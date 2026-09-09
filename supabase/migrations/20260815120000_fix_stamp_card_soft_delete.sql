-- =========================================================
-- Fix: soft-deleting a stamp card always failed with 42501
-- =========================================================
-- PostgREST appends "RETURNING 1" to every PATCH. Postgres enforces a table's
-- SELECT policies against the NEW row whenever an UPDATE carries a RETURNING
-- clause, and every SELECT policy on stamp_cards excludes deleted rows. So the
-- post-update row (status = 'deleted') was unreadable and Postgres raised
-- "new row violates row-level security policy for table stamp_cards".
-- No amount of rewriting stamp_cards_member_update could fix that.
--
-- The soft delete now runs inside a security definer function instead.

-- 1) Restore the intended member update policy. Members may only move a card
--    between active/inactive; the 'deleted' transition goes through the RPC.
drop policy if exists "stamp_cards_member_update" on public.stamp_cards;

create policy "stamp_cards_member_update" on public.stamp_cards
  for update
  using (
    (public.is_business_member(business_id) and status <> 'deleted' and deleted_at is null)
    or public.is_platform_admin()
  )
  with check (
    (
      public.is_business_member(business_id)
      and status in ('active', 'inactive')
      and deleted_at is null
    )
    or public.is_platform_admin()
  );

-- 2) Soft delete RPC.
create or replace function public.soft_delete_stamp_card(p_card_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_business_id uuid;
  v_status public.card_status;
begin
  if auth.uid() is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  if p_card_id is null then
    raise exception 'card id is required' using errcode = '22004';
  end if;

  select business_id, status
    into v_business_id, v_status
  from public.stamp_cards
  where id = p_card_id
  for update;

  if not found then
    raise exception 'stamp card not found' using errcode = 'P0002';
  end if;

  if not (public.is_business_member(v_business_id) or public.is_platform_admin()) then
    raise exception 'not allowed to delete this stamp card' using errcode = '42501';
  end if;

  if v_status = 'deleted' then
    return p_card_id;
  end if;

  update public.stamp_cards
  set status = 'deleted',
      deleted_at = now()
  where id = p_card_id;

  return p_card_id;
end;
$$;

revoke all on function public.soft_delete_stamp_card(uuid) from public, anon;
grant execute on function public.soft_delete_stamp_card(uuid) to authenticated;

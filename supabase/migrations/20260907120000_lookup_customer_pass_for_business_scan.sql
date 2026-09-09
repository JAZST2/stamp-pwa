-- =========================================================
-- Business scan: look up a customer by personal short code
-- =========================================================
-- profiles RLS only allows "own row or platform admin". A business owner
-- scanning a customer pass therefore gets an empty result (not 42501),
-- which surfaced as "Customer code was not found".
--
-- Lookup now runs in a SECURITY DEFINER function, and stamp_events
-- grants are added so the subsequent insert is allowed.

create or replace function public.lookup_customer_by_personal_code(p_code text)
returns table (
  id uuid,
  full_name text,
  personal_short_code text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized text;
begin
  if auth.uid() is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  if p_code is null or length(trim(p_code)) = 0 then
    return;
  end if;

  if not (
    public.is_platform_admin()
    or exists (
      select 1 from public.businesses b where b.owner_id = auth.uid()
    )
    or exists (
      select 1
      from public.business_staff s
      where s.profile_id = auth.uid()
        and s.status = 'active'
    )
  ) then
    raise exception 'not authorized' using errcode = '42501';
  end if;

  normalized := upper(trim(p_code));

  return query
    select p.id, p.full_name, p.personal_short_code
    from public.profiles p
    where p.role = 'customer'
      and p.personal_short_code is not null
      and upper(p.personal_short_code) = normalized
    limit 1;
end;
$$;

revoke all on function public.lookup_customer_by_personal_code(text) from public;
grant execute on function public.lookup_customer_by_personal_code(text) to authenticated;

grant select, insert on table public.stamp_events to authenticated;
grant select on table public.profiles to authenticated;

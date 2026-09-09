-- =========================================================
-- Fix: adding a stamp fails with 42804
-- =========================================================
-- after_stamp_event_insert updates customer_memberships.status with a CASE
-- that PostgreSQL infers as text:
--   status = case ... then 'completed' else 'active' end
-- status is membership_status, so the assignment raises:
--   column "status" is of type membership_status but expression is of type text
-- Cast the CASE (and the reward unlock literal) to the enum types.

create or replace function public.after_stamp_event_insert()
returns trigger as $$
declare
  card_total int;
  new_count int;
  membership_cycle int;
  ms record;
begin
  select total_stamps
  into card_total
  from public.stamp_cards
  where id = new.stamp_card_id;

  if card_total is null then
    raise exception 'stamp card % not found', new.stamp_card_id;
  end if;

  update public.customer_memberships
  set current_stamp_count = current_stamp_count + 1,
      status = case
        when current_stamp_count + 1 >= card_total then 'completed'::public.membership_status
        else 'active'::public.membership_status
      end,
      completed_at = case
        when current_stamp_count + 1 >= card_total then now()
        else completed_at
      end
  where id = new.membership_id
  returning current_stamp_count, cycle_number into new_count, membership_cycle;

  select *
  into ms
  from public.stamp_card_milestones
  where stamp_card_id = new.stamp_card_id
    and stamp_number = new_count;

  if ms.id is not null then
    insert into public.reward_claims (
      membership_id, customer_id, business_id, stamp_card_id, milestone_id,
      cycle_number, reward_description, status, unlocked_at
    )
    select
      new.membership_id,
      m.customer_id,
      new.business_id,
      new.stamp_card_id,
      ms.id,
      membership_cycle,
      ms.reward_description,
      'unlocked'::public.reward_claim_status,
      now()
    from public.customer_memberships m
    where m.id = new.membership_id
    on conflict (membership_id, milestone_id, cycle_number) do nothing;
  end if;

  return new;
end;
$$ language plpgsql security definer set search_path = public;

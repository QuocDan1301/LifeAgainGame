-- Chạy một lần trong SQL Editor của project Supabase.
-- Chạy lại an toàn: không xóa tài khoản hoặc điểm đã có.
begin;
create schema if not exists life_again_private;
revoke all on schema life_again_private from public, anon, authenticated;
create table if not exists life_again_private.ranking_state (
  id integer primary key check (id = 1),
  revision bigint not null default 0,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);
alter table life_again_private.ranking_state enable row level security;
revoke all on life_again_private.ranking_state from public, anon, authenticated;
insert into life_again_private.ranking_state (id, payload)
values (1, '{"accounts": [], "sessions": [], "starts": [], "runs": []}'::jsonb)
on conflict (id) do nothing;

create or replace function public.life_again_read_state()
returns jsonb language sql security definer set search_path = '' as $$
  select jsonb_build_object('revision', revision, 'payload', payload)
  from life_again_private.ranking_state where id = 1;
$$;
create or replace function public.life_again_write_state(expected_revision bigint, next_payload jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare saved_revision bigint;
begin
  if jsonb_typeof(next_payload) <> 'object'
    or jsonb_typeof(next_payload->'accounts') is distinct from 'array'
    or jsonb_typeof(next_payload->'sessions') is distinct from 'array'
    or jsonb_typeof(next_payload->'starts') is distinct from 'array'
    or jsonb_typeof(next_payload->'runs') is distinct from 'array' then
    raise exception 'Invalid ranking payload' using errcode = '22023';
  end if;
  update life_again_private.ranking_state
    set payload = next_payload, revision = revision + 1, updated_at = now()
    where id = 1 and revision = expected_revision
    returning revision into saved_revision;
  if not found then
    raise exception 'Ranking revision conflict' using errcode = '40001';
  end if;
  return jsonb_build_object('revision', saved_revision);
end;
$$;
revoke all on function public.life_again_read_state() from public, anon, authenticated;
revoke all on function public.life_again_write_state(bigint, jsonb) from public, anon, authenticated;
grant execute on function public.life_again_read_state() to service_role;
grant execute on function public.life_again_write_state(bigint, jsonb) to service_role;
commit;
notify pgrst, 'reload schema';

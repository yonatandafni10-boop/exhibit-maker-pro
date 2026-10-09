create type public.app_role as enum ('admin', 'user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "own roles readable" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create or replace function public.grant_owner_admin()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if lower(new.email) = 'brickyard931@gmail.com' then
    insert into public.user_roles(user_id, role) values (new.id, 'admin') on conflict do nothing;
  end if;
  return new;
end $$;
create trigger on_auth_user_owner_admin after insert on auth.users
for each row execute function public.grant_owner_admin();
insert into public.user_roles(user_id, role)
select id, 'admin' from auth.users where lower(email) = 'brickyard931@gmail.com' on conflict do nothing;

create table public.set_overrides (
  slug text primary key,
  price numeric,
  name text,
  description text,
  pieces text,
  hidden boolean not null default false,
  updated_at timestamptz not null default now()
);
grant select on public.set_overrides to anon, authenticated;
grant insert, update, delete on public.set_overrides to authenticated;
grant all on public.set_overrides to service_role;
alter table public.set_overrides enable row level security;
create policy "public read overrides" on public.set_overrides for select to anon, authenticated using (true);
create policy "admin write overrides" on public.set_overrides for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.site_texts (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);
grant select on public.site_texts to anon, authenticated;
grant insert, update, delete on public.site_texts to authenticated;
grant all on public.site_texts to service_role;
alter table public.site_texts enable row level security;
create policy "public read texts" on public.site_texts for select to anon, authenticated using (true);
create policy "admin write texts" on public.site_texts for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
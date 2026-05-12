create table if not exists public.crm_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.crm_data enable row level security;

drop policy if exists "Users can read own CRM data" on public.crm_data;
create policy "Users can read own CRM data"
on public.crm_data
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own CRM data" on public.crm_data;
create policy "Users can insert own CRM data"
on public.crm_data
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own CRM data" on public.crm_data;
create policy "Users can update own CRM data"
on public.crm_data
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own CRM data" on public.crm_data;
create policy "Users can delete own CRM data"
on public.crm_data
for delete
to authenticated
using (auth.uid() = user_id);

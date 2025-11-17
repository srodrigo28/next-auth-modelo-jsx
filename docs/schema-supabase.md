create table if not exists public.conta_perfil (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text,
  email text,
  telefone text,
  created_at timestamp with time zone default now()
);

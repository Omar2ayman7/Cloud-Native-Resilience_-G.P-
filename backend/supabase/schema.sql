-- FreshCart backend schema for Supabase/PostgreSQL
create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name varchar(120) not null,
  email varchar(255) not null unique,
  password_hash text not null,
  phone varchar(30) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name varchar(120) not null unique,
  slug varchar(140) not null unique,
  image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  name varchar(120) not null unique,
  slug varchar(140) not null unique,
  image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title varchar(220) not null,
  slug varchar(240) not null unique,
  description text,
  quantity integer not null default 0 check (quantity >= 0),
  price numeric(12,2) not null check (price >= 0),
  image_cover text,
  category_id uuid references public.categories(id) on delete set null,
  brand_id uuid references public.brands(id) on delete set null,
  ratings_average numeric(3,2) not null default 0 check (ratings_average between 0 and 5),
  ratings_quantity integer not null default 0 check (ratings_quantity >= 0),
  sold integer not null default 0 check (sold >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  name varchar(120) not null,
  slug varchar(140) not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_subcategories (
  product_id uuid not null references public.products(id) on delete cascade,
  subcategory_id uuid not null references public.subcategories(id) on delete cascade,
  primary key (product_id, subcategory_id)
);

create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  status varchar(20) not null default 'active' check (status in ('active','converted','abandoned')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists one_active_cart_per_user on public.carts(user_id) where status = 'active';

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(cart_id, product_id)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete restrict,
  cart_id uuid references public.carts(id) on delete set null,
  total_order_price numeric(12,2) not null default 0 check (total_order_price >= 0),
  payment_method varchar(30) not null default 'card',
  payment_status varchar(30) not null default 'pending' check (payment_status in ('pending','paid','failed','refunded')),
  is_paid boolean not null default false,
  paid_at timestamptz,
  shipping_details text not null,
  shipping_phone varchar(30) not null,
  shipping_city varchar(120) not null,
  stripe_session_id varchar(255) unique,
  stripe_payment_intent_id varchar(255),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_title varchar(220) not null,
  product_image text,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  subtotal numeric(12,2) not null check (subtotal >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete restrict,
  provider varchar(30) not null default 'stripe',
  stripe_session_id varchar(255) unique,
  stripe_payment_intent_id varchar(255),
  amount numeric(12,2) not null default 0,
  currency varchar(10) not null default 'egp',
  status varchar(30) not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stripe_webhook_events (
  id uuid primary key default gen_random_uuid(),
  stripe_event_id varchar(255) not null unique,
  event_type varchar(120) not null,
  processed boolean not null default false,
  received_at timestamptz not null default now()
);

create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_cart_items_cart on public.cart_items(cart_id);
create index if not exists idx_orders_user on public.orders(user_id);
create index if not exists idx_order_items_order on public.order_items(order_id);

drop trigger if exists users_updated_at on public.users;
create trigger users_updated_at before update on public.users for each row execute function public.set_updated_at();
drop trigger if exists categories_updated_at on public.categories;
create trigger categories_updated_at before update on public.categories for each row execute function public.set_updated_at();
drop trigger if exists brands_updated_at on public.brands;
create trigger brands_updated_at before update on public.brands for each row execute function public.set_updated_at();
drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at before update on public.products for each row execute function public.set_updated_at();
drop trigger if exists subcategories_updated_at on public.subcategories;
create trigger subcategories_updated_at before update on public.subcategories for each row execute function public.set_updated_at();
drop trigger if exists carts_updated_at on public.carts;
create trigger carts_updated_at before update on public.carts for each row execute function public.set_updated_at();
drop trigger if exists cart_items_updated_at on public.cart_items;
create trigger cart_items_updated_at before update on public.cart_items for each row execute function public.set_updated_at();
drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at before update on public.orders for each row execute function public.set_updated_at();
drop trigger if exists payments_updated_at on public.payments;
create trigger payments_updated_at before update on public.payments for each row execute function public.set_updated_at();

-- Backend-only access model: the Express server uses SUPABASE_SERVICE_ROLE_KEY.
-- RLS is enabled with no public policies so browsers cannot access these tables directly.
alter table public.users enable row level security;
alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.subcategories enable row level security;
alter table public.product_subcategories enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.stripe_webhook_events enable row level security;

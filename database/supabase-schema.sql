-- =====================================================================
-- ZAP MUDRA — Supabase Database Schema
-- Run this SQL in: Supabase Dashboard > SQL Editor > New Query
-- =====================================================================

-- ─── 1. USER PROFILES ────────────────────────────────────────────────
-- Stores extra info alongside auth.users
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  phone      text,
  created_at timestamptz default now()
);

-- Auto-create a profile row whenever a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── 2. LOAN LINKS MASTER TABLE ──────────────────────────────────────
create table if not exists public.loan_links (
  id            serial primary key,
  category      text not null check (category in ('personal_loan','credit_card')),
  bank_name     text not null,
  short_code    text not null,
  color         text not null default '#7B2FBE',
  url           text not null,
  is_active     boolean not null default true,
  display_order int not null default 0
);

-- ─── 3. LINK CLICK TRACKING TABLE ────────────────────────────────────
create table if not exists public.link_clicks (
  id           bigserial primary key,
  user_id      uuid not null references auth.users(id) on delete cascade,
  loan_link_id int  not null references public.loan_links(id) on delete cascade,
  clicked_at   timestamptz not null default now()
);

-- Index for fast per-user lookups
create index if not exists link_clicks_user_idx on public.link_clicks(user_id);
create index if not exists link_clicks_link_idx on public.link_clicks(loan_link_id);

-- ─── 4. ROW LEVEL SECURITY ────────────────────────────────────────────
-- profiles: users can only read/update their own profile
alter table public.profiles enable row level security;
create policy "Users can view own profile"   on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- loan_links: anyone (anon) can read active links
alter table public.loan_links enable row level security;
create policy "Anyone can view active loan links" on public.loan_links for select using (is_active = true);

-- link_clicks: users can insert and view only their own clicks
alter table public.link_clicks enable row level security;
create policy "Users can insert own clicks" on public.link_clicks for insert with check (auth.uid() = user_id);
create policy "Users can view own clicks"   on public.link_clicks for select using (auth.uid() = user_id);

-- ─── 5. SEED DATA — ALL LOAN LINKS ───────────────────────────────────
insert into public.loan_links (category, bank_name, short_code, color, url, display_order) values

-- Personal Loans
('personal_loan', 'Poonawalla',  'POON',  '#1a3c8f',
 'https://instant-pocket-loan.poonawallafincorp.com/?utm_DSA_Code=PDL00142&UTM_Partner_Name=MyMoneyMantra&UTM_Partner_Medium=sms&UTM_Partner_AgentCode=PFLMMM&UTM_Partner_ReferenceID=MMMPFL-NSZAP01',
 1),

('personal_loan', 'Unity Bank',  'UNITY', '#006666',
 'https://loans.theunitybank.com/unity-pl-ui/page/exclusion/login/logindetails?utm_source=partnership&utm_medium=mymoneymantra&utm_campaign=mmm_NSZAP01',
 2),

('personal_loan', 'PREFR',       'PREFR', '#5b34c9',
 'https://marketplace.creditvidya.com/mymoneymantra?utm_source=MMMNSZAP01',
 3),

('personal_loan', 'IndusInd Bank','INDUS', '#8f1b2c',
 'https://induseasycredit.indusind.bank.in/customer/personal-loan/new-lead?utm_source=partnerships&utm_medium=MyMoneyMantra&utm_campaign=personal-loan&utm_content=NSZAP01',
 4),

('personal_loan', 'InCred',      'INCRD', '#e63946',
 'https://www.incred.com/personal-loan/?partnerId=5924685198961082P&utm_source=NSZAP01&utm_medium=efgh&utm_campaign=wxyz',
 5),

-- Credit Cards
('credit_card', 'AU Bank',       'AU',    '#c0392b',
 'https://cconboarding.au.bank.in/auccself/#/landing?utm_source=MMFNT&utm_medium=banner&utm_campaign=MMFNT-display-campaign-NS_ZAP01',
 1),

('credit_card', 'SCAPIA',        'SCAP',  '#ff6b35',
 'https://apply.scapia.cards/landing_page?utm_medium=DSA&utm_campaign=RKPL_offline&utm_content=NS_ZAP01-display-campaign&utm_term=card',
 2),

('credit_card', 'BOB Card',      'BOB',   '#1a237e',
 'https://mycard.bobcard.tech/?utm_source=MMM_xyz&utm_medium=EARNTRA&utm_campaign=NS_ZAP01',
 3),

('credit_card', 'ZAGGLE',        'ZAGG',  '#f57c00',
 'https://app.zagg.money/?source=YES_BANK&utm_campaign=mmm&lead=NSZAP01',
 4),

('credit_card', 'POP Card',      'POP',   '#6a1b9a',
 'https://ppv.getpopcard.co/?utm_source=PPV&utm_medium=abc&utm_campaign=NS_ZAP01',
 5),

('credit_card', 'KIWI Card',     'KIWI',  '#2e7d32',
 'https://gokiwi.sng.link/D5owq/ldsl/iwme?utm_source=mmm&utm_medium=apply&utm_term=EARNTRA&utm_content=NS_ZAP01',
 6),

('credit_card', 'Axis Bank',     'AXIS',  '#97144d',
 'https://web.axis.bank.in/DigitalChannel/WebForm/?ipa126&axisreferralcode=NRKNSZAP01',
 7),

('credit_card', 'IndusInd DIY',  'IDIY',  '#8f1b2c',
 'https://induseasycredit.indusind.bank.in/customer/new-lead?utm_medium=IBL&utm_campaign=Credit-Card&utm_content=NS_ZAP01',
 8),

('credit_card', 'YES ACE',       'YES',   '#00518f',
 'https://www.kredit.pe/invite/mymoneymantra_ace/EARNTRA/NSZAP01',
 9)

on conflict do nothing;

-- PlumberOS Database Schema
-- This creates the core tables for the plumbing SaaS

-- Companies (the businesses using the platform)
create table companies (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text unique not null,
  phone text,
  address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  stripe_customer_id text,
  subscription_tier text default 'free',
  subscription_status text default 'active'
);

-- Plumbers (individual workers under a company)
create table plumbers (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid references companies(id) on delete cascade not null,
  name text not null,
  email text unique not null,
  phone text,
  role text default 'plumber',
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Customers (homeowners, businesses who need plumbing)
create table customers (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid references companies(id) on delete cascade not null,
  name text not null,
  email text,
  phone text not null,
  address text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Leads (potential jobs)
create table leads (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid references companies(id) on delete cascade not null,
  customer_id uuid references customers(id),
  plumber_id uuid references plumbers(id),
  
  -- Lead details
  source text not null, -- 'phone', 'website', 'thumbtack', 'angi', etc.
  status text default 'new', -- 'new', 'qualified', 'quoted', 'booked', 'completed', 'lost'
  priority integer default 3, -- 1-5
  
  -- What they need
  issue text not null,
  description text,
  location text,
  
  -- AI analysis (filled by OpenClaw)
  ai_qualification jsonb,
  ai_score integer,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Jobs (actual work orders)
create table jobs (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid references companies(id) on delete cascade not null,
  lead_id uuid references leads(id),
  customer_id uuid references customers(id) not null,
  plumber_id uuid references plumbers(id),
  
  -- Job details
  status text default 'scheduled', -- 'scheduled', 'in_progress', 'completed', 'cancelled'
  type text not null,
  description text,
  
  -- Scheduling
  scheduled_at timestamp with time zone,
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  
  -- Pricing
  estimated_price decimal(10,2),
  final_price decimal(10,2),
  
  -- Notes
  notes text,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Row-level security (basic)
alter table companies enable row level security;
alter table plumbers enable row level security;
alter table customers enable row level security;
alter table leads enable row level security;
alter table jobs enable row level security;
-- Invoices table
create table invoices (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid references companies(id) on delete cascade not null,
  customer_id uuid references customers(id),
  job_id uuid references jobs(id),
  
  -- Invoice details
  invoice_number text unique not null,
  status text default 'pending', -- 'pending', 'paid', 'overdue', 'cancelled'
  
  -- Financials
  amount decimal(10,2) not null,
  tax decimal(10,2) default 0,
  total decimal(10,2) not null,
  
  -- Dates
  issue_date date not null,
  due_date date,
  paid_date date,
  
  -- Notes
  notes text,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table invoices enable row level security;

-- Add jobs table
create table jobs (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid references companies(id) on delete cascade not null,
  lead_id uuid references leads(id),
  customer_id uuid references customers(id),
  plumber_id uuid references plumbers(id),
  
  -- Job details
  status text default 'scheduled', -- 'scheduled', 'in_progress', 'completed', 'cancelled'
  type text not null,
  description text,
  
  -- Scheduling
  scheduled_date date,
  scheduled_time time,
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  
  -- Pricing
  estimated_price decimal(10,2),
  final_price decimal(10,2),
  
  -- Notes
  notes text,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table jobs enable row level security;

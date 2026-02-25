import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Enable UUID extension
    await sql`create extension if not exists "uuid-ossp"`;

    // Create buckets table
    await sql`
      CREATE TABLE IF NOT EXISTS buckets (
        id uuid default uuid_generate_v4() primary key,
        title text not null,
        color text default '#6b7280',
        position integer default 0,
        created_at timestamp with time zone default timezone('utc'::text, now()) not null
      )
    `;

    // Insert default buckets if empty
    const existing = await sql`SELECT COUNT(*) as count FROM buckets`;
    if (existing[0]?.count === 0) {
      await sql`
        INSERT INTO buckets (title, color, position) VALUES
        ('New Leads', '#3b82f6', 1),
        ('Qualified', '#8b5cf6', 2),
        ('Quoted', '#eab308', 3),
        ('Booked', '#f97316', 4),
        ('In Progress', '#eab308', 5),
        ('Completed', '#22c55e', 6)
      `;
    }

    return NextResponse.json({ success: true, message: 'Buckets table ready!' });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
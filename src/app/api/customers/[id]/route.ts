import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// GET - Fetch single customer with job and invoice history
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // Get customer
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single();

  if (customerError) {
    return NextResponse.json({ error: customerError.message }, { status: 500 });
  }

  // Get customer's jobs
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('customer_id', id)
    .order('created_at', { ascending: false });

  // Get customer's invoices
  const { data: invoices } = await supabase
    .from('invoices')
    .select('*')
    .eq('customer_id', id)
    .order('created_at', { ascending: false });

  return NextResponse.json({ 
    customer,
    jobs: jobs || [],
    invoices: invoices || []
  });
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hawbikistbbenjaldjvk.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhhd2Jpa2lzdGJiZW5qYWxkanZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NjkwMDAsImV4cCI6MjA1OTQ0NTAwMH0.TLfWbguFUB-plJDPesqzcb13nDSxwJPSTxeOielzpFU';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase; 
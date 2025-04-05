import { createClient, SupabaseClient } from '@supabase/supabase-js';

// URL e chave fixa para garantir a conexão
const supabaseUrl = 'https://hawbikistbbenjaldjvk.supabase.co';
// A chave precisa ser exatamente a mesma que aparece no painel do Supabase
// usando a chave anon correta
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhhd2Jpa2lzdGJiZW5qYWxkanZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NjkwMDAsImV4cCI6MjA1OTQ0NTAwMH0.TLfWbguFUB-plJDPesqzcb13nDSxwJPSTxeOielzpFU';

// Configurações básicas sem opções complexas
const options = {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
};

// Criar cliente Supabase
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey, options);

console.log('Supabase inicializado com URL:', supabaseUrl);

export default supabase; 
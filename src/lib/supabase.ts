import { createClient, SupabaseClient } from '@supabase/supabase-js';

// URL e chave fixa para garantir a conexão
const supabaseUrl = 'https://hawbikistbbenjaldjvk.supabase.co';
// A chave precisa ser exatamente a mesma que aparece no painel do Supabase
// usando a chave service_role em vez da anon
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhhd2Jpa2lzdGJiZW5qYWxkanZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxODYyMDc3NiwiZXhwIjoyMDM0MTk2Nzc2fQ.xdqd3rJcPmQNpJdnRHLEpqOJu6iXEDcs1s5UAK3JKGw';

// Configurações avançadas com segurança CORS
const options = {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseKey}`
    }
  }
};

// Criar cliente Supabase
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey, options);

console.log('Supabase inicializado com URL:', supabaseUrl);

export default supabase; 
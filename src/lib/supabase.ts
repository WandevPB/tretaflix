import { createClient } from '@supabase/supabase-js';

// URL e chave fixa para garantir a conexão
const supabaseUrl = 'https://hawbikistbbenjaldjvk.supabase.co';
// A chave precisa ser exatamente a mesma que aparece no painel do Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhhd2Jpa2lzdGJiZW5qYWxkanZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg2MjA3NzYsImV4cCI6MjAzNDE5Njc3Nn0.O2mEYwLhMBnOjDxIRDhj7RYo4w-f68SPBfEQVKUgh1E';

// Configurações básicas sem opções complexas
const options = {
  auth: {
    autoRefreshToken: true,
    persistSession: false
  }
};

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey, options);

console.log('Supabase inicializado com URL:', supabaseUrl);

export default supabase; 
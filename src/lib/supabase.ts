import { createClient, SupabaseClient } from '@supabase/supabase-js';

// URL e chave fixa para garantir a conexão
const supabaseUrl = 'https://hemzlkistdwenjalvix.supabase.co';
// A chave precisa ser exatamente a mesma que aparece no painel do Supabase
// usando a chave anon correta
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlbXpsa2lzdGR3ZW5qYWx2aXgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcxNjY1NzQ0NiwiZXhwIjoyMDMyMjMzNDQ2fQ.AhZ4F8OKCyUc0FmgOQAx4XkiJw4K-UM1YOAATB5kOds';

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
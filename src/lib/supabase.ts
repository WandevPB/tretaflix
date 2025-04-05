import { createClient } from '@supabase/supabase-js';

// URL e chave fixa para garantir a conexão
const supabaseUrl = 'https://hemzlkistdwenjalvix.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlbXpsa2lzdGR3ZW5qYWx2aXgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcxODgwMTA0MiwiZXhwIjoyMDM0Mzc3MDQyfQ.xoxFHQbYgLvx5yx35JNIGvgxSHnYEJVv2_s43BpRkGM';

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
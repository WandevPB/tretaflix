import { createClient } from '@supabase/supabase-js';

// Usar variáveis de ambiente ou valores padrão (para desenvolvimento)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hemzlkistdwenjalvix.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlbXpsa2lzdGR3ZW5qYWx2aXgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcxODgwMTA0MiwiZXhwIjoyMDM0Mzc3MDQyfQ.xoxFHQbYgLvx5yx35JNIGvgxSHnYEJVv2_s43BpRkGM';

// Criar e exportar o cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Log para debug
console.log('Supabase inicializado com URL:', supabaseUrl);

export default supabase; 
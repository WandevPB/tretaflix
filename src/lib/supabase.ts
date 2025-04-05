import { createClient } from '@supabase/supabase-js';

// Usar variáveis de ambiente ou valores padrão (para desenvolvimento)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hawbikistbbenjaldjvk.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhhd2Jpa2lzdGJiZW5qYWxkanZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NjkwMDAsImV4cCI6MjA1OTQ0NTAwMH0.TLfWbguFUB-plJDPesqzcb13nDSxwJPSTxeOielzpFU';

// Criar e exportar o cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Log para debug
console.log('Supabase inicializado com URL:', supabaseUrl);

export default supabase; 
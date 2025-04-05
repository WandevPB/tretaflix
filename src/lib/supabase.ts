import { createClient } from '@supabase/supabase-js';

// URL e chave fixa para garantir a conexão
const supabaseUrl = 'https://hawbikistbbenjaldjvk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhhd2Jpa2lzdGJiZW5qYWxkanZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg4MDEwNDIsImV4cCI6MjAzNDM3NzA0Mn0.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

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
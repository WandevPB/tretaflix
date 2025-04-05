-- Script para criar a tabela 'tretaflix' no Supabase
-- Execute este script no SQL Editor do seu projeto Supabase (https://hawbikistbbenjaldjvk.supabase.co)

-- Primeiro, vamos remover a tabela se ela já existir
DROP TABLE IF EXISTS tretaflix;

-- Criar a tabela tretaflix com todos os campos necessários
CREATE TABLE tretaflix (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    overview TEXT,
    posterUrl TEXT,
    backdropUrl TEXT,
    releaseDate TEXT,
    rating TEXT,
    genres TEXT,
    embedCode TEXT,
    type TEXT NOT NULL,
    tmdbId TEXT,
    dateAdded TIMESTAMPTZ DEFAULT NOW(),
    embedUrl TEXT,
    mediaType TEXT,
    season INTEGER,
    episodeCount INTEGER,
    seasonTitle TEXT,
    category TEXT,
    routeType TEXT
);

-- Comentários na tabela para documentação
COMMENT ON TABLE tretaflix IS 'Tabela para armazenar filmes, séries e canais ao vivo do TretaFlix';
COMMENT ON COLUMN tretaflix.id IS 'ID único do conteúdo';
COMMENT ON COLUMN tretaflix.title IS 'Título do conteúdo';
COMMENT ON COLUMN tretaflix.overview IS 'Sinopse ou descrição do conteúdo';
COMMENT ON COLUMN tretaflix.posterUrl IS 'URL da imagem de poster';
COMMENT ON COLUMN tretaflix.backdropUrl IS 'URL da imagem de fundo/backdrop';
COMMENT ON COLUMN tretaflix.releaseDate IS 'Data de lançamento';
COMMENT ON COLUMN tretaflix.rating IS 'Classificação/avaliação';
COMMENT ON COLUMN tretaflix.genres IS 'Gêneros separados por vírgula';
COMMENT ON COLUMN tretaflix.embedCode IS 'Código de incorporação ou URL do vídeo';
COMMENT ON COLUMN tretaflix.type IS 'Tipo de conteúdo: movie, serie, live, etc';
COMMENT ON COLUMN tretaflix.tmdbId IS 'ID no TMDB se disponível';
COMMENT ON COLUMN tretaflix.dateAdded IS 'Data em que o conteúdo foi adicionado';
COMMENT ON COLUMN tretaflix.embedUrl IS 'URL de incorporação extraída do embedCode';
COMMENT ON COLUMN tretaflix.mediaType IS 'Tipo de mídia conforme API externa';
COMMENT ON COLUMN tretaflix.season IS 'Número da temporada (apenas para séries)';
COMMENT ON COLUMN tretaflix.episodeCount IS 'Número de episódios na temporada';
COMMENT ON COLUMN tretaflix.seasonTitle IS 'Título da temporada';
COMMENT ON COLUMN tretaflix.category IS 'Categoria personalizada';
COMMENT ON COLUMN tretaflix.routeType IS 'Tipo de rota para navegação';

-- Criar índices para melhorar a performance de consultas comuns
CREATE INDEX idx_tretaflix_type ON tretaflix(type);
CREATE INDEX idx_tretaflix_dateadded ON tretaflix(dateAdded);

-- Desativar RLS (Row Level Security) para permitir acesso público
ALTER TABLE tretaflix DISABLE ROW LEVEL SECURITY;

-- Caso queira habilitar RLS no futuro e criar políticas:
-- ALTER TABLE tretaflix ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Permitir acesso público para selecionar" ON tretaflix FOR SELECT USING (true);
-- CREATE POLICY "Permitir inserção pública" ON tretaflix FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Permitir atualização pública" ON tretaflix FOR UPDATE USING (true);
-- CREATE POLICY "Permitir exclusão pública" ON tretaflix FOR DELETE USING (true);

-- Inserir alguns dados de exemplo (opcional)
INSERT INTO tretaflix (id, title, type, overview, posterUrl, dateAdded) VALUES 
('exemplo1', 'Filme de Teste', 'movie', 'Este é um filme de exemplo para testar a tabela', 'https://via.placeholder.com/300x450?text=Filme+Teste', NOW()),
('exemplo2', 'Série de Teste', 'serie', 'Esta é uma série de exemplo para testar a tabela', 'https://via.placeholder.com/300x450?text=Serie+Teste', NOW()),
('exemplo3', 'Canal ao Vivo de Teste', 'live', 'Este é um canal ao vivo de exemplo', 'https://via.placeholder.com/300x450?text=Canal+Teste', NOW());

-- Verificar se a tabela foi criada corretamente
SELECT * FROM tretaflix; 
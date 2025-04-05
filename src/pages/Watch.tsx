import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import supabase from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import VideoPlayer from '@/components/VideoPlayer';

interface ContentItem {
  id: string;
  title: string;
  embedcode: string;
  overview?: string;
  posterurl?: string;
  backdropurl?: string;
  type: string;
  routetype: string;
}

const Watch = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        console.log(`Fetching content with ID: ${id} and type: ${type}`);
        setLoading(true);
        setError(null);
        
        if (!id) {
          setError('ID do conteúdo não especificado');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('tretaflix')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Erro Supabase:', error);
          throw error;
        }

        if (!data) {
          console.log('Nenhum conteúdo encontrado para o ID:', id);
          setError('Conteúdo não encontrado');
          setLoading(false);
          return;
        }

        console.log('Conteúdo carregado com sucesso:', data);
        setContent(data);
      } catch (err) {
        console.error('Erro ao carregar o conteúdo:', err);
        setError('Falha ao carregar o conteúdo. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [id, type]);

  return (
    <div className="bg-tretaflix-black min-h-screen text-white">
      <div className="container mx-auto px-4 py-4">
        <Button 
          variant="ghost" 
          className="mb-4 text-white"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-[70vh]">
            <Loader2 className="h-12 w-12 animate-spin text-tretaflix-red mb-4" />
            <p className="text-lg text-gray-400">Carregando...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[70vh]">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-tretaflix-red mb-2">Erro</h2>
              <p className="text-gray-400 mb-6">{error}</p>
              <Button 
                className="bg-tretaflix-red hover:bg-tretaflix-red/80"
                onClick={() => navigate('/')}
              >
                Voltar para a página inicial
              </Button>
            </div>
          </div>
        ) : content ? (
          <div>
            <h1 className="text-2xl font-bold mb-4">{content.title}</h1>
            <div className="video-container">
              {content.embedcode ? (
                <VideoPlayer 
                  embedCode={content.embedcode} 
                  className="w-full rounded-md" 
                  poster={content.posterurl}
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-10 bg-tretaflix-dark rounded-md">
                  <p className="text-center mb-4">Nenhum link de vídeo disponível para este conteúdo</p>
                  <Button 
                    className="bg-tretaflix-red hover:bg-tretaflix-red/80"
                    onClick={() => navigate(-1)}
                  >
                    Voltar
                  </Button>
                </div>
              )}
            </div>
            
            {content.overview && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Sobre</h2>
                <p className="text-gray-300">{content.overview}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[70vh]">
            <p className="text-xl text-gray-400">Conteúdo não encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Watch; 
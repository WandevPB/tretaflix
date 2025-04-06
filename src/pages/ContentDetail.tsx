import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Play, Star, Clock, Calendar } from "lucide-react";
import { getOmdbDetail } from "@/services/omdbApi";
import { useToast } from "@/components/ui/use-toast";
import VideoPlayer from "@/components/VideoPlayer";

interface ContentDetailProps {
  type: "filme" | "serie" | "aovivo";
}

const ContentDetail = ({ type }: ContentDetailProps) => {
  const { id } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();
  const [content, setContent] = useState<{
    id: string;
    title: string;
    overview: string;
    backdrop: string;
    poster: string;
    year: string;
    duration: string;
    rating: number;
    genres: string[];
    embedUrl: string;
  } | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContentDetails = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        const storedContent = JSON.parse(localStorage.getItem('tretaflix_content') || '[]');
        const localContent = storedContent.find((item: any) => item.id === id || item.imdbID === id);
        
        if (localContent) {
          setContent({
            id: localContent.id,
            title: localContent.title,
            overview: localContent.overview,
            backdrop: localContent.backdrop_path || "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=2574&auto=format&fit=crop",
            poster: localContent.poster_path || localContent.poster,
            year: localContent.release_date || localContent.year,
            duration: type === "filme" ? "2h" : type === "serie" ? "Múltiplas temporadas" : "Ao vivo",
            rating: localContent.vote_average || 0,
            genres: localContent.genres || [],
            embedUrl: localContent.embedUrl || ""
          });
          setIsLoading(false);
          return;
        }
        
        if (type !== "aovivo") {
          const details = await getOmdbDetail(id);
          
          if (details.Response === "True") {
            setContent({
              id: details.imdbID,
              title: details.Title,
              overview: details.Plot,
              backdrop: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=2574&auto=format&fit=crop",
              poster: details.Poster !== "N/A" ? details.Poster : "https://via.placeholder.com/300x450?text=Sem+Imagem",
              year: details.Year,
              duration: type === "filme" ? details.Runtime : details.totalSeasons ? `${details.totalSeasons} temporadas` : "Múltiplos episódios",
              rating: parseFloat(details.imdbRating) || 0,
              genres: details.Genre ? details.Genre.split(", ") : [],
              embedUrl: ""
            });
          } else {
            toast({
              title: "Erro ao carregar conteúdo",
              description: "Não foi possível encontrar os detalhes deste conteúdo.",
              variant: "destructive",
            });
          }
        } else {
          setContent({
            id: id,
            title: "Canal ao Vivo",
            overview: "Transmissão ao vivo.",
            backdrop: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=2574&auto=format&fit=crop",
            poster: "https://via.placeholder.com/300x450?text=Ao+Vivo",
            year: new Date().getFullYear().toString(),
            duration: "Ao vivo",
            rating: 0,
            genres: ["Ao Vivo"],
            embedUrl: ""
          });
        }
      } catch (error) {
        console.error("Error fetching content details:", error);
        toast({
          title: "Erro ao carregar conteúdo",
          description: "Ocorreu um erro ao carregar os detalhes do conteúdo.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchContentDetails();
  }, [id, type, toast]);

  if (isLoading || !content) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {isPlaying ? (
          <div className="w-full bg-black">
            {content.embedUrl ? (
              <VideoPlayer
                embedCode={content.embedUrl}
                className="w-full"
                poster={content.poster}
              />
            ) : (
              <div className="w-full aspect-video flex items-center justify-center text-white">
                <p>Não há conteúdo disponível para reprodução. O administrador precisa adicionar um link de torrent ou URL de vídeo.</p>
              </div>
            )}
            <div className="container mx-auto px-4 py-4">
              <Button 
                className="bg-tretaflix-gray hover:bg-tretaflix-gray/80 text-white"
                onClick={() => setIsPlaying(false)}
              >
                Voltar para detalhes
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute inset-0">
              <img 
                src={content.backdrop} 
                alt={content.title} 
                className="w-full h-full object-cover brightness-50"
              />
              <div className="absolute inset-0 hero-gradient"></div>
            </div>
            
            <div className="container mx-auto px-4 py-20 relative z-10">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-64 flex-shrink-0 rounded-lg overflow-hidden shadow-xl">
                  <img 
                    src={content.poster} 
                    alt={content.title} 
                    className="w-full h-auto"
                  />
                </div>
                
                <div className="flex-grow">
                  <h1 className="text-3xl md:text-5xl font-bold mb-2 text-white">
                    {content.title}
                  </h1>
                  
                  <div className="flex flex-wrap gap-3 text-sm text-gray-300 mb-6">
                    <span className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" /> {content.year}
                    </span>
                    <span className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" /> {content.duration}
                    </span>
                    {content.rating > 0 && (
                      <span className="flex items-center">
                        <Star className="mr-1 h-4 w-4 text-yellow-400" /> {content.rating}
                      </span>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    {content.genres.map((genre) => (
                      <span 
                        key={genre} 
                        className="inline-block bg-tretaflix-gray text-white text-xs px-2 py-1 rounded mr-2 mb-2"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-gray-300 mb-8 max-w-3xl">
                    {content.overview}
                  </p>
                  
                  <Button 
                    className="bg-tretaflix-red hover:bg-tretaflix-red/80 text-white"
                    onClick={() => setIsPlaying(true)}
                    disabled={!content.embedUrl}
                  >
                    <Play className="mr-2 h-5 w-5" /> Assistir Agora
                  </Button>
                  {!content.embedUrl && (
                    <p className="text-yellow-200 mt-2 text-sm">
                      Este conteúdo ainda não possui um link de vídeo disponível.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ContentDetail;

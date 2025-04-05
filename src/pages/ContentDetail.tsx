import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Play, Star, Clock, Calendar, Tag } from "lucide-react";
import ContentSlider, { ContentItem } from "@/components/ContentSlider";
import { getOmdbDetail } from "@/services/omdbApi";
import { useToast } from "@/components/ui/use-toast";

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
  
  const [relatedContent, setRelatedContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch content details
  useEffect(() => {
    const fetchContentDetails = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        // First check if content exists in localStorage
        const storedContent = JSON.parse(localStorage.getItem('tretaflix_content') || '[]');
        const localContent = storedContent.find((item: any) => item.id === id || item.imdbID === id);
        
        if (localContent) {
          // Use content from localStorage if available
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
        
        // If not in localStorage, fetch from OMDB
        if (type !== "aovivo") {
          const omdbType = type === "filme" ? "movie" : "series";
          const details = await getOmdbDetail(id);
          
          if (details.Response === "True") {
            setContent({
              id: details.imdbID,
              title: details.Title,
              overview: details.Plot,
              backdrop: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=2574&auto=format&fit=crop", // Placeholder
              poster: details.Poster !== "N/A" ? details.Poster : "https://via.placeholder.com/300x450?text=Sem+Imagem",
              year: details.Year,
              duration: type === "filme" ? details.Runtime : details.totalSeasons ? `${details.totalSeasons} temporadas` : "Múltiplos episódios",
              rating: parseFloat(details.imdbRating) || 0,
              genres: details.Genre ? details.Genre.split(", ") : [],
              embedUrl: "" // Empty because not added by admin yet
            });
          } else {
            toast({
              title: "Erro ao carregar conteúdo",
              description: "Não foi possível encontrar os detalhes deste conteúdo.",
              variant: "destructive",
            });
          }
        } else {
          // For live content
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
            embedUrl: "" // Empty because not added by admin yet
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
          <div className="w-full bg-black aspect-video">
            {content.embedUrl ? (
              <iframe
                src={content.embedUrl}
                className="w-full h-full"
                title={content.title}
                frameBorder="0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                <p>Não há conteúdo disponível para reprodução. O administrador precisa adicionar um link de torrent ou URL de vídeo.</p>
              </div>
            )}
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
                  >
                    <Play className="mr-2 h-5 w-5" /> Assistir Agora
                  </Button>
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

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getContent } from "@/services/contentService";
import { getTmdbDetail } from "@/services/tmdbApi";
import { Content } from "@/types/content";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Star } from "lucide-react";
import Head from "next/head";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/VideoPlayer";

export default function ContentDetailPage() {
  const router = useRouter();
  const { type, id } = router.query;
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      if (!type || !id) return;

      setLoading(true);
      try {
        // Buscar o conteúdo da base de dados
        const contentData = await getContent(id as string);
        
        if (!contentData) {
          router.push("/404");
          return;
        }
        
        // Buscar detalhes adicionais do TMDB se o ID do TMDB estiver disponível
        if (contentData.tmdbId) {
          try {
            // Determinar o tipo de mídia correto para a API TMDB
            const tmdbType = contentData.mediaType || 
              (type === "movie" ? "movie" : type === "series" ? "tv" : "movie");
            
            const tmdbDetails = await getTmdbDetail(contentData.tmdbId, tmdbType as "movie" | "tv");
            
            if (tmdbDetails.success) {
              // Mesclar os dados existentes com os detalhes do TMDB
              contentData.title = tmdbDetails.title || tmdbDetails.name || contentData.title;
              contentData.overview = tmdbDetails.overview || contentData.overview;
              contentData.posterUrl = tmdbDetails.poster_path || contentData.posterUrl;
              contentData.backdropUrl = tmdbDetails.backdrop_path || contentData.backdropUrl;
              contentData.releaseDate = tmdbDetails.release_date || tmdbDetails.first_air_date || contentData.releaseDate;
              contentData.rating = tmdbDetails.vote_average.toString() || contentData.rating;
              
              // Gêneros
              if (tmdbDetails.genres && tmdbDetails.genres.length > 0) {
                contentData.genres = tmdbDetails.genres.map(g => g.name).join(", ");
              }
            }
          } catch (error) {
            console.error("Erro ao buscar detalhes do TMDB:", error);
            // Continuar com os dados existentes se houver erro na API TMDB
          }
        }
        
        setContent(contentData);
      } catch (error) {
        console.error("Erro ao carregar detalhes do conteúdo:", error);
        router.push("/404");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [id, type, router]);

  if (loading) {
    return (
      <>
        <Head>
          <title>Carregando... | TretaFlix</title>
        </Head>
        <div className="min-h-screen bg-tretaflix-black text-white">
          <NavBar />
          <div className="relative w-full h-[50vh] bg-tretaflix-gray/20 animate-pulse" />
          <div className="container mx-auto px-4 py-8 -mt-32 relative z-10">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-1/4">
                <Skeleton className="h-[400px] w-full rounded-md bg-tretaflix-gray/20" />
              </div>
              <div className="w-full lg:w-3/4 space-y-4">
                <Skeleton className="h-10 w-3/4 bg-tretaflix-gray/20" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20 bg-tretaflix-gray/20" />
                  <Skeleton className="h-6 w-20 bg-tretaflix-gray/20" />
                  <Skeleton className="h-6 w-20 bg-tretaflix-gray/20" />
                </div>
                <Skeleton className="h-24 w-full bg-tretaflix-gray/20" />
                <Skeleton className="h-64 w-full bg-tretaflix-gray/20" />
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  if (!content) return null;

  return (
    <>
      <Head>
        <title>{content.title} | TretaFlix</title>
        <meta name="description" content={content.overview} />
      </Head>
      <div className="min-h-screen bg-tretaflix-black text-white">
        <NavBar />
        
        {/* Hero backdrop */}
        <div 
          className="relative w-full h-[50vh] bg-cover bg-center" 
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(24, 24, 27, 1)), url(${content.backdropUrl})`,
          }}
        />
        
        {/* Content details */}
        <div className="container mx-auto px-4 py-8 -mt-32 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Poster */}
            <div className="w-full lg:w-1/4">
              <img 
                src={content.posterUrl} 
                alt={content.title} 
                className="w-full rounded-md shadow-xl"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/300x450?text=Sem+Imagem";
                }}
              />
            </div>
            
            {/* Details */}
            <div className="w-full lg:w-3/4">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{content.title}</h1>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {content.genres.split(",").map((genre, index) => (
                  <Badge key={index} variant="outline" className="bg-tretaflix-red/20 text-white border-tretaflix-red">
                    {genre.trim()}
                  </Badge>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-6">
                {content.releaseDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{content.releaseDate}</span>
                  </div>
                )}
                {content.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{content.rating}/10</span>
                  </div>
                )}
              </div>
              
              {content.type === "series" && content.season && (
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">
                    Temporada {content.season}
                    {content.seasonTitle && <span className="font-normal text-gray-300 ml-2">- {content.seasonTitle}</span>}
                  </h2>
                  {content.episodeCount && (
                    <p className="text-sm text-gray-300">
                      {content.episodeCount} {content.episodeCount === 1 ? "Episódio" : "Episódios"}
                    </p>
                  )}
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Sinopse</h3>
                <p className="text-gray-300 leading-relaxed">{content.overview}</p>
              </div>
              
              {/* Embed Player */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4">
                  {content.type === "movie" 
                    ? "Assistir Filme" 
                    : content.type === "series" 
                      ? `Assistir Temporada ${content.season || ""}` 
                      : "Assistir Agora"}
                </h3>
                <VideoPlayer
                  embedCode={content.embedCode}
                  poster={content.posterPath || content.imageUrl}
                  className="w-full rounded-md overflow-hidden"
                />
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
} 
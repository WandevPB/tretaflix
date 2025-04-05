import { useState, useEffect } from "react";
import Hero from "@/components/Hero";
import ContentSlider, { ContentItem } from "@/components/ContentSlider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import supabase from "@/lib/supabase";

// Mock data for demonstration (will be replaced by API data in the future)
const mockMovies: ContentItem[] = [
  {
    id: "1",
    title: "Vingadores: Ultimato",
    poster: "https://images.unsplash.com/photo-1617914309185-9e63b3badfca?q=80&w=2670&auto=format&fit=crop",
    type: "movie",
    year: "2019",
    rating: 8.4
  },
  {
    id: "2",
    title: "Pantera Negra",
    poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2670&auto=format&fit=crop",
    type: "movie",
    year: "2018",
    rating: 7.3
  },
  {
    id: "3",
    title: "Coringa",
    poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2670&auto=format&fit=crop",
    type: "movie",
    year: "2019",
    rating: 8.4
  },
  {
    id: "4",
    title: "Top Gun: Maverick",
    poster: "https://images.unsplash.com/photo-1653460760285-2a1fd397fee0?q=80&w=1935&auto=format&fit=crop",
    type: "movie",
    year: "2022",
    rating: 8.3
  },
  {
    id: "5",
    title: "Batman",
    poster: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=2574&auto=format&fit=crop",
    type: "movie",
    year: "2022",
    rating: 7.8
  },
  {
    id: "6",
    title: "Duna",
    poster: "https://images.unsplash.com/photo-1612036782180-6f0822f0aa81?q=80&w=2670&auto=format&fit=crop",
    type: "movie",
    year: "2021",
    rating: 8.0
  },
  {
    id: "7",
    title: "Tudo em Todo Lugar",
    poster: "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?q=80&w=2680&auto=format&fit=crop",
    type: "movie",
    year: "2022",
    rating: 8.7
  },
  {
    id: "8",
    title: "Avatar: O Caminho da Água",
    poster: "https://images.unsplash.com/photo-1655722724099-151ae389ee08?q=80&w=1917&auto=format&fit=crop",
    type: "movie",
    year: "2022",
    rating: 7.6
  }
];

const mockSeries: ContentItem[] = [
  {
    id: "s1",
    title: "Stranger Things",
    poster: "https://images.unsplash.com/photo-1626379953819-c36cf76a99e6?q=80&w=2574&auto=format&fit=crop",
    type: "serie",
    year: "2016",
    rating: 8.7
  },
  {
    id: "s2",
    title: "The Witcher",
    poster: "https://images.unsplash.com/photo-1612190656723-6a0298d076a0?q=80&w=2574&auto=format&fit=crop",
    type: "serie",
    year: "2019",
    rating: 8.2
  },
  {
    id: "s3",
    title: "Breaking Bad",
    poster: "https://images.unsplash.com/photo-1633299874708-a99a0ae4657a?q=80&w=2670&auto=format&fit=crop",
    type: "serie",
    year: "2008",
    rating: 9.5
  },
  {
    id: "s4",
    title: "Game of Thrones",
    poster: "https://images.unsplash.com/photo-1579788394708-48684175365e?q=80&w=2794&auto=format&fit=crop",
    type: "serie",
    year: "2011",
    rating: 9.2
  },
  {
    id: "s5",
    title: "The Last of Us",
    poster: "https://images.unsplash.com/photo-1492528086374-3c2826680d5c?q=80&w=2574&auto=format&fit=crop",
    type: "serie",
    year: "2023",
    rating: 8.8
  },
  {
    id: "s6",
    title: "Arcane",
    poster: "https://images.unsplash.com/photo-1559583109-3e7968136c99?q=80&w=2187&auto=format&fit=crop",
    type: "serie",
    year: "2021",
    rating: 9.0
  },
  {
    id: "s7",
    title: "Peaky Blinders",
    poster: "https://images.unsplash.com/photo-1588064719685-bd29437024f4?q=80&w=2576&auto=format&fit=crop",
    type: "serie",
    year: "2013",
    rating: 8.8
  },
  {
    id: "s8",
    title: "Wandavision",
    poster: "https://images.unsplash.com/photo-1593085260707-5377ba37ace0?q=80&w=2680&auto=format&fit=crop",
    type: "serie",
    year: "2021",
    rating: 8.0
  }
];

const mockLiveChannels: ContentItem[] = [
  {
    id: "l1",
    title: "Canal Esportes 24h",
    poster: "https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=2670&auto=format&fit=crop",
    type: "movie",
  },
  {
    id: "l2",
    title: "Notícias Agora",
    poster: "https://images.unsplash.com/photo-1503694978374-8a2fa686963a?q=80&w=2669&auto=format&fit=crop",
    type: "movie",
  },
  {
    id: "l3",
    title: "Canal Filmes Clássicos",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2625&auto=format&fit=crop",
    type: "movie",
  },
  {
    id: "l4",
    title: "Música Premium",
    poster: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2670&auto=format&fit=crop",
    type: "movie",
  },
  {
    id: "l5",
    title: "Documentários HD",
    poster: "https://images.unsplash.com/photo-1568992688065-536aad8a12f6?q=80&w=2274&auto=format&fit=crop",
    type: "movie",
  },
  {
    id: "l6",
    title: "Séries Maratona",
    poster: "https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?q=80&w=2574&auto=format&fit=crop",
    type: "movie",
  }
];

const HomePage = () => {
  const [recentContent, setRecentContent] = useState<ContentItem[]>([]);
  const [movies, setMovies] = useState<ContentItem[]>([]);
  const [series, setSeries] = useState<ContentItem[]>([]);
  const [liveChannels, setLiveChannels] = useState<ContentItem[]>([]);
  const [hasContent, setHasContent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Carregar conteúdo do Supabase ao invés de localStorage
  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        // Buscar todos os conteúdos do Supabase
        const { data: allContent, error } = await supabase
          .from('tretaflix_content')
          .select('*')
          .order('dateAdded', { ascending: false });
          
        if (error) {
          console.error("Erro ao buscar conteúdo:", error);
          setHasContent(false);
          setIsLoading(false);
          return;
        }

        console.log("Conteúdo carregado do Supabase:", allContent);
        
        // Processar o conteúdo por tipo
        const formattedContent = allContent?.map(formatContentItem) || [];
        
        // Filtrar por tipo
        const contentMovies = formattedContent.filter(item => 
          item.type === "movie" || item.type === "filme"
        );
        
        const contentSeries = formattedContent.filter(item => 
          item.type === "tv" || item.type === "serie"
        );
        
        const contentLiveChannels = formattedContent.filter(item => 
          item.type === "live" || item.type === "aovivo"
        );
        
        // Atualizar o state
        setMovies(contentMovies);
        setSeries(contentSeries);
        setLiveChannels(contentLiveChannels);
        setRecentContent(formattedContent.slice(0, 12));
        setHasContent(formattedContent.length > 0);
      } catch (error) {
        console.error("Erro ao processar conteúdo:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContent();
  }, []);
  
  // Helper to format content items consistently
  const formatContentItem = (item: any): ContentItem => {
    return {
      id: item.id || item.imdbID,
      title: item.title,
      poster: item.poster_path || item.posterUrl || item.poster || "https://via.placeholder.com/300x450?text=Sem+Imagem",
      type: item.type || (item.mediaType === "tv" ? "serie" : "filme"),
      year: item.release_date || item.releaseDate || item.year || "",
      rating: item.vote_average || item.rating || 0
    };
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>
        <Hero />
        
        <div className="container mx-auto px-2 mt-12">
          {!hasContent && (
            <div className="bg-tretaflix-dark p-8 rounded-lg shadow-lg text-center mb-12">
              <h2 className="text-xl md:text-2xl font-bold mb-4">Bem-vindo ao TretaFlix</h2>
              <p className="text-gray-400 mb-4">
                Ainda não há conteúdo disponível no catálogo. Entre como administrador para adicionar filmes, séries e canais ao vivo.
              </p>
              <p className="text-sm text-gray-500">
                Acesse o painel administrativo através de <a href="/admin" className="text-tretaflix-red hover:underline">tretaflix.com/admin</a>
              </p>
            </div>
          )}
          
          {movies.length > 0 && (
            <ContentSlider 
              title="Filmes Populares" 
              items={movies} 
              viewMoreLink="/filmes"
            />
          )}
          
          {series.length > 0 && (
            <ContentSlider 
              title="Séries em Alta" 
              items={series} 
              viewMoreLink="/series"
            />
          )}
          
          {liveChannels.length > 0 && (
            <ContentSlider 
              title="Canais ao Vivo" 
              items={liveChannels} 
              viewMoreLink="/aovivo"
            />
          )}
          
          {recentContent.length > 0 && (
            <ContentSlider 
              title="Adicionados Recentemente" 
              items={recentContent}
            />
          )}
        </div>
      </main>
      <div className="flex-grow"></div>
      <Footer />
    </div>
  );
};

export default HomePage;

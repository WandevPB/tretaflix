import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ContentItem } from "@/components/ContentSlider";
import { Link } from "react-router-dom";
import { Play, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChannelItem extends ContentItem {
  category?: string;
}

const LiveTVPage = () => {
  const [allChannels, setAllChannels] = useState<ChannelItem[]>([]);
  const [filteredChannels, setFilteredChannels] = useState<ChannelItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [featuredChannel, setFeaturedChannel] = useState<ChannelItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  
  // Load content from localStorage
  useEffect(() => {
    // Load content added by admin from localStorage
    const storedContent = JSON.parse(localStorage.getItem('tretaflix_content') || '[]');
    
    // Filter and format content for live channels
    const storedChannels = storedContent
      .filter((item: any) => item.type === "live" || item.routeType === "aovivo")
      .map((item: any) => ({
        id: item.id || item.imdbID,
        title: item.title,
        poster: item.poster_path || item.poster || "https://via.placeholder.com/300x450?text=Sem+Imagem",
        type: "aovivo",
        category: item.category || "Geral"
      }));
    
    setAllChannels(storedChannels);
    setFilteredChannels(storedChannels);
    
    // Set featured channel if any channels exist
    if (storedChannels.length > 0) {
      setFeaturedChannel(storedChannels[0]);
    }
    
    setHasContent(storedChannels.length > 0);
  }, []);
  
  // Filter channels by category
  useEffect(() => {
    if (selectedCategory === "Todos") {
      setFilteredChannels(allChannels);
    } else {
      const filtered = allChannels.filter(channel => 
        channel.category === selectedCategory
      );
      setFilteredChannels(filtered);
    }
  }, [selectedCategory, allChannels]);
  
  const handleWatchChannel = (channel: ChannelItem) => {
    setFeaturedChannel(channel);
    setIsPlaying(true);
    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {!hasContent ? (
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">Canais ao Vivo</h1>
            <div className="bg-tretaflix-dark p-8 rounded-lg shadow-lg text-center">
              <AlertTriangle className="h-12 w-12 text-tretaflix-red mx-auto mb-4" />
              <h2 className="text-xl md:text-2xl font-bold mb-4">Sem canais disponíveis</h2>
              <p className="text-gray-400 mb-6">
                Ainda não há canais ao vivo disponíveis no catálogo. Entre como administrador para adicionar canais.
              </p>
              <Button 
                onClick={() => window.location.href = "/admin"}
                className="bg-tretaflix-red hover:bg-tretaflix-red/80"
              >
                Acessar Painel Admin
              </Button>
            </div>
          </div>
        ) : (
          <>
            {featuredChannel && (
              <div className="w-full bg-tretaflix-dark">
                {isPlaying ? (
                  <div className="w-full bg-black aspect-video">
                    <iframe 
                      src={featuredChannel.embedUrl || ""}
                      className="w-full h-full"
                      title={featuredChannel.title}
                      frameBorder="0"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                  </div>
                ) : (
                  <div className="relative aspect-video max-h-[70vh]">
                    <img 
                      src={featuredChannel.poster} 
                      alt={featuredChannel.title} 
                      className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <h2 className="text-4xl font-bold mb-4">{featuredChannel.title}</h2>
                      <Button 
                        onClick={() => setIsPlaying(true)}
                        className="bg-tretaflix-red hover:bg-tretaflix-red/80 rounded-full w-16 h-16 flex items-center justify-center"
                      >
                        <Play className="h-8 w-8" />
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="container mx-auto px-4 py-4">
                  <div className="flex items-center space-between">
                    <h2 className="text-2xl font-bold">{featuredChannel.title}</h2>
                    <div className="flex-grow"></div>
                    {!isPlaying && (
                      <Button 
                        onClick={() => setIsPlaying(true)}
                        className="bg-tretaflix-red hover:bg-tretaflix-red/80"
                      >
                        <Play className="mr-2 h-4 w-4" /> Assistir Agora
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h2 className="text-2xl font-bold mb-4 md:mb-0">Todos os Canais</h2>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px] bg-tretaflix-gray border-tretaflix-gray text-white">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-tretaflix-gray border-tretaflix-gray text-white">
                    <SelectItem value="Todos">Todas Categorias</SelectItem>
                    <SelectItem value="Esportes">Esportes</SelectItem>
                    <SelectItem value="Notícias">Notícias</SelectItem>
                    <SelectItem value="Filmes">Filmes</SelectItem>
                    <SelectItem value="Séries">Séries</SelectItem>
                    <SelectItem value="Música">Música</SelectItem>
                    <SelectItem value="Geral">Geral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredChannels.map((channel) => (
                  <div 
                    key={channel.id}
                    className="bg-tretaflix-dark rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200"
                    onClick={() => handleWatchChannel(channel)}
                  >
                    <div className="aspect-video relative">
                      <img 
                        src={channel.poster} 
                        alt={channel.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/400x225?text=Sem+Imagem";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                        <div>
                          <h3 className="font-bold truncate">{channel.title}</h3>
                          <span className="text-xs text-gray-300">{channel.category}</span>
                        </div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                        <div className="bg-tretaflix-red/80 rounded-full p-3">
                          <Play className="h-6 w-6" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default LiveTVPage;

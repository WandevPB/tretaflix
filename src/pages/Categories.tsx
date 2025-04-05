
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentItem } from "@/components/ContentSlider";
import { Play } from "lucide-react";

// Extend ContentItem type to support "live" content
interface LiveContentItem extends Omit<ContentItem, 'type'> {
  type: 'movie' | 'serie' | 'live';
}

// Mock data for categories
const mockCategories = [
  "Esportes",
  "Notícias",
  "Filmes",
  "Séries",
  "Música", 
  "Documentários",
  "Educação",
  "Infantil",
  "Culinária",
  "Viagens",
  "Animes"
];

// Mock data for channels in categories
const mockChannelsInCategories: Record<string, LiveContentItem[]> = {
  "Esportes": [
    {
      id: "e1",
      title: "Esportes 24h",
      poster: "https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=2670&auto=format&fit=crop",
      type: "live"
    },
    {
      id: "e2",
      title: "Futebol Ao Vivo",
      poster: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?q=80&w=2670&auto=format&fit=crop",
      type: "live"
    }
  ],
  "Notícias": [
    {
      id: "n1",
      title: "Notícias 24h",
      poster: "https://images.unsplash.com/photo-1503694978374-8a2fa686963a?q=80&w=2669&auto=format&fit=crop",
      type: "live"
    }
  ],
  "Filmes": [
    {
      id: "f1",
      title: "Cinema Clássico",
      poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2625&auto=format&fit=crop",
      type: "live"
    }
  ]
};

const CategoriesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(mockCategories[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeChannel, setActiveChannel] = useState<LiveContentItem | null>(null);

  const handleWatchChannel = (channel: LiveContentItem) => {
    setActiveChannel(channel);
    setIsPlaying(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Featured channel section */}
      {activeChannel && (
        <div className="relative bg-tretaflix-black">
          {isPlaying ? (
            <div className="w-full aspect-video bg-black">
              <iframe 
                src="https://www.youtube.com/embed/2m1drlOZSDw?autoplay=1" 
                className="w-full h-full" 
                title={activeChannel.title}
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <div className="relative">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={activeChannel.poster} 
                  alt={activeChannel.title} 
                  className="w-full h-full object-cover brightness-50"
                />
                <div className="absolute inset-0 hero-gradient"></div>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="bg-tretaflix-black py-8 flex-1">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-6">Categorias</h2>
          
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
            <TabsList className="bg-tretaflix-gray mb-6 flex-wrap justify-start h-auto">
              {mockCategories.map(category => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="data-[state=active]:bg-tretaflix-red"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {mockCategories.map(category => (
              <TabsContent key={category} value={category}>
                <div className="content-grid">
                  {mockChannelsInCategories[category]?.map((channel) => (
                    <div
                      key={channel.id}
                      className="movie-card cursor-pointer"
                      onClick={() => handleWatchChannel(channel)}
                    >
                      <div className="aspect-video bg-tretaflix-gray rounded-md overflow-hidden">
                        <img
                          src={channel.poster}
                          alt={channel.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/60 transition-opacity">
                          <Play className="h-12 w-12 text-tretaflix-red" />
                        </div>
                        <div className="card-overlay">
                          <h3 className="text-sm font-medium truncate text-white">
                            {channel.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  )) || (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-400">Nenhum canal encontrado nesta categoria</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CategoriesPage;

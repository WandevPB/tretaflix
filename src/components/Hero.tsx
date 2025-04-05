
import { useEffect, useState } from "react";

interface HeroProps {
  featured?: {
    id: string;
    title: string;
    overview: string;
    backdrop: string;
    type: "movie" | "serie";
  };
}

const Hero = ({ featured }: HeroProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Default featured content if none provided
  const defaultFeatured = {
    id: "default",
    title: "Tretas Incríveis",
    overview: "Assista aos melhores filmes, séries e canais ao vivo na TretaFlix. Sua nova plataforma de streaming com conteúdo exclusivo para você aproveitar.",
    backdrop: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?q=80&w=2831&auto=format&fit=crop",
    type: "movie" as const
  };

  const displayFeatured = featured || defaultFeatured;

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative h-[80vh] min-h-[500px]">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src={displayFeatured.backdrop} 
          alt={displayFeatured.title}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
        />
        <div className="absolute inset-0 hero-gradient"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10 h-full flex items-end pb-24">
        <div className="max-w-2xl animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-3 drop-shadow-lg">
            {displayFeatured.title}
          </h1>
          <p className="text-white/80 text-lg mb-6 line-clamp-3">
            {displayFeatured.overview}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;

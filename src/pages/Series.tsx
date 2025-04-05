import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { ContentItem } from "@/components/ContentSlider";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const SeriesPage = () => {
  const [allSeries, setAllSeries] = useState<ContentItem[]>([]);
  const [filteredSeries, setFilteredSeries] = useState<ContentItem[]>([]);
  const [selectedGenre, setSelectedGenre] = useState("Todos");
  const [sort, setSort] = useState("recentes");
  const [hasContent, setHasContent] = useState(false);

  // Load content from localStorage
  useEffect(() => {
    // Load content added by admin from localStorage
    const storedContent = JSON.parse(localStorage.getItem('tretaflix_content') || '[]');
    
    // Filter and format content for series
    const storedSeries = storedContent
      .filter((item: any) => item.type === "series" || item.routeType === "serie")
      .map((item: any) => ({
        id: item.id || item.imdbID,
        title: item.title,
        poster: item.poster_path || item.poster || "https://via.placeholder.com/300x450?text=Sem+Imagem",
        type: "serie",
        year: item.release_date || item.year || "",
        rating: item.vote_average || item.rating || 0,
        genres: item.genres || []
      }));
    
    setAllSeries(storedSeries);
    setFilteredSeries(storedSeries);
    setHasContent(storedSeries.length > 0);
  }, []);

  // Filter and sort series
  useEffect(() => {
    if (selectedGenre === "Todos") {
      setFilteredSeries(allSeries);
    } else {
      const filtered = allSeries.filter(serie => 
        // In a real app, this would check the actual series genres
        // For mock data, we're using a random filter
        selectedGenre === "Todos" ? true : Math.random() > 0.3
      );
      setFilteredSeries(filtered);
    }
  }, [selectedGenre, allSeries]);

  // Use a different sort function based on the sort state
  useEffect(() => {
    const sortedSeries = [...filteredSeries];
    
    if (sort === "recentes") {
      // Sort by year (most recent first)
      sortedSeries.sort((a, b) => parseInt(b.year || "0") - parseInt(a.year || "0"));
    } else if (sort === "avaliacao") {
      // Sort by rating (highest first)
      sortedSeries.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === "az") {
      // Sort alphabetically
      sortedSeries.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    setFilteredSeries(sortedSeries);
  }, [sort, allSeries, selectedGenre, filteredSeries]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8">Séries</h1>
          
          {!hasContent ? (
            <div className="bg-tretaflix-dark p-8 rounded-lg shadow-lg text-center">
              <AlertTriangle className="h-12 w-12 text-tretaflix-red mx-auto mb-4" />
              <h2 className="text-xl md:text-2xl font-bold mb-4">Sem séries disponíveis</h2>
              <p className="text-gray-400 mb-6">
                Ainda não há séries disponíveis no catálogo. Entre como administrador para adicionar séries.
              </p>
              <Button 
                onClick={() => window.location.href = "/admin"}
                className="bg-tretaflix-red hover:bg-tretaflix-red/80"
              >
                Acessar Painel Admin
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="todos" className="w-full">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <TabsList className="bg-tretaflix-gray">
                  <TabsTrigger value="todos">Todas</TabsTrigger>
                  <TabsTrigger value="lancamentos">Lançamentos</TabsTrigger>
                  <TabsTrigger value="populares">Mais Assistidas</TabsTrigger>
                </TabsList>
                
                <div className="flex gap-2">
                  <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                    <SelectTrigger className="w-[180px] bg-tretaflix-gray border-0">
                      <SelectValue placeholder="Gênero" />
                    </SelectTrigger>
                    <SelectContent className="bg-tretaflix-gray border-tretaflix-gray text-white">
                      <SelectItem value="Todos">Todos os Gêneros</SelectItem>
                      <SelectItem value="Ação">Ação</SelectItem>
                      <SelectItem value="Aventura">Aventura</SelectItem>
                      <SelectItem value="Comédia">Comédia</SelectItem>
                      <SelectItem value="Drama">Drama</SelectItem>
                      <SelectItem value="Ficção Científica">Ficção Científica</SelectItem>
                      <SelectItem value="Terror">Terror</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger className="w-[180px] bg-tretaflix-gray border-0">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent className="bg-tretaflix-gray border-tretaflix-gray text-white">
                      <SelectItem value="recentes">Mais Recentes</SelectItem>
                      <SelectItem value="avaliacao">Melhor Avaliadas</SelectItem>
                      <SelectItem value="az">A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <TabsContent value="todos">
                <div className="mb-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Todas as Séries</h2>
                  
                  <div className="text-white">
                    <span>{filteredSeries.length} séries encontradas</span>
                  </div>
                </div>
                
                <div className="content-grid">
                  {filteredSeries.map((serie) => (
                    <Link
                      key={serie.id}
                      to={`/serie/${serie.id}`}
                      className="movie-card"
                    >
                      <div className="poster-wrapper">
                        <img 
                          src={serie.poster} 
                          alt={serie.title}
                          className="poster"
                          onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/300x450?text=Sem+Imagem";
                          }}
                        />
                        <div className="overlay">
                          <div className="rating">
                            <span className="star">★</span> {serie.rating}
                          </div>
                          <button className="play-button">
                            Assistir
                          </button>
                        </div>
                      </div>
                      <h3 className="movie-title">{serie.title}</h3>
                      <div className="movie-year">{serie.year}</div>
                    </Link>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="lancamentos">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">Séries Recentes</h2>
                </div>
                
                <div className="content-grid">
                  {allSeries
                    .filter(serie => parseInt(serie.year || "0") >= 2022)
                    .map((serie) => (
                      <Link
                        key={serie.id}
                        to={`/serie/${serie.id}`}
                        className="movie-card"
                      >
                        <div className="poster-wrapper">
                          <img 
                            src={serie.poster} 
                            alt={serie.title}
                            className="poster"
                            onError={(e) => {
                              e.currentTarget.src = "https://via.placeholder.com/300x450?text=Sem+Imagem";
                            }}
                          />
                          <div className="overlay">
                            <div className="rating">
                              <span className="star">★</span> {serie.rating}
                            </div>
                            <button className="play-button">
                              Assistir
                            </button>
                          </div>
                        </div>
                        <h3 className="movie-title">{serie.title}</h3>
                        <div className="movie-year">{serie.year}</div>
                      </Link>
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="populares">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">Séries Mais Assistidas</h2>
                </div>
                
                <div className="content-grid">
                  {allSeries
                    .filter(serie => (serie.rating || 0) >= 7.5)
                    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                    .map((serie) => (
                      <Link
                        key={serie.id}
                        to={`/serie/${serie.id}`}
                        className="movie-card"
                      >
                        <div className="poster-wrapper">
                          <img 
                            src={serie.poster} 
                            alt={serie.title}
                            className="poster"
                            onError={(e) => {
                              e.currentTarget.src = "https://via.placeholder.com/300x450?text=Sem+Imagem";
                            }}
                          />
                          <div className="overlay">
                            <div className="rating">
                              <span className="star">★</span> {serie.rating}
                            </div>
                            <button className="play-button">
                              Assistir
                            </button>
                          </div>
                        </div>
                        <h3 className="movie-title">{serie.title}</h3>
                        <div className="movie-year">{serie.year}</div>
                      </Link>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SeriesPage;

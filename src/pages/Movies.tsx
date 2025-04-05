import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ContentItem } from "@/components/ContentSlider";
import { Link } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabase";

const MoviesPage = () => {
  const [allMovies, setAllMovies] = useState<ContentItem[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<ContentItem[]>([]);
  const [selectedGenre, setSelectedGenre] = useState("Todos");
  const [sort, setSort] = useState("recentes");
  const [hasContent, setHasContent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar filmes do Supabase
  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        console.log("Tentando buscar filmes via cliente Supabase");
        // Tentar buscar do Supabase via cliente
        const { data: moviesData, error } = await supabase
          .from('tretaflix')
          .select('*')
          .or('type.eq.movie,type.eq.filme')
          .order('dateAdded', { ascending: false });
          
        if (error) {
          console.error("Erro ao buscar filmes via cliente Supabase:", error);
          
          // Tentar método alternativo com fetch direto
          console.log("Tentando buscar filmes via fetch direto");
          try {
            const response = await fetch('https://hawbikistbbenjaldjvk.supabase.co/rest/v1/tretaflix?select=*&or=(type.eq.movie,type.eq.filme)', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhhd2Jpa2lzdGJiZW5qYWxkanZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg4MDEwNDIsImV4cCI6MjAzNDM3NzA0Mn0.xoxFHQbYgLvx5yx35JNIGvgxSHnYEJVv2_s43BpRkGM',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhhd2Jpa2lzdGJiZW5qYWxkanZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg4MDEwNDIsImV4cCI6MjAzNDM3NzA0Mn0.xoxFHQbYgLvx5yx35JNIGvgxSHnYEJVv2_s43BpRkGM',
                'Range': '0-999'
              }
            });
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const fetchedMovies = await response.json();
            console.log("Filmes carregados via fetch:", fetchedMovies);
            
            // Formatar os filmes para o formato esperado
            const formattedMovies = fetchedMovies?.map((item: any) => ({
              id: item.id || item.imdbID,
              title: item.title,
              poster: item.posterUrl || item.poster_path || item.poster || "https://via.placeholder.com/300x450?text=Sem+Imagem",
              type: "movie",
              year: item.releaseDate || item.release_date || item.year || "",
              rating: item.rating || item.vote_average || 0,
              genres: (item.genres || "").split(", ")
            })) || [];
            
            setAllMovies(formattedMovies);
            setFilteredMovies(formattedMovies);
            setHasContent(formattedMovies.length > 0);
            setIsLoading(false);
            return;
          } catch (fetchError) {
            console.error("Erro ao buscar com fetch direto:", fetchError);
            setHasContent(false);
            setIsLoading(false);
            return;
          }
        }
        
        console.log("Filmes carregados do Supabase:", moviesData);
        
        // Formatar os filmes para o formato esperado
        const formattedMovies = moviesData?.map((item: any) => ({
          id: item.id || item.imdbID,
          title: item.title,
          poster: item.posterUrl || item.poster_path || item.poster || "https://via.placeholder.com/300x450?text=Sem+Imagem",
          type: "movie",
          year: item.releaseDate || item.release_date || item.year || "",
          rating: item.rating || item.vote_average || 0,
          genres: (item.genres || "").split(", ")
        })) || [];
        
        setAllMovies(formattedMovies);
        setFilteredMovies(formattedMovies);
        setHasContent(formattedMovies.length > 0);
      } catch (error) {
        console.error("Erro ao processar filmes:", error);
        setHasContent(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMovies();
  }, []);

  // Filter and sort movies
  useEffect(() => {
    if (selectedGenre === "Todos") {
      setFilteredMovies(allMovies);
    } else {
      const filtered = allMovies.filter(movie => 
        // In a real app, this would check the actual movie genres
        // For mock data, we're using a random filter
        selectedGenre === "Todos" ? true : Math.random() > 0.3
      );
      setFilteredMovies(filtered);
    }
  }, [selectedGenre, allMovies]);

  // Use a different sort function based on the sort state
  useEffect(() => {
    const sortedMovies = [...filteredMovies];
    
    if (sort === "recentes") {
      // Sort by year (most recent first)
      sortedMovies.sort((a, b) => parseInt(b.year || "0") - parseInt(a.year || "0"));
    } else if (sort === "avaliacao") {
      // Sort by rating (highest first)
      sortedMovies.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === "az") {
      // Sort alphabetically
      sortedMovies.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    setFilteredMovies(sortedMovies);
  }, [sort, allMovies, selectedGenre]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8">Filmes</h1>
          
          {!hasContent ? (
            <div className="bg-tretaflix-dark p-8 rounded-lg shadow-lg text-center">
              <AlertTriangle className="h-12 w-12 text-tretaflix-red mx-auto mb-4" />
              <h2 className="text-xl md:text-2xl font-bold mb-4">Sem filmes disponíveis</h2>
              <p className="text-gray-400 mb-6">
                Ainda não há filmes disponíveis no catálogo. Entre como administrador para adicionar filmes.
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
                  <TabsTrigger value="todos">Todos</TabsTrigger>
                  <TabsTrigger value="lancamentos">Lançamentos</TabsTrigger>
                  <TabsTrigger value="populares">Mais Assistidos</TabsTrigger>
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
                      <SelectItem value="avaliacao">Melhor Avaliados</SelectItem>
                      <SelectItem value="az">A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <TabsContent value="todos">
                <div className="mb-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Todos os Filmes</h2>
                  
                  <div className="text-white">
                    <span>{filteredMovies.length} filmes encontrados</span>
                  </div>
                </div>
                
                <div className="content-grid">
                  {filteredMovies.map((movie) => (
                    <Link
                      key={movie.id}
                      to={`/filme/${movie.id}`}
                      className="movie-card"
                    >
                      <div className="poster-wrapper">
                        <img 
                          src={movie.poster} 
                          alt={movie.title}
                          className="poster"
                          onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/300x450?text=Sem+Imagem";
                          }}
                        />
                        <div className="overlay">
                          <div className="rating">
                            <span className="star">★</span> {movie.rating}
                          </div>
                          <button className="play-button">
                            Assistir
                          </button>
                        </div>
                      </div>
                      <h3 className="movie-title">{movie.title}</h3>
                      <div className="movie-year">{movie.year}</div>
                    </Link>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="lancamentos">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">Lançamentos</h2>
                </div>
                
                <div className="content-grid">
                  {allMovies
                    .filter(movie => parseInt(movie.year || "0") >= 2022)
                    .map((movie) => (
                      <Link
                        key={movie.id}
                        to={`/filme/${movie.id}`}
                        className="movie-card"
                      >
                        <div className="poster-wrapper">
                          <img 
                            src={movie.poster} 
                            alt={movie.title}
                            className="poster"
                            onError={(e) => {
                              e.currentTarget.src = "https://via.placeholder.com/300x450?text=Sem+Imagem";
                            }}
                          />
                          <div className="overlay">
                            <div className="rating">
                              <span className="star">★</span> {movie.rating}
                            </div>
                            <button className="play-button">
                              Assistir
                            </button>
                          </div>
                        </div>
                        <h3 className="movie-title">{movie.title}</h3>
                        <div className="movie-year">{movie.year}</div>
                      </Link>
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="populares">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">Mais Assistidos</h2>
                </div>
                
                <div className="content-grid">
                  {allMovies
                    .filter(movie => (movie.rating || 0) >= 7.5)
                    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                    .map((movie) => (
                      <Link
                        key={movie.id}
                        to={`/filme/${movie.id}`}
                        className="movie-card"
                      >
                        <div className="poster-wrapper">
                          <img 
                            src={movie.poster} 
                            alt={movie.title}
                            className="poster"
                            onError={(e) => {
                              e.currentTarget.src = "https://via.placeholder.com/300x450?text=Sem+Imagem";
                            }}
                          />
                          <div className="overlay">
                            <div className="rating">
                              <span className="star">★</span> {movie.rating}
                            </div>
                            <button className="play-button">
                              Assistir
                            </button>
                          </div>
                        </div>
                        <h3 className="movie-title">{movie.title}</h3>
                        <div className="movie-year">{movie.year}</div>
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

export default MoviesPage;

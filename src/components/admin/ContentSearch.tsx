import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search } from "lucide-react";
import { searchTmdb, getTmdbDetail, mediaTypeToRouteType } from "@/services/tmdbApi";

export interface MovieSearchResult {
  id: string;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genres: string[];
  imdbID?: string;
  media_type?: string;
}

interface ContentSearchProps {
  onSelectContent: (content: MovieSearchResult) => void;
  contentType: string;
  onContentTypeChange: (type: string) => void;
}

const ContentSearch = ({ onSelectContent, contentType, onContentTypeChange }: ContentSearchProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MovieSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = async () => {
    if (searchQuery.trim().length < 3) {
      toast({
        title: "Busca muito curta",
        description: "Digite pelo menos 3 caracteres para buscar.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    
    try {
      const tmdbType = contentType === "movie" ? "movie" : 
                       contentType === "series" ? "tv" : 
                       "multi"; // Default to multi search for live
                      
      const response = await searchTmdb(searchQuery, tmdbType as "movie" | "tv" | "multi");
      
      if (response.results && response.results.length > 0) {
        // Map TMDB results to our format
        const formattedResults = await Promise.all(response.results.slice(0, 8).map(async (item) => {
          // Para filtrar apenas tipos específicos quando se usa multi-search
          if (tmdbType === "multi") {
            const mediaType = item.media_type || "movie";
            
            // Só incluir os tipos de conteúdo relevantes
            if (contentType === "movie" && mediaType !== "movie") return null;
            if (contentType === "series" && mediaType !== "tv") return null;
            // Para 'live', aceitamos qualquer tipo para permitir customização
          }
          
          // Define título baseado no tipo (filmes usam 'title', séries usam 'name')
          const title = item.title || item.name || "Sem título";
          
          // Define data baseada no tipo
          const date = item.release_date || item.first_air_date || "";
          
          return {
            id: item.id,
            title: title,
            overview: item.overview || "Sem descrição disponível",
            poster_path: item.poster_path || "https://via.placeholder.com/300x450?text=Sem+Imagem",
            backdrop_path: item.backdrop_path || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2625&auto=format&fit=crop",
            release_date: date,
            vote_average: item.vote_average || 0,
            genres: [], // Adicionaremos gêneros a partir dos detalhes
            media_type: item.media_type || (contentType === "movie" ? "movie" : contentType === "series" ? "tv" : "movie")
          };
        }));
        
        // Filtrar resultados nulos (que não correspondem ao tipo desejado)
        const validResults = formattedResults.filter(item => item !== null) as MovieSearchResult[];
        
        setSearchResults(validResults);
        
        if (validResults.length === 0) {
          toast({
            title: "Sem resultados",
            description: "Não foi possível encontrar resultados para o tipo selecionado.",
          });
        }
      } else {
        setSearchResults([]);
        toast({
          title: "Sem resultados",
          description: "Não foi possível encontrar resultados para sua busca.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro na busca",
        description: "Ocorreu um erro ao buscar conteúdo. Tente novamente.",
        variant: "destructive",
      });
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Quando o usuário seleciona um item, obter detalhes completos
  const handleSelectContent = async (result: MovieSearchResult) => {
    setIsSearching(true);
    
    try {
      // Determinar o tipo para busca detalhada
      const detailType = result.media_type === "tv" || contentType === "series" 
        ? "tv" 
        : "movie";
      
      // Obter detalhes completos
      const details = await getTmdbDetail(result.id, detailType);
      
      if (details.success) {
        const genres = details.genres ? details.genres.map(g => g.name) : [];
        
        const completeResult: MovieSearchResult = {
          id: details.id,
          title: details.title || details.name || result.title,
          overview: details.overview || result.overview,
          poster_path: details.poster_path || result.poster_path,
          backdrop_path: details.backdrop_path || result.backdrop_path,
          release_date: details.release_date || details.first_air_date || result.release_date || "",
          vote_average: details.vote_average || result.vote_average,
          genres: genres,
          media_type: detailType
        };
        
        onSelectContent(completeResult);
      } else {
        // Fallback para usar os resultados da pesquisa se os detalhes falharem
        onSelectContent(result);
      }
    } catch (error) {
      console.error("Error getting details:", error);
      // Fallback para usar os resultados da pesquisa se os detalhes falharem
      onSelectContent(result);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <Select 
          value={contentType}
          onValueChange={onContentTypeChange}
        >
          <SelectTrigger className="bg-tretaflix-gray border-tretaflix-gray text-white w-32">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent className="bg-tretaflix-gray border-tretaflix-gray text-white">
            <SelectItem value="movie">Filme</SelectItem>
            <SelectItem value="series">Série</SelectItem>
            <SelectItem value="live">Canal ao Vivo</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex flex-1">
          <Input
            type="text"
            placeholder="Buscar filme, série ou canal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-tretaflix-gray border-tretaflix-gray text-white rounded-r-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <Button
            onClick={handleSearch}
            disabled={isSearching || searchQuery.length < 3}
            className="bg-tretaflix-red hover:bg-tretaflix-red/80 rounded-l-none"
          >
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      {searchResults.length > 0 && (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {searchResults.map((result) => (
            <div
              key={result.id}
              className="flex gap-3 p-3 bg-tretaflix-gray rounded-md cursor-pointer hover:bg-tretaflix-gray/80"
              onClick={() => handleSelectContent(result)}
            >
              <div className="w-16 h-24 bg-gray-700 rounded overflow-hidden">
                <img
                  src={result.poster_path}
                  alt={result.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/300x450?text=Sem+Imagem";
                  }}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{result.title}</h3>
                <p className="text-sm text-gray-400">
                  {result.release_date ? result.release_date.substring(0, 4) : ""} 
                  {result.vote_average > 0 && (
                    <> • {result.vote_average.toFixed(1)}/10</>
                  )}
                </p>
                <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                  {result.overview}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {isSearching && (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-tretaflix-red mx-auto" />
          <p className="mt-2">Buscando conteúdo...</p>
        </div>
      )}
    </div>
  );
};

export default ContentSearch;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Film, Tv, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchOmdb, OmdbSearchResult } from "@/services/omdbApi";
import { useToast } from "@/components/ui/use-toast";

const SearchDialog = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<OmdbSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (query.trim().length < 3) {
      toast({
        title: "Busca muito curta",
        description: "Digite pelo menos 3 caracteres para buscar.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const movieResults = await searchOmdb(query, "movie");
    const seriesResults = await searchOmdb(query, "series");
    
    const combined: OmdbSearchResult[] = [];
    
    if (movieResults.Response === "True" && movieResults.Search) {
      combined.push(...movieResults.Search);
    }
    
    if (seriesResults.Response === "True" && seriesResults.Search) {
      combined.push(...seriesResults.Search);
    }
    
    setResults(combined.slice(0, 8)); // Limit to 8 results
    setLoading(false);

    if (combined.length === 0) {
      toast({
        title: "Sem resultados",
        description: "Não foi possível encontrar resultados para sua busca.",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleResultClick = (result: OmdbSearchResult) => {
    setOpen(false);
    const route = result.Type === "movie" ? `/filme/${result.imdbID}` : `/serie/${result.imdbID}`;
    navigate(route);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-white">
          <Search className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-tretaflix-dark text-white border-tretaflix-gray max-w-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex flex-1 items-center rounded-md bg-tretaflix-gray px-3">
            <Search className="text-tretaflix-red h-5 w-5 mr-2" />
            <Input
              type="text"
              placeholder="Buscar filmes, séries..."
              className="border-0 bg-transparent text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {query && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7" 
                onClick={() => setQuery("")}
              >
                <X className="h-4 w-4 text-gray-400" />
              </Button>
            )}
          </div>
          <Button 
            onClick={handleSearch} 
            className="bg-tretaflix-red hover:bg-tretaflix-red/80"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buscar"}
          </Button>
        </div>

        {loading && (
          <div className="py-6 flex justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-tretaflix-red" />
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {results.map((result) => (
              <div 
                key={result.imdbID}
                className="bg-tretaflix-gray rounded-md overflow-hidden cursor-pointer hover:ring-1 hover:ring-tretaflix-red transition-all"
                onClick={() => handleResultClick(result)}
              >
                <div className="aspect-[2/3] bg-black/50">
                  <img 
                    src={result.Poster !== "N/A" ? result.Poster : "https://via.placeholder.com/300x450?text=Sem+Imagem"} 
                    alt={result.Title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/300x450?text=Sem+Imagem";
                    }}
                  />
                </div>
                <div className="p-2">
                  <h3 className="text-sm font-medium truncate">{result.Title}</h3>
                  <div className="flex items-center text-xs text-gray-400">
                    <span className="mr-1">
                      {result.Year}
                    </span>
                    <span className="flex items-center ml-2">
                      {result.Type === "movie" ? (
                        <Film className="h-3 w-3 mr-1" />
                      ) : (
                        <Tv className="h-3 w-3 mr-1" />
                      )}
                      {result.Type === "movie" ? "Filme" : "Série"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && results.length === 0 && query.length > 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-400">Nenhum resultado encontrado para "{query}"</p>
            <p className="text-gray-500 text-sm mt-2">Tente usar termos diferentes ou verifique a ortografia</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;

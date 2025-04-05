import { toast } from "@/components/ui/use-toast";

// API Key for OMDB API
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

export interface OmdbSearchResult {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface OmdbSearchResponse {
  Search?: OmdbSearchResult[];
  totalResults?: string;
  Response: string;
  Error?: string;
}

export interface OmdbDetailResponse {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: { Source: string; Value: string }[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
  Error?: string;
}

export const searchOmdb = async (query: string, type: "movie" | "series" | "episode" = "movie"): Promise<OmdbSearchResponse> => {
  try {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=${type}`);
    const data = await response.json();

    if (data.Response === "False") {
      toast({
        title: "Erro na busca",
        description: data.Error || "Não foi possível encontrar resultados.",
        variant: "destructive",
      });
      return { Response: "False", Error: data.Error };
    }

    return data;
  } catch (error) {
    toast({
      title: "Erro na API",
      description: "Não foi possível conectar à API de filmes. Tente novamente mais tarde.",
      variant: "destructive",
    });
    return { Response: "False", Error: "Erro de conexão" };
  }
};

export const getOmdbDetail = async (imdbId: string): Promise<OmdbDetailResponse> => {
  try {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbId}&plot=full`);
    const data = await response.json();

    if (data.Response === "False") {
      toast({
        title: "Erro ao carregar detalhes",
        description: data.Error || "Não foi possível carregar os detalhes do conteúdo.",
        variant: "destructive",
      });
      return { ...data, Response: "False" };
    }

    return data;
  } catch (error) {
    toast({
      title: "Erro na API",
      description: "Não foi possível conectar à API de filmes. Tente novamente mais tarde.",
      variant: "destructive",
    });
    return { Response: "False", Error: "Erro de conexão" } as OmdbDetailResponse;
  }
};

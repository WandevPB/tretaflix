import { toast } from "@/components/ui/use-toast";

// API Key para TMDB - deve ser salva em .env
const API_KEY = "527675a851d901c88e25e67d661ca11d";
const API_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1Mjc2NzVhODUxZDkwMWM4OGUyNWU2N2Q2NjFjYTExZCIsIm5iZiI6MTc0MzczMjQ0MC4zOTMsInN1YiI6IjY3ZWYzZWQ4YWE3N2UwOGFmNzk5MjMzZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4ik1_R1r-uXj-R0cq3jIICgYKt0X_9PTercF3zz9kSs";

// Configurações para língua portuguesa e região
const LANGUAGE = "pt-BR";
const REGION = "BR";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";

export interface TmdbSearchResult {
  id: string;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
  media_type?: string;
}

export interface TmdbSearchResponse {
  results?: TmdbSearchResult[];
  total_results?: number;
  total_pages?: number;
  page?: number;
  success?: boolean;
  status_message?: string;
}

export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbDetailResponse {
  id: string;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  genres: TmdbGenre[];
  runtime?: number;
  number_of_seasons?: number;
  status?: string;
  tagline?: string;
  success?: boolean;
  status_message?: string;
}

// Opções de fetch com cabeçalhos de autorização
const fetchOptions = {
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json;charset=utf-8'
  }
};

// Buscar na TMDB por filmes ou séries em português
export const searchTmdb = async (query: string, type: "movie" | "tv" | "multi" = "multi"): Promise<TmdbSearchResponse> => {
  try {
    const endpoint = type === "multi" 
      ? `/search/multi` 
      : `/search/${type}`;
    
    const url = `${BASE_URL}${endpoint}?api_key=${API_KEY}&language=${LANGUAGE}&query=${encodeURIComponent(query)}&region=${REGION}&include_adult=false`;
    const response = await fetch(url, fetchOptions);
    const data = await response.json();

    if (!response.ok) {
      toast({
        title: "Erro na busca",
        description: data.status_message || "Não foi possível encontrar resultados.",
        variant: "destructive",
      });
      return { success: false, status_message: data.status_message };
    }

    // Formatar os resultados para incluir URLs completos das imagens
    const formattedResults = data.results?.map((item: TmdbSearchResult) => ({
      ...item,
      poster_path: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : null,
      backdrop_path: item.backdrop_path ? `${BACKDROP_BASE_URL}${item.backdrop_path}` : null,
      id: item.id.toString()
    }));

    return {
      ...data,
      results: formattedResults
    };
  } catch (error) {
    console.error("Erro na API TMDB:", error);
    toast({
      title: "Erro na API",
      description: "Não foi possível conectar à API de filmes. Tente novamente mais tarde.",
      variant: "destructive",
    });
    return { success: false, status_message: "Erro de conexão" };
  }
};

// Obter detalhes de filme/série específico com ID
export const getTmdbDetail = async (id: string, type: "movie" | "tv"): Promise<TmdbDetailResponse> => {
  try {
    const url = `${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=${LANGUAGE}&append_to_response=credits,videos`;
    const response = await fetch(url, fetchOptions);
    const data = await response.json();

    if (!response.ok) {
      toast({
        title: "Erro ao carregar detalhes",
        description: data.status_message || "Não foi possível carregar os detalhes do conteúdo.",
        variant: "destructive",
      });
      return { ...data, success: false };
    }

    // Formatar os resultados para incluir URLs completos das imagens
    return {
      ...data,
      poster_path: data.poster_path ? `${IMAGE_BASE_URL}${data.poster_path}` : null,
      backdrop_path: data.backdrop_path ? `${BACKDROP_BASE_URL}${data.backdrop_path}` : null,
      id: data.id.toString(),
      success: true
    };
  } catch (error) {
    console.error("Erro na API TMDB Details:", error);
    toast({
      title: "Erro na API",
      description: "Não foi possível conectar à API de filmes. Tente novamente mais tarde.",
      variant: "destructive",
    });
    return { success: false, status_message: "Erro de conexão" } as TmdbDetailResponse;
  }
};

// Obter gêneros em português
export const getGenres = async (type: "movie" | "tv"): Promise<TmdbGenre[]> => {
  try {
    const url = `${BASE_URL}/genre/${type}/list?api_key=${API_KEY}&language=${LANGUAGE}`;
    const response = await fetch(url, fetchOptions);
    const data = await response.json();

    if (!response.ok) {
      return [];
    }

    return data.genres || [];
  } catch (error) {
    console.error("Erro ao buscar gêneros:", error);
    return [];
  }
};

// Conversor de tipo media_type para routeType
export const mediaTypeToRouteType = (mediaType: string): string => {
  switch (mediaType) {
    case "movie":
      return "filme";
    case "tv":
      return "serie";
    default:
      return "filme";
  }
}; 
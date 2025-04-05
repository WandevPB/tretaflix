export interface Content {
  id: string;
  title: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  releaseDate: string;
  rating: string;
  genres: string;
  embedCode: string;
  type: string;
  tmdbId?: string;
  mediaType?: string;
  
  // Campos específicos para séries
  season?: number;
  episodeCount?: number;
  seasonTitle?: string;
} 
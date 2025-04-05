import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Image, Loader2, Plus } from "lucide-react";
import { MovieSearchResult } from "./ContentSearch";
import supabase from "@/lib/supabase";

// Lista de categorias
const categories = [
  "Ação",
  "Aventura",
  "Animação",
  "Comédia",
  "Crime",
  "Documentário",
  "Drama",
  "Família",
  "Fantasia",
  "História",
  "Terror",
  "Música",
  "Mistério",
  "Romance",
  "Ficção Científica",
  "Thriller",
  "Guerra",
  "Faroeste",
  "Esportes",
  "Notícias",
  "Infantil",
  "Educação",
  "Culinária",
  "Viagens",
  "Animes"
];

// Função para salvar o conteúdo apenas no Supabase
const saveContent = async (data: ContentFormSchema) => {
  setIsLoading(true);
  
  try {
    // Sanitizar o código embed
    const cleanEmbedCode = data.embedCode || '';
    
    // Preparar o conteúdo para salvar
    const contentToSave = {
      id: data.id || generateId(),
      title: data.title,
      overview: data.overview || '',
      type: data.type,
      release_date: data.releaseDate || '',
      vote_average: data.rating || 0,
      poster_path: data.posterUrl || '',
      backdrop_path: data.backdropUrl || '',
      embedUrl: cleanEmbedCode,
      dateadded: new Date().toISOString(),
      // Incluir campos de temporada quando relevante
      ...(data.type === 'serie' && {
        season: data.season || 1,
        episodeCount: data.episodeCount || 0,
        seasonTitle: data.seasonTitle || ''
      })
    };
    
    // Salvar no Supabase
    const response = await fetch('https://hawbikistbbenjaldjvk.supabase.co/rest/v1/tretaflix', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhhd2Jpa2lzdGJiZW5qYWxkanZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg4MDEwNDIsImV4cCI6MjAzNDM3NzA0Mn0.xoxFHQbYgLvx5yx35JNIGvgxSHnYEJVv2_s43BpRkGM',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhhd2Jpa2lzdGJiZW5qYWxkanZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg4MDEwNDIsImV4cCI6MjAzNDM3NzA0Mn0.xoxFHQbYgLvx5yx35JNIGvgxSHnYEJVv2_s43BpRkGM',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(contentToSave)
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao salvar conteúdo: ${response.statusText}`);
    }
    
    toast({
      title: "Conteúdo adicionado com sucesso!",
      description: `${data.title} foi adicionado ao catálogo.`,
    });
    
    form.reset();
    setSelectedPoster(null);
    setSelectedBackdrop(null);
    
  } catch (error) {
    console.error('Erro ao adicionar conteúdo:', error);
    toast({
      title: "Erro ao adicionar conteúdo",
      description: "Ocorreu um erro ao tentar adicionar o conteúdo.",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

interface ContentFormProps {
  selectedContent: MovieSearchResult | null;
  contentType: string;
}

const ContentForm = ({ selectedContent, contentType }: ContentFormProps) => {
  const { toast } = useToast();
  const [embedCode, setEmbedCode] = useState("");
  const [category, setCategory] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Try to set a default category based on the first genre when content changes
  useEffect(() => {
    if (selectedContent && selectedContent.genres && selectedContent.genres.length > 0) {
      // Check if any genre matches our category list
      const matchingCategory = selectedContent.genres.find(genre => 
        categories.includes(genre)
      );
      if (matchingCategory) {
        setCategory(matchingCategory);
      } else if (categories.length > 0) {
        // Set first category as default if no match
        setCategory(categories[0]);
      }
    }
  }, [selectedContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedContent) {
      toast({
        title: "Erro",
        description: "Selecione um conteúdo antes de adicionar.",
        variant: "destructive",
      });
      return;
    }
    
    if (!embedCode.trim()) {
      toast({
        title: "Erro",
        description: "Adicione o link do torrent ou URL do vídeo.",
        variant: "destructive",
      });
      return;
    }
    
    if (!category) {
      toast({
        title: "Erro",
        description: "Selecione uma categoria para o conteúdo.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // Format URL from embed code if it's an iframe
      let embedUrl = embedCode;
      const iframeMatch = embedCode.match(/src=["']([^"']+)["']/);
      if (iframeMatch && iframeMatch[1]) {
        embedUrl = iframeMatch[1];
      }
      
      // In a real app, this would be an API call to save the content
      const success = await saveContent({
        ...selectedContent,
        embedCode,
        embedUrl,
        category,
        type: contentType,
        routetype: contentType === "movie" ? "filme" :
                  contentType === "series" ? "serie" : "aovivo"
      });
      
      if (success) {
        toast({
          title: "Conteúdo adicionado",
          description: `${selectedContent.title} foi adicionado com sucesso.`,
        });
        
        // Reset form
        setEmbedCode("");
        setCategory("");
      } else {
        throw new Error("Failed to save content");
      }
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o conteúdo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!selectedContent) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-16 h-16 rounded-full bg-tretaflix-gray flex items-center justify-center mb-4">
          <Image className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium">Nenhum conteúdo selecionado</h3>
        <p className="text-sm text-gray-400 mt-1">
          Busque e selecione um conteúdo para adicionar informações.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <div className="w-1/3">
          <div className="aspect-[2/3] bg-tretaflix-gray rounded-md overflow-hidden">
            <img
              src={selectedContent.poster_path}
              alt={selectedContent.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/300x450?text=Sem+Imagem";
              }}
            />
          </div>
        </div>
        
        <div className="flex-1 space-y-2">
          <div>
            <Label htmlFor="title" className="text-sm text-gray-300">Título</Label>
            <Input
              id="title"
              value={selectedContent.title}
              className="bg-tretaflix-gray border-tretaflix-gray text-white"
              readOnly
            />
          </div>
          
          <div>
            <Label htmlFor="year" className="text-sm text-gray-300">Ano</Label>
            <Input
              id="year"
              value={selectedContent.release_date}
              className="bg-tretaflix-gray border-tretaflix-gray text-white"
              readOnly
            />
          </div>
          
          <div>
            <Label htmlFor="genre" className="text-sm text-gray-300">Gênero</Label>
            <Input
              id="genre"
              value={selectedContent.genres.join(", ")}
              className="bg-tretaflix-gray border-tretaflix-gray text-white"
              readOnly
            />
          </div>
        </div>
      </div>
      
      <div>
        <Label htmlFor="overview" className="text-sm text-gray-300">Sinopse</Label>
        <Textarea
          id="overview"
          value={selectedContent.overview}
          className="bg-tretaflix-gray border-tretaflix-gray text-white h-24"
          readOnly
        />
      </div>
      
      <div>
        <Label htmlFor="category" className="text-sm text-gray-300">
          Categoria <span className="text-tretaflix-red">*</span>
        </Label>
        <Select 
          value={category} 
          onValueChange={setCategory}
          required
        >
          <SelectTrigger className="bg-tretaflix-gray border-tretaflix-gray text-white">
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent className="bg-tretaflix-gray border-tretaflix-gray text-white max-h-80">
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="embedCode" className="text-sm text-gray-300">
          {contentType === "movie" 
            ? "Link do Torrent" 
            : contentType === "series" 
              ? "Link do Torrent da Temporada" 
              : "URL do Stream"}
          <span className="text-tretaflix-red">*</span>
        </Label>
        <Textarea
          id="embedCode"
          value={embedCode}
          onChange={(e) => setEmbedCode(e.target.value)}
          className="bg-tretaflix-gray border-tretaflix-gray text-white min-h-20"
          placeholder="Cole aqui o link do torrent (magnet) ou URL do vídeo..."
        />
        <p className="text-xs text-gray-500 mt-1">
          Exemplos: magnet:?xt=urn:btih:HASH, https://exemplo.com/video.mp4, ou outros formatos válidos.
        </p>
      </div>
      
      <div className="pt-4">
        <Button 
          type="submit" 
          className="w-full bg-tretaflix-red hover:bg-tretaflix-red/80"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" /> Adicionar Conteúdo
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ContentForm;

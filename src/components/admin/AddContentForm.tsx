import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ContentSearch, { MovieSearchResult } from "./ContentSearch";
import { validateEmbedCode } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/router";

const formSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  overview: z.string().min(1, "Descrição é obrigatória"),
  posterUrl: z.string().url("URL da imagem inválida").min(1, "URL da imagem é obrigatória"),
  backdropUrl: z.string().url("URL da imagem de fundo inválida").min(1, "URL da imagem de fundo é obrigatória"),
  releaseDate: z.string(),
  rating: z.string(),
  embedCode: z.string().min(1, "URL do vídeo ou código de embed é obrigatório"),
  genres: z.string().min(1, "Gêneros são obrigatórios"),
  tmdbId: z.string().optional(),
  mediaType: z.string().optional(),
  season: z.coerce.number().optional(),
  episodeCount: z.coerce.number().optional(),
  seasonTitle: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddContentFormProps {
  onAddContent: (content: any) => Promise<void>;
  contentType: string;
  onContentTypeChange: (type: string) => void;
}

export default function AddContentForm({
  onAddContent,
  contentType,
  onContentTypeChange,
}: AddContentFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedContent, setSelectedContent] = useState<MovieSearchResult | null>(null);
  const [showSampleVideos, setShowSampleVideos] = useState(false);
  const [sampleVideos, setSampleVideos] = useState([
    {
      id: 'sample1',
      title: 'Big Buck Bunny',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    },
    {
      id: 'sample2',
      title: 'Elephant Dream',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
    },
    {
      id: 'sample3',
      title: 'Tears of Steel',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg',
    },
    {
      id: 'sample4',
      title: 'Sintel',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg',
    }
  ]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      overview: "",
      posterUrl: "",
      backdropUrl: "",
      releaseDate: "",
      rating: "",
      embedCode: "",
      genres: "",
      tmdbId: "",
      mediaType: contentType,
    },
  });

  // Buscar vídeos de amostra da API quando o componente carregar
  useEffect(() => {
    const fetchSampleVideos = async () => {
      try {
        const response = await fetch('/api/videos/search');
        if (response.ok) {
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            setSampleVideos(data.results);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar vídeos de amostra:', error);
      }
    };
    
    fetchSampleVideos();
  }, []);

  // Quando um conteúdo for selecionado da pesquisa
  const handleSelectContent = (content: MovieSearchResult) => {
    setSelectedContent(content);
    
    form.setValue("title", content.title);
    form.setValue("overview", content.overview);
    
    // A API TMDB retorna URLs completas para as imagens
    form.setValue("posterUrl", content.poster_path);
    form.setValue("backdropUrl", content.backdrop_path || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2625&auto=format&fit=crop");
    
    // Data de lançamento
    form.setValue("releaseDate", content.release_date || "");
    
    // Avaliação
    form.setValue("rating", content.vote_average ? content.vote_average.toString() : "");
    
    // Gêneros
    form.setValue("genres", content.genres.join(", "));
    
    // ID do TMDB e tipo de mídia
    form.setValue("tmdbId", content.id);
    form.setValue("mediaType", content.media_type || contentType);
    
    // Foco no campo do embed para facilitar a inserção
    setTimeout(() => {
      const embedInput = document.getElementById("embedCode");
      if (embedInput) {
        embedInput.focus();
      }
    }, 100);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const contentData = {
        ...data,
        type: contentType,
        tmdbId: data.tmdbId || "",
        mediaType: data.mediaType || contentType,
      };

      await onAddContent(contentData);
      
      toast({
        title: "Conteúdo adicionado com sucesso!",
        description: `${data.title} foi adicionado à biblioteca.`,
      });

      // Resetar o formulário
      form.reset();
      setSelectedContent(null);
      
      // Redirecionar para a lista de conteúdos do tipo atual
      router.push(`/admin/${contentType === "movie" ? "movies" : contentType === "series" ? "series" : "live"}`);
    } catch (error) {
      toast({
        title: "Erro ao adicionar conteúdo",
        description: "Ocorreu um erro ao adicionar o conteúdo. Tente novamente.",
        variant: "destructive",
      });
      console.error("Submit error:", error);
    }
  };

  // Adicionar na função existente para mostrar amostras, ou criar uma nova
  const handleShowSampleVideos = () => {
    setShowSampleVideos(true);
  };

  // Adicionar na função existente para usar vídeo de amostra
  const handleUseSampleVideo = (url: string) => {
    form.setValue('embedCode', url);
    setShowSampleVideos(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-tretaflix-gray/50 p-6 rounded-md">
        <h2 className="text-xl font-semibold mb-4">Buscar Conteúdo</h2>
        <ContentSearch 
          onSelectContent={handleSelectContent} 
          contentType={contentType}
          onContentTypeChange={onContentTypeChange}
        />
      </div>

      {(selectedContent || form.getValues().title) && (
        <Card className="bg-tretaflix-gray/50 p-6">
          <h2 className="text-xl font-semibold mb-4">Adicionar Detalhes e Embed</h2>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Título do conteúdo" {...field} className="bg-tretaflix-gray border-tretaflix-gray text-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="releaseDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Lançamento</FormLabel>
                        <FormControl>
                          <Input placeholder="Ano ou data" {...field} className="bg-tretaflix-gray border-tretaflix-gray text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Avaliação</FormLabel>
                        <FormControl>
                          <Input placeholder="Avaliação (0-10)" {...field} className="bg-tretaflix-gray border-tretaflix-gray text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="overview"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descrição do conteúdo" 
                        {...field} 
                        className="bg-tretaflix-gray border-tretaflix-gray text-white min-h-24" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="posterUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL do Poster</FormLabel>
                      <FormControl>
                        <Input placeholder="URL da imagem de capa" {...field} className="bg-tretaflix-gray border-tretaflix-gray text-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="backdropUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL da Imagem de Fundo</FormLabel>
                      <FormControl>
                        <Input placeholder="URL da imagem de fundo" {...field} className="bg-tretaflix-gray border-tretaflix-gray text-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="genres"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gêneros</FormLabel>
                    <FormControl>
                      <Input placeholder="Ação, Aventura, etc." {...field} className="bg-tretaflix-gray border-tretaflix-gray text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {contentType === "series" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="season"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Temporada</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder="Número da temporada"
                            {...field}
                            className="bg-tretaflix-gray border-tretaflix-gray text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="episodeCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de Episódios</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder="Quantidade de episódios"
                            {...field}
                            className="bg-tretaflix-gray border-tretaflix-gray text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="seasonTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título da Temporada (opcional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: A Saga Continua"
                            {...field}
                            className="bg-tretaflix-gray border-tretaflix-gray text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              
              <FormField
                control={form.control}
                name="embedCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {contentType === "movie" 
                        ? "URL do Vídeo ou Código de Incorporação" 
                        : contentType === "series" 
                          ? "URL do Vídeo ou Código de Incorporação" 
                          : "URL do Stream"}
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        id="embedCode"
                        placeholder="Cole aqui o link direto do vídeo ou código iframe"
                        {...field} 
                        className="bg-tretaflix-gray border-tretaflix-gray text-white min-h-24"
                      />
                    </FormControl>
                    <FormMessage />
                    <div className="text-xs text-gray-400 mt-2 space-y-1">
                      <p>Exemplos de links válidos:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>https://exemplo.com/video.mp4 (link direto para vídeo)</li>
                        <li>&lt;iframe src="https://exemplo.com/embed/123"&gt;&lt;/iframe&gt; (código incorporado)</li>
                        <li>Ou use os vídeos de amostra abaixo que funcionam garantidamente</li>
                      </ul>
                      <button 
                        type="button"
                        onClick={handleShowSampleVideos}
                        className="text-tretaflix-red hover:underline mt-1 block font-bold"
                      >
                        Clique aqui para usar vídeos de amostra (recomendado)
                      </button>
                    </div>
                  </FormItem>
                )}
              />
              
              {showSampleVideos && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                  <div className="bg-tretaflix-card text-white p-6 rounded-lg max-w-xl w-full max-h-[90vh] overflow-auto">
                    <h3 className="text-xl font-bold mb-4">Vídeos de Amostra</h3>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Links Diretos</h4>
                      <div className="space-y-2">
                        <button
                          className="w-full text-left p-2 hover:bg-tretaflix-gray rounded transition-colors"
                          onClick={() => handleUseSampleVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4')}
                        >
                          Big Buck Bunny (MP4)
                        </button>
                        <button
                          className="w-full text-left p-2 hover:bg-tretaflix-gray rounded transition-colors"
                          onClick={() => handleUseSampleVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4')}
                        >
                          Elephants Dream (MP4)
                        </button>
                        <button
                          className="w-full text-left p-2 hover:bg-tretaflix-gray rounded transition-colors"
                          onClick={() => handleUseSampleVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4')}
                        >
                          Sintel (MP4)
                        </button>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Códigos iframe (YouTube)</h4>
                      <div className="space-y-2">
                        <button
                          className="w-full text-left p-2 hover:bg-tretaflix-gray rounded transition-colors"
                          onClick={() => handleUseSampleVideo('<iframe width="560" height="315" src="https://www.youtube.com/embed/aqz-KE-bpKQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>')}
                        >
                          Big Buck Bunny (YouTube)
                        </button>
                        <button
                          className="w-full text-left p-2 hover:bg-tretaflix-gray rounded transition-colors"
                          onClick={() => handleUseSampleVideo('<iframe width="560" height="315" src="https://www.youtube.com/embed/sLg9mKAu0GY" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>')}
                        >
                          Sintel (YouTube)
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => setShowSampleVideos(false)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                      >
                        Fechar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-tretaflix-red hover:bg-tretaflix-red/80"
              >
                Adicionar {contentType === "movie" ? "Filme" : contentType === "series" ? "Série" : "Canal ao Vivo"}
              </Button>
            </form>
          </Form>
        </Card>
      )}
    </div>
  );
} 
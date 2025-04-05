import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Image, Loader2, Save, ArrowLeft } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
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

const EditContent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState<any>(null);
  
  // Formulário
  const [title, setTitle] = useState("");
  const [overview, setOverview] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [backdropUrl, setBackdropUrl] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [category, setCategory] = useState("");
  const [embedCode, setEmbedCode] = useState("");
  const [contentType, setContentType] = useState<"movie" | "series" | "live">("movie");
  const [genre, setGenre] = useState("");
  const [season, setSeason] = useState<number | undefined>(undefined);
  const [episodeCount, setEpisodeCount] = useState<number | undefined>(undefined);
  const [seasonTitle, setSeasonTitle] = useState("");
  
  // Carregar dados do conteúdo
  useEffect(() => {
    // Verificar autenticação
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate("/admin");
      return;
    }
    
    const fetchContent = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('tretaflix')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) {
          throw error;
        }
        
        if (!data) {
          toast({
            title: "Conteúdo não encontrado",
            description: "O item que você está tentando editar não existe.",
            variant: "destructive",
          });
          navigate(-1);
          return;
        }
        
        // Preencher formulário
        setContent(data);
        setTitle(data.title || "");
        setOverview(data.overview || "");
        setPosterUrl(data.posterurl || "");
        setBackdropUrl(data.backdropurl || "");
        setReleaseDate(data.releasedate || "");
        setCategory(data.category || "");
        setEmbedCode(data.embedcode || "");
        setGenre(data.genres || "");
        
        // Determinar tipo de conteúdo
        if (data.type === "series" || data.routetype === "serie") {
          setContentType("series");
          setSeason(data.season || undefined);
          setEpisodeCount(data.episodecount || undefined);
          setSeasonTitle(data.seasontitle || "");
        } else if (data.type === "live" || data.routetype === "aovivo") {
          setContentType("live");
        } else {
          setContentType("movie");
        }
      } catch (error) {
        console.error("Erro ao carregar conteúdo:", error);
        toast({
          title: "Erro ao carregar",
          description: "Não foi possível carregar os dados do conteúdo.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContent();
  }, [id, navigate, toast]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Preparar dados atualizados
      const updatedContent = {
        title,
        overview,
        posterurl: posterUrl,
        backdropurl: backdropUrl,
        releasedate: releaseDate,
        category,
        embedcode: embedCode,
        genres: genre,
        type: contentType,
        routetype: contentType === "movie" ? "filme" : 
                  contentType === "series" ? "serie" : "aovivo",
        // Campos opcionais para séries
        ...(contentType === "series" && {
          season,
          episodecount: episodeCount,
          seasontitle: seasonTitle
        })
      };
      
      // Atualizar no Supabase
      const { error } = await supabase
        .from('tretaflix')
        .update(updatedContent)
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Conteúdo atualizado",
        description: "As alterações foram salvas com sucesso.",
      });
      
      // Redirecionar
      if (contentType === "movie") {
        navigate("/admin/movies");
      } else if (contentType === "series") {
        navigate("/admin/series");
      } else {
        navigate("/admin/live");
      }
    } catch (error) {
      console.error("Erro ao atualizar conteúdo:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível atualizar o conteúdo.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            className="mr-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Editar Conteúdo</h1>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-tretaflix-red mb-4" />
              <p className="text-gray-400">Carregando conteúdo...</p>
            </div>
          </div>
        ) : content ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-sm text-gray-300">Título</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-tretaflix-gray border-tretaflix-gray text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="type" className="text-sm text-gray-300">Tipo de Conteúdo</Label>
                    <Select 
                      value={contentType} 
                      onValueChange={(value: "movie" | "series" | "live") => setContentType(value)}
                    >
                      <SelectTrigger className="bg-tretaflix-gray border-tretaflix-gray text-white">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent className="bg-tretaflix-gray border-tretaflix-gray text-white">
                        <SelectItem value="movie">Filme</SelectItem>
                        <SelectItem value="series">Série</SelectItem>
                        <SelectItem value="live">Ao Vivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="category" className="text-sm text-gray-300">Categoria</Label>
                    <Select 
                      value={category} 
                      onValueChange={setCategory}
                    >
                      <SelectTrigger className="bg-tretaflix-gray border-tretaflix-gray text-white">
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent className="bg-tretaflix-gray border-tretaflix-gray text-white max-h-60">
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="releaseDate" className="text-sm text-gray-300">Data de Lançamento</Label>
                    <Input
                      id="releaseDate"
                      type="date"
                      value={releaseDate ? releaseDate.slice(0, 10) : ""}
                      onChange={(e) => setReleaseDate(e.target.value)}
                      className="bg-tretaflix-gray border-tretaflix-gray text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="genre" className="text-sm text-gray-300">Gêneros (separados por vírgula)</Label>
                    <Input
                      id="genre"
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="bg-tretaflix-gray border-tretaflix-gray text-white"
                      placeholder="Ação, Aventura, Ficção Científica"
                    />
                  </div>
                  
                  {contentType === "series" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="season" className="text-sm text-gray-300">Temporada</Label>
                        <Input
                          id="season"
                          type="number"
                          value={season || ""}
                          onChange={(e) => setSeason(e.target.value ? parseInt(e.target.value) : undefined)}
                          className="bg-tretaflix-gray border-tretaflix-gray text-white"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="episodeCount" className="text-sm text-gray-300">Número de Episódios</Label>
                        <Input
                          id="episodeCount"
                          type="number"
                          value={episodeCount || ""}
                          onChange={(e) => setEpisodeCount(e.target.value ? parseInt(e.target.value) : undefined)}
                          className="bg-tretaflix-gray border-tretaflix-gray text-white"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <Label htmlFor="seasonTitle" className="text-sm text-gray-300">Título da Temporada</Label>
                        <Input
                          id="seasonTitle"
                          value={seasonTitle}
                          onChange={(e) => setSeasonTitle(e.target.value)}
                          className="bg-tretaflix-gray border-tretaflix-gray text-white"
                          placeholder="Ex: A Guerra dos Tronos"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="posterUrl" className="text-sm text-gray-300">URL do Poster</Label>
                  <Input
                    id="posterUrl"
                    value={posterUrl}
                    onChange={(e) => setPosterUrl(e.target.value)}
                    className="bg-tretaflix-gray border-tretaflix-gray text-white"
                    placeholder="https://exemplo.com/poster.jpg"
                  />
                  {posterUrl && (
                    <div className="mt-2 aspect-[2/3] bg-tretaflix-gray rounded-md overflow-hidden w-24">
                      <img
                        src={posterUrl}
                        alt="Poster Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x450?text=Erro+na+Imagem";
                        }}
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="backdropUrl" className="text-sm text-gray-300">URL da Imagem de Fundo</Label>
                  <Input
                    id="backdropUrl"
                    value={backdropUrl}
                    onChange={(e) => setBackdropUrl(e.target.value)}
                    className="bg-tretaflix-gray border-tretaflix-gray text-white"
                    placeholder="https://exemplo.com/backdrop.jpg"
                  />
                </div>
                
                <div>
                  <Label htmlFor="overview" className="text-sm text-gray-300">Sinopse</Label>
                  <Textarea
                    id="overview"
                    value={overview}
                    onChange={(e) => setOverview(e.target.value)}
                    className="bg-tretaflix-gray border-tretaflix-gray text-white min-h-[100px]"
                  />
                </div>
                
                <div>
                  <Label htmlFor="embedCode" className="text-sm text-gray-300">
                    URL do Vídeo (Cole aqui a URL do vídeo)
                  </Label>
                  <Textarea
                    id="embedCode"
                    value={embedCode}
                    onChange={(e) => setEmbedCode(e.target.value)}
                    className="bg-tretaflix-gray border-tretaflix-gray text-white min-h-[100px]"
                    placeholder="Cole aqui a URL do vídeo"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Exemplos de formatos válidos:
                    <br />- URL direta: <code className="bg-black/30 px-1 rounded">https://redecanais.gs/player3/server.php?servidor=1&vid=FILME123</code>
                    <br />- URL MP4: <code className="bg-black/30 px-1 rounded">https://exemplo.com/video.mp4</code>
                    <br />- Links torrent (magnet links) também são suportados
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-6">
              <Button 
                type="button" 
                variant="outline"
                className="mr-2"
                onClick={() => navigate(-1)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-tretaflix-red hover:bg-tretaflix-red/80"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium">Conteúdo não encontrado</h3>
              <p className="text-sm text-gray-400 mt-1">
                Não foi possível encontrar o conteúdo solicitado.
              </p>
              <Button 
                className="mt-4 bg-tretaflix-red hover:bg-tretaflix-red/80"
                onClick={() => navigate(-1)}
              >
                Voltar
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default EditContent; 
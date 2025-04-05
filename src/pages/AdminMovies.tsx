import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Trash2, Edit, Search, AlertTriangle } from "lucide-react";

interface MovieItem {
  id: string;
  title: string;
  embedUrl: string;
  category: string;
  dateAdded: string;
  type: string;
  routeType?: string;
}

const AdminMovies = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMovies, setFilteredMovies] = useState<MovieItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Load movies from localStorage
    const storedContent = JSON.parse(localStorage.getItem('tretaflix_content') || '[]');
    const movieItems = storedContent.filter((item: any) => 
      item.type === "movie" || item.routeType === "filme"
    );
    
    setMovies(movieItems);
    setFilteredMovies(movieItems);
    setIsLoading(false);
  }, []);
  
  // Filter movies based on search term
  useEffect(() => {
    const filtered = movies.filter(movie => 
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMovies(filtered);
  }, [searchTerm, movies]);
  
  const handleDeleteMovie = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este filme?")) {
      try {
        // Get existing content
        const storedContent = JSON.parse(localStorage.getItem('tretaflix_content') || '[]');
        
        // Filter out the movie to delete
        const updatedContent = storedContent.filter((item: any) => item.id !== id);
        
        // Save back to localStorage
        localStorage.setItem('tretaflix_content', JSON.stringify(updatedContent));
        
        // Update state
        setMovies(movies.filter(movie => movie.id !== id));
        
        toast({
          title: "Filme excluído",
          description: "O filme foi removido com sucesso.",
        });
      } catch (error) {
        toast({
          title: "Erro ao excluir",
          description: "Não foi possível excluir o filme.",
          variant: "destructive",
        });
      }
    }
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gerenciar Filmes</h1>
          <Button 
            onClick={() => navigate("/admin/adicionar")}
            className="bg-tretaflix-red hover:bg-tretaflix-red/80"
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Filme
          </Button>
        </div>
        
        <div className="flex items-center space-x-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar filmes..."
              className="pl-9 bg-tretaflix-gray border-tretaflix-gray text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select defaultValue="todos">
            <SelectTrigger className="w-40 bg-tretaflix-gray border-tretaflix-gray text-white">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent className="bg-tretaflix-gray border-tretaflix-gray text-white">
              <SelectItem value="todos">Todas Categorias</SelectItem>
              <SelectItem value="acao">Ação</SelectItem>
              <SelectItem value="comedia">Comédia</SelectItem>
              <SelectItem value="drama">Drama</SelectItem>
              <SelectItem value="ficcao">Ficção Científica</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="spinner border-t-tretaflix-red"></div>
            <p className="mt-2 text-gray-400">Carregando filmes...</p>
          </div>
        ) : filteredMovies.length > 0 ? (
          <div className="border rounded-md border-tretaflix-gray">
            <Table>
              <TableCaption>Lista de filmes cadastrados na plataforma.</TableCaption>
              <TableHeader>
                <TableRow className="border-tretaflix-gray">
                  <TableHead className="text-white">Título</TableHead>
                  <TableHead className="text-white">Categoria</TableHead>
                  <TableHead className="text-white">Data de Adição</TableHead>
                  <TableHead className="text-white w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovies.map((movie) => (
                  <TableRow key={movie.id} className="border-tretaflix-gray">
                    <TableCell className="font-medium">{movie.title}</TableCell>
                    <TableCell>{movie.category || "Não categorizado"}</TableCell>
                    <TableCell>{movie.dateAdded ? new Date(movie.dateAdded).toLocaleDateString() : "Desconhecida"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                          onClick={() => navigate(`/filme/${movie.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-tretaflix-red hover:text-tretaflix-red/80"
                          onClick={() => handleDeleteMovie(movie.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-16 bg-tretaflix-dark rounded-md border border-tretaflix-gray">
            <AlertTriangle className="h-12 w-12 text-tretaflix-red mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">Nenhum filme encontrado</h3>
            <p className="text-gray-400 mb-6">Ainda não há filmes cadastrados ou sua busca não retornou resultados.</p>
            <Button 
              onClick={() => navigate("/admin/adicionar")}
              className="bg-tretaflix-red hover:bg-tretaflix-red/80"
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Primeiro Filme
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminMovies; 
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Use environment variables for credentials
    setTimeout(() => {
      if (username === import.meta.env.VITE_ADMIN_USERNAME && 
          password === import.meta.env.VITE_ADMIN_PASSWORD) {
        // Set auth token in localStorage
        localStorage.setItem("admin_token", btoa(Date.now().toString()));
        localStorage.setItem("admin_name", "Administrador");
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao painel administrativo.",
        });
        navigate("/admin/dashboard");
      } else {
        toast({
          title: "Erro ao fazer login",
          description: "Nome de usuário ou senha incorretos.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-tretaflix-black">
      <div className="w-full max-w-md p-8 bg-tretaflix-dark rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-tretaflix-red font-bold text-3xl mb-2">
            TRETAFLIX
          </h1>
          <h2 className="text-white text-xl">Painel Administrativo</h2>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="text-white text-sm">
              Nome de usuário
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Digite seu nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-tretaflix-gray border-tretaflix-gray text-white placeholder:text-gray-400"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-white text-sm">
              Senha
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-tretaflix-gray border-tretaflix-gray text-white placeholder:text-gray-400 pr-10"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-tretaflix-red hover:bg-tretaflix-red/90 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

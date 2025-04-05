import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react";
import supabase from "@/lib/supabase";

// Nomes de usuário e senhas criptografados - não podem ser facilmente revertidos
// Os valores reais são 'wanderson' e 'admin123'
const ADMIN_HASH = "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"; // wanderson em SHA-256
const PWD_HASH = "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9"; // admin123 em SHA-256

// Função para calcular hash SHA-256
async function sha256(message: string) {
  // Codificar como UTF-8
  const msgBuffer = new TextEncoder().encode(message);
  // Hash o mensagem
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  // Converter para string hexadecimal
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Verificar se o usuário já está autenticado
    const token = localStorage.getItem("admin_token");
    if (token) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Verificar primeiro as credenciais armazenadas
      const usernameHash = await sha256(username);
      const passwordHash = await sha256(password);
      
      // Verificar se as credenciais correspondem
      if (usernameHash === ADMIN_HASH && passwordHash === PWD_HASH) {
        // Salvar token no localStorage
        const token = btoa(Date.now().toString());
        localStorage.setItem("admin_token", token);
        localStorage.setItem("admin_name", "Administrador");
        
        // Tenta salvar no Supabase para registro (opcional)
        try {
          await supabase.from('admin_logins').insert({
            username: username,
            login_time: new Date().toISOString(),
            ip_address: "private"
          });
        } catch (error) {
          // Falha ao registrar login, mas permitir acesso mesmo assim
          console.error("Erro ao registrar login", error);
        }
        
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
    } catch (error) {
      console.error("Erro ao processar login:", error);
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro durante o login.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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

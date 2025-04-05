
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Film, Tv, Radio, Plus, Users, Settings, 
  LogOut, Menu, X, ChevronDown
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [adminName, setAdminName] = useState("");
  
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("admin_token");
      const name = localStorage.getItem("admin_name");
      
      if (!token) {
        navigate("/admin");
      } else {
        setAdminName(name || "Administrador");
      }
    };
    
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
        setIsMobile(true);
      } else {
        setSidebarOpen(true);
        setIsMobile(false);
      }
    };
    
    checkAuth();
    handleResize();
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_name");
    toast({
      title: "Logout realizado com sucesso",
      description: "Você foi desconectado do painel administrativo.",
    });
    navigate("/admin");
  };
  
  const navItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Filmes",
      path: "/admin/filmes",
      icon: <Film className="h-5 w-5" />,
    },
    {
      name: "Séries",
      path: "/admin/series",
      icon: <Tv className="h-5 w-5" />,
    },
    {
      name: "Canais ao Vivo",
      path: "/admin/aovivo",
      icon: <Radio className="h-5 w-5" />,
    },
    {
      name: "Adicionar Conteúdo",
      path: "/admin/adicionar",
      icon: <Plus className="h-5 w-5" />,
    },
    {
      name: "Usuários",
      path: "/admin/usuarios",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Configurações",
      path: "/admin/configuracoes",
      icon: <Settings className="h-5 w-5" />,
    },
  ];
  
  return (
    <div className="flex h-screen bg-tretaflix-black">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-tretaflix-dark border-r border-tretaflix-gray transition-transform lg:relative lg:translate-x-0`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-tretaflix-gray">
          <Link to="/admin/dashboard" className="flex items-center">
            <h1 className="text-tretaflix-red font-bold text-xl">
              TRETAFLIX
            </h1>
            <span className="text-white ml-2 text-xs bg-tretaflix-gray px-2 py-1 rounded">
              ADMIN
            </span>
          </Link>
          
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        <div className="p-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                  location.pathname === item.path
                    ? "bg-tretaflix-gray text-white"
                    : "text-gray-400 hover:text-white hover:bg-tretaflix-gray/50"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="text-sm">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-400 hover:text-white hover:bg-tretaflix-gray/50"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span className="text-sm">Sair</span>
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="h-16 flex items-center justify-between border-b border-tretaflix-gray bg-tretaflix-dark px-4">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          <div className="flex-1"></div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center text-white">
                <span className="mr-2">{adminName}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-tretaflix-gray border-tretaflix-gray text-white">
              <DropdownMenuItem 
                className="hover:bg-tretaflix-gray/80 cursor-pointer"
                onClick={() => navigate("/admin/configuracoes")}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-tretaflix-lightgray/30" />
              <DropdownMenuItem 
                className="hover:bg-tretaflix-gray/80 cursor-pointer text-tretaflix-red"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        
        <main className="flex-1 overflow-y-auto bg-tretaflix-black">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import AdminLayout from "@/components/AdminLayout";
import { Film, Monitor, Users, TrendingUp, Calendar } from "lucide-react";

// Generate mock visit data for last 7 days
const generateVisitorsData = () => {
  const data = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    data.push({
      name: formattedDate,
      visitors: Math.floor(Math.random() * 2000) + 1000
    });
  }
  return data;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [currentVisitors, setCurrentVisitors] = useState(285);
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalSeries: 0,
    totalLive: 0,
    totalViews: 0
  });
  const [visitorsData, setVisitorsData] = useState(generateVisitorsData());
  const [popularContent, setPopularContent] = useState<{ name: string, views: number }[]>([]);
  const [contentByCategory, setContentByCategory] = useState<{ name: string, value: number }[]>([]);
  
  // Check if user is authenticated and load data
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate("/admin");
      return;
    }
    
    // Load content from localStorage and update stats
    const storedContent = JSON.parse(localStorage.getItem('tretaflix_content') || '[]');
    
    // Count by type
    const movies = storedContent.filter((item: any) => 
      item.type === "movie" || item.routeType === "filme"
    );
    
    const series = storedContent.filter((item: any) => 
      item.type === "series" || item.routeType === "serie"
    );
    
    const liveChannels = storedContent.filter((item: any) => 
      item.type === "live" || item.routeType === "aovivo"
    );
    
    // Update stats
    setStats({
      totalMovies: movies.length,
      totalSeries: series.length,
      totalLive: liveChannels.length,
      totalViews: Math.floor(Math.random() * 10000) // Random views for demo
    });
    
    // Generate popular content data
    if (storedContent.length > 0) {
      const popular = storedContent.slice(0, Math.min(5, storedContent.length)).map((item: any) => ({
        name: item.title,
        views: Math.floor(Math.random() * 5000)
      }));
      setPopularContent(popular);
    }
    
    // Generate content by category data
    const categories: Record<string, number> = {};
    storedContent.forEach((item: any) => {
      const category = item.category || "Não categorizado";
      categories[category] = (categories[category] || 0) + 1;
    });
    
    const categoriesData = Object.entries(categories).map(([name, value]) => ({ name, value }));
    setContentByCategory(categoriesData.length > 0 ? categoriesData : [
      { name: "Sem conteúdo", value: 1 }
    ]);
    
    // Simulate changing visitor count
    const interval = setInterval(() => {
      setCurrentVisitors(prev => {
        const change = Math.floor(Math.random() * 11) - 5;
        return Math.max(200, prev + change);
      });
    }, 10000);
    
    return () => clearInterval(interval);
  }, [navigate]);
  
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-tretaflix-dark text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Total de Filmes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Film className="mr-2 h-5 w-5 text-tretaflix-red" />
                <span className="text-2xl font-bold">{stats.totalMovies}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-tretaflix-dark text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Total de Séries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Monitor className="mr-2 h-5 w-5 text-tretaflix-red" />
                <span className="text-2xl font-bold">{stats.totalSeries}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-tretaflix-dark text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Canais ao Vivo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-tretaflix-red" />
                <span className="text-2xl font-bold">{stats.totalLive}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-tretaflix-dark text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Visualizações Totais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-tretaflix-red" />
                <span className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="bg-tretaflix-dark text-white lg:col-span-2">
            <CardHeader>
              <CardTitle>Visitantes por Dia</CardTitle>
              <CardDescription className="text-gray-400">
                Estatísticas de visitantes nos últimos 7 dias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={visitorsData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#141414', 
                        borderColor: '#303030',
                        color: '#fff'
                      }} 
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="visitors" 
                      name="Visitantes" 
                      stroke="#E50914" 
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-tretaflix-dark text-white">
            <CardHeader>
              <CardTitle>Visitantes Online</CardTitle>
              <CardDescription className="text-gray-400">
                Número de usuários ativos no momento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-[240px]">
                <Users className="h-16 w-16 text-tretaflix-red mb-4" />
                <div className="text-5xl font-bold">{currentVisitors}</div>
                <p className="text-gray-300 mt-2">usuários online</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-tretaflix-dark text-white">
            <CardHeader>
              <CardTitle>Conteúdos Mais Populares</CardTitle>
              <CardDescription className="text-gray-400">
                Conteúdos mais assistidos na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={popularContent.length > 0 ? popularContent : [
                      { name: "Nenhum conteúdo adicionado", views: 0 }
                    ]}
                    layout="vertical" 
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" horizontal={false} />
                    <XAxis type="number" stroke="#888" />
                    <YAxis dataKey="name" type="category" stroke="#888" width={120} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#141414', 
                        borderColor: '#303030',
                        color: '#fff'
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="views" name="Visualizações" fill="#E50914" barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-tretaflix-dark text-white">
            <CardHeader>
              <CardTitle>Conteúdo por Categoria</CardTitle>
              <CardDescription className="text-gray-400">
                Distribuição de filmes e séries por gênero
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={contentByCategory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#141414', 
                        borderColor: '#303030',
                        color: '#fff'
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="value" name="Quantidade" fill="#757575" barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

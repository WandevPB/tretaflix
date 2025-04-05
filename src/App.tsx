import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Index";
import NotFound from "./pages/NotFound";
import MoviesPage from "./pages/Movies";
import SeriesPage from "./pages/Series";
import LiveTVPage from "./pages/LiveTV";
import CategoriesPage from "./pages/Categories";
import ContentDetail from "./pages/ContentDetail";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAddContent from "./pages/AdminAddContent";
import AdminMovies from "./pages/AdminMovies";
import AdminSeries from "./pages/AdminSeries";
import AdminLiveTV from "./pages/AdminLiveTV";
import AdminUsers from "./pages/AdminUsers";
import AdminSettings from "./pages/AdminSettings";
import EditContent from "./pages/EditContent";
import Watch from "./pages/Watch";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/filmes" element={<MoviesPage />} />
          <Route path="/series" element={<SeriesPage />} />
          <Route path="/aovivo" element={<LiveTVPage />} />
          <Route path="/categorias" element={<CategoriesPage />} />
          <Route path="/filme/:id" element={<ContentDetail type="filme" />} />
          <Route path="/serie/:id" element={<ContentDetail type="serie" />} />
          <Route path="/aovivo/:id" element={<ContentDetail type="aovivo" />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/adicionar" element={<AdminAddContent />} />
          <Route path="/admin/filmes" element={<AdminMovies />} />
          <Route path="/admin/series" element={<AdminSeries />} />
          <Route path="/admin/aovivo" element={<AdminLiveTV />} />
          <Route path="/admin/usuarios" element={<AdminUsers />} />
          <Route path="/admin/configuracoes" element={<AdminSettings />} />
          <Route path="/admin/editar/:id" element={<EditContent />} />
          <Route path="/watch/:type/:id" element={<Watch />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

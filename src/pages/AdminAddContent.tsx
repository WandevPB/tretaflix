
import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import SearchCard from "@/components/admin/SearchCard";
import ContentFormCard from "@/components/admin/ContentFormCard";
import { MovieSearchResult } from "@/components/admin/ContentSearch";
import { useToast } from "@/components/ui/use-toast";

const AdminAddContent = () => {
  const { toast } = useToast();
  const [selectedContent, setSelectedContent] = useState<MovieSearchResult | null>(null);
  const [contentType, setContentType] = useState("movie");
  
  const handleSelectContent = (content: MovieSearchResult) => {
    setSelectedContent(content);
  };

  const handleContentTypeChange = (type: string) => {
    setContentType(type);
    // Clear selected content when changing type
    if (selectedContent) {
      setSelectedContent(null);
    }
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Adicionar Conteúdo</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SearchCard 
            onSelectContent={handleSelectContent} 
            contentType={contentType}
            onContentTypeChange={handleContentTypeChange}
          />
          <ContentFormCard selectedContent={selectedContent} contentType={contentType} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAddContent;

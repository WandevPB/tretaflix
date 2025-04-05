import { useState } from "react";
import { useRouter } from "next/router";
import { addContent } from "@/services/contentService";
import AdminLayout from "@/components/admin/AdminLayout";
import AddContentForm from "@/components/admin/AddContentForm";
import { Content } from "@/types/content";

export default function AddContentPage() {
  const router = useRouter();
  const initialType = router.query.type as string || "movie";
  const [contentType, setContentType] = useState(initialType);

  // Handler para adicionar conteúdo
  const handleAddContent = async (content: Omit<Content, "id">) => {
    try {
      await addContent({
        ...content,
        type: contentType,
      });
      
      // Redirecionar de volta para a lista correspondente
      if (contentType === "movie") {
        router.push("/admin/movies");
      } else if (contentType === "series") {
        router.push("/admin/series");
      } else {
        router.push("/admin/live");
      }
    } catch (error) {
      console.error("Error adding content:", error);
      throw error;
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Adicionar {contentType === "movie" ? "Filme" : contentType === "series" ? "Série" : "Canal ao Vivo"}
        </h1>
        <p className="text-gray-400">
          Busque e adicione conteúdo à biblioteca do TretaFlix
        </p>
      </div>
      
      <AddContentForm 
        onAddContent={handleAddContent} 
        contentType={contentType}
        onContentTypeChange={setContentType}
      />
    </AdminLayout>
  );
} 
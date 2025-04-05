
import { Card, CardContent } from "@/components/ui/card";
import ContentForm from "./ContentForm";
import { MovieSearchResult } from "./ContentSearch";

interface ContentFormCardProps {
  selectedContent: MovieSearchResult | null;
  contentType: string;
}

const ContentFormCard = ({ selectedContent, contentType }: ContentFormCardProps) => {
  return (
    <Card className="bg-tretaflix-dark text-white">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Adicionar Informações</h2>
        <ContentForm selectedContent={selectedContent} contentType={contentType} />
      </CardContent>
    </Card>
  );
};

export default ContentFormCard;

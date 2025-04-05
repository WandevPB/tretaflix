
import { Card, CardContent } from "@/components/ui/card";
import ContentSearch from "./ContentSearch";
import { MovieSearchResult } from "./ContentSearch";

interface SearchCardProps {
  onSelectContent: (content: MovieSearchResult) => void;
  contentType: string;
  onContentTypeChange: (type: string) => void;
}

const SearchCard = ({ onSelectContent, contentType, onContentTypeChange }: SearchCardProps) => {
  return (
    <Card className="bg-tretaflix-dark text-white">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Buscar Conteúdo</h2>
        <ContentSearch 
          onSelectContent={onSelectContent} 
          contentType={contentType} 
          onContentTypeChange={onContentTypeChange} 
        />
      </CardContent>
    </Card>
  );
};

export default SearchCard;

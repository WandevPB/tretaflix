import { Content } from "@/types/content";
import { v4 as uuidv4 } from 'uuid';
import supabase from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

// Tabela no Supabase
const CONTENTS_TABLE = 'contents';

// Adicionar conteúdo
export const addContent = async (content: Omit<Content, "id">): Promise<Content> => {
  try {
    // Gerar um UUID para o novo conteúdo
    const newContent: Content = {
      ...content,
      id: uuidv4(),
    };
    
    // Inserir na tabela do Supabase
    const { data, error } = await supabase
      .from(CONTENTS_TABLE)
      .insert(newContent)
      .select()
      .single();
    
    if (error) {
      console.error("Erro ao adicionar conteúdo:", error);
      toast({
        title: "Erro ao adicionar conteúdo",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Erro ao adicionar conteúdo:", error);
    throw error;
  }
};

// Obter todos os conteúdos
export const getAllContents = async (): Promise<Content[]> => {
  try {
    const { data, error } = await supabase
      .from(CONTENTS_TABLE)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Erro ao buscar conteúdos:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Erro ao buscar conteúdos:", error);
    return [];
  }
};

// Obter conteúdos por tipo
export const getContentsByType = async (type: string): Promise<Content[]> => {
  try {
    const { data, error } = await supabase
      .from(CONTENTS_TABLE)
      .select('*')
      .eq('type', type)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Erro ao buscar conteúdos do tipo ${type}:`, error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error(`Erro ao buscar conteúdos do tipo ${type}:`, error);
    return [];
  }
};

// Obter conteúdo por ID
export const getContent = async (id: string): Promise<Content | null> => {
  try {
    const { data, error } = await supabase
      .from(CONTENTS_TABLE)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Erro ao buscar conteúdo com ID ${id}:`, error);
      if (error.code !== 'PGRST116') { // Not found error code
        throw error;
      }
      return null;
    }
    
    return data;
  } catch (error) {
    console.error(`Erro ao buscar conteúdo com ID ${id}:`, error);
    return null;
  }
};

// Atualizar conteúdo
export const updateContent = async (id: string, updatedFields: Partial<Content>): Promise<Content | null> => {
  try {
    const { data, error } = await supabase
      .from(CONTENTS_TABLE)
      .update(updatedFields)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Erro ao atualizar conteúdo com ID ${id}:`, error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error(`Erro ao atualizar conteúdo com ID ${id}:`, error);
    return null;
  }
};

// Excluir conteúdo
export const deleteContent = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(CONTENTS_TABLE)
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Erro ao excluir conteúdo com ID ${id}:`, error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error(`Erro ao excluir conteúdo com ID ${id}:`, error);
    return false;
  }
}; 
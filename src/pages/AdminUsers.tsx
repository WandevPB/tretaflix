import AdminLayout from "@/components/AdminLayout";
import { Users, AlertTriangle } from "lucide-react";

const AdminUsers = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Gerenciar Usuários</h1>
        
        <div className="text-center py-16 bg-tretaflix-dark rounded-md border border-tretaflix-gray">
          <div className="bg-tretaflix-gray/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-tretaflix-red" />
          </div>
          <AlertTriangle className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
          <h3 className="text-xl font-medium mb-2">Módulo em Desenvolvimento</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            O gerenciamento de usuários está em desenvolvimento e estará disponível em breve.
            Esta funcionalidade permitirá adicionar, editar e remover usuários do sistema.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers; 
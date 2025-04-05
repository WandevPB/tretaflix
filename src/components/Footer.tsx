
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-tretaflix-black py-10 border-t border-tretaflix-gray">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <Link to="/" className="flex items-center">
              <h1 className="text-tretaflix-red font-bold text-2xl tracking-tighter">
                TRETAFLIX
              </h1>
            </Link>
            <p className="text-gray-400 mt-2 max-w-md">
              Sua plataforma de streaming para assistir filmes, séries e canais ao vivo de qualquer lugar.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-medium mb-4">Navegação</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-tretaflix-red transition-colors">
                    Início
                  </Link>
                </li>
                <li>
                  <Link to="/filmes" className="text-gray-400 hover:text-tretaflix-red transition-colors">
                    Filmes
                  </Link>
                </li>
                <li>
                  <Link to="/series" className="text-gray-400 hover:text-tretaflix-red transition-colors">
                    Séries
                  </Link>
                </li>
                <li>
                  <Link to="/aovivo" className="text-gray-400 hover:text-tretaflix-red transition-colors">
                    Ao Vivo
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-medium mb-4">Suporte</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/faq" className="text-gray-400 hover:text-tretaflix-red transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/contato" className="text-gray-400 hover:text-tretaflix-red transition-colors">
                    Contato
                  </Link>
                </li>
                <li>
                  <Link to="/termos" className="text-gray-400 hover:text-tretaflix-red transition-colors">
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link to="/privacidade" className="text-gray-400 hover:text-tretaflix-red transition-colors">
                    Política de Privacidade
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h3 className="text-white font-medium mb-4">Sobre</h3>
              <p className="text-gray-400">
                O TretaFlix não armazena qualquer conteúdo em seus servidores. Todo conteúdo é incorporado através de embeddings de terceiros.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-tretaflix-gray text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} TretaFlix. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

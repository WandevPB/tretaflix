
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import SearchDialog from "./SearchDialog";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Check if we're scrolled down
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 z-40 w-full transition-colors duration-300 ${
        isScrolled || isMenuOpen ? "bg-tretaflix-black shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-tretaflix-red font-bold text-2xl">
            TRETAFLIX
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-tretaflix-red ${
                location.pathname === "/" ? "text-tretaflix-red" : "text-white"
              }`}
            >
              Início
            </Link>
            <Link
              to="/filmes"
              className={`text-sm font-medium transition-colors hover:text-tretaflix-red ${
                location.pathname === "/filmes" ? "text-tretaflix-red" : "text-white"
              }`}
            >
              Filmes
            </Link>
            <Link
              to="/series"
              className={`text-sm font-medium transition-colors hover:text-tretaflix-red ${
                location.pathname === "/series" ? "text-tretaflix-red" : "text-white"
              }`}
            >
              Séries
            </Link>
            <Link
              to="/aovivo"
              className={`text-sm font-medium transition-colors hover:text-tretaflix-red ${
                location.pathname === "/aovivo" ? "text-tretaflix-red" : "text-white"
              }`}
            >
              Ao Vivo
            </Link>
            <Link
              to="/categorias"
              className={`text-sm font-medium transition-colors hover:text-tretaflix-red ${
                location.pathname === "/categorias" ? "text-tretaflix-red" : "text-white"
              }`}
            >
              Categorias
            </Link>
          </nav>

          {/* Search and Mobile Menu Button */}
          <div className="flex items-center space-x-1">
            <SearchDialog />
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-tretaflix-black">
          <div className="container mx-auto px-4 py-3 space-y-1">
            <Link
              to="/"
              className={`block py-2 text-base font-medium ${
                location.pathname === "/" ? "text-tretaflix-red" : "text-white"
              }`}
            >
              Início
            </Link>
            <Link
              to="/filmes"
              className={`block py-2 text-base font-medium ${
                location.pathname === "/filmes" ? "text-tretaflix-red" : "text-white"
              }`}
            >
              Filmes
            </Link>
            <Link
              to="/series"
              className={`block py-2 text-base font-medium ${
                location.pathname === "/series" ? "text-tretaflix-red" : "text-white"
              }`}
            >
              Séries
            </Link>
            <Link
              to="/aovivo"
              className={`block py-2 text-base font-medium ${
                location.pathname === "/aovivo" ? "text-tretaflix-red" : "text-white"
              }`}
            >
              Ao Vivo
            </Link>
            <Link
              to="/categorias"
              className={`block py-2 text-base font-medium ${
                location.pathname === "/categorias" ? "text-tretaflix-red" : "text-white"
              }`}
            >
              Categorias
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

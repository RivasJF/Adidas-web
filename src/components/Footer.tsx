import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-12 h-10 fill-current text-white" viewBox="0 0 48 32">
                <path d="M4.5 28L12 16.5H18L10.5 28H4.5Z" />
                <path d="M16 28L26 10H32L22 28H16Z" />
                <path d="M28 28L40 4H46L34 28H28Z" />
              </svg>
              <span className="font-black text-2xl tracking-tighter uppercase">
                adidas
              </span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Tienda oficial de adidas. Descubre las últimas colecciones deportivas para 
              fútbol, tenis y baloncesto. Diseñado para deportistas. Creado para todos.
            </p>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-white" />
                <span>+57 (601) 123 4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-white" />
                <span>soporte@adidasstore.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-white" />
                <span>Medellín, Colombia</span>
              </div>
            </div>
          </div>

          {/* Categorías */}
          <div>
            <h3 className="font-black text-lg uppercase tracking-wider mb-6">Categorías</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <Link to="/" className="hover:text-white hover:underline transition-colors">
                  Fútbol
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white hover:underline transition-colors">
                  Tenis
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white hover:underline transition-colors">
                  Basquetball
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white hover:underline transition-colors">
                  Destacados
                </Link>
              </li>
            </ul>
          </div>

          {/* Soporte */}
          <div>
            <h3 className="font-black text-lg uppercase tracking-wider mb-6">Soporte</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="hover:text-white hover:underline transition-colors cursor-pointer">
                Envíos y Entregas
              </li>
              <li className="hover:text-white hover:underline transition-colors cursor-pointer">
                Devoluciones y Cambios
              </li>
              <li className="hover:text-white hover:underline transition-colors cursor-pointer">
                Preguntas Frecuentes
              </li>
              <li className="hover:text-white hover:underline transition-colors cursor-pointer">
                Términos y Condiciones
              </li>
              <li className="hover:text-white hover:underline transition-colors cursor-pointer">
                Política de Privacidad
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400 text-center md:text-left">
            © {new Date().getFullYear()} Adidas Store - Proyecto de demostración. 
            Los precios y productos son ficticios.
          </p>
          <p className="text-xs text-gray-500 uppercase tracking-widest">
            Driven by Sport
          </p>
        </div>
      </div>
    </footer>
  );
};

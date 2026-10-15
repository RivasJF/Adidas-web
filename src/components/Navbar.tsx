import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useCart } from '../shared/context/cart.context';

interface NavbarProps {
  onSearchChange?: (term: string) => void;
  searchValue?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearchChange,
  searchValue = '',
}) => {
  const { totalItems, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleCategoryClick = (cat: 'Fútbol' | 'Tenis' | 'Basquetball' | 'Todos') => {
    navigate(cat === 'Todos' ? '/' : `/?category=${encodeURIComponent(cat)}`);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      {/* Top micro-bar */}
      <div className="bg-black text-white text-xs py-1.5 px-4 font-medium tracking-wider">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" /> Envíos gratis por compras sobre $100
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" /> 30 días para devoluciones gratis
            </span>
            <span className="hidden lg:flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Productos 100% Originales
            </span>
          </div>
          <div className="text-[11px] font-semibold text-gray-300">
            OFICIAL ADIDAS STORE
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              {/* Adidas 3 stripes svg */}
              <svg className="w-12 h-10 fill-current text-black group-hover:scale-105 transition-transform" viewBox="0 0 48 32">
                <path d="M4.5 28L12 16.5H18L10.5 28H4.5Z" />
                <path d="M16 28L26 10H32L22 28H16Z" />
                <path d="M28 28L40 4H46L34 28H28Z" />
              </svg>
              <span className="font-black text-2xl tracking-tighter uppercase font-sans">
                adidas
              </span>
            </Link>

            {/* Navigation links for Desktop */}
            <nav className="hidden md:flex items-center space-x-6 text-sm font-black uppercase tracking-wider">
              <button
                onClick={() => handleCategoryClick('Todos')}
                className="hover:text-black hover:border-b-2 hover:border-black py-2 transition-colors cursor-pointer text-gray-700"
              >
                Todos
              </button>
              <button
                onClick={() => handleCategoryClick('Fútbol')}
                className="hover:text-black hover:border-b-2 hover:border-black py-2 transition-colors cursor-pointer text-gray-700"
              >
                Fútbol
              </button>
              <button
                onClick={() => handleCategoryClick('Tenis')}
                className="hover:text-black hover:border-b-2 hover:border-black py-2 transition-colors cursor-pointer text-gray-700"
              >
                Tenis
              </button>
              <button
                onClick={() => handleCategoryClick('Basquetball')}
                className="hover:text-black hover:border-b-2 hover:border-black py-2 transition-colors cursor-pointer text-gray-700"
              >
                Basquetball
              </button>
            </nav>
          </div>

          {/* Search bar & Cart action */}
          <div className="flex items-center gap-4 flex-1 justify-end max-w-md">
            {onSearchChange && (
              <div className="relative w-full hidden sm:block">
                <input
                  type="text"
                  placeholder="Buscar Predator, Barricade, Harden..."
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full bg-gray-100 text-gray-900 text-sm pl-10 pr-4 py-2.5 rounded-none border border-transparent focus:border-black focus:bg-white outline-none transition-all placeholder-gray-500 font-medium"
                />
                <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              </div>
            )}

            {/* Cart trigger button */}
            <button
              onClick={openCart}
              className="relative p-2.5 bg-black text-white hover:bg-neutral-800 transition-colors cursor-pointer flex items-center justify-center group"
              title="Ver Carrito de Compras"
              aria-label="Carrito de compras"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-black font-black text-xs w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-black hover:bg-gray-100"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile search bar */}
        {onSearchChange && (
          <div className="sm:hidden pb-3">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar calzado o ropa..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-gray-100 text-sm pl-9 pr-3 py-2 border border-transparent focus:border-black focus:bg-white outline-none"
              />
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
            </div>
          </div>
        )}
      </div>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-3 font-black uppercase text-sm tracking-wide">
          <button
            onClick={() => handleCategoryClick('Todos')}
            className="block w-full text-left py-2 border-b border-gray-100"
          >
            Todos los Deportes
          </button>
          <button
            onClick={() => handleCategoryClick('Fútbol')}
            className="block w-full text-left py-2 border-b border-gray-100"
          >
            Fútbol
          </button>
          <button
            onClick={() => handleCategoryClick('Tenis')}
            className="block w-full text-left py-2 border-b border-gray-100"
          >
            Tenis
          </button>
          <button
            onClick={() => handleCategoryClick('Basquetball')}
            className="block w-full text-left py-2 border-b border-gray-100"
          >
            Basquetball
          </button>
        </div>
      )}
    </header>
  );
};

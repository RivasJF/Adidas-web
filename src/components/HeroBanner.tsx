import React from 'react';
import { ChevronRight } from 'lucide-react';

interface HeroBannerProps {
  onCategoryClick: (category: 'Fútbol' | 'Tenis' | 'Basquetball' | 'Todos') => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onCategoryClick }) => {
  return (
    <div className="relative w-full overflow-hidden bg-black">
      {/* Grid background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[420px] md:min-h-[480px] lg:min-h-[540px] py-10">
          
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <div className="inline-block bg-white text-black px-4 py-1.5 text-xs font-black uppercase tracking-[0.25em]">
                Nike? No. Impossible is Nothing.
              </div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85]">
                ELEGANCE IN
                <br />
                <span className="text-yellow-400">PURE SPORT</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 max-w-xl mx-auto lg:mx-0">
                Descubre el calzado de élite para <span className="text-white font-semibold">Fútbol</span>, 
                {' '}<span className="text-white font-semibold">Tenis</span> y 
                {' '}<span className="text-white font-semibold">Basquetball</span>. 
                Diseñado para elevar tu rendimiento al siguiente nivel.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => onCategoryClick('Fútbol')}
                className="group bg-white text-black px-8 py-3.5 font-black uppercase tracking-wider text-sm flex items-center gap-2 hover:bg-yellow-400 transition-colors cursor-pointer"
              >
                Fútbol
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onCategoryClick('Tenis')}
                className="group border-2 border-white text-white px-8 py-3.5 font-black uppercase tracking-wider text-sm flex items-center gap-2 hover:bg-white hover:text-black transition-colors cursor-pointer"
              >
                Tenis
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onCategoryClick('Basquetball')}
                className="group border-2 border-white text-white px-8 py-3.5 font-black uppercase tracking-wider text-sm flex items-center gap-2 hover:bg-white hover:text-black transition-colors cursor-pointer"
              >
                Basquetball
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center lg:justify-start gap-8 pt-4 text-gray-300 text-sm">
              <div>
                <span className="text-white font-black text-3xl block">+50k</span>
                <span className="uppercase tracking-wider text-xs">Clientes Felices</span>
              </div>
              <div>
                <span className="text-white font-black text-3xl block">4.9★</span>
                <span className="uppercase tracking-wider text-xs">Valoración Media</span>
              </div>
              <div>
                <span className="text-white font-black text-3xl block">100%</span>
                <span className="uppercase tracking-wider text-xs">Originales</span>
              </div>
            </div>
          </div>

          {/* Right Image - Hero Shoe */}
          <div className="relative flex items-center justify-center">
            {/* Glow effects */}
            <div className="absolute top-10 right-10 w-72 h-72 bg-yellow-400/30 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
            
            <img
              src="https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=1200&q=90"
              alt="Calzado Adidas Deportivo de Alta Gama"
              className="relative z-10 w-full max-w-lg lg:max-w-2xl object-contain drop-shadow-[0_35px_60px_rgba(255,255,255,0.25)] rotate-[-6deg] hover:rotate-[-4deg] transition-transform duration-700"
            />
            <div className="absolute bottom-0 text-white/10 text-9xl font-black uppercase tracking-tighter select-none -z-0">
              ADIDAS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

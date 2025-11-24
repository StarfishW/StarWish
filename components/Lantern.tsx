import React from 'react';
import { Wish } from '../types';
import { HeartIcon } from './Icons';

interface LanternProps {
  wish: Wish;
  onClick: (wish: Wish) => void;
}

const Lantern: React.FC<LanternProps> = ({ wish, onClick }) => {
  
  // Style mapping for the paper color
  const colorStyles = {
    gold: 'from-amber-100 via-amber-400 to-amber-600',
    red: 'from-red-100 via-red-500 to-red-700',
    orange: 'from-orange-100 via-orange-400 to-orange-600',
  };

  // Glow shadow colors
  const glowColors = {
    gold: 'shadow-amber-500/40',
    red: 'shadow-red-500/40',
    orange: 'shadow-orange-500/40',
  };

  return (
    // Layer 1: Positioning and Static Scale
    <div
      className="absolute z-10 select-none"
      style={{
        left: `${wish.x}%`,
        bottom: '-150px', // Start below the viewport
        transform: `scale(${wish.scale})`,
      }}
    >
      {/* Layer 2: Vertical Floating Animation */}
      <div
        style={{
          animation: `floatUp ${wish.duration}s linear infinite`,
          animationDelay: `-${wish.delay}s`,
        }}
      >
        {/* Layer 3: Horizontal Sway Animation */}
        <div
          style={{
            animation: `sway ${wish.duration * 0.15}s ease-in-out infinite alternate`,
          }}
        >
          {/* Interactive Layer */}
          <div 
            onClick={() => onClick(wish)}
            className="group relative cursor-pointer hover:scale-110 transition-transform duration-500"
          >
            {/* Lantern Body */}
            <div className={`
              relative w-16 h-24 md:w-20 md:h-28 
              opacity-95 
              rounded-t-sm rounded-b-2xl 
              bg-gradient-to-b ${colorStyles[wish.colorTone]} 
              shadow-[0_0_35px_10px] ${glowColors[wish.colorTone]}
              overflow-hidden
            `}>
              
              {/* Paper Texture Overlay (Subtle) */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')] opacity-30 mix-blend-overlay"></div>

              {/* Inner Light Core (The Fire) */}
              <div 
                className="absolute inset-x-4 bottom-4 h-16 bg-gradient-to-t from-white via-yellow-200 to-transparent blur-md rounded-full mix-blend-screen" 
                style={{ animation: 'flame 3s infinite ease-in-out alternate' }}
              />
              
              {/* Structure Lines (Wireframe) */}
              <div className="absolute inset-0 border-[0.5px] border-white/20 rounded-t-sm rounded-b-2xl" />
              <div className="absolute top-0 bottom-0 left-1/2 w-[0.5px] bg-black/10" />
              <div className="absolute bottom-2 left-3 right-3 h-[1px] bg-black/20" /> {/* Bottom rim */}
              <div className="absolute top-2 left-3 right-3 h-[1px] bg-black/10" /> {/* Top rim */}

            </div>

            {/* Hint on hover */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
               <div className="flex items-center gap-2 text-[10px] text-white/90 bg-black/60 px-3 py-1 rounded-full shadow-lg backdrop-blur-sm border border-white/10 whitespace-nowrap">
                 <span>{wish.content.substring(0, 12)}{wish.content.length > 12 ? '...' : ''}</span>
                 {wish.likes > 0 && (
                   <span className="flex items-center gap-0.5 border-l border-white/20 pl-2">
                     <HeartIcon className="w-3 h-3 text-red-400" solid />
                     {wish.likes}
                   </span>
                 )}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lantern;
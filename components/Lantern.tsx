
import React from 'react';
import { Wish } from '../types';
import { HeartIcon } from './Icons';

interface LanternProps {
  wish: Wish;
  onClick: (wish: Wish) => void;
}

const Lantern: React.FC<LanternProps> = ({ wish, onClick }) => {
  
  // High saturation styles for the "Anime/Festival" look
  const styles = {
    gold: {
      background: 'radial-gradient(circle at 50% 90%, #fffbe7 0%, #fcd34d 30%, #f59e0b 60%, #b45309 90%)',
      shadow: 'shadow-[0_0_50px_-5px_rgba(251,191,36,0.6)]',
      textColor: 'text-amber-900/80',
    },
    red: {
      background: 'radial-gradient(circle at 50% 90%, #fff1f2 0%, #fda4af 30%, #f87171 60%, #b91c1c 90%)',
      shadow: 'shadow-[0_0_50px_-5px_rgba(248,113,113,0.6)]',
      textColor: 'text-red-950/80',
    },
    orange: {
      background: 'radial-gradient(circle at 50% 90%, #fff7ed 0%, #fdba74 30%, #fb923c 60%, #c2410c 90%)',
      shadow: 'shadow-[0_0_50px_-5px_rgba(251,146,60,0.6)]',
      textColor: 'text-orange-950/80',
    },
  };

  const currentStyle = styles[wish.colorTone];
  
  // Truncate text for the lantern body (visual purposes)
  // We want a vertical column of text, usually 2-5 chars looks best.
  const displayContent = wish.content.length > 5 ? wish.content.substring(0, 4) + '..' : wish.content;

  return (
    <div
      className="absolute z-10 select-none"
      style={{
        left: `${wish.x}%`,
        bottom: '-250px', // Start further down
        transform: `scale(${wish.scale})`,
      }}
    >
      {/* Animation Wrapper: Floating Up */}
      <div
        style={{
          animation: `floatUp ${wish.duration}s linear infinite`,
          animationDelay: `-${wish.delay}s`,
        }}
      >
        {/* Animation Wrapper: Swaying */}
        <div
          style={{
            animation: `sway ${wish.duration * 0.12}s ease-in-out infinite alternate`,
          }}
        >
          {/* Interactive Container */}
          <div 
            onClick={() => onClick(wish)}
            className="group relative cursor-pointer hover:scale-110 transition-transform duration-700 ease-out"
          >
            {/* --- LANTERN BODY --- */}
            <div 
              className={`
                relative w-24 h-36 md:w-28 md:h-40
                rounded-t-3xl rounded-b-[4rem]
                ${currentStyle.shadow}
                overflow-hidden
                border-[0.5px] border-white/20
              `}
              style={{ background: currentStyle.background }}
            >
              {/* 1. Paper Texture */}
              <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')]"></div>
              
              {/* 2. Bamboo Structure (Subtler) */}
              <div className="absolute inset-0 flex justify-between px-6 opacity-10 mix-blend-multiply pointer-events-none">
                 <div className="w-[1px] h-full bg-black transform -skew-x-6"></div> 
                 <div className="w-[1px] h-full bg-black transform skew-x-6"></div>
              </div>
              <div className="absolute top-[25%] left-0 right-0 h-[1px] bg-black/10 blur-[1px]"></div>

              {/* 3. Calligraphy Text (The Wish) */}
              <div className={`absolute inset-0 flex items-center justify-center pt-2 pb-8 ${currentStyle.textColor}`}>
                <div 
                  className="font-['Ma_Shan_Zheng'] text-3xl md:text-4xl leading-tight opacity-85"
                  style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}
                >
                  {displayContent}
                </div>
              </div>

              {/* 4. Flame Core */}
              <div 
                className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full blur-2xl mix-blend-soft-light opacity-100"
                style={{ animation: 'flame 4s infinite ease-in-out alternate' }}
              />
            </div>

            {/* --- LANTERN BOTTOM RIM & FIRE --- */}
            {/* The wire ring */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-3 bg-amber-900/40 rounded-full blur-[1px] border border-amber-500/30"></div>
            
            {/* The Fire Source */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-orange-200 rounded-full blur-[2px] animate-pulse"></div>


            {/* --- HOVER TOOLTIP (Keep for full text readability) --- */}
            <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none z-20 translate-y-4 group-hover:translate-y-0">
               <div className="flex items-center gap-2 text-[11px] text-amber-100/90 bg-slate-900/90 px-3 py-1.5 rounded-full shadow-xl backdrop-blur-md border border-amber-500/20 whitespace-nowrap">
                 <span className="font-serif tracking-wide max-w-[150px] truncate">{wish.content}</span>
                 {wish.likes > 0 && (
                   <span className="flex items-center gap-1 border-l border-white/10 pl-2 ml-1 text-xs">
                     <HeartIcon className="w-3 h-3 text-red-400" solid />
                     {wish.likes}
                   </span>
                 )}
               </div>
               {/* Tooltip Triangle */}
               <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-slate-900/90 rotate-180 -mt-[1px]"></div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Lantern;

import React, { useState } from 'react';
import { Wish, Language } from '../types';
import { XMarkIcon, SparklesIcon, HeartIcon, ShareIcon } from './Icons';
import { TRANSLATIONS } from '../constants';

interface WishDetailProps {
  wish: Wish;
  onClose: () => void;
  language: Language;
  onLike: (wish: Wish) => void;
  hasLiked: boolean;
}

const WishDetail: React.FC<WishDetailProps> = ({ wish, onClose, language, onLike, hasLiked }) => {
  const t = TRANSLATIONS[language];
  const [isAnimatingLike, setIsAnimatingLike] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleLike = () => {
    if (!hasLiked) {
      setIsAnimatingLike(true);
      onLike(wish);
      setTimeout(() => setIsAnimatingLike(false), 500);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: t.appTitle,
      text: `${wish.content}\n\n${wish.blessing}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share canceled or failed', err);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareData.text}\n\n${shareData.url}`);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full max-w-lg bg-slate-900/95 border border-amber-500/30 rounded-2xl shadow-[0_0_60px_rgba(251,191,36,0.15)] overflow-hidden flex flex-col relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Decorative Top Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-amber-200 transition-colors z-10"
        >
          <XMarkIcon />
        </button>

        <div className="p-8 text-center flex flex-col items-center">
          
          <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(251,191,36,0.2)]">
             <SparklesIcon className="text-amber-300 w-8 h-8" />
          </div>

          <h3 className="text-slate-400 text-sm tracking-widest uppercase mb-4 font-medium">{t.wishLabel}</h3>
          
          <p className="text-2xl md:text-3xl text-white font-serif mb-8 leading-relaxed italic">
            "{wish.content}"
          </p>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-8" />

          <h3 className="text-amber-400/80 text-xs tracking-[0.2em] uppercase mb-3 flex items-center gap-2">
            <span>✧</span> {t.wisdomLabel} <span>✧</span>
          </h3>
          
          <p className="text-lg md:text-xl text-amber-100/90 font-serif leading-loose mb-8">
            {wish.blessing}
          </p>

          <div className="flex items-center gap-4">
            {/* Like Button */}
            <button
              onClick={handleLike}
              disabled={hasLiked}
              className={`group relative flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 ${
                hasLiked 
                  ? 'bg-red-500/10 text-red-400 border border-red-500/30 cursor-default' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-red-400 border border-slate-700 hover:border-red-400/50'
              }`}
            >
              <div className={`relative ${isAnimatingLike ? 'animate-bounce' : ''}`}>
                <HeartIcon className="w-5 h-5" solid={hasLiked} />
                {isAnimatingLike && (
                  <div className="absolute inset-0 animate-ping text-red-500 opacity-75">
                    <HeartIcon className="w-5 h-5" solid />
                  </div>
                )}
              </div>
              <span className="font-medium font-sans">
                {hasLiked ? t.liked : t.like}
              </span>
              <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs min-w-[1.5rem] ml-1">
                {wish.likes}
              </span>
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="group relative flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 border border-slate-700 hover:border-amber-400/50"
            >
              <ShareIcon className="w-5 h-5" />
              <span className="font-medium font-sans">
                {isCopied ? t.copied : t.share}
              </span>
            </button>
          </div>
        </div>

        <div className="bg-slate-950/50 p-4 text-center">
          <p className="text-slate-600 text-xs font-mono">
            {t.timeLabel} {new Date(wish.timestamp).toLocaleTimeString(language === 'zh' ? 'zh-CN' : 'en-US')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WishDetail;
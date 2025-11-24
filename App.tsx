
import React, { useState, useCallback } from 'react';
import StarField from './components/StarField';
import Lantern from './components/Lantern';
import WishForm from './components/WishForm';
import WishDetail from './components/WishDetail';
import { Wish, AppState, Language } from './types';
import { generateBlessing } from './services/geminiService';
import { SparklesIcon } from './components/Icons';
import { TRANSLATIONS } from './constants';

const INITIAL_WISHES: Wish[] = [
  { id: '1', content: '世界和平', timestamp: Date.now(), blessing: 'Harmony begins in the heart and ripples outward like starlight.', likes: 42, x: 20, duration: 80, delay: 0, scale: 0.8, colorTone: 'gold' },
  { id: '2', content: '家人安康', timestamp: Date.now(), blessing: 'Vitality flows like a river; cherish the roots that sustain you.', likes: 128, x: 50, duration: 95, delay: 40, scale: 0.6, colorTone: 'red' },
  { id: '3', content: '金榜题名', timestamp: Date.now(), blessing: 'Effort is the fuel, knowledge the flame. Shine brightly.', likes: 15, x: 80, duration: 70, delay: 10, scale: 0.9, colorTone: 'orange' },
];

function App() {
  const [wishes, setWishes] = useState<Wish[]>(INITIAL_WISHES);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);
  const [language, setLanguage] = useState<Language>('zh'); // Default to zh for the aesthetic match
  const [likedWishIds, setLikedWishIds] = useState<Set<string>>(new Set());

  const t = TRANSLATIONS[language];

  // Add a wish to the list
  const handleWishSubmit = async (text: string) => {
    setAppState(AppState.SUBMITTING);

    // 1. Generate AI Blessing
    const blessing = await generateBlessing(text, language);

    // 2. Create Wish Object
    const newWish: Wish = {
      id: Date.now().toString(),
      content: text,
      timestamp: Date.now(),
      blessing: blessing,
      likes: 0,
      // Random visual properties for natural feel
      x: Math.random() * 80 + 10, // Keep within 10-90% width
      duration: Math.random() * 60 + 60, // 60s to 120s flight time
      delay: 0, // Start immediately
      scale: Math.random() * 0.4 + 0.6, // 0.6 to 1.0 scale
      colorTone: ['gold', 'red', 'orange'][Math.floor(Math.random() * 3)] as 'gold' | 'red' | 'orange',
    };

    setWishes(prev => [...prev, newWish]);
    setAppState(AppState.IDLE);
    
    // Show the detail immediately
    setSelectedWish(newWish);
  };

  const handleLanternClick = useCallback((wish: Wish) => {
    const currentWish = wishes.find(w => w.id === wish.id) || wish;
    setSelectedWish(currentWish);
  }, [wishes]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  const handleLike = (wishToLike: Wish) => {
    if (likedWishIds.has(wishToLike.id)) return;

    // Update wishes state
    const updatedWishes = wishes.map(w => 
      w.id === wishToLike.id ? { ...w, likes: w.likes + 1 } : w
    );
    setWishes(updatedWishes);

    // Update selected wish if it's currently open
    if (selectedWish && selectedWish.id === wishToLike.id) {
      setSelectedWish({ ...selectedWish, likes: selectedWish.likes + 1 });
    }

    // Add to liked set
    setLikedWishIds(prev => new Set(prev).add(wishToLike.id));
  };

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden text-slate-100 selection:bg-amber-500/30">
      
      {/* 1. Background Layer - Updated to match reference (Deep Blue/Purple Twilight) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1b4b] via-[#2e1065] to-[#4c1d95]">
        <StarField />
        {/* Soft atmospheric fog at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-pink-900/30 to-transparent pointer-events-none mix-blend-screen" />
      </div>

      {/* 2. Interactive Lantern Layer */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="relative w-full h-full pointer-events-auto perspective-[1000px]">
             {wishes.map(wish => (
            <Lantern 
              key={wish.id} 
              wish={wish} 
              onClick={handleLanternClick} 
            />
          ))}
        </div>
      </div>

      {/* 3. UI Overlay Layer */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 md:p-12 z-40">
        
        {/* Header & Language Switcher */}
        <div className="flex justify-between items-start w-full pointer-events-auto">
          <div className="text-center md:text-left relative">
            {/* Decorative line above title */}
            <div className="hidden md:block w-12 h-1 bg-amber-500 mb-4 ml-1"></div>
            
            <h1 className="text-4xl md:text-7xl font-['Ma_Shan_Zheng'] text-transparent bg-clip-text bg-gradient-to-b from-[#fcd34d] via-[#f59e0b] to-[#d97706] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] tracking-wide">
              {t.appTitle}
            </h1>
            <p className="text-amber-100/80 text-sm md:text-lg mt-2 font-light tracking-widest max-w-xs md:max-w-md font-['Noto_Serif_SC']">
              {t.appSubtitle}
            </p>
          </div>

          {/* Language Switcher */}
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 border border-amber-500/30 hover:border-amber-500 hover:bg-slate-800/80 transition-all text-xs md:text-sm font-medium text-amber-100/80 backdrop-blur-md"
          >
            <span className={language === 'en' ? 'text-amber-400 font-bold' : 'opacity-50'}>EN</span>
            <span className="opacity-30">|</span>
            <span className={language === 'zh' ? 'text-amber-400 font-bold' : 'opacity-50'}>中文</span>
          </button>
        </div>

        {/* Floating Action Button (Main CTA) */}
        <div className="flex justify-center md:justify-end pointer-events-auto pb-8 md:pb-0">
          <button
            onClick={() => setAppState(AppState.WRITING)}
            className="group relative flex items-center justify-center w-16 h-16 md:w-auto md:h-auto md:px-8 md:py-4 bg-gradient-to-r from-amber-600 to-red-600 rounded-full shadow-[0_0_40px_rgba(220,38,38,0.4)] hover:shadow-[0_0_60px_rgba(220,38,38,0.6)] hover:scale-105 transition-all duration-300 border border-amber-500/20"
          >
            <span className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-20 duration-[2s]"></span>
            <SparklesIcon className="w-8 h-8 text-amber-100 md:mr-3" />
            <span className="hidden md:block text-xl font-['Ma_Shan_Zheng'] text-amber-50 tracking-widest">{t.cta}</span>
          </button>
        </div>
      </div>

      {/* 4. Modals */}
      
      {/* Wish Writing Form */}
      {(appState === AppState.WRITING || appState === AppState.SUBMITTING) && (
        <WishForm 
          onSubmit={handleWishSubmit} 
          onCancel={() => setAppState(AppState.IDLE)} 
          isSubmitting={appState === AppState.SUBMITTING} 
          language={language}
        />
      )}

      {/* Wish Detail View */}
      {selectedWish && (
        <WishDetail 
          wish={selectedWish} 
          onClose={() => setSelectedWish(null)} 
          language={language}
          onLike={handleLike}
          hasLiked={likedWishIds.has(selectedWish.id)}
        />
      )}

    </div>
  );
}

export default App;

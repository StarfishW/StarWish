import React, { useState } from 'react';
import { PaperAirplaneIcon, XMarkIcon } from './Icons';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface WishFormProps {
  onSubmit: (text: string) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  language: Language;
}

const WishForm: React.FC<WishFormProps> = ({ onSubmit, onCancel, isSubmitting, language }) => {
  const [text, setText] = useState('');
  const t = TRANSLATIONS[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-700 rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.1)] p-6 md:p-8 transform transition-all scale-100">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif text-amber-100">{t.cta}</h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-white transition-colors">
            <XMarkIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6 relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.placeholder}
              className="w-full h-40 bg-slate-800/50 border border-slate-600 rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 resize-none font-serif text-lg leading-relaxed"
              maxLength={200}
              disabled={isSubmitting}
              autoFocus
            />
            <div className="absolute bottom-3 right-3 text-xs text-slate-500">
              {text.length}/200
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-slate-300 hover:text-white transition-colors font-medium text-sm"
              disabled={isSubmitting}
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={!text.trim() || isSubmitting}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-serif font-bold text-slate-900 transition-all duration-300 
                ${!text.trim() || isSubmitting 
                  ? 'bg-slate-700 cursor-not-allowed text-slate-500' 
                  : 'bg-gradient-to-r from-amber-200 to-amber-500 hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] hover:scale-105'
                }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-800 border-t-transparent rounded-full animate-spin" />
                  <span>{t.sending}</span>
                </>
              ) : (
                <>
                  <span>{t.send}</span>
                  <PaperAirplaneIcon className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WishForm;

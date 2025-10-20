
import React from 'react';
import { ChefHatIcon } from './icons/ChefHatIcon';
import type { Language } from '../translations';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: {
    headerTitle: string;
  };
}


export const Header: React.FC<HeaderProps> = ({ language, setLanguage, translations }) => {
  const buttonClasses = "px-3 py-1 rounded-md text-sm font-semibold transition-colors";
  const activeClasses = "bg-emerald-500 text-white";
  const inactiveClasses = "bg-stone-200 text-stone-600 hover:bg-stone-300";

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ChefHatIcon className="w-8 h-8 text-emerald-500" />
          <h1 className="text-2xl md:text-3xl font-bold text-stone-800">
            {translations.headerTitle}
          </h1>
        </div>
        <div className="flex items-center gap-2 p-1 bg-stone-100 rounded-lg">
          <button 
            onClick={() => setLanguage('en')}
            className={`${buttonClasses} ${language === 'en' ? activeClasses : inactiveClasses}`}
            aria-pressed={language === 'en'}
          >
            EN
          </button>
          <button 
            onClick={() => setLanguage('id')}
            className={`${buttonClasses} ${language === 'id' ? activeClasses : inactiveClasses}`}
            aria-pressed={language === 'id'}
          >
            ID
          </button>
        </div>
      </div>
    </header>
  );
};

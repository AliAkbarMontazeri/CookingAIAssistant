
import React from 'react';
import { ChefHatIcon } from './icons/ChefHatIcon';

interface LoadingSpinnerProps {
    translations: {
        loadingMessage: string;
        loadingSubMessage: string;
    }
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ translations }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center text-stone-500">
      <ChefHatIcon className="w-16 h-16 text-emerald-500 animate-bounce" />
      <p className="mt-4 text-lg font-semibold">{translations.loadingMessage}</p>
      <p>{translations.loadingSubMessage}</p>
    </div>
  );
};

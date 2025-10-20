
import React from 'react';

interface FooterProps {
    translations: {
        poweredBy: string;
    }
}

export const Footer: React.FC<FooterProps> = ({ translations }) => {
  return (
    <footer className="w-full py-4 mt-8">
      <div className="container mx-auto px-4 md:px-8 text-center text-stone-500 text-sm">
        <p>{translations.poweredBy}</p>
      </div>
    </footer>
  );
};

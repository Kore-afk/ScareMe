import React from "react";
import { Ghost, Skull } from "lucide-react";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  onLanguageChange: (language: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onLanguageChange }) => {
  const { t, i18n } = useTranslation();

  return (
    <header className="bg-gradient-to-b from-orange-900 via-orange-900/50 to-black/50 p-12 shadow-lg relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 animate-float text-4xl">🎃</div>
        <div className="absolute top-5 right-1/4 animate-spooky text-4xl">👻</div>
        <div className="absolute bottom-0 left-1/3 animate-spooky text-4xl">🕷️</div>
        <div className="absolute top-2 right-1/3 animate-float text-4xl">🦇</div>
      </div>

      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between relative z-10 gap-6">
        <div className="flex items-center gap-4">
          <Ghost className="h-12 w-12 text-orange-500 animate-spooky" />
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
            {t("header.title")}
          </h1>
          <Skull className="h-12 w-12 text-orange-500 animate-float" />
        </div>

        <select
          className="bg-gray-900/80 text-orange-400 rounded-full px-6 py-3 border-2 border-orange-500/30 hover:border-orange-500 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-lg"
          value={i18n.language}
          onChange={(e) => onLanguageChange(e.target.value)}
        >
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
      </div>
    </header>
  );
};
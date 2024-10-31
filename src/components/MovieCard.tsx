import React, { useState } from "react";
import { Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Movie } from "../services/tmdb";

interface MovieCardProps {
  movie: Movie;
  onSelect: () => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onSelect }) => {
  const { t } = useTranslation();
  const imageUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '';
  const [showFullOverview, setShowFullOverview] = useState(false);

  return (
    <div
      onClick={onSelect}
      className="group bg-gradient-to-b from-orange-900/30 to-gray-900 rounded-lg overflow-hidden shadow-[0_0_15px_rgba(234,88,12,0.2)] hover:shadow-[0_0_25px_rgba(234,88,12,0.4)] transform hover:scale-105 transition-all duration-300 cursor-pointer"
    >
      <div className="relative h-[28rem]">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50">
          <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-full flex items-center gap-2 transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <Eye className="h-5 w-5" />
            {t("movies.whereToWatch")}
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
          <h2 className="text-2xl font-bold text-orange-400 mb-3 line-clamp-2">
            {movie.title}
          </h2>
          <div className="flex items-center gap-4 mb-3">
            <span className="bg-orange-600/80 text-sm font-bold px-3 py-1.5 rounded-full">
              {movie.vote_average.toFixed(1)} / 10
            </span>
            <span className="text-sm text-gray-300">
              {new Date(movie.release_date).getFullYear()}
            </span>
          </div>
          <div className="relative">
            <p className={`text-gray-300 text-sm ${showFullOverview ? '' : 'line-clamp-3'}`}>
              {movie.overview}
            </p>
            {movie.overview.length > 150 && !showFullOverview && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFullOverview(true);
                }}
                className="text-orange-400 hover:text-orange-300 text-sm mt-1 focus:outline-none"
              >
                Read More...
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
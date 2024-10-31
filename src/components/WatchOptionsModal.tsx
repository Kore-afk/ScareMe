import React from "react";
import {
  X,
  Monitor,
  ShoppingCart,
  DollarSign,
  PlayCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Movie, WatchProviderData } from "../services/tmdb";

interface WatchOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: Movie;
  watchProviders: { [key: string]: WatchProviderData };
}

const REGION_NAMES: { [key: string]: string } = {
  US: "United States",
  ES: "Spain",
  MX: "Mexico",
};

export const WatchOptionsModal: React.FC<WatchOptionsModalProps> = ({
  isOpen,
  onClose,
  movie,
  watchProviders,
}) => {
  const { t } = useTranslation();
  const imageUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '';

  if (!isOpen) return null;

  const getProviderTypeIcon = (type: string) => {
    switch (type) {
      case "flatrate":
        return <Monitor className="h-5 w-5 text-blue-400" />;
      case "free":
        return <PlayCircle className="h-5 w-5 text-green-400" />;
      case "ads":
        return <PlayCircle className="h-5 w-5 text-yellow-400" />;
      case "rent":
        return <DollarSign className="h-5 w-5 text-orange-400" />;
      case "buy":
        return <ShoppingCart className="h-5 w-5 text-purple-400" />;
      default:
        return <PlayCircle className="h-5 w-5" />;
    }
  };

  const hasStreamingOptions = Object.values(watchProviders).some((providers) =>
    Object.values(providers).some((array) => array && array.length > 0)
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative border border-orange-500/20">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Movie Info Section */}
          <div className="relative h-[500px] md:h-auto">
            {imageUrl && (
              <img
                src={imageUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h2 className="text-3xl font-bold text-orange-400 mb-2">
                {movie.title}
              </h2>
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-orange-600/80 px-3 py-1 rounded-full text-sm">
                  {movie.vote_average.toFixed(1)} / 10
                </span>
                <span className="text-gray-300">
                  {new Date(movie.release_date).getFullYear()}
                </span>
              </div>
              <p className="text-gray-300 line-clamp-3">{movie.overview}</p>
            </div>
          </div>

          {/* Watch Options Section */}
          <div className="p-6 overflow-y-auto max-h-[500px] md:max-h-[90vh]">
            <h3 className="text-xl font-semibold text-orange-400 mb-6">
              {t("movies.whereToWatch")}
            </h3>

            {hasStreamingOptions ? (
              Object.entries(watchProviders).map(([region, providerTypes]) => (
                <div key={region} className="mb-6 last:mb-0">
                  <h4 className="text-lg font-medium text-gray-200 mb-4">
                    {REGION_NAMES[region] || region}
                  </h4>
                  {Object.entries(providerTypes).map(([type, providers]) =>
                    providers && providers.length > 0 ? (
                      <div key={type} className="mb-4 last:mb-0">
                        <div className="flex items-center gap-2 mb-3">
                          {getProviderTypeIcon(type)}
                          <span className="text-gray-300">
                            {t(`movies.providerTypes.${type}`)}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {providers.map((provider) => (
                            <a
                              key={provider.provider_id}
                              href={`https://www.justwatch.com/search?q=${encodeURIComponent(
                                movie.title
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-gray-800/50 hover:bg-gray-700/50 px-3 py-2 rounded-lg transition-colors border border-gray-700/50"
                            >
                              {provider.logo_path && (
                                <img
                                  src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                  alt={provider.provider_name}
                                  className="w-6 h-6 rounded"
                                />
                              )}
                              <span className="text-white">
                                {provider.provider_name}
                              </span>
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-8">
                {t("movies.noStreamingOptions")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
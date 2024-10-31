import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./i18n";

import { Header } from "./components/Header";
import { MovieCard } from "./components/MovieCard";
import { SortControls } from "./components/SortControls";
import { WatchOptionsModal } from "./components/WatchOptionsModal";
import { Pagination } from "./components/Pagination";
import {
  getHalloweenMovies,
  getWatchProviders,
  type Movie,
  type WatchProvider,
  type MoviesResponse,
} from "./services/tmdb";

function App() {
  const { i18n } = useTranslation();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [sortBy, setSortBy] = useState("popularity");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [watchProviders, setWatchProviders] = useState<{
    [key: number]: { [key: string]: WatchProvider[] };
  }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getHalloweenMovies(sortBy, currentPage, i18n.language);
      setMovies(response.results);
      setTotalPages(response.total_pages);

      // Fetch watch providers for each movie
      const providers: { [key: number]: { [key: string]: WatchProvider[] } } = {};
      for (const movie of response.results) {
        providers[movie.id] = await getWatchProviders(movie.id);
      }
      setWatchProviders(providers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [sortBy, currentPage, i18n.language]);

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <Header onLanguageChange={handleLanguageChange} />

      <main className="container mx-auto px-4 py-8">
        <SortControls sortBy={sortBy} onSortChange={handleSortChange} />

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500 mx-auto"></div>
          </div>
        )}

        {error && <div className="text-red-500 text-center py-12">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelect={() => handleMovieSelect(movie)}
            />
          ))}
        </div>

        {!loading && !error && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </main>

      {selectedMovie && (
        <WatchOptionsModal
          isOpen={true}
          onClose={() => setSelectedMovie(null)}
          movie={selectedMovie}
          watchProviders={watchProviders[selectedMovie.id] || {}}
        />
      )}

      <footer className="bg-gradient-to-t from-orange-900/20 to-transparent py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-orange-400">
          <p className="text-xl">🎃 {i18n.t("footer.happyHalloween")} 👻</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
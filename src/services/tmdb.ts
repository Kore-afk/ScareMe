import axios from 'axios';

const TMDB_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOGYwYmFhMGQwMThjMmIxNTFkNzAwMTQ2NWM1NjFiYSIsIm5iZiI6MTczMDMyNzEyMC44NzA4ODQ0LCJzdWIiOiI2NzIyYWE3MGVlYjBjNWVmM2I5YmM2MjMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.BHSnThMKLmaCFph-0t8Flt55j3-Qltob41iA6WKZCf0';
const BASE_URL = 'https://api.themoviedb.org/3';
const WATCH_PROVIDERS_REGIONS = ['US', 'ES', 'MX'];

const tmdbAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

export interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  overview: string;
  vote_average: number;
  genre_ids: number[];
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export interface WatchProviderData {
  flatrate?: WatchProvider[];
  free?: WatchProvider[];
  ads?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
}

export interface MoviesResponse {
  results: Movie[];
  total_pages: number;
  page: number;
}

export const getHalloweenMovies = async (sortBy: string, page: number = 1, language: string = 'en') => {
  try {
    const params = {
      language,
      with_genres: '27', // Horror genre
      sort_by: getSortParameter(sortBy),
      'vote_count.gte': 100,
      include_adult: false,
      page
    };

    const response = await tmdbAxios.get('/discover/movie', { params });
    return response.data as MoviesResponse;
  } catch (error) {
    console.error('Error fetching Halloween movies:', error);
    throw new Error('Failed to fetch movies');
  }
};

export const getWatchProviders = async (movieId: number) => {
  try {
    const providers: { [key: string]: WatchProviderData } = {};
    
    for (const region of WATCH_PROVIDERS_REGIONS) {
      try {
        const response = await tmdbAxios.get(`/movie/${movieId}/watch/providers`);
        const regionData = response.data.results[region];
        
        if (regionData) {
          providers[region] = {
            flatrate: regionData.flatrate || [],
            free: regionData.free || [],
            ads: regionData.ads || [],
            rent: regionData.rent || [],
            buy: regionData.buy || []
          };
        }
      } catch (regionError) {
        console.error(`Error fetching providers for region ${region}:`, regionError);
      }
    }
    
    return providers;
  } catch (error) {
    console.error('Error fetching watch providers:', error);
    return {};
  }
};

const getSortParameter = (sortBy: string) => {
  switch (sortBy) {
    case 'popularity':
      return 'popularity.desc';
    case 'rating':
      return 'vote_average.desc';
    case 'newest':
      return 'release_date.desc';
    default:
      return 'popularity.desc';
  }
};
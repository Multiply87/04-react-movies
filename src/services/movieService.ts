import axios from "axios";
import type { Movie } from "../types/movie";

const apiKey = import.meta.env.VITE_TMDB_TOKEN;

interface ArticlesHttpResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}


export const searchMovies = async (query: string): Promise<Movie[]> => {
  const response = await axios.get<ArticlesHttpResponse>(
    `https://api.themoviedb.org/3/search/movie?query=${query}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );
  return response.data.results;
};
import axios from "axios";
import type { Movie } from "../types/movie";

const apiKey = import.meta.env.VITE_TMDB_TOKEN;

export interface FilmsHttpResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export const searchMovies = async (
  query: string,
  page: number
): Promise<FilmsHttpResponse> => {
  const response = await axios.get<FilmsHttpResponse>(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: {
        query,
        page,
      },
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  return response.data;
};
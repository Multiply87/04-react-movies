import { useState } from "react";
import { searchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid";
import SearchBar from "../SearchBar/SearchBar";
import css from "./App.module.css";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

export interface SearchMovieHandler {
  (query: string): void;
}

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const searchMovieHandler: SearchMovieHandler = async (query) => {
    setMovies([]);
    setIsLoading(true);
    setIsError(false);

    try {
      const result = await searchMovies(query);
      if (result.length === 0) {
        toast("No movies found for your request.");
      } else {
        setMovies(result);
      }
    } catch (error) {
      console.error("Error searching for movies:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMovie = (movie: Movie) => {
    setMovie(movie);
  };

  const closeModal = () => {
    setMovie(null);
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={searchMovieHandler} />
      {!isLoading && !isError && (
        <MovieGrid onSelect={handleSelectMovie} movies={movies} />
      )}
      {isError && <ErrorMessage />}
      {isLoading && <Loader />}
      {movie && <MovieModal movie={movie} onClose={closeModal} />}
      <Toaster />
    </div>
  );
}

export default App;

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid";
import SearchBar from "../SearchBar/SearchBar";
import Pagination from "../Pagination/Pagination";
import css from "./App.module.css";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

function App() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["movies", searchQuery, page],
    queryFn: () => searchMovies(searchQuery, page),
    enabled: Boolean(searchQuery),
    placeholderData: (previousData) => previousData,
  });

  const movies: Movie[] = data?.results ?? [];
  const totalPages: number = data?.total_pages ?? 0;

  useEffect(() => {
    if (isSuccess && searchQuery && movies.length === 0) {
      toast("No movies found for your request.");
    }
  }, [isSuccess, searchQuery, movies.length]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {!isLoading && !isError && movies.length > 0 && (
        <>
          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={page}
              onPageChange={handlePageChange}
            />
          )}
          <MovieGrid onSelect={setSelectedMovie} movies={movies} />
        </>
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
      <Toaster />
    </div>
  );
}

export default App;

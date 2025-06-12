import { useGetNewMoviesQuery } from "../../redux/api/movie";
import MovieCard from "./MovieCard";

const MovieList = () => {
  const { data: movie, isLoading, error } = useGetNewMoviesQuery();

  if (isLoading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-500">Error loading movies</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {movie?.newMovies?.map((m) => (
        <MovieCard key={m._id} movie={m} />
      ))}
    </div>
  );
};

export default MovieList;

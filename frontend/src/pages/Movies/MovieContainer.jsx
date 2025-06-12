import { useState } from "react";
import { useGetAllMoviesQuery } from "../../redux/api/movie";
import { useListGenresQuery } from "../../redux/api/genre";
import Navigation from "../Auth/Navigation";
import MovieCard from "./MovieCard";

const MovieContainer = () => {
  const { data: movieData = {} } = useGetAllMoviesQuery();
  const movies = movieData.movies || [];
  const { data: genresData = {} } = useListGenresQuery();

  const genres = genresData.genres || [];

  const [selectedGenre, setSelectedGenre] = useState("all");

  const filteredMovies =
    selectedGenre === "all"
      ? movies
      : movies.filter((movie) => movie.genre === selectedGenre);

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-zinc-900 text-white p-4 pt-10">
        {/* Genre Buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <button
            onClick={() => setSelectedGenre("all")}
            className={`px-4 py-2 rounded-full ${
              selectedGenre === "all"
                ? "bg-white text-zinc-900"
                : "bg-zinc-700 hover:bg-zinc-600"
            }`}
          >
            All
          </button>
          {genres.map((genre) => (
            <button
              key={genre._id}
              onClick={() => setSelectedGenre(genre._id)}
              className={`px-4 py-2 rounded-full ${
                selectedGenre === genre._id
                  ? "bg-white text-zinc-900"
                  : "bg-zinc-700 hover:bg-zinc-600"
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>

        {/* Movie Cards */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      </div>
    </>
  );
};

export default MovieContainer;

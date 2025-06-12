import {
  useGetAllMoviesQuery,
  useGetNewMoviesQuery,
  useGetTopMoviesQuery,
} from "../../redux/api/movie";
import { useListGenresQuery } from "../../redux/api/genre";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setMoviesFilter,
  setFilteredMovies,
  setMoviesYear,
  setUniqueYear,
} from "../../redux/features/movies/moviesSlice";
import MovieCard from "./MovieCard";
import Navigation from "../Auth/Navigation";

const AllMovies = () => {
  const dispatch = useDispatch();

  const { data, isLoading } = useGetAllMoviesQuery();
  const { data: genres } = useListGenresQuery();
  const { data: newMovies } = useGetNewMoviesQuery();
  const { data: topMovies } = useGetTopMoviesQuery();

  const { moviesFilter, filteredMovies } = useSelector((state) => state.movies);

  console.log("movies", data);

  // Extract years for filtering
  const movieYears = data?.movies?.map((movie) => movie.year) || [];
  const uniqueYear = [...new Set(movieYears)];

  // Initialize movie data
  useEffect(() => {
    if (data?.movies?.length > 0) {
      dispatch(setFilteredMovies(data.movies));
      dispatch(setMoviesYear(movieYears));
      dispatch(setUniqueYear(uniqueYear));
    }
  }, [data?.movies, dispatch]);

  // Search filter
  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    dispatch(setMoviesFilter({ searchTerm }));

    const filtered =
      data?.movies?.filter((movie) =>
        movie.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [];

    dispatch(setFilteredMovies(filtered));
  };

  // Genre filter
  const handleGenreClick = (genreId) => {
    dispatch(setMoviesFilter({ selectedGenre: genreId }));

    if (!genreId) {
      dispatch(setFilteredMovies(data?.movies || []));
      return;
    }

    const filtered =
      data?.movies?.filter((movie) => movie.genre === genreId) || [];
    dispatch(setFilteredMovies(filtered));
  };

  // Year filter
const handleYearChange = (year) => {
  dispatch(setMoviesFilter({ selectedYear: year }));

  if (!year) {
    dispatch(setFilteredMovies(data?.movies || []));
    return;
  }

  const filtered = data?.movies?.filter(
    (movie) => movie.year.toString() === year
  ) || [];
  
  dispatch(setFilteredMovies(filtered));
};


  // Sort filter
  const handleSortChange = (sortOption) => {
    dispatch(setMoviesFilter({ selectedSort: sortOption }));

    switch (sortOption) {
      case "new":
        dispatch(setFilteredMovies(newMovies?.newMovies || []));
        break;
      case "top":
        dispatch(setFilteredMovies(topMovies?.topMovies || []));
        break;
      default:
        dispatch(setFilteredMovies(data?.movies || []));
        break;
    }
  };

  return (
    <>
      <Navigation />
      <div className="text-white bg-zinc-900">
        <section>
          {/* Hero Section */}
          <div className="relative h-[40rem] w-screen mb-5 flex items-center justify-center bg-cover">
            <div className="absolute mb-40 inset-0 bg-gradient-to-b from-black to-zinc-900 opacity-80"></div>
            <div className="relative z-10 text-center text-white mt-[10rem]">
              <h1 className="text-8xl font-bold mb-5"> Cinema Kada</h1>
              <p className="text-2xl mb-40">
                Cinema Kada: Unveiling the Magic of Movies!
              </p>
              <div className="w-full h-[1px] bg-zinc-600 my-40"></div>
            </div>

            {/* Filters */}
            <section className="absolute -bottom-[5rem] w-full flex flex-col items-center">
              <div className="w-[40rem] h-[5rem] group rounded-lg overflow-hidden border border-zinc-600 bg-zinc-800 hover:border-white focus-within:ring-2 focus-within:ring-zinc-400 transition duration-200">
                <label className="w-full h-full flex items-center cursor-text px-6">
                  <input
                    type="text"
                    className="w-full bg-transparent text-white outline-none placeholder-zinc-400 text-lg"
                    placeholder="Search Movie"
                    value={moviesFilter.searchTerm}
                    onChange={handleSearchChange}
                  />
                </label>
              </div>
              <section className="flex gap-4 mt-[2rem]">
                {/* Genre Filter */}
                <select
                  className="border p-2 rounded text-gray-300"
                  value={moviesFilter.selectedGenre}
                  onChange={(e) => handleGenreClick(e.target.value)}
                >
                  <option value="">Genres</option>
                  {genres?.genres?.map((genre) => (
                    <option key={genre._id} value={genre._id}>
                      {genre.name}
                    </option>
                  ))}
                </select>

                {/* Year Filter */}
                <select
                  className="border p-2 rounded text-gray-300"
                  value={moviesFilter.selectedYear}
                  onChange={(e) => handleYearChange(e.target.value)}
                >
                  <option value="">Year</option>
                  {uniqueYear.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>

                {/* Sort Filter */}
                <select
                  className="border p-2 rounded text-gray-300"
                  value={moviesFilter.selectedSort}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  <option value="">Sort By</option>
                  <option value="new">New Movies</option>
                  <option value="top">Top Movies</option>
                </select>
              </section>
            </section>
          </div>

          {/* Movie Cards */}
          <section className="mt-[10rem] px-10 w-screen flex justify-center items-center flex-wrap gap-6 text-white">
            {isLoading ? (
              <p className="text-2xl">Loading movies...</p>
            ) : filteredMovies?.length > 0 ? (
              filteredMovies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))
            ) : (
              <p className="text-2xl">No movies found.</p>
            )}
          </section>
        </section>
      </div>
    </>
  );
};

export default AllMovies;

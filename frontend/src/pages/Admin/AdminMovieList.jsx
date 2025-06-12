import { Link } from "react-router-dom";
import { useGetAllMoviesQuery } from "../../redux/api/movie";
import Navigation from "../Auth/Navigation";

const AdminMovieList = () => {
  const { data: movies, isLoading, isError, error } = useGetAllMoviesQuery();


  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-zinc-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold mb-6">Movie List</h1>

          {isLoading && <p className="text-zinc-300">Loading movies...</p>}
          {isError && (
            <p className="text-red-400">
              Error: {error?.data?.message || "Something went wrong"}
            </p>
          )}

          {movies?.movies?.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {movies?.movies.map((movie) => (
                <div
                  key={movie._id}
                  className="bg-zinc-800 rounded-2xl shadow-md overflow-hidden hover:scale-105 transition-transform duration-200"
                >
                  <img
                    src={
                      movie.image ||
                      "https://via.placeholder.com/300x450?text=No+Image"
                    }
                    alt={movie.name}
                    className="w-full h-60 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-semibold">{movie.name}</h2>
                    <p className="text-sm text-zinc-400 mt-1 line-clamp-2">
                      {movie.description || "No description available."}
                    </p>
                    <Link
                      to={`/admin/movies/update/${movie._id}`}
                      className="inline-block mt-4 text-indigo-400 hover:underline text-sm"
                    >
                      Update
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !isLoading && <p className="text-zinc-400">No movies found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminMovieList;

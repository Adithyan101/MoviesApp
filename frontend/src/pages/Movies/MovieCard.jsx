import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {
  return (
    <div className="bg-zinc-800 text-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
      <Link to={`/movies/${movie._id}`}>
        <img
          src={movie.image}
          alt={movie.name}
          className="w-full h-64 object-cover rounded-t-2xl"
        />
        <div className="p-4">
          <h2 className="text-xl font-semibold truncate">{movie.name}</h2>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;

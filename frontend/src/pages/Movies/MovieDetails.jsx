import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  useGetSpecificMovieQuery,
  useAddMovieReviewMutation,
} from "../../redux/api/movie";
import Navigation from "../Auth/Navigation";

const MovieDetails = () => {
  const { id: movieId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { data: movie, isLoading, error, refetch } = useGetSpecificMovieQuery(movieId);
  const [createReview, { isLoading: loadingMovieReview }] = useAddMovieReviewMutation();
     console.log("movie",movie)
  const { userInfo } = useSelector((state) => state.auth);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!rating || !comment) {
      toast.error("Please provide both rating and comment");
      return;
    }

    try {
      await createReview({
        movieId,
        review: {
          rating,
          comment,
          name: userInfo.name,
        },
      }).unwrap();

      toast.success("Review submitted!");
      setRating(0);
      setComment("");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Review failed");
    }
  };

  return (
    <>
      <Navigation />
    <div className="text-white p-6 bg-zinc-900 min-h-screen">
      <Link to="/" className="text-blue-400 hover:underline mb-4 inline-block">
        &larr; Go Back
      </Link>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error loading movie details.</p>
      ) : (
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">{movie?.movie.name}</h1>
          <img src={movie?.movie?.image} alt={movie?.name} className="w-full max-h-[400px] object-cover rounded" />
          <p className="mt-4 text-lg">{movie?.movie?.description}</p>

          {/* Reviews */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
            {movie?.movie?.reviews?.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              movie?.movie?.reviews.map((review) => (
                <div key={review._id} className="mb-4 p-4 bg-zinc-800 rounded">
                  <p className="font-semibold">{review.name}</p>
                  <p>Rating: {review.rating} / 5</p>
                  <p className="text-sm text-gray-300">{review.comment}</p>
                </div>
              ))
            )}
          </section>

          {/* Write a review */}
          {userInfo ? (
            <section className="mt-10">
              <h2 className="text-xl font-semibold mb-2">Write a Review</h2>
              <form onSubmit={submitHandler} className="space-y-4">
                <div>
                  <label className="block mb-1">Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full p-2 rounded bg-zinc-800 text-white"
                  >
                    <option value="">Select...</option>
                    {[1, 2, 3, 4, 5].map((r) => (
                      <option key={r} value={r}>
                        {r} - {["Terrible", "Bad", "Okay", "Good", "Excellent"][r - 1]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Comment</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="4"
                    className="w-full p-2 rounded bg-zinc-800 text-white"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
                  disabled={loadingMovieReview}
                >
                  {loadingMovieReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </section>
          ) : (
            <p className="mt-6 text-gray-400">Please log in to write a review.</p>
          )}
        </div>
      )}
    </div>
    </>
  );
};

export default MovieDetails;

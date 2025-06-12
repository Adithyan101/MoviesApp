import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import Navigation from "../Auth/Navigation";
import {
  useGetSpecificMovieQuery,
  useUpdateMovieMutation,
  useDeleteMovieMutation,
  useUploadImageMutation,
} from "../../redux/api/movie";

const UpdateMovieList = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movieData, setMovieData] = useState({
    name: "",
    description: "",
    image: "",
    genre: "",
    cast: [],
    year: "",
    reviews: [],
    rating: 0,
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const { data: initialMovieData, isLoading: isMovieLoading } = useGetSpecificMovieQuery(id);

  const [updateMovie, { isLoading: isUpdatingMovie }] = useUpdateMovieMutation();
  const [deleteMovie, { isLoading: isDeletingMovie }] = useDeleteMovieMutation();
  const [uploadImage, { isLoading: isUploadingImage }] = useUploadImageMutation();

  useEffect(() => {
    if (initialMovieData) {
      setMovieData(initialMovieData.movie);
    }
  }, [initialMovieData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMovieData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCastChange = (e) => {
    setMovieData((prev) => ({ ...prev, cast: e.target.value.split(",") }));
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;
    const formData = new FormData();
    formData.append("image", selectedImage);
    try {
      const response = await uploadImage(formData).unwrap();
      return response.imageUrl;
    } catch (err) {
      console.log(err);
      toast.error("Image upload failed");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    let imageUrl = movieData.image;

    if (selectedImage) {
      const uploaded = await handleImageUpload();
      if (uploaded) imageUrl = uploaded;
    }

    try {
      await updateMovie({ id, updatedMovie: { ...movieData, image: imageUrl } });
      toast.success("Movie updated successfully");
       navigate("/admin/movies-list");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update movie");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    try {
      await deleteMovie(id).unwrap();
      toast.success("Movie deleted successfully");
      navigate("/movies");
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete movie");
    }
  };

  if (isMovieLoading) return <Loader />;

  console.log(movieData);

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold mb-6 text-center">Update Movie</h2>
        <form
          onSubmit={handleUpdate}
          className="bg-zinc-800 rounded-xl shadow-xl p-6 space-y-6"
        >
          <div>
            <label className="block mb-2 text-sm font-medium">Movie Name</label>
            <input
              type="text"
              name="name"
              value={movieData?.name}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-zinc-700 border border-zinc-600 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Description</label>
            <textarea
              name="description"
              rows={4}
              value={movieData?.description}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-zinc-700 border border-zinc-600 focus:outline-none"
              required
            ></textarea>
          </div>

          {/* <div>
            <label className="block mb-2 text-sm font-medium">Genre</label>
            <input
              type="text"
              name="genre"
              value={movieData?.m}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-zinc-700 border border-zinc-600"
              required
            />
          </div> */}

          <div>
            <label className="block mb-2 text-sm font-medium">Cast (comma separated)</label>
            <input
              type="text"
              name="cast"
              value={movieData?.cast.join(",")}
              onChange={handleCastChange}
              className="w-full p-2 rounded bg-zinc-700 border border-zinc-600"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Year</label>
            <input
              type="number"
              name="year"
              value={movieData?.year}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-zinc-700 border border-zinc-600"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Rating</label>
            <input
              type="number"
              step="0.1"
              name="rating"
              value={movieData?.rating}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-zinc-700 border border-zinc-600"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Image</label>
            {movieData.image && (
              <img
                src={movieData?.image}
                alt="Current"
                className="h-32 object-cover mb-2 rounded"
              />
            )}
            <input
              type="file"
              onChange={(e) => setSelectedImage(e.target.files[0])}
              className="w-full p-2 bg-zinc-700 text-white rounded border border-zinc-600"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <button
              type="submit"
              disabled={isUpdatingMovie || isUploadingImage}
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded text-white font-semibold disabled:opacity-50"
            >
              {isUpdatingMovie || isUploadingImage ? "Updating..." : "Update"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeletingMovie}
              className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded text-white font-semibold disabled:opacity-50"
            >
              {isDeletingMovie ? "Deleting..." : "Delete"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateMovieList;

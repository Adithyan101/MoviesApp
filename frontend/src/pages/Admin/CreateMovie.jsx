import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import Navigation from "../Auth/Navigation";
import {
  useCreateMovieMutation,
  useUploadImageMutation,
} from "../../redux/api/movie.js";
import { useListGenresQuery } from "../../redux/api/genre.js";

const CreateMovie = () => {
  const navigate = useNavigate();

  const [movieData, setMovieData] = useState({
    name: "",
    description: "",
    image: null,
    genre: "",
    cast: [""],
    year: "",
    reviews: [],
    rating: 0,
  });



  const [selectedImage, setSelectedImage] = useState(null);


    const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };



  const [createMovie, { isLoading: isCreatingMovie }] = useCreateMovieMutation();
  const [uploadImage] = useUploadImageMutation();
  const { data: genres = [], isLoading: isGenresLoading } = useListGenresQuery();
  console.log(genres);

  useEffect(() => {
    if (genres.length > 0) {
      setMovieData((prev) => ({ ...prev, genre: genres[0]._id || "" }));
    }
  }, [genres]);

const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "genre") {
    const selectedGenre = genres.genres.find((genre) => genre._id === value);
    setMovieData((prev) => ({ ...prev, genre: selectedGenre ? selectedGenre._id : "" }));
  } else {
    setMovieData((prev) => ({ ...prev, [name]: value }));
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !selectedImage ||
      !movieData.name.trim() ||
      !movieData.description ||
      !movieData.cast.length ||
      !movieData.year
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      let uploadedImagePath = null;

      const formData = new FormData();
      formData.append("image", selectedImage);

      const res = await uploadImage(formData).unwrap();

      if (res.path) {
        uploadedImagePath = res.path;
      } else {
        toast.error(res.error || "Image upload failed");
        return;
      }


      await createMovie({
        name: movieData.name,
        description: movieData.description,
        genre: movieData.genre,
        cast: movieData.cast,
        year: movieData.year,
        image: uploadedImagePath,
      }).unwrap();

      toast.success("Movie created and added to DB successfully");

      setMovieData({
        name: "",
        description: "",
        image: null,
        genre: "",
        cast: [""],
        rating: 0,
        year: "",
        reviews: [],
      });
      setSelectedImage(null);
      navigate("/admin/movies-list");
    } catch (error) {
      toast.error(error?.data?.message || error.error || "Something went wrong");
      console.log(error);
    }
  };

  if (isCreatingMovie || isGenresLoading) {
    return <Loader />;
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-zinc-900 text-white px-4 py-10 flex flex-col items-center">
        <div className="w-full max-w-3xl bg-zinc-800 p-8 rounded-2xl shadow-lg mt-10">
          <h2 className="text-3xl font-bold text-center mb-6">🎬 Create a Movie</h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Movie Name */}
            <div>
              <label className="block text-zinc-300 mb-1">Movie Name</label>
              <input
                name="name"
                type="text"
                required
                className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white"
                value={movieData.name}
                onChange={handleChange}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-zinc-300 mb-1">Description</label>
              <textarea
                name="description"
                required
                rows="4"
                className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white"
                value={movieData.description}
                onChange={handleChange}
              />
            </div>

            {/* Release Year */}
            <div>
              <label className="block text-zinc-300 mb-1">Release Year</label>
              <input
                name="year"
                type="number"
                required
                className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white"
                value={movieData.year}
                onChange={handleChange}
              />
            </div>

            {/* Genre */}
            <div>
              <label className="block text-zinc-300 mb-1">Genre</label>
              <select
                name="genre"
                className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white"
                value={movieData.genre}
                onChange={handleChange}
              >
                {genres.genres.map((g) => (
                  <option key={g._id} value={g._id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Cast */}
            <div>
              <label className="block text-zinc-300 mb-2">Cast</label>
              <input
                type="text"
                name="cast"
                value={movieData.cast.join(", ")}
                className="w-full px-4 py-2 mb-2 rounded-lg bg-zinc-700 text-white"
                onChange={(e) =>
                  setMovieData({
                    ...movieData,
                    cast: e.target.value.split(",").map((actor) => actor.trim()),
                  })
                }
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-zinc-300 mb-1">Upload Poster</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
              />
              {selectedImage && (
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Preview"
                  className="mt-4 w-full h-60 object-cover rounded-lg"
                />
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isCreatingMovie}
              className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors text-white py-3 rounded-lg text-lg font-semibold"
            >
              {isCreatingMovie ? "Creating..." : "Create Movie"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateMovie;

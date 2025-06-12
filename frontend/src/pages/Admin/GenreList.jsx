import { useState } from "react";
import {
  useCreateGenreMutation,
  useUpdateGenreMutation,
  useRemoveGenreMutation,
  useListGenresQuery,
} from "../../redux/api/genre";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import Navigation from "../Auth/Navigation.jsx";

const GenreList = () => {
  const { data, isLoading, refetch } = useListGenresQuery();
  const [name, setName] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [updatingName, setUpdatingName] = useState("");

  const [createGenre] = useCreateGenreMutation();
  const [updateGenre] = useUpdateGenreMutation();
  const [removeGenre] = useRemoveGenreMutation();

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Genre name is required");
    try {
      await createGenre({ name }).unwrap();
      toast.success("Genre created successfully");
      setName("");
      refetch();
    } catch {
      toast.error("Failed to create genre");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!updatingName.trim()) return toast.error("Updated name is required");
    try {
      await updateGenre({
        id: selectedGenre._id,
        updateGenre: {
          name: updatingName,
        },
      }).unwrap();
      toast.success("Genre updated");
      setSelectedGenre(null);
      setUpdatingName("");
      refetch();
    } catch {
      toast.error("Failed to update genre");
    }
  };

  const handleDelete = async (id) => {
    try {
      await removeGenre(id).unwrap();
      toast.success("Genre deleted");
      refetch();
    } catch {
      toast.error("Failed to delete genre");
    }
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-zinc-900 text-white p-8 mt-30">
        <div className="mb-6 bg-zinc-800 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Add New Genre</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter genre name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-zinc-700 text-white px-4 py-2 rounded w-full outline-none focus:ring focus:ring-zinc-500"
            />
            <button
              onClick={handleCreate}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
            >
              Add
            </button>
          </div>
        </div>

        {selectedGenre && (
          <div className="mb-6 bg-zinc-800 p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Update Genre</h2>
            <div className="flex gap-4">
              <input
                type="text"
                value={updatingName}
                onChange={(e) => setUpdatingName(e.target.value)}
                className="bg-zinc-700 text-white px-4 py-2 rounded w-full outline-none focus:ring focus:ring-zinc-500"
              />
              <button
                onClick={handleUpdate}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
              >
                Update
              </button>
              <button
                onClick={() => {
                  setSelectedGenre(null);
                  setUpdatingName("");
                }}
                className="bg-zinc-600 hover:bg-zinc-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="bg-zinc-800 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">All Genres</h2>
          {data?.length === 0 ? (
            <p className="text-zinc-400">No genres found.</p>
          ) : (
            <ul className="space-y-2">
              {data?.genres?.map((genre) => (
                <li
                  key={genre._id}
                  className="flex justify-between items-center bg-zinc-700 px-4 py-2 rounded"
                >
                  <span>{genre.name}</span>
                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        setSelectedGenre(genre);
                        setUpdatingName(genre.name);
                      }}
                      className="bg-zinc-500 hover:bg-zinc-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(genre._id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default GenreList;

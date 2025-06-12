import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader.jsx";
import { setCredentials } from "../../redux/features/auth/authSlice.js";
import { useProfileMutation } from "../../redux/api/user.js";
import Navigation from "../Auth/Navigation.jsx";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [profile, { isLoading: profileLoading }] = useProfileMutation();

  useEffect(() => {
    setName(userInfo.name);
    setEmail(userInfo.email);
  }, [userInfo.name, userInfo.email]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await profile({ name, email, password }).unwrap();
      dispatch(setCredentials(res));
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
        <div className="bg-zinc-900 text-white rounded-2xl shadow-xl w-full max-w-md p-8">
          <h2 className="text-3xl font-bold mb-6 text-center">Edit Profile</h2>

          {profileLoading ? (
            <Loader />
          ) : (
            <form onSubmit={submitHandler} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-400"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-400"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-zinc-600 hover:bg-zinc-500 transition-colors rounded-lg text-white font-semibold"
              >
                Update Profile
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Loader from "../../components/Loader.jsx";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../redux/api/user.js";
import { setCredentials } from "../../redux/features/auth/authSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const search = useLocation().search;
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const handleSubmit = async(e) => {
    e.preventDefault();

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("Login successful");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white font-poppins flex flex-col md:flex-row">
      {/* Left side - Signup Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>

          <div>
            <label className="block mb-1 text-sm text-zinc-300">Email</label>
            <input
              type="email"
              name="email"
              placeholder="abc@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-zinc-300 ">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded transition"
          >
            {isLoading ? "logging in..." : "Login"}
          </button>

          {isLoading && <Loader />}

          <p className="text-sm text-center text-zinc-400">
            New to CinemaKada?{" "}
            <Link to={redirect ? `/signup?redirect=${redirect}` : "/signup"} className="text-blue-400 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>

      {/* Right side - Image */}
      <div className="hidden md:block w-full md:w-1/2 relative">
        <img
          src="https://cdn.pixabay.com/photo/2019/10/31/08/26/film-4591329_1280.jpg"
          alt="Signup Visual"
          className="w-full h-full object-cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-900/80 to-transparent" />
      </div>
    </div>
  );
};

export default Login;

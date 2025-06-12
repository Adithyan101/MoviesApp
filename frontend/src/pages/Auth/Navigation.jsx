import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../redux/api/user.js";
import { logout as logoutAction } from "../../redux/features/auth/authSlice.js";
import { toast } from "react-toastify";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const userInfo = useSelector((state) => state.auth.userInfo);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const dropdownRef = useRef();

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logoutAction());
      navigate("/login");
      toast.success("Logout successful");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const navItems = ["Home", "Movies", "Browse"];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-zinc-900 text-white shadow-md sticky top-0 z-50 font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold hover:text-zinc-300">
          🎬 CinemaKada
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-8 font-semibold">
          {navItems.map((text) => {
            const path =
              text === "Home"
                ? "/"
                : text === "Browse"
                ? "/all-movies"
                : `/${text.toLowerCase()}`;
            return (
              <Link
                key={text}
                to={path}
                className="relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-white hover:after:w-full after:transition-all after:duration-300 hover:text-zinc-300"
              >
                {text}
              </Link>
            );
          })}
        </div>

        {/* User/Login & Mobile Toggle */}
        <div className="flex items-center gap-4">
          {userInfo ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 bg-zinc-800 px-4 py-1.5 rounded-md hover:bg-zinc-700"
              >
                <span className="font-light text-sm">Hey,</span>
                <span className="font-medium">{userInfo.name}</span>
                <span className="text-sm">⌄</span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-zinc-900 text-white rounded shadow-lg z-10">
                  {userInfo.isAdmin && (
                    <>
                      <Link
                        to="/admin/movies/dashboard"
                        className="block px-4 py-2 hover:bg-zinc-600"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/admin/users"
                        className="block px-4 py-2 hover:bg-zinc-600"
                      >
                        Manage Users
                      </Link>
                    </>
                  )}
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-zinc-600"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-zinc-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1.5 border border-zinc-600 rounded-lg hover:text-zinc-300"
            >
              Login
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={toggleMenu}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-zinc-800 px-4 pb-4 space-y-2 animate-fade-in-down">
          {navItems.map((text) => {
            const path = text === "Home" ? "/" : `/${text.toLowerCase()}`;
            return (
              <Link
                key={text}
                to={path}
                onClick={() => setIsOpen(false)}
                className="block py-2 border-b border-zinc-700 hover:text-zinc-300"
              >
                {text}
              </Link>
            );
          })}

          {userInfo ? (
            <>
              {userInfo.isAdmin && (
                <>
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block py-2 border-b border-zinc-700"
                  >
                    Admin Dashboard
                  </Link>
                  <Link
                    to="/admin/users"
                    onClick={() => setIsOpen(false)}
                    className="block py-2 border-b border-zinc-700"
                  >
                    Manage Users
                  </Link>
                </>
              )}
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="block py-2 border-b border-zinc-700"
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full text-left py-2 border-b border-zinc-700 text-red-400 hover:text-red-300"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block py-2 border-b border-zinc-700"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navigation;

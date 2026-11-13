import React, { useState } from "react";
import { FaUser, FaShoppingCart } from "react-icons/fa";
import logo from "../assets/logo (2).png";
import { useAuth } from "../context/UserContext";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = () => {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Hamburger state

  // Redirect logic (Fixed admin path to match App.jsx -> /adminpage/details)
  const redirectDashboard = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(false);
    if (auth?.user?.role === "admin" || auth?.user?.isAdmin) {
      navigate("/adminpage/details");
    } else {
      navigate("/user");
    }
  };

  // Handle dropdown toggle
  const handleDropdownToggle = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  // Close dropdown when mouse leaves
  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  // Handle logout logic
  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
    navigate("/");
  };

  return (
    {/* Yahan md:px-6 add kiya hai taaki desktop par dono taraf se spacing mil jaye */}
    <nav className="flex items-center justify-between p-3 md:px-6 sm:m-2 bg-white shadow-md sticky top-0 z-50">
      {/* Brand Logo */}
      <div className="flex items-center space-x-2">
        <Link to="/">
          <img
            src={logo}
            alt="logo"
            className="w-24 sm:w-32 md:w-40 ml-[1rem]"
          />
        </Link>
      </div>

      {/* Navbar Links + Hamburger */}
      <div className="flex items-center justify-between">
        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <Link to="/admin-login" className="text-gray-600 hover:text-gray-900">
            Admin
          </Link>
          <Link to="/user" className="text-gray-600 hover:text-gray-900">
            User
          </Link>
          
          {/* Hotels link - Active only on / */}
          {location.pathname === "/" ? (
            <a href="#hotels" className="text-gray-600 hover:text-gray-900 cursor-pointer">
              Hotels
            </a>
          ) : (
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Hotels
            </Link>
          )}

          <a href="#contact" className="text-gray-600 hover:text-gray-900">
            Contact
          </a>
        </div>

        {/* Hamburger Icon - Mobile */}
        <div
          className="md:hidden cursor-pointer p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg
              className="w-8 h-8 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-8 h-8 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg z-50 p-4 space-y-4 border-t border-gray-100">
          <Link
            to="/"
            className="block text-gray-600 hover:text-gray-900"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/admin-login"
            className="block text-gray-600 hover:text-gray-900"
            onClick={() => setIsMenuOpen(false)}
          >
            Admin
          </Link>
          <Link
            to="/user"
            className="block text-gray-600 hover:text-gray-900"
            onClick={() => setIsMenuOpen(false)}
          >
            User
          </Link>
          <a
            href="#hotels"
            className="block text-gray-600 hover:text-gray-900"
            onClick={() => setIsMenuOpen(false)}
          >
            Hotels
          </a>
          <a
            href="#contact"
            className="block text-gray-600 hover:text-gray-900"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </a>
        </div>
      )}

      {/* Notification & Profile - Yahan md:mr-4 ya md:pr-4 add kar sakte hain agar zaroorat ho */}
      <div className="flex items-center space-x-6 relative md:mr-4">
        {/* Cart */}
        <FaShoppingCart
          size={20}
          className="cursor-pointer text-gray-700 hover:text-black"
          onClick={() => navigate("/cart")}
        />

        {/* User Icon */}
        <div className="cursor-pointer text-gray-700 hover:text-black p-1" onClick={handleDropdownToggle}>
          <FaUser size={20} />
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div
            className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1"
            onMouseLeave={closeDropdown}
          >
            <ul>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                onClick={redirectDashboard}
              >
                Your Profile
              </li>
              {auth?.user ? (
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-red-600 font-medium"
                  onClick={handleLogout}
                >
                  Sign Out
                </li>
              ) : (
                <li
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate("/login");
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700 font-medium"
                >
                  Sign In
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

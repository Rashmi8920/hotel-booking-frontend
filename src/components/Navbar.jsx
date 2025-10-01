import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import logo from "../assets/logo (2).png";
import { useAuth } from "../context/UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import { IoIosHeartEmpty } from "react-icons/io";    //(heart icon)
import {FaShoppingCart}  from "react-icons/fa";

const Navbar = () => {
    const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false); //Hamburger state

  // Redirect logic
  const redirectDashboard = (e) => {
    e.stopPropagation();
    if (auth?.user?.role === "admin") {
      navigate("/admin/details");
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
   <nav className="sm:flex items-center justify-between p-3 sm:m-2 bg-white shadow-md sticky top-0 z-50">
      {/* Brand Logo */}
      <div className="items-center space-x-2">
        <img
          src={logo}
          alt="logo"
          className="w-24 sm:w-32 md:w-40 ml-[1rem]"
        />
      </div>

      {/* Navbar Links + Hamburger */}
      <div className="flex items-center justify-between">
        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6">
          <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
          <a href="/admin-login" className="text-gray-600 hover:text-gray-900">Admin</a>
          <a href="/user" className="text-gray-600 hover:text-gray-900">User</a>
          {/* <a href="#hotels" className="text-gray-600 cursor-none hover:text-gray-900">Hotels</a> */}
          {/* Hotels link - Active only on / or /home */}
      <a
        href={location.pathname == "/" ? "#hotels" : undefined} // Only works on home
        className={`text-gray-600 hover:text-gray-900 ${
           location.pathname == "/" ? "cursor-pointer" : "cursor-default"
        }`}
      >
        Hotels
      </a>
          <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
        </div>

        {/* Hamburger Icon - Mobile */}
        <div
          className="md:hidden cursor-pointer mt-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            // Close Icon
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
            // Hamburger Icon
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
        <div className=" md:hidden absolute top-16 left-0   w-full bg-white shadow-lg z-90 p-4 space-y-4">
          <a href="/" className="block text-gray-600 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>Home</a>
          <a href="/admin-login" className="block text-gray-600 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>Admin</a>
          <a href="/user" className="block text-gray-600 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>User</a>
          <a href="#hotels" className="block text-gray-600 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>Hotels</a>
          <a href="#contact" className="block text-gray-600 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>Contact</a>
        </div>
      )}

      {/* Notification & Profile */}
      <div className="flex items-center   space-x-6 mt-[-24px] sm:mr-[9rem] ml-[15rem] relative">
        {/* Cart / Favorites */}
        <FaShoppingCart
          size={20}
          className="cursor-pointer"
          onClick={() => navigate("/cart")}
        />

        {/* User Icon */}
        <FaUser
          className="cursor-pointer"
          size={20}
          onClick={handleDropdownToggle}
        />

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div
            className="absolute right-0 mt-36 w-48 bg-white border border-gray-200 rounded shadow-lg z-50"
            onMouseLeave={closeDropdown}
          >
            <ul>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={redirectDashboard}
              >
                Your Profile
              </li>
              {auth?.user ? (
                <div
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={handleLogout}
                >
                  Sign Out
                </div>
              ) : (
                <div
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Sign In
                </div>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

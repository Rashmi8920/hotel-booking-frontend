import React, { useState } from "react";
import { FaMapMarkerAlt, FaCalendarAlt, FaUser } from "react-icons/fa";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import BannerImage from "../assets/Rectangle 2.png";
import { useSearch } from "../context/Serach";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useSearch();

  const handelSerach = async (e) => {
    e.preventDefault();
    if (!search.keyword) {
      console.error("Search keyword is missing");
      return;
    }
    try {
      const url = `${import.meta.env.VITE_BASE_URL}/api/booking/search/${
        search.keyword
      }`;
      console.log("Requesting:", url);
      const { data } = await axios.get(url);
      setSearch({ ...search, results: data });
      navigate("/search");
    } catch (error) {
      console.error("Error during search API call:", error);
    }
  };

  return (
    <div
      className="relative w-full h-[500px] bg-cover bg-center"
      style={{ backgroundImage: `url(${BannerImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-white">
        <h1 className="text-3xl font-bold text-center sm:text-4xl">
          Enjoy Your Dream Vacations 
        </h1>
        <p className="mt-2 text-base text-center sm:text-lg">
          Plan and book your perfect trip with expert advice, travel tips,
          destination information, and inspiration from us .
        </p>

        {/* Search Bar */}
        <div className="mt-8 w-[300px] sm:p-4 p-2 max-w-[50rem] sm:w-[80%] md:w-[60%] bg-white rounded-lg shadow-lg flex items-center sm:space-x-4 space-x-2 sm:mr-0 mr-46">
          <input
            type="text"
            placeholder="Search destinations..."
            className="flex-grow p-1 text-black bg-white border border-gray-300 rounded-md sm:p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 "
            value={search.keyword}
            onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
          />
          <button
            onClick={handelSerach}
            className="p-1 py-1 font-medium text-white transition bg-blue-600 rounded-md sm:px-4 sm:py-2 hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;

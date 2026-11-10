import React from "react";
import { FaUser, FaPlus, FaTimesCircle, FaMap } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const navbarMenu = [
  { id: 1, name: "User Details", link: "/user", icon: <FaUser /> },
  { id: 2, name: "Your Order", link: "/user/your-order", icon: <FaPlus /> },
  { id: 3, name: "Your Bookings", link: "/user/all-booking",  icon: <FaMap /> },
];

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="bg-gray-800 text-white w-[12rem] sm:w-[15rem] h-full min-h-[28rem] border-r border-gray-700 sm:ml-0 ml-6 p-1 flex flex-col justify-between">
        <nav className="flex flex-col p-5 space-y-4">
          {navbarMenu.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className="flex items-center p-3 ml-10 duration-300 rounded-lg tran9ition-colors hover:bg-gray-700 sm:ml-1"
            >
             <span className="mr-3 text-xl">{item.icon}</span>
              <span className="text-[13px] sm:text-base">{item.name}</span> 
            </Link>
          ))}
        </nav>

        
      </div>
    </>
  );
};

export default Navbar;
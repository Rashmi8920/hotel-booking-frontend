import React, { useState } from "react";
import { FaUser, FaPlus, FaList, FaFolder, FaMap } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi"; // Hamburger & Close icon
const navbarMenu = [
  { id: 1, name: "Admin Details", link: "/adminpage/details", icon: <FaUser /> },
  { id: 2, name: "Create Post", link: "/adminpage/create-post", icon: <FaPlus /> },
  { id: 3, name: "All Posts", link: "/adminpage/all-post", icon: <FaList /> },
  {
    id: 4,
    name: "Create Category",
    link: "/adminpage/create-category",
    icon: <FaFolder />,
  },
  { id: 5, name: "All Booking (order)", link: "/adminpage/all-booking", icon: <FaMap /> },
];

const 
Navbar = () => {
   const [isOpen, setIsOpen] = useState(false); //Sidebar toggle state
  return (
    //  all navbar
    <div className=" bg-gray-800  sm:ml-0 ml-[-28px] text-white w-[13rem] mt-10 sm:mt-0  h-full min-h-[28rem] border-r border-gray-700 md:mr-0 sticky top-20 z-30  m-[-50px] md:m-0 sm:mr-0 mr-[-8px] sm:mb-0 mb-[10px] ">
      <nav className="flex flex-col p-5 space-y-4">
        {navbarMenu.map((item) => (
          <Link
            key={item.id}
            to={item.link}
            className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-300"
          >
            <span className="mr-3 text-xl">{item.icon}</span>
            <span className="text-md">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Navbar;

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
CreateNavbar = () => {
   const [isOpen, setIsOpen] = useState(false); //Sidebar toggle state
  return (
    //  all navbar
    // <div className=" bg-gray-800  text-white w-[13rem] mt-12 sm:mt-0  h-full min-h-[28rem] border-r border-gray-700 md:mr-0 sticky top-20 z-50 mr-[-8px] m-[-50px] md:m-0 ">
    //   <nav className="flex flex-col p-5 space-y-4">
    //     {navbarMenu.map((item) => (
    //       <Link
    //         key={item.id}
    //         to={item.link}
    //         className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-300"
    //       >
    //         <span className="mr-3 text-xl">{item.icon}</span>
    //         <span className="text-md">{item.name}</span>
    //       </Link>
    //     ))}
    //   </nav>
    // </div>
    // allpost navbar
     <div className="relative">
      {/* ====== Hamburger Icon - Mobile Only ====== */}
      <div
        className="md:hidden p-4 cursor-pointer absolute top-2 left-2 z-40 bg-gray-800 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <FiX className="text-white text-2xl" /> // Close icon
        ) : (
          <FiMenu className="text-white text-2xl" /> // Hamburger icon
        )}
      </div>

      {/* ====== Sidebar ====== */}
      <div
        className={`bg-gray-800 text-white w-[13rem] mt-12 sm:mt-0 sm:min-h-[28rem] border-r border-gray-700  h-[400px]
          transform transition-transform duration-300 sticky  top-10 z-20
          md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:mr-0 mr-[-20px] m-[-50px] md:m-0`}
      >
        <nav className="flex flex-col p-5 space-y-4">
          {navbarMenu.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              onClick={() => setIsOpen(false)} // Click hone par sidebar band
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-300"
            >
              <span className="mr-3 text-xl">{item.icon}</span>
              <span className="text-md">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default CreateNavbar;

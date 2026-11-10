import React from "react";
import Details from "./Details";
import Navbar from "./Navbar";

const DashBoard = () => {
  return (
    <div className="flex justify-center items-start p-10 bg-gray-50 min-h-screen">
      <div className="flex shadow-lg rounded-lg overflow-hidden bg-white min-h-[28rem] w-[82rem]">
       <div className="ml-6 "> <Navbar /></div> {/*chaNGES GIBNWE*/}
        <Details />
      </div>
    </div>
  );
};

export default DashBoard;

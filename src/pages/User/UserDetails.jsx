import React from "react";
import { useAuth } from "../../context/UserContext";

const UserDetails = () => {
  const [auth] = useAuth();
  const user = {
    name: auth?.user?.name || "N/A",
    email: auth?.user?.email || "N/A",
  };

  return (
    <div className="p-8 max-w-[250px] bg-white mt-0  ">
      <h2 className="text-2xl font-bold text-gray-800  mr-1 mb-6 text-center  ">
        User Details
      </h2>
      <div className="sm:space-y-4 space-y-1">
        <div className="flex items-center">
          <span className="font-semibold text-gray-800 w-24">Name :</span>
          <span className="text-gray-600  ml-[-39px]">{user.name}</span>
        </div>
        <div className="flex items-center">
          <p className="font-semibold text-gray-800 ">Email: </p> 
         
            <p className="text-gray-600 sm:ml-2 mt-1 sm:mt-0  ml-[9px] text-base sm:overflow-visible overflow-x-scroll " > {user.email}</p>
       
        </div>
      </div>
    </div>
  );
};

export default UserDetails;

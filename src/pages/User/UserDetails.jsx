import React from "react";
import { useAuth } from "../../context/UserContext";

const UserDetails = () => {
  const [auth] = useAuth();
  const user = {
    name: auth?.user?.name || "N/A",
    email: auth?.user?.email || "N/A",
  };

  return (
    <div className="p-8 max-w-[250px] bg-white mt-0 sm:mr-0 mr-5 ">
      <h2 className="mb-6 mr-1 text-xl font-bold text-center text-gray-800 sm:text-2xl">
        User Details
      </h2>
      <div className="space-y-1 sm:space-y-4">
        <div className="flex items-center">
          <span className="w-24 font-semibold text-gray-800">Name :</span>
          <span className="text-gray-600  ml-[-39px] capitalize">{user.name}</span>
        </div>
        <div className="flex items-center">
          <p className="font-semibold text-gray-800 ">Email: </p> 
      {/* Only for mobile */}
            <br className="sm:hidden " />   
            <p className="text-gray-600 sm:ml-2 mt-1 sm:mt-0  ml-[9px] text-base sm:overflow-visible overflow-x-scroll  " > {user.email}</p>
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;

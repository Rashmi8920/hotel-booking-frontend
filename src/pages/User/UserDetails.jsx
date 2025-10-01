import React from "react";
import { useAuth } from "../../context/UserContext";

const UserDetails = () => {
  const [auth] = useAuth();
  const user = {
    name: auth?.user?.name || "N/A",
    email: auth?.user?.email || "N/A",
  };

  return (
    <div className="p-8 max-w-[250px] bg-white mt-0 sm:mr-0 mr-9  ">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        User Details
      </h2>
      <div className="space-y-4">
        <div className="flex items-center">
          <span className="font-semibold text-gray-800 w-24">Name :</span>
          <span className="text-gray-600  ml-[-39px]">{user.name}</span>
        </div>
        <div className="flex items-center">
          <span className="font-semibold text-gray-800 w-24">Email :</span>
          <span className="text-gray-600"> {user.email}</span>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;

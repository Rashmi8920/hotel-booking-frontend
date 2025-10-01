import React, { useState } from 'react'
import { toast } from "react-toastify";
import { Navigate, useNavigate } from 'react-router-dom';
const AdminLogin = () => {
      const [email, setEmail] = useState("")
        const [password, setPassword] = useState("");
          const navigate = useNavigate(); // <-- useNavigate hook

  const handleSubmit=async(e)=>{ 
 e.preventDefault();
  if(email=="admin@gmail.com" && password=="admin"){
      toast.success("Login successful");
      navigate("/adminpage")
  }else{
   toast.error("Admin email and password does not match  ");
  }
  }

  return (
    <div className="flex items-center justify-center bg-gray-100 pt-10 pb-10">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign in</h2>

        <form 
        onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label className=" block text-sm font-medium text-gray-700">
            Admin  Email 
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border bg-white text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border bg-white text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          {/* {error && <p className="text-red-500 text-sm mt-2">{error}</p>} */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin

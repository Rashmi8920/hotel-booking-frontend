import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { toast } from "react-toastify";
import { FaRegCalendarAlt, FaRegMoneyBillAlt, FaUserAlt } from "react-icons/fa";

const AllTrip = () => {
  const [bookingList, setAllBookingList] = useState([]);
console.log("booking list on admin",bookingList)

  const getAllTrip = async () => {
    try{
      const authData = JSON.parse(localStorage.getItem("auth"));
const token = authData?.token;
    // const token = localStorage.getItem("token"); // Or context se token lo
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

 const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/booking/get-all-bookings`,
      {
        headers:{
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("all booking console alltrip.jsx",response.data )
    setAllBookingList(response.data.bookings);
    }
    catch(error){
  console.error("Error fetching bookings:", error.message);
    } 
  };

  useEffect(() => {
    getAllTrip();
  }, []);

  //delete booking
  const handleDelete = async (bookingId) => {
    try {
      const authData = JSON.parse(localStorage.getItem("auth"));
      const token = authData?.token;

      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/booking/delete-booking/${bookingId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Booking deleted & hotel is now available!");

      // Remove deleted booking from state
      setAllBookingList(bookingList.filter((b) => b._id !== bookingId));
    } catch (error) {
      toast.error("Failed to delete booking");
    }
  };


  return (
    <div className="flex p-4">
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-6 mt-6 w-full ml-8">
        {bookingList.map((booking) => (
          <div
            key={booking._id}
            className="max-w-sm rounded  overflow-hidden shadow-lg bg-white border border-gray-200 sm:h-80 h-80"
          >
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">title -
               {booking.post?.title}
              </h2>
              <p className="text-gray-600 text-sm mt-2">
                <FaRegCalendarAlt className="inline-block mr-2" />
                {new Date(booking.bookingDate||new Date(booking.bookingDate).toLocaleDateString()).toLocaleDateString()}
              </p>
              {/* <p className="text-gray-600 text-sm mt-2">
                <FaRegMoneyBillAlt className="inline-block mr-2" />
                Payment Status: {booking.paymentStatus}
              </p> */}
              <p className="text-gray-600 text-sm mt-2">
                <FaUserAlt className="inline-block mr-2" />
                User : {booking.customerName}
              </p>
              <p className="text-gray-600 text-sm mt-2">
                Status : {" "}
                <span
                  className={`${
                    booking.status === "pending"
                      ? "text-yellow-500"
                      : "text-green-500"
                  } font-bold`}
                >
                  {booking.status}
                </span>
              </p>
              {/* delete btn */}
              <button
              onClick={()=>handleDelete(booking._id)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                  Delete Booking
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllTrip;

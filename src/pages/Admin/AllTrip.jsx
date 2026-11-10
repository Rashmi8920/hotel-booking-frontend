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
    // console.log("backned",VITE_BASE_URL)
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
      <div className="grid w-full grid-cols-1 gap-6 mt-6 ml-8 md:grid-cols-2 lg:grid-cols-3 ">
        {bookingList.map((booking) => (
          <div
            key={booking._id}
            className="max-w-sm overflow-hidden bg-white border border-gray-200 rounded shadow-lg sm:h-80 h-80"
          >
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">Title -
               {booking.post?.title}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                <FaRegCalendarAlt className="inline-block mr-2" />
                {new Date(booking.bookingDate||new Date(booking.bookingDate).toLocaleDateString()).toLocaleDateString()}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                <FaRegMoneyBillAlt className="inline-block mr-2" />
                Payment Status: {booking.paymentStatus}
              </p>
              <p className="mt-2 text-sm text-gray-600 capitalize">
                <FaUserAlt className="inline-block mr-2" />
                User : {booking.user.name}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Status : {" "}
                <span
  className={`font-bold ${
    booking.status === "confirmed"
      ? "text-green-500"
      : booking.status === "pending"
      ? "text-yellow-500"
      : "text-red-500"
  }`}
>
  {booking.status}
</span>
              </p>
              {/* delete btn */}
              <button
              onClick={() =>handleDelete(booking._id)}
              className="px-4 py-2 mt-4 text-white bg-red-500 rounded hover:bg-red-600"
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

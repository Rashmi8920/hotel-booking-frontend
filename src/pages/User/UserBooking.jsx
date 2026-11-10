import React, { useEffect, useState } from "react";
import Navbar from "./Navbar"; // Apne Navbar ka sahi path de dena
import axios from "axios";
import { toast } from "react-toastify";
import { FaRegCalendarAlt, FaRegMoneyBillAlt, FaUserAlt } from "react-icons/fa";

const UserBooking = () => {
  const [bookingList, setAllBookingList] = useState([]);
  const [loading, setLoading] = useState(true);

const getUserTrips = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem("auth"));
      const token = authData?.token;

      // 1. Check karein ki token mil raha hai ya nahi
      console.log("Frontend Token found:", token ? "Yes (Token exists)" : "No (Token is missing)");

      if (!token) {
        toast.error("Please login to view your orders.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/booking/get-user-bookings`, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
        }
      );

      // 2. Yahan backend ka poora response print karein
      console.log("Backend Full Response Data:", response.data);

      setAllBookingList(response.data.bookings || response.data);
    } catch (error) {
      // 3. Agar koi error aaye toh usko print karein
      console.error("Error fetching user bookings:", error.response?.data || error.message);
      toast.error("Failed to load your bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserTrips();
  }, []);

  // Agar user ko apni booking cancel/delete karni ho (optional)
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

      toast.success("Booking cancelled successfully!");
      setAllBookingList(bookingList.filter((b) => b._id !== bookingId));
    } catch (error) {
      toast.error("Failed to cancel booking");
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-2 sm:flex-row bg-gray-50 sm:p-4">
      <Navbar />
      <div className="flex-1 p-2 sm:p-6">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Your Orders / Bookings</h1>

        {loading ? (
          <p className="text-gray-600">Loading your bookings...</p>
        ) : bookingList.length === 0 ? (
          <p className="text-gray-600">You have no bookings yet.</p>
        ) : (
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookingList.map((booking) => (
              <div
                key={booking._id}
                className="flex flex-col justify-between p-5 bg-white border border-gray-200 rounded-lg shadow-md"
              >
                <div>
                  <h2 className="mb-3 text-lg font-semibold text-gray-800">
                    {booking.post?.title || "Hotel Booking"}
                  </h2>
                  <p className="mb-2 text-sm text-gray-600">
                    <FaRegCalendarAlt className="inline-block mr-2 text-gray-500" />
                    {booking.bookingDate
                      ? new Date(booking.bookingDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p className="mb-2 text-sm text-600">
                    <FaRegMoneyBillAlt className="inline-block mr-2 text-gray-500" />
                    Payment: <span className="font-medium capitalize">{booking.paymentStatus}</span>
                  </p>
                  <p className="mb-2 text-sm text-gray-600">
                    Status:{" "}
                    <span
                      className={`font-bold capitalize ${
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
                </div>

                {/* Cancel / Delete Button */}
                <button
                  onClick={() => handleDelete(booking._id)}
                  className="self-start px-4 py-2 mt-4 text-sm text-white transition duration-200 bg-red-500 rounded hover:bg-red-600"
                >
                  Cancel Booking
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBooking;
import React, { useEffect } from "react";
import { useBook } from "../context/Booking";
import { FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./User/Navbar";
import { useAuth } from "../context/UserContext";
import axios from "axios";

const YourOrder = () => {
  const navigate = useNavigate();
  const [book, setBook] = useBook();
  const [auth] = useAuth();

  const userName = auth?.user?.name;
  // Fetch bookings from backend
  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/booking/get-all-bookings`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      console.log("API response from get-all-bookings:", res.data);

      if (res.data.bookings && Array.isArray(res.data.bookings)) {
        // Merge backend bookings + local bookings
        setBook((prev) => {
          const merged = [...res.data.bookings, ...prev];
          // Remove duplicates based on booking _id
          const unique = merged.filter(
            (value, index, self) =>
              index === self.findIndex((t) => t._id === value._id)
          );
          return unique;
        });
      }
      else {
        console.warn("No bookings found from backend, keeping local data");
      }
    } catch (err) {
      console.error("Error fetching user bookings:", err);
      toast.error("Failed to fetch bookings");
    }
  };

  // Call fetchBookings when token is available
  useEffect(() => {
    if (auth.token) {
      // localStorage.removeItem("booking"); // clear stale data
      fetchBookings();
    }
  }, [auth.token]);

  // Handle checkout
  const handleCheckout = async (orderId, postId) => {
    console.warn("post id // order id", { postId, orderId });

    if (!orderId || !postId) {
      toast.error("Order ID or Post ID is missing!");
      return;
    }

    try {
      if (!auth.token) {
        toast.error("User not authenticated");
        return;
      }
      const completedBooking = book.find((item) => item._id === orderId);
      if (!completedBooking) {
        toast.error("Booking not found");
        return;
      }
      //prevent dublicate booking
      if (completedBooking === "successfull") {
        toast.error("This room has already been booked !....")
        return;
      }
      const payload = {
        postId,
        bookingDate: new Date().toISOString(),
        transactionId: `TXN-${Date.now()}`,
        amount: completedBooking.amount,
      };

      console.log("Payload booking sent to backend:", payload);

      // Save booking to backend
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/booking/create-booking`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      console.log("Create booking response api:", response.data);

      const savedBooking = response.data.booking;
      if (savedBooking) {
        toast.success("Booking saved to backend");
        // Merge with existing bookings
        setBook((prev) => [...prev, savedBooking]);
        // setBook((prev) => {
        //   const merged = [...prev, savedBooking];
        //   const unique = merged.filter(
        //     (value, index, self) =>
        //       index === self.findIndex((t) => t._id === value._id)
        //   );
        //   return unique;
        // });
        // Refresh bookings for ui updated in backend
        await fetchBookings();
        //clean old data
        localStorage.removeItem("booking");

        navigate("/thank-you");

      } else {
        toast.error("Failed to save booking to backend");
      }

      // Update local state and localStorage
      // setBook((prev) => {
      //   const updated = [
      //     ...prev,
      //     {
      //       _id: Date.now().toString(), // temporary unique id
      //       post: {
      //         _id:postId,
      //         title: completedBooking?.post?.title || "untitled",
      //       },
      //       amount: completedBooking.amount,
      //     },
      //   ];
      //   localStorage.setItem("booking", JSON.stringify(updated));
      //   return updated;
      // });

      // navigate("/thank-you");
    } catch (error) {
      console.error(
        "Error during checkout:",
        error.response?.data || error.message
      );
      toast.error("Failed to complete the order. Please try again.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row mt-6">
      <div className="lg:w-1/4 w-full ml-12">
        <Navbar />
      </div>

      <div className="lg:w-3/4 w-full p-4 lg:p-8 bg-gray-50">
        {book && Array.isArray(book) && book.length > 0 ? (
          book.map((order) => {
            console.log("all Booking map alltrip:", order);
            console.log("Booking ID:", order?._id);
            console.log("Post ID:", order?.post?._id);

            return (
              <div
                key={order?._id}
                className="bg-white shadow-lg rounded-lg p-6 max-w-screen-md mx-auto mb-6 transition-transform transform hover:scale-105 hover:shadow-xl"
              >
                <h1 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-6 text-center">
                  Order: {order?.post?.title || order.title || "No title available"}
                </h1>

                <div className="mb-4">
                  <p className="text-gray-600 text-lg">
                    <span className="font-semibold">Customer:</span> {userName}
                  </p>
                  <p className="text-gray-600 text-lg">
                    <span className="font-semibold">Price:</span> {order.amount}
                  </p>
                </div>

                <div className="flex justify-center lg:justify-between items-center">
                  <button
                    className="bg-blue-600 text-white py-2 px-6 rounded-lg flex items-center gap-2 shadow hover:bg-blue-700 transition"
                    onClick={() =>
                      handleCheckout(order?._id || null, order.post?._id || null)
                    }
                    disabled={order.status == "successfull"}
                  >
                    <FaShoppingCart />
                    <span>{order.status == "successfull" ? "Already Booked" : "checkout"}</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-600 text-lg text-center">No orders found</p>
        )}
      </div>
    </div>
  );
};

export default YourOrder;
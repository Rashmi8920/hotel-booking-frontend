import React, { useEffect, useState } from "react";
import { useBook } from "../context/Booking";
import { FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Navbar from "./User/Navbar";
import { useAuth } from "../context/UserContext";
import axios from "axios";
import { FaStar, FaTimes } from "react-icons/fa";

const YourOrder = () => {

  const navigate = useNavigate();
  const [book, setBook] = useBook();
  console.log("book", book)
  const [auth] = useAuth();
  const userName = auth?.user?.name;

  // States for Review Modal
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedOrderForReview, setSelectedOrderForReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleOpenReviewModal = (order) => {
    setSelectedOrderForReview(order);
    setIsReviewOpen(true);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    // Yahan apni Review submit karne ki API call likhein (Axios POST/PUT)
    console.log("Submitting review for order:", selectedOrderForReview?._id);
    console.log("Rating:", rating, "Comment:", comment);

    // Success ke baad modal band kar dein
    setIsReviewOpen(false);
    setComment("");
    alert("Review submitted successfully!");
  };


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

      if (Array.isArray(res.data.bookings)) {
        setBook(res.data.bookings);
      } else {
        console.warn("No bookings found from backend, keeping local data");
        setBook([])
      }
    } catch (err) {
      console.error("Error fetching user bookings:", err);
      toast.error("Failed to fetch bookings");
    }
  };

  useEffect(() => {
    if (auth.token) {
      localStorage.removeItem("booking"); // Clear stale local data
      fetchBookings();
    }
  }, [auth.token]);


  // Handle checkout
  const handleCheckout = async (orderId, postId) => {

    console.log("Checkout clicked:", {
      orderId,
      postId,
    });

    if (!orderId || !postId) {
      toast.error("Booking ID or Hotel ID is missing!");
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/booking/checkout/${orderId}`,
        {
          postId,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      // console.log("Checkout response:", response.data);

      if (response.data.success) {
        toast.success("Checkout completed successfully!");

        // Refresh bookings
        await fetchBookings();

        // Go to thank-you page
        navigate("/thank-you");
      }
    } catch (error) {
      console.error(
        "Checkout error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
        "Failed to complete checkout."
      );
    }
  };
  const activeBookings = Array.isArray(book)
    ? book.filter((order) => order?.status !== "checked-out")
    : [];
  return (
    <div className="flex flex-col mt-6 lg:flex-row">
      {/* Sidebar */}
      <div className="w-full ml-12 lg:w-1/4">
        <Navbar />
      </div>

      {/* Orders Section */}
      <div className="w-full p-4 mt-5 lg:w-3/4 lg:p-8 bg-gray-50 sm:mt-0">

        {activeBookings.length > 0 ? (
          activeBookings.map((order) => {
            console.log(
              "Booking:",
              order
            );

            return (
              <div
                key={order?._id}
                className="max-w-screen-md p-6 mx-auto mb-6 transition-transform transform bg-white rounded-lg shadow-lg hover:scale-105 hover:shadow-xl"
              >
                <h1 className="mb-6 text-2xl font-semibold text-center text-gray-800 lg:text-3xl">
                  Order: {order?.post?.title || order.title || "No title available"}
                </h1>

                <div className="mb-4">
                  <p className="text-lg text-gray-600">
                    <span className="font-semibold">Customer:</span> {userName}
                  </p>
                  <p className="text-lg text-gray-600">
                    {/* <span className="font-semibold">Price:</span> ${order.amount?.toFixed(2) || "0.00"} */}
                    <span className="font-semibold">
                      Price:
                    </span>{" "}
                    ₹{Number(order?.amount || 0).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center justify-center lg:justify-between">
                  <button
                    className="flex items-center gap-2 px-6 py-2 text-white transition bg-blue-600 rounded-lg shadow cursor-pointer hover:bg-blue-700"
                    onClick={() => handleCheckout(order?._id || null, order.post?._id || null)}
                  >
                    <FaShoppingCart />
                    <span>Checkout</span>
                  </button>

                  {/* Write a Review Button (Without status check) */}
                  <button
                    onClick={() => handleOpenReviewModal(order)}
                    className="flex items-center gap-2 px-6 py-2 text-white transition rounded-lg shadow cursor-pointer bg-amber-600 hover:bg-amber-700 "
                  >
                    <FaStar /> Write a Review
                  </button>          
                        </div>
                        {/* --- REVIEW MODAL POPUP (Jab isReviewOpen true hoga tab dikhega) --- */}
      {isReviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center mt-12 bg-black/50">
          <div className="relative w-full max-w-md p-6 mt-10 bg-white border-2 border-gray-300 shadow-xl rounded-xl">
            <button 
              onClick={() => setIsReviewOpen(false)}
              className="absolute text-xl text-gray-500 top-4 right-4 hover:text-black"
            >
              <FaTimes />
            </button>

            <h3 className="mb-4 text-xl font-bold text-gray-800">Write a Review</h3>
            
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">Rating (1 to 5 Stars)</label>
                <div className="flex gap-2 text-2xl cursor-pointer text-amber-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} onClick={() => setRating(star)}>
                      {star <= rating ? "★" : "☆"}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">Your Feedback</label>
                <textarea
                  rows="4"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
              </div>
            );
          })
        ) : (
          <p className="text-lg text-center text-gray-600">No orders found</p>
        )}
      </div>
    </div>
  );
};

export default YourOrder;




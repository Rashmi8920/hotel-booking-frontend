import React, { useEffect } from "react";
import { useBook } from "../context/Booking";
import { FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Navbar from "./User/Navbar";
import { useAuth } from "../context/UserContext";
import axios from "axios";

const YourOrder = () => {
  const navigate = useNavigate();
  const [book, setBook] = useBook();
  console.log("book",book)
  const [auth] = useAuth();
  const userName = auth?.user?.name;

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
        setBook(res.data.bookings)
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
    console.warn("post id // order id", { postId, orderId });

    if (!orderId || !postId) {
      toast.error("Order ID or Post ID is missing!");
      return;
    }

    try {
      const completedBooking = book.find((item) => item._id === orderId);

      if (!completedBooking) {
        toast.error("Booking not found");
        return;
      }

      // Prevent duplicate booking
      if (completedBooking.status === "successfull") {
        toast.error("This room has already been booked!....");
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
          },  } );

      console.log("Create booking response api:", response.data);

      const savedBooking = response.data.booking;

      if (savedBooking) {
        toast.success("Booking saved to backend");

        // setBook((prev) => {
        //   const merged = [...prev, savedBooking];
        //   const unique = merged.filter(
        //     (value, index, self) =>
        //       index === self.findIndex((t) => t._id === value._id)
        //   );
        //   return unique;
        // });
        await fetchBookings();

        navigate("/thank-you"); 
      } else {
        toast.error("Failed to save booking to backend");
      }
    } catch (error) {
      console.error("Error during checkout:", error.response?.data || error.message);
      toast.error("Failed to complete the order. Please try again.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row mt-6">
      {/* Sidebar */}
      <div className="lg:w-1/4 w-full ml-12">
        <Navbar />
      </div>

      {/* Orders Section */}
      <div className="lg:w-3/4 w-full p-4 lg:p-8 bg-gray-50 sm:mt-0 mt-5">
        {book && Array.isArray(book) && book.length > 0 ? (
          book.map((order) => {
            console.log("Booking map alltrip:", order);
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
                    onClick={() => handleCheckout(order?._id || null, order.post?._id || null)}
                    disabled={order.status === "successfull"}
                  >
                    <FaShoppingCart />
                    <span>
                      {order.status === "successfull" ? "Already Booked" : "Checkout"}
                    </span>
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


// import React, { useEffect } from "react"       ;
// import { useBook } from "../context/Booking";
// import { FaShoppingCart } from "react-icons/fa";
// import { toast } from "react-toastify";
// import { useLocation, useNavigate } from "react-router-dom";
// import Navbar from "./User/Navbar";
// import { useAuth } from "../context/UserContext";
// import axios from "axios";

// const YourOrder = () => {
//   const navigate = useNavigate();
//   const [book, setBook] = useBook();
//   const [auth] = useAuth();
//   const userName = auth?.user?.name;

//   // Fetch bookings from backend
//   const fetchBookings = async () => {
//     try {
//       const res = await axios.get(
//         `${import.meta.env.VITE_BASE_URL}/api/booking/get-all-bookings`,
//         {
//           headers: {
//             Authorization: `Bearer ${auth.token}`,
//           },
//         }
//       );

//       console.log("API response from get-all-bookings:", res.data);

//        if (res.data.bookings && Array.isArray(res.data.bookings)) {
//       // merge backend + local state
//       setBook((prev) => {
//         const merged = [...res.data.bookings, ...prev];
//         const unique = merged.filter(
//           (value, index, self) =>
//             index === self.findIndex((t) => t._id === value._id)
//         );
//         return unique;
//       });
//     }  else {
//         console.warn("No bookings found from backend, keeping local data");
//       }
//     } catch (err) {
//       console.error("Error fetching user bookings:", err);
//       toast.error("Failed to fetch bookings");
//     }
//   };

//   // Call fetchBookings when token is available
//   useEffect(() => {
//     if (auth.token) {
//       // localStorage.removeItem("booking"); // clear stale data
//       fetchBookings();
//     }
//   }, [auth.token]);

//   // Handle checkout
//   const handleCheckout = async (orderId, postId) => {
//     console.warn("post id // order id", { postId, orderId });

//     if (!orderId || !postId) {
//       toast.error("Order ID or Post ID is missing!");
//       return;
//     }

//     try {
//       if (!auth.token) {
//         toast.error("User not authenticated");
//         return;
//       }

//       const completedBooking = book.find((item) => item._id === orderId);
//       if (!completedBooking) {
//         toast.error("Booking not found");
//         return;
//       }

//       // Prevent duplicate booking
//       if (completedBooking === "successfull") {
//         toast.error("This room has already been booked !....");
//         return;
//       }

//       const payload = {
//         postId,
//         bookingDate: new Date().toISOString(),
//         transactionId: `TXN-${Date.now()}`,
//         amount: completedBooking.amount,
//       };

//       console.log("Payload booking sent to backend:", payload);

//       // Save booking to backend
//       const response = await axios.post(
//         `${import.meta.env.VITE_BASE_URL}/api/booking/create-booking`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${auth.token}`,
//           },
//         }
//       );

//       console.log("Create booking response api:", response.data);

//       const savedBooking = response.data.booking;
//       if (savedBooking) {
//         toast.success("Booking saved to backend");
      
//           setBook((prev) => {
//     const merged = [...prev, savedBooking];
//     // remove duplicates based on booking _id
//     const unique = merged.filter(
//       (value, index, self) =>
//         index === self.findIndex((t) => t._id === value._id)
//     );
//     return unique;
//   });

//   // setBook(savedBooking)
//         localStorage.removeItem("booking");
//        // await fetchBookings(); // Refresh bookings for UI updated
//         navigate("/thank-you");
//       } else {
//         toast.error("Failed to save booking to backend");
//       }
//     } catch (error) {
//       console.error(
//         "Error during checkout:",
//         error.response?.data || error.message
//       );
//       toast.error("Failed to complete the order. Please try again.");
//     }
//   };

//   return (
//     <div className="flex flex-col lg:flex-row mt-6">
//       <div className="lg:w-1/4 w-full ml-12">
//         <Navbar />
//       </div>

//       <div className="lg:w-3/4 w-full p-4 lg:p-8 bg-gray-50">
//         {book && Array.isArray(book) && book.length > 0 ? (
//           book.map((order) => {
//             console.log("Booking map alltrip:", order);
//             console.log("Booking ID:", order?._id);
//             console.log("Post ID:", order?.post?._id);

//             return (
//               <div
//                 key={order?._id}
//                 className="bg-white shadow-lg rounded-lg p-6 max-w-screen-md mx-auto mb-6 transition-transform transform hover:scale-105 hover:shadow-xl"
//               >
//                 <h1 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-6 text-center">
//                   Order: {order?.post?.title || order.title || "No title available"}
//                 </h1>

//                 <div className="mb-4">
//                   <p className="text-gray-600 text-lg">
//                     <span className="font-semibold">Customer:</span> {userName}
//                   </p>
//                   <p className="text-gray-600 text-lg">
//                     <span className="font-semibold">Price:</span> {order.amount}
//                   </p>
//                 </div>

//                 <div className="flex justify-center lg:justify-between items-center">
//                   <button
//                     className="bg-blue-600 text-white py-2 px-6 rounded-lg flex items-center gap-2 shadow hover:bg-blue-700 transition"
//                     onClick={() =>
//                       handleCheckout(order?._id || null, order.post?._id || null)
//                     }
//                     disabled={order.status === "successfull"}
//                   >
//                     <FaShoppingCart />
//                     <span>
//                       {order.status === "successfull"
//                         ? "Already Booked"
//                         : "checkIn"}
//                     </span>
//                   </button>
//                 </div>
//               </div>
//             );
//           })
//         ) : (
//           <p className="text-gray-600 text-lg text-center">No orders found</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default YourOrder;



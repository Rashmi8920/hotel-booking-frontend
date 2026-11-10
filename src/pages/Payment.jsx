import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { json, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useBook } from "../context/Booking";
import { useAuth } from "../context/UserContext";
import { useCart } from "../context/Cart";

const Payment = () => {
  const stripe = useStripe(); const elements = useElements();
  const location = useLocation();
  const navigate = useNavigate();
  const [book, setBook] = useBook();  //useBook([]) 
  const [cart, setCart] = useCart();
  const [auth] = useAuth();

  const [loading, setLoading] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [amount, setAmount] = useState(0);
  const [title, setTitle] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState({
    line1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  // Fetch product title and price dynamically from location state
  useEffect(() => {
    if (location?.state) {
      setAmount(location.state.totalPrice || 0)   // console.log(location.state.totalPrice)
      setTitle(location.state.products.map(p => p.title).join(", "));
      if (location.state.products?.length > 0) {
        console.log(" Post ID:", location?.state.products.map(p => p.postId)); // Debugging purpose
      } else {
        console.error("Post ID is missing in location.state");
      }
    }
  }, [location]);

  const handleCountryCodeConversion = (country) => {
    const countryMapping = {
      India: "IN",
    };
    return countryMapping[country] || country;
  };

//  handle payment function==================================
const handlePayment = async (e) => {
  e.preventDefault();

  if (!stripe || !elements) {
    toast.error("Stripe has not loaded yet. Please try again.");
    return;
  }
 // CHECK CARD DETAILS
  if (!cardComplete) {
    toast.error("Please enter complete card details.");
    return;
  }
 // CHECK CUSTOMER DETAILS
  if (
    !customerName ||
    !customerAddress.line1 ||
    !customerAddress.city ||
    !customerAddress.country
  ) {
    toast.error("Please fill out all the required fields.");
    return;
  }
   // CHECK PRODUCTS
  // ==========================================
  if (!location.state?.products?.length) {
    toast.error("No hotel selected for booking.");
    return;
  }

  setLoading(true);

  try {
    const convertedCountry = handleCountryCodeConversion(
      customerAddress.country
    );

    console.log("Converted Country:", convertedCountry);
    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      toast.error("Card details are not available.");
      setLoading(false);
      return;
    }

    // ==========================================
    // CREATE PAYMENT METHOD
    // ==========================================

    const { paymentMethod, error: paymentMethodError } =
      await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: customerName,
          address: {
            line1: customerAddress.line1,
            city: customerAddress.city,
            state: customerAddress.state,
            postal_code: customerAddress.postalCode,
            country: convertedCountry,
          },
        },
      });

    if (paymentMethodError) {
      console.error("Stripe Payment Method Error:", paymentMethodError);

      toast.error(paymentMethodError.message);
      setLoading(false);
      return;
    }

    console.log("Payment Method Created:", paymentMethod);
    const totalAmount = location.state.products.reduce(
      (sum, p) => sum + Number(p.price || 0),
      0
    );

    console.log("Total Amount:", totalAmount);

    // ==========================================
    // CREATE BOOKINGS
    // ==========================================

    let responses = [];

    for (let p of location.state.products) {
      const bookingData = {
        token: auth?.token,
        postId: p.postId,
        bookingDate: new Date(),
        customerName: customerName,
        transactionId: paymentMethod.id,
        amount: Number(p.price || 0),
      };

      console.log(
        "FINAL BOOKING DATA FROM PAYMENT:",
        bookingData
      );
      // CREATE BOOKING======================================
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/booking/create-booking`,
        bookingData
      );

      responses.push(res.data);
     // UPDATE HOTEL AVAILABILITY
      await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/api/booking/update-availability`,
        {
          postId: p.postId,
          isAvailable: false,
        }
      );
    }

    console.log(
      "Create booking response:",
      responses
    );
    // UPDATE BOOKING CONTEXT=====================================
    const updatedBooking = [
      ...book,
      {
        title,
        amount: totalAmount,
        customerAddress,
        postId: location.state?.postId,
      },
    ];

    setBook(updatedBooking);

    // ==========================================
    // REMOVE BOOKED HOTELS FROM CART
    // ==========================================

    const cartData =
      JSON.parse(localStorage.getItem("cart")) || [];

    console.log("Cart Data:", cartData);

    const bookedIds = location.state.products.map((p) =>
      String(p.postId)
    );

    const updatedCart = cartData.filter(
      (item) => !bookedIds.includes(String(item._id))
    );

    console.log("Updated Cart:", updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    setCart(updatedCart);
    toast.success("Payment successful! Hotels booked successfully.");

    setTimeout(() => {
      navigate("/user/your-order");
    }, 1500);

  } catch (error) {
    console.error( "Error creating booking:",error);

    console.error( "Error response:", error.response?.data
    );

    toast.error( error.response?.data?.message || "Booking failed. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-semibold">Payment</h1>
      <div className="p-4 mb-4 bg-gray-100 rounded-md shadow-md">
        <h2 className="text-xl font-medium text-gray-800"> Title : {title}</h2>
        <p className="text-lg text-gray-600">

          Price:{" "} <span className="font-semibold text-green-600">
            {amount.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        </p>
      </div>

      <form onSubmit={handlePayment} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="name" className="mb-2 text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="p-3 border rounded-md"
            placeholder={auth.user?.name}
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="address" className="mb-2 text-gray-700">
            Address Line 1
          </label>
          <input
            type="text"
            id="address"
            value={customerAddress.line1}
            onChange={(e) =>
              setCustomerAddress({ ...customerAddress, line1: e.target.value })
            }
            className="p-3 border rounded-md"
            placeholder="Enter address"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="city" className="mb-2 text-gray-700">
            City
          </label>
          <input
            type="text"
            id="city"
            value={customerAddress.city}
            onChange={(e) =>
              setCustomerAddress({ ...customerAddress, city: e.target.value })
            }
            className="p-3 border rounded-md"
            placeholder="Enter city"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="state" className="mb-2 text-gray-700">
            State
          </label>
          <input
            type="text"
            id="state"
            value={customerAddress.state}
            onChange={(e) =>
              setCustomerAddress({ ...customerAddress, state: e.target.value })
            }
            className="p-3 border rounded-md"
            placeholder="Enter state"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="postalCode" className="mb-2 text-gray-700">
            Postal Code
          </label>
          <input
            type="text"
            id="postalCode"
            value={customerAddress.postalCode}
            onChange={(e) =>
              setCustomerAddress({
                ...customerAddress,
                postalCode: e.target.value,
              })
            }
            className="p-3 border rounded-md"
            placeholder="Enter postal code"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="country" className="mb-2 text-gray-700">
            Country
          </label>
          <input
            type="text"
            id="country"
            value={customerAddress.country}
            onChange={(e) =>
              setCustomerAddress({
                ...customerAddress,
                country: e.target.value,
              })
            }
            className="p-3 border rounded-md"
            placeholder="Enter country (e.g., India)"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="card" className="mb-2 text-gray-700">
            Card Details
          </label>
          <CardElement
            id="card"
            className="p-3 border rounded-md"
            onChange={(event) => {
              setCardComplete(event.complete);

              if (event.error) {
                toast.error(event.error.message);
              }
            }}
          />
        </div>
        <button      
          type="submit"
          disabled={!stripe || !cardComplete|| loading}
          // className="px-6 py-3 text-white bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-600"
          className="px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >

          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
};

export default Payment;

import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { json, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useBook } from "../context/Booking";
import { useAuth } from "../context/UserContext";
import { useCart } from "../context/Cart";

const Payment = () => {
  // const stripe = useStripe(); const elements = useElements();
  const location = useLocation();
  const navigate = useNavigate();
  const [book, setBook] = useBook();  //useBook([]) 
  const [cart, setCart] = useCart();
  const [auth] = useAuth();

  const [loading, setLoading] = useState(false);
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

  const handlePayment = async (e) => {
     e.preventDefault();
    setLoading(true)

    // if (!stripe || !elements) {
    //   toast.error("Stripe has not loaded yet. Please try again.");
    //   return;
    // }

    if (
      !customerName ||
      !customerAddress.line1 ||
      !customerAddress.city ||
      !customerAddress.country
    ) {
      toast.error("Please fill out all the required fields.");
       setLoading(false)
      return;
    }

    const convertedCountry = handleCountryCodeConversion(
      customerAddress.country
    );

   
// stripe payment method:
    // try {
    //   // Create a payment intent on the server
    //   const { data } = await axios.post(
    //     `${import.meta.env.VITE_BASE_URL}/api/booking/create-payment-intent`,
    //     {
    //       amount: amount * 100, // Amount in cents
    //       currency: "usd",
    //       description: `Payment for ${title}`,
    //       customerName,
    //       customerAddress: { ...customerAddress, country: convertedCountry },
    //     }
    //   );

    //   const clientSecret = data.clientSecret;

    //   // Confirm the payment on the client
    //   // const response = await stripe.confirmCardPayment(...);
    //   // const paymentIntent = response.paymentIntent;
    //   // const error = response.error;

    //   const { paymentIntent, error } = await stripe.confirmCardPayment(
    //     clientSecret,
    //     {
    //       payment_method: {
    //         card: elements.getElement(CardElement),
    //         billing_details: {
    //           name: customerName,
    //           address: {
    //             line1: customerAddress.line1,
    //             city: customerAddress.city,
    //             state: customerAddress.state,
    //             postal_code: customerAddress.postalCode,
    //             country: convertedCountry,
    //           },
    //         },
    //       },
    //     }
    //   );

    //   if (error) {
    //     toast.error(`Payment failed: ${error.message}`);
    //     setLoading(false);
    //     return;
    //   }

    //   if (paymentIntent.status === "succeeded") {
    //     // After payment success, create the booking
    //     const bookingData = {
    //       token: auth?.token, // Replace with actual userId
    //       postId: location.state.postId,
    //       bookingDate: new Date(), // Set the booking date
    //       transactionId: paymentIntent.id,
    //     };

    //     console.log("Booking Data Sent:", bookingData);

    //     await axios.post(
    //       `${import.meta.env.VITE_BASE_URL}/api/booking/create-booking`,
    //       bookingData
    //     );
    //     const updatedBooking = [
    //       ...book,
    //       { title, amount, customerName, postId: location.state?.postId },
    //     ];
    //     setBook(updatedBooking);
    //     localStorage.setItem("booking", JSON.stringify(updatedBooking));

    //     // Update product availability
    //     await axios.patch(
    //       `${import.meta.env.VITE_BASE_URL}/api/booking/update-availability`,
    //       {
    //         postId: location.state.postId,
    //         isAvailable: false,
    //       }
    //     );

    //     // Redirect to orders
    //     toast.success("Payment and booking successful!");
    //     navigate("/user/your-order");
    //   }
    // }
 try{
  toast.success("Payment successful (Test Mode)!")

 let totalAmount = 0;
if (location.state?.products?.length > 0) {
  totalAmount = location.state.products.reduce((sum, p) => sum + Number(p.price || 0), 0);
} 
  const bookingData={
    token: auth.token,
    postId:location.state.products.map(p => p.postId),  // yai array ki form h
    bookingDate:new Date(),
      customerName: customerName,
    transactionId:`TEST -${Date.now()}`, //fake transaction id
    amount: totalAmount,
  };
  console.log("booking data sent",bookingData);

  // save booking to database ( for multiple booking  for loop use)
let response
for (let p of location.state.products) {
   response = await axios.post(   //let
    `${import.meta.env.VITE_BASE_URL}/api/booking/create-booking`,
    bookingData,
    { headers: { Authorization: `Bearer ${auth.token}` } }
  );
}
console.log("All booking responses:", response);

 
console.log("Create booking response api in payment page :", response.data.bookingData);
  //  update local state
  const updatedBooking=[
    ...book,
   { title,amount, customerAddress,postId : location.state?.postId},
  ];
  setBook(updatedBooking);
  setLoading(true);
  // update product avalability
 await axios.patch(
  `${import.meta.env.VITE_BASE_URL}/api/booking/update-availability`,
  {
    postIds: location.state.products.map(p => p.postId),
    isAvailable: false,
  },
  { headers: { Authorization: `Bearer ${auth.token}` } }
);

  
// Remove booked hotels from cart
const cartData = JSON.parse(localStorage.getItem("cart")) || [];
console.log("Cart Data from LocalStorage:", cartData);

const bookedIds = location.state.products.map(p => String(p.postId));

// Keep only hotels that were NOT booked
const updatedCart = cartData.filter(item => !bookedIds.includes(item._id));
console.log("updated crt",updatedCart)
localStorage.setItem("cart", JSON.stringify(updatedCart));

setCart(updatedCart);

if (updatedCart.length < cartData.length) {
  toast.success("Booked hotels removed from cart!");
} else {
  toast.error("Hotels were not removed from cart.");
}

  setTimeout(()=>{
    navigate("/thank-you")
toast.success("booking successfull")
  },4000)
  } catch (error) {
      console.error("Error creating booking:", error.message);
      toast.error("booking failed. Please try again.");
      setLoading(false);
    } 
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Payment</h1>
      <div className="bg-gray-100 p-4 rounded-md mb-4 shadow-md">
        <h2 className="text-xl font-medium text-gray-800"> Title : {title}</h2>
        <p className="text-lg text-gray-600">

          Price:{" "} <span className="text-green-600 font-semibold">
            {amount.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        </p>
      </div>

      <form onSubmit={handlePayment} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="name" className="text-gray-700 mb-2">
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
          <label htmlFor="address" className="text-gray-700 mb-2">
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
          <label htmlFor="city" className="text-gray-700 mb-2">
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
          <label htmlFor="state" className="text-gray-700 mb-2">
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
          <label htmlFor="postalCode" className="text-gray-700 mb-2">
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
          <label htmlFor="country" className="text-gray-700 mb-2">
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
        {/* <div className="flex flex-col">
          <label htmlFor="card" className="text-gray-700 mb-2">
            Card Details
          </label>
          <CardElement id="card" className="p-3 border rounded-md" />
        </div> */}
        <button
          type="submit"
          // disabled={!stripe || loading}
          className="px-6 py-3 text-white rounded-lg bg-blue-500 hover:bg-blue-600">
          
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
};

export default Payment;

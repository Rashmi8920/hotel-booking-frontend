import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaWifi,
  FaBriefcase,
  FaSwimmingPool,
  FaCar,
  FaStar,
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import axios from "axios";
import RelatedProduct from "./RelatedProduct";
import Spinner from "../Spinner";
import { useCart } from "../../context/Cart";
import { toast } from "react-toastify";
import { useAuth } from "../../context/UserContext";
import { useBook } from "../../context/Booking";

const Product = () => {
  const params = useParams();
  const [postDetails, setPostDetails] = useState(null);
  console.log("postdetail",postDetails)
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [cart, setCart] = useCart();
  const navigate = useNavigate();
  const [auth] = useAuth();
  const [booking, setBooking] = useBook();
  console.log("Related Products", relatedProducts);

  const handleCheckIn = () => {
    if (!auth?.token) {
      toast.error("Authentication required to proceed!");
      return navigate("/login");
    }
    navigate("/cart");
  };

  console.log("This is postId", postDetails?._id);
  // console.log("This is product categoryID", postDetails?.category._id);

  useEffect(() => {
    if (params?.slug) getPostBySlug();
  }, [params?.slug]);

  const getPostBySlug = async (e) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/post/get-post/${params.slug}`
      );
      const product = res.data.product;
      console.log("prodduct",product)
      setPostDetails(product);
      getRelatedPost(product?._id, product?.category._id);
    } catch (error) {
      console.error("Error fetching post details:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const getRelatedPost = async (pid, cid) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/post/related-post/${pid}/${cid}`
      );
      setRelatedProducts(res.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = () => {
    // Check if item already exists in cart
    const isItemInCart = cart.some(item => item._id === postDetails._id);

    if (isItemInCart) {
      toast.error("Item already in cart");
      return;
    }

    if (postDetails.isAvailable) {
      setCart([...cart, postDetails]);
      localStorage.setItem("cart", JSON.stringify([...cart, postDetails]));
      toast.success("Item Added to cart");
    }

  };

  if (loading) {
    return (
      <div className="p-8">
        <Spinner />
      </div>
    );
  }

  if (!postDetails) {
    return <Spinner />;
  }

  return (
    <div className="p-8 min-h-screen">
      <div className="flex flex-col md:flex-row md:space-x-8 overflow-hidden">
        {/* Images Section */}
        <div className="flex flex-col space-y-4 p-4 md:w-1/2">
          {postDetails.images?.length > 0 && (
            <>
              <img
                src={postDetails.images[0]}
                alt="Main Image"
                className="w-full h-[25rem] object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
              />
              <div className="grid grid-cols-2 gap-2">
                {postDetails.images.slice(1).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Additional Image ${idx + 1}`}
                    className="h-[100%] object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Details Section */}
        <div className="flex-1 p-8 md:w-1/2">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {postDetails.title}
          </h1>
          <div className="flex items-center space-x-2 text-yellow-500 mb-4">
            <FaStar />
            <span className="text-xl font-semibold">4.5</span>
            <span className="text-gray-500">(1200 Reviews)</span>
          </div>
          <p className="flex items-center text-gray-600 mb-4">
            <MdLocationOn className="text-xl" />
            {postDetails.hotelLocation || "Location unavailable"}
          </p>

          <div className="flex space-x-4 mb-6">
            <button
              className={`px-6 py-3 font-semibold rounded-lg shadow transition ${
                // postDetails.isAvailable  ||
                cart.some(item => item._id === postDetails._id)
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-300 text-gray-700 cursor-not-allowed"
                }`}
              disabled={
                // !postDetails.isAvailable ||
                !cart.some(item => item._id === postDetails._id)} // 
              onClick={handleCheckIn}
            >
              Check-In
            </button>

            <button
              className={`px-6 py-3 font-semibold rounded-lg shadow transition
                 ${cart.some(item => item._id === postDetails._id)  //postDetails.isAvailable ||
                  ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              disabled={
                !postDetails.isAvailable ||
                 cart.some(item => item._id === postDetails._id)}
              onClick={handleAddToCart}
            >
              {cart.some(item => item._id === postDetails._id)
                ? "Added to Cart"
                : "Add to Wishlist"}
            </button>

          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Overview</h2>
            <p className="text-gray-600 text-justify mt-2">{postDetails.description}</p>
          </div>

          <div className="mt-3">
            <p className="text-base font-bold text-orange-600">
              Price Per Day :{" "}
              <span className="text-xl text-gray-500">
                {postDetails.price.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </span>
            </p>
          </div>

          <div className="flex  sm:justify-between gap-12">
            {/* Nearby Areas */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800">Near Area</h2>
              <ul className="space-y-2 mt-2 text-gray-700 list-disc pl-5">
                {postDetails?.nearArea?.flatMap((area, idx) =>
                  area
                    .split(",")
                    .map((subArea, subIdx) => (
                      <li key={`${idx}-${subIdx}`}>{subArea.trim()}</li>
                    ))
                )}
              </ul>
            </div>
            {/* Facilities */}
            <div className="mt-8 mr-32">
              <h2 className="text-xl font-semibold text-gray-800">
                Facilities
              </h2>
              <ul className="space-y-2 mt-2 text-gray-700 list-disc pl-5">
                {postDetails?.facilities?.flatMap((facility, idx) =>
                  facility
                    .split(",")
                    .map((subFacility, subIdx) => (
                      <li key={`${idx}-${subIdx}`}>{subFacility.trim()}</li>
                    ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <h1 className="ml-11 font-semibold text-3xl mb-7 mt-5">
        You may like this:
      </h1>
      <RelatedProduct relatedProducts={relatedProducts} />
    </div>
  );
};

export default Product;

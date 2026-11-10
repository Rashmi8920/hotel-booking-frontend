import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
//home page hotel
const Hotels = () => {
  const [posts, setPosts] = useState([]);

  // Fetch all posts
  const getAllPosts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/post/get-all-post`
      );
      setPosts(res.data.posts);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  // Image rotation logic
  const [imageIndexes, setImageIndexes] = useState({});

  useEffect(() => {
    
    const interval = setInterval(() => {
      setImageIndexes((prevIndexes) => {
        const newIndexes = { ...prevIndexes };
        posts.forEach((post) => {
          const currentIndex = newIndexes[post._id] || 0;
          newIndexes[post._id] = (currentIndex + 1) % post.images.length;
        });
        return newIndexes;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [posts]);

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  return (
    <div className="container mx-auto mt-16" id="hotels">
      <h2 className="text-3xl font-semibold mb-8 sm:ml-[8rem] ml-14">Popular Hotels</h2>
      <Carousel
        responsive={responsive}
        // removeArrowOnDeviceType={["tablet"]}
      >
        {posts.map((hotel) => (
          <div
            key={hotel._id}
            className="w-64 mx-auto overflow-hidden bg-white rounded-lg"
          >
            <img
              src={hotel.images[imageIndexes[hotel._id] || 0]}
              alt={hotel.title}
              className="object-cover w-full h-64"
            />
            <div className="p-4">
              <Link
                  to={hotel.isAvailable ? `product/${hotel.slug}` : "#"}
                   onClick={(e) => {
                    if (!hotel.isAvailable) {   // booked hone par block
                      e.preventDefault();
                      toast.success("This hotel is already booked.");
                    }
                  }}
                className={`text-lg text-gray-800 font-medium ${hotel.isAvailable
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-70"
                    }`}
              >
                {hotel.title}
              </Link>
              {/* <p className="text-gray-500">{hotel.hotelLocation}</p> */}
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Hotels;

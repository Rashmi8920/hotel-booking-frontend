import React from "react";
import Image1 from "../assets/Post/Rectangle 16.png";
import Image2 from "../assets/Post/Rectangle 17.png";
import Image3 from "../assets/Post/Rectangle 8 (1).png";

const NextTrip = () => {
  
  const trips = [
    {
      image: Image1,
      title: "Sydney’s 10 most fashionable 5 star hotels",
      description:
        "Browse the fastest growing tourism sector in the heart of Australia's tourism capital ....",
    },
    {
      image: Image2,
      title: "Top cities for Vegan Travellers",
      description:
        "Top sites where you do not have to worry about being a vegan. Our tourist guide is here...",
    },
    {
      image: Image3,
      title: "World’s top destinations during and post covid timeline",
      description:
        "Pandemic is still intact and will be here for a longer time. Here’s where your next destination...",
    },
  ];

  return (
    <div className="px-4 mx-auto max-w-7xl mt-14">
      <h1 className="text-3xl font-semibold mb-6 ml-[10px]">
        Get inspiration for your next trip
      </h1>
      <div className="flex flex-wrap justify-center gap-6 mt-14">
        {trips.map((trip, index) => (
          <div
            key={index}
            className="relative w-[24rem] h-[15rem] rounded-lg overflow-hidden shadow-lg"
          >
            <img
              src={trip.image}
              alt={trip.title}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-black bg-opacity-40">
              <h2 className="text-lg font-semibold text-white">{trip.title}</h2>
              <p className="text-sm text-gray-200">{trip.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NextTrip;

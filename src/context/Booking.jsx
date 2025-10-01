import { useState, useContext, createContext, useEffect } from "react";

const BookingContext = createContext();

const BookingProvider = ({ children }) => {
  const [book, setBook] = useState([]);

  // LocalStorage se initial data load karo (only once on mount)
  useEffect(() => {
    const existingBookItem = localStorage.getItem("booking");
    if (existingBookItem) {
      setBook(JSON.parse(existingBookItem));
    }
  }, []);

  // Jab bhi book state change ho, localStorage me save karo
  useEffect(() => {
    if (book.length > 0) {
      localStorage.setItem("booking", JSON.stringify(book));
      // console.log("booking data local sai fetch",JSON.parse(localStorage.getItem("booking")));
    }
  }, [book]);

  return (
    <BookingContext.Provider value={[book, setBook]}>
      {children}
    </BookingContext.Provider>
  );
};

// Custom hook
const useBook = () => useContext(BookingContext);

export { useBook, BookingProvider };

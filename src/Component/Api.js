import axios from "axios";

const baseUrl = "http://localhost:3000";

export const fetchMovies = async () => {
  try {
    const response = await axios.get(`${baseUrl}/movies`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
};

export const fetchBookings = async (movieTitle) => {
    const response = await axios.get(`${baseUrl}/bookings?movie.Title=${movieTitle}`);
    return response.data.flatMap((booking) => booking.seats);
  };

  export const createBooking = async (bookingDetails) => {
    await axios.post(`${baseUrl}/bookings`, bookingDetails);
  };
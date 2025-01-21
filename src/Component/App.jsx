import React, { useState, useEffect } from 'react';
import { fetchMovies, fetchBookings, createBooking } from './api';
import { SeatGrid } from './SeatGrid';
import { BookingForm } from './BookingForm';

export const Booking = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      const movies = await fetchMovies();
      setMovies(movies);
      setSelectedMovie(movies[0]);
      const occupied = await fetchBookings(movies[0].Title);
      setOccupiedSeats(occupied);
      setLoading(false);
    };
    loadMovies();
  }, []);

  const handleMovieChange = async (e) => {
    const selectedTitle = e.target.value;
    const movie = movies.find((m) => m.Title === selectedTitle);
    setSelectedMovie(movie);
    const occupied = await fetchBookings(movie.Title);
    setOccupiedSeats(occupied);
    setSelectedSeats([]);
  };

  const handleSeatClick = (rowIndex, seatIndex) => {
    const seatId = `${rowIndex}-${seatIndex}`;
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
    );
  };

  const handleBookingSubmit = async (formData) => {
    const bookingDetails = {
      movie: selectedMovie,
      seats: selectedSeats,
      name: formData.name,
      phone: formData.phone,
      totalPrice: selectedSeats.length * (selectedMovie?.Price || 0),
    };
    await createBooking(bookingDetails);
    alert('Booking successful!');
    const occupied = await fetchBookings(selectedMovie.Title);
    setOccupiedSeats(occupied);
    setSelectedSeats([]);
  };

  if (loading) return <p>Loading movies...</p>;

  return (
    <div>
      <div className="movie-container">
        <label htmlFor="movie">Pick a movie:</label>
        <select id="movie" onChange={handleMovieChange} value={selectedMovie?.Title || ''}>
          {movies.map((movie) => (
            <option key={movie.Title} value={movie.Title}>
              {movie.Title} ({movie.Price} kr)
            </option>
          ))}
        </select>
      </div>
      <SeatGrid
        rows={Array(6).fill(Array(17).fill('seat'))}
        selectedSeats={selectedSeats}
        occupiedSeats={occupiedSeats}
        onSeatClick={handleSeatClick}
      />
      <p>
        You have selected <span>{selectedSeats.length}</span> seats for a total of{' '}
        <span>{selectedSeats.length * (selectedMovie?.Price || 0)}</span> kr.
      </p>
      <BookingForm
        selectedSeats={selectedSeats}
        selectedMovie={selectedMovie}
        onSubmit={handleBookingSubmit}
      />
    </div>
  );
};

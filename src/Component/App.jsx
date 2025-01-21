import React, { useState, useEffect } from 'react';
import { fetchMovies, fetchBookings, createBooking } from './Api';
import { SeatGrid} from './Seats';
import { BookingForm } from './BookingForm';
import { MovieSelector } from './MovieSelector';

export const App = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      const movies = await fetchMovies();
      if (movies.length > 0) {
      setMovies(movies);
      setSelectedMovie(movies[0]);
      const occupied = await fetchBookings(movies[0].Title);
      setOccupiedSeats(occupied);
      }
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
      <MovieSelector
        movies={movies}
        selectedMovie={selectedMovie}
        onChange={handleMovieChange}
      />
      
      <div className="showcase">
          <li>
            <div className="seat"></div>
            <small>N/A</small>
          </li>
          <li>
            <div className="seat selected"></div>
            <small>Selected</small>
          </li>
          <li>
            <div className="seat occupied"></div>
            <small>Occupied</small>
          </li>
      </div>

      <div className="screen"></div>

      <SeatGrid
        rows={Array.from({length: 6}, () => Array(17).fill('seat'))}
        selectedSeats={selectedSeats}
        occupiedSeats={occupiedSeats}
        onSeatClick={handleSeatClick}
      />
      <p className="text">
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

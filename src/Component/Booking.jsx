import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const Booking = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState(['0-1', '1-1','1-0','1-4', '2-5', '3-15','3-16', '4-7', '4-3', '5-6', '5-5', '5-14']);
  const [loading, setLoading] = useState(true);

  const rows = Array(6)
    .fill()
    .map(() => Array(17).fill('seat'));

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('http://localhost:5000/movies');
        setMovies(response.data);
        setSelectedMovie(response.data[0]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  const handleMovieChange = async (e) => {
    const selectedTitle = e.target.value;
    const movie = movies.find((m) => m.Title === selectedTitle);
    setSelectedMovie(movie);
    setSelectedSeats([]);

    try {
      const response = await axios.get(`http://localhost:5000/bookings?movie.Title=${selectedTitle}`);
      const occupied = response.data.flatMap((booking) => booking.seats);
      setOccupiedSeats([...occupiedSeats, ...occupied]); // Combine predefined and fetched occupied seats
    } catch (error) {
      console.error('Error fetching occupied seats:', error);
    }
  };

  const handleSeatClick = (rowIndex, seatIndex) => {
    const seatId = `${rowIndex}-${seatIndex}`;
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
    );
  };

  const handleBooking = async () => {
    try {
      const bookingDetails = {
        movie: selectedMovie,
        seats: selectedSeats,
        totalPrice: selectedSeats.length * (selectedMovie?.Price || 0),
      };

      await axios.post('http://localhost:5000/bookings', bookingDetails);
      alert('Booking successful!');
      setOccupiedSeats((prev) => [...prev, ...selectedSeats]);
      setSelectedSeats([]);
    } catch (error) {
      alert('Failed to book seats. Please try again.');
      console.error('Error booking seats:', error);
    }
  };

  if (loading) return <p>Loading movies...</p>;
    
  

  return (
    <>
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
      <ul className="showcase">
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
      </ul>

      <div className="screen"></div>

      <div className="container">
        {rows.map((row, rowIndex) => (
          <div className="row" key={rowIndex}>
            {row.map((_, seatIndex) => {
              const seatId = `${rowIndex}-${seatIndex}`;
              const isSelected = selectedSeats.includes(seatId);
              const isOccupied = occupiedSeats.includes(seatId);
              return (
                <div
                  key={seatId}
                  className={`seat ${isOccupied ? 'occupied' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => !isOccupied && handleSeatClick(rowIndex, seatIndex)}
                ></div>
              );
            })}
          </div>
        ))}
      </div>
      <p className="text">
        You have selected <span>{selectedSeats.length}</span> seats for a total of{' '}
        <span>{selectedSeats.length * (selectedMovie?.Price || 0)}</span> kr.
      </p>
      <button onClick={handleBooking} disabled={selectedSeats.length === 0}>
        Book Now
      </button>
    </>
  );
};
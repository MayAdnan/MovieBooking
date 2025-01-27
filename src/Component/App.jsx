import { useState, useEffect } from 'react';
import { fetchMovies, fetchBookings, createBooking } from '../data/Api';
import { SeatGrid} from './Seats';
import { BookingForm } from './BookingForm';
import { MovieSelector } from './MovieSelector';
import { AdminMovies } from './Crud';

export const App = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const movies = await fetchMovies();
        if (!movies || movies.length === 0) {
          setMovies([]);
          setLoading(false);
          return;
        }
        setMovies(movies);
        setSelectedMovie(movies[0]);
        const occupied = await fetchBookings(movies[0].Title);
        setOccupiedSeats(occupied);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  const handleMovieChange = async (e) => {
    const selectedTitle = e.target.value;
    const movie = movies.find((m) => m.Title === selectedTitle);
    setSelectedMovie(movie);
    setSelectedSeats([]);
      try {
        const occupied = await fetchBookings(movie.Title);
        setOccupiedSeats(occupied);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        setOccupiedSeats([]);
    }
  };

  const handleSeatClick = (rowIndex, seatIndex) => {
    const seatId = `${rowIndex}-${seatIndex}`;
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
    );
  };

  const handleBookingSubmit = async (formData) => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat.');
      return;
    }
    const bookingDetails = {
      movie: selectedMovie,
      seats: selectedSeats,
      name: formData.name,
      phone: formData.phone,
      totalPrice: selectedSeats.length * (selectedMovie?.Price || 0),
    };

    try {
    await createBooking(bookingDetails);
    alert('Booking successful!');
    const occupied = await fetchBookings(selectedMovie.Title);
    setOccupiedSeats(occupied);
    setSelectedSeats([]);
    } catch (error) {
      alert('Booking failed. Please try again.');
    }
  };

  const deleteMovie = async (id) => {
    try {
      await axios.delete(`${baseUrl}/movies/${id}`);
      setMovies(movies.filter((movie) => movie.id !== id));

      if (selectedMovie && selectedMovie.id === id) {
        setSelectedMovie(null);
        setSelectedSeats([]);
      }
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  }

  if (loading) {
    return <p>Loading movies...</p>;
  }

  return (
    <>
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
      <div>
        <button onClick={() => setAdmin(!admin)}>
          {admin ? 'Back to booking' : 'Admin'}
        </button>
      </div>
      {admin && <AdminMovies />}
    </div>
    </>
  );
};
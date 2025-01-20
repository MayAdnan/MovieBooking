// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';


// fixa så att sidan laddar med sätten direkt när man kör 
// dela upp koden 

export const Booking = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [formError, setFormError] = useState('');

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

        if (response.data.length > 0) {
          const firstMovieTitle = response.data[0].Title;
          const bookingsResponse = await axios.get(`http://localhost:5000/bookings?movie.Title=${firstMovieTitle}`);
          const occupied = bookingsResponse.data.flatMap((booking) => booking.seats);
          setOccupiedSeats(occupied);
        }
        
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    if (selectedMovie) {
      const fetchOccupiedSeats = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/bookings?movie.Title=${selectedMovie.Title}`);
          const occupied = response.data.flatMap((booking) => booking.seats);
          setOccupiedSeats(occupied);
        } catch (error) {
          console.error('Error fetching occupied seats:', error);
        }
      };

      fetchOccupiedSeats();
    }
  }, [selectedMovie]);

  const handleMovieChange = async (e) => {
    const selectedTitle = e.target.value;
    const movie = movies.find((m) => m.Title === selectedTitle);
    setSelectedMovie(movie);
    setSelectedSeats([]);
    setOccupiedSeats([]); 
  };

  const handleSeatClick = (rowIndex, seatIndex) => {
    const seatId = `${rowIndex}-${seatIndex}`;
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
    );
  };

  const handleShowForm = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat.');
      return;
    }
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setFormError('Name is required.');
      return false;
    }
    if (!/^\d{5}$/.test(formData.phone)) {
      setFormError('Phone number must be 5 digits.');
      return false;
    }
    setFormError('');
    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const bookingDetails = {
        movie: selectedMovie,
        seats: selectedSeats,
        name: formData.name,
        phone: formData.phone,
        totalPrice: selectedSeats.length * (selectedMovie?.Price || 0),
      };

      await axios.post('http://localhost:5000/bookings', bookingDetails);
      alert('Booking successful!');
      setOccupiedSeats((prev) => [...prev, ...selectedSeats]);
      setSelectedSeats([]);
      setShowForm(false);
      setFormData({ name: '', phone: '' });
      

  handleMovieChange({ target: { value: selectedMovie.Title } });
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
      <button onClick={handleShowForm}>Boka</button>

      {showForm && (
        <form onSubmit={handleFormSubmit} className="booking-form">
          <h2>Enter your details</h2>
          {formError && <p className="error">{formError}</p>}
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
            />
          </div>
          <div>
            <label htmlFor="phone">Phone:</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleFormChange}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      )}
    </>
  );
};
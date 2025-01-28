import { useEffect, useState } from "react";
import axios from "axios";
import { fetchMovies } from "./data/Api";

const baseUrl = "http://localhost:3000";

export const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState({ Title: "", Year: "", Price: "" , id: "" });

  useEffect(() => {
    const loadMovies = async () => {
        const data = await fetchMovies();
        setMovies(data || []);
    };
    loadMovies();
  }, []);

  const addMovie = async() => {
    if (!form.Title || !form.Year || !form.Price) {
      alert("Please fill out all fields.");
      return;
    }
    
    const newMovie = {
      Title: form.Title,
      Year: form.Year,
      Price: form.Price,
    };

    try {
      const response = await axios.post(`${baseUrl}/movies`, newMovie);
      setMovies([...movies, response.data]);
      setForm({ Title: "", Year: "", Price: "", id: "" });
    } catch (error) {
      console.error("Error adding movie:", error);
    }
  };
  
  const updateMovies = async () => {
    try {
      await axios.put(`${baseUrl}/movies/${form.id}`, form);
      setMovies(movies.map((movie) => (movie.id === form.id ? form : movie)));
      setForm({ Title: "", Year: "", Price: "", id: "" });
    } catch (error) {
      console.error("Error updating movie:", error);
    }
  };

  const editMovie = (movie) => {
    setForm({
      id: movie.id,
      Title: movie.Title,
      Year: movie.Year,
      Price: movie.Price,
    });
  };

  const deleteMovie = async(id) => {
    console.log("Deleting movie with id:", id);
    try {
      await axios.delete(`${baseUrl}/movies/${id}`);
      setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== id));
    } catch (error) {
        console.error("Error deleting movie:", error);
        }
  };

  return (
    <> 
      <h1>Admin Movies</h1>
      <form>
        <div> 
        <label htmlFor="title">Title:</label>
        <input
        type="text"
        name="title"
        value={form.Title || ""}
        onChange= {(e) => setForm({ ...form, Title: e.target.value })}
        required
        />
        </div>

        <div>
        <label htmlFor="year">Year:</label>
        <input
        type="number"
        name="year"
        value={form.Year || ""}
        onChange={(e) => setForm({ ...form, Year: e.target.value })}
        required
        />
        </div>

        <div> 
        <label htmlFor="price">Price:</label>
        <input
        type="number"
        name="price"
        value={form.Price || ""}
        onChange={(e) => setForm({ ...form, Price: e.target.value })}
        required
        />
        </div>

        {form.id ? (
          <button type= "button" onClick={updateMovies}>Update</button>
        ) : (
          <button type= "button" onClick={addMovie}>Add</button>
        )}
        </form>
        <ul>
          {movies.map((movie) => (
            <li key={movie.id}>
              {movie.Title} ({movie.Year}) - {movie.Price} kr
              <button onClick={() => editMovie(movie)}>Edit</button>
              <button onClick={() => deleteMovie (movie.id)}>Delete</button>
            </li>
          ))}
        </ul>
    </>
  );
};
import React from 'react';

export const MovieSelector = ({ movies, selectedMovie, onChange }) => {
    if (movies.length === 0) {
        return <p>Loading movies...</p>;
    }

    return (
        <div className="movie-container">
            <label htmlFor="movie">Pick a movie:</label>
            <select id="movie" onChange={onChange} value={selectedMovie?.Title || ''}>
                {movies.map((movie) => (
                    <option key={movie.Title} value={movie.Title}>
                        {movie.Title} ({movie.Price} kr)
                    </option>
                ))}
            </select>
        </div>
    );
};
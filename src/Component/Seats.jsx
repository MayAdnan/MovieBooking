import React from 'react';

export const SeatGrid = ({ rows, occupiedSeats, selectedSeats, onSeatClick }) => {
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
              onClick={() => !isOccupied && onSeatClick(rowIndex, seatIndex)}
            ></div>
          );
        })}
      </div>
    ))}
  </div>
};
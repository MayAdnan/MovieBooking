import React, {useState} from "react";

export const BookingForm = ({onSubmit, selectedSeats, selectedMovie }) => {
    const [formData, setFormData] = useState({name: "", phone: ""});
    const [formError, setFormError] = useState("");

    const validateForm = () => {
        if (!formData.name.trim()){
            setFormError("Name is required.");
            return false;
        } 
        if (!/^\d{5}$/.test(formData.phone)) {
            setFormError("Phone number must be exactly 5 digits.");
            return false;
        }

        if (selectedSeats.length === 0) {
            setFormError("Please select at least one seat");
            return false;
        }

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()){
            onSubmit(formData);
            setFormData({name: "", phone: ""});
        }
    };
    return (
        <form onSubmit={handleSubmit} className="booking-form">
      <h2>Enter your details</h2>
      {formError && <p className="error">{formError}</p>}
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="phone">Phone:</label>
        <input
          type="text"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>
      <button type="submit"disabled={selectedSeats.length === 0}>
        Submit
        </button>
    </form>
  );
};
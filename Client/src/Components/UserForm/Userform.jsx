import React, { useState } from "react";

const Userform = () => {
  // Step 1: Set up state for form fields
  const [formData, setFormData] = useState({
    avatar: null,
    name: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
  });

  // Step 2: Handle input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  // Step 3: Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here, you can add code to send the form data to a server or process it as needed
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Avatar:</label>
        <input type="file" name="avatar" onChange={handleChange} />
      </div>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Phone:</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Gender:</label>
        <div>
          <label>
            <input
              type="radio"
              name="gender"
              value="male"
              checked={formData.gender === "male"}
              onChange={handleChange}
            />
            Male
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="female"
              checked={formData.gender === "female"}
              onChange={handleChange}
            />
            Female
          </label>
        </div>
      </div>
      <div>
        <label>Address:</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        ></textarea>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default Userform;

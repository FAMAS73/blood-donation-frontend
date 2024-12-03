import React, { useState } from "react";

const RegisterDonor = ({ contract }) => {
  const [formData, setFormData] = useState({
    name: "",
    bloodType: "",
    weight: "",
    height: "",
    age: "",
    nationalId: "",
    hasDisease: false,
  });

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tx = await contract.registerDonor(
        formData.name,
        formData.bloodType,
        parseInt(formData.weight),
        parseInt(formData.height),
        parseInt(formData.age),
        formData.nationalId,
        formData.hasDisease
      );
      await tx.wait();
      alert("Donor registered successfully!");
      // Reset form
      setFormData({
        name: "",
        bloodType: "",
        weight: "",
        height: "",
        age: "",
        nationalId: "",
        hasDisease: false,
      });
    } catch (error) {
      alert("Error registering donor: " + error.message);
    }
  };

  return (
    <div className="register-donor">
      <h2>Register as Donor</h2>
      <form onSubmit={handleSubmit}>
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
          <label>Blood Type:</label>
          <select
            name="bloodType"
            value={formData.bloodType}
            onChange={handleChange}
            required
          >
            <option value="">Select Blood Type</option>
            {bloodTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Weight (kg):</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            min="45"
            required
          />
        </div>

        <div>
          <label>Height (cm):</label>
          <input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Age:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="17"
            max="70"
            required
          />
        </div>

        <div>
          <label>National ID:</label>
          <input
            type="text"
            name="nationalId"
            value={formData.nationalId}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              name="hasDisease"
              checked={formData.hasDisease}
              onChange={handleChange}
            />
            Has Disease
          </label>
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterDonor;

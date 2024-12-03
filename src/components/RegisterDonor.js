import React, { useState } from "react";
import { useLanguage } from "../LanguageContext";

const RegisterDonor = ({ contract }) => {
  const { t } = useLanguage();
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
      <h2>{t.register.title}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{t.register.name}</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>{t.register.bloodType}</label>
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

        <div className="form-group">
          <label>{t.register.weight}</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            min="45"
            required
          />
        </div>

        <div className="form-group">
          <label>{t.register.height}</label>
          <input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>{t.register.age}</label>
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

        <div className="form-group">
          <label>{t.register.nationalId}</label>
          <input
            type="text"
            name="nationalId"
            value={formData.nationalId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="hasDisease"
              checked={formData.hasDisease}
              onChange={handleChange}
            />
            {t.register.hasDisease}
          </label>
        </div>

        <button type="submit">{t.register.submit}</button>
      </form>
    </div>
  );
};

export default RegisterDonor;

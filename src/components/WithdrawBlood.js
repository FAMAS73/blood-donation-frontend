import React, { useState } from "react";

const WithdrawBlood = ({ contract }) => {
  const [formData, setFormData] = useState({
    recipientBloodType: "",
    component: "",
    quantity: "",
    hospital: "",
  });
  const [loading, setLoading] = useState(false);

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const bloodComponents = ["Whole Blood", "PRC", "FFP"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tx = await contract.withdrawCompatibleBloodUnits(
        formData.recipientBloodType,
        formData.component,
        parseInt(formData.quantity),
        formData.hospital
      );
      await tx.wait();
      alert("Blood units withdrawn successfully!");
      // Reset form
      setFormData({
        recipientBloodType: "",
        component: "",
        quantity: "",
        hospital: "",
      });
    } catch (error) {
      alert("Error withdrawing blood units: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="withdraw-blood">
      <h2>Withdraw Blood</h2>
      <form onSubmit={handleWithdraw}>
        <div>
          <label>Recipient Blood Type:</label>
          <select
            name="recipientBloodType"
            value={formData.recipientBloodType}
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
          <label>Blood Component:</label>
          <select
            name="component"
            value={formData.component}
            onChange={handleChange}
            required
          >
            <option value="">Select Component</option>
            {bloodComponents.map((comp) => (
              <option key={comp} value={comp}>
                {comp}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Quantity (ml):</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="450"
            step="450"
            placeholder="450 ml per unit"
            required
          />
        </div>

        <div>
          <label>Hospital Name:</label>
          <input
            type="text"
            name="hospital"
            value={formData.hospital}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Withdraw Blood"}
        </button>
      </form>

      <div className="info-box">
        <h3>Blood Type Compatibility Chart:</h3>
        <ul>
          <li>O- can donate to all blood types</li>
          <li>O+ can donate to O+, A+, B+, AB+</li>
          <li>A- can donate to A-, A+, AB-, AB+</li>
          <li>A+ can donate to A+, AB+</li>
          <li>B- can donate to B-, B+, AB-, AB+</li>
          <li>B+ can donate to B+, AB+</li>
          <li>AB- can donate to AB-, AB+</li>
          <li>AB+ can only donate to AB+</li>
        </ul>
      </div>
    </div>
  );
};

export default WithdrawBlood;

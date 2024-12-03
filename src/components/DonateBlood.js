import React, { useState } from "react";

const DonateBlood = ({ contract }) => {
  const [component, setComponent] = useState("");
  const [loading, setLoading] = useState(false);

  const bloodComponents = [
    "Whole Blood",
    "PRC",  // Packed Red Cells
    "FFP"   // Fresh Frozen Plasma
  ];

  const handleDonation = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tx = await contract.donateBlood(component);
      await tx.wait();
      alert("Blood donation recorded successfully!");
      setComponent("");
    } catch (error) {
      if (error.message.includes("Donor not registered")) {
        alert("Error: You must register as a donor first");
      } else {
        alert("Error recording blood donation: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="donate-blood">
      <h2>Donate Blood</h2>
      <form onSubmit={handleDonation}>
        <div>
          <label>Blood Component:</label>
          <select
            value={component}
            onChange={(e) => setComponent(e.target.value)}
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

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Donate"}
        </button>
      </form>

      <div className="info-box">
        <h3>Blood Components Information:</h3>
        <ul>
          <li><strong>Whole Blood:</strong> Complete blood donation</li>
          <li><strong>PRC (Packed Red Cells):</strong> Concentrated red blood cells</li>
          <li><strong>FFP (Fresh Frozen Plasma):</strong> Plasma separated from whole blood</li>
        </ul>
      </div>
    </div>
  );
};

export default DonateBlood;

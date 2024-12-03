import React, { useState } from "react";
import { useLanguage } from "../LanguageContext";

const DonateBlood = ({ contract }) => {
  const { t } = useLanguage();
  const [component, setComponent] = useState("");
  const [loading, setLoading] = useState(false);

  const bloodComponents = [
    { value: "Whole Blood", label: t.donate.wholeBlood },
    { value: "PRC", label: t.donate.prc },
    { value: "FFP", label: t.donate.ffp }
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
      <h2>{t.donate.title}</h2>
      <form onSubmit={handleDonation}>
        <div className="form-group">
          <label>{t.donate.component}</label>
          <select
            value={component}
            onChange={(e) => setComponent(e.target.value)}
            required
          >
            <option value="">{t.donate.component}</option>
            {bloodComponents.map((comp) => (
              <option key={comp.value} value={comp.value}>
                {comp.label}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : t.donate.submit}
        </button>
      </form>
    </div>
  );
};

export default DonateBlood;

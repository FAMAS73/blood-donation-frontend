import React, { useState } from "react";
import { useLanguage } from "../LanguageContext";

const WithdrawBlood = ({ contract }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    recipientBloodType: "",
    component: "",
    quantity: "",
    hospital: "",
  });
  const [loading, setLoading] = useState(false);

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const bloodComponents = [
    { value: "Whole Blood", label: t.donate.wholeBlood },
    { value: "PRC", label: t.donate.prc },
    { value: "FFP", label: t.donate.ffp }
  ];

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
      <h2>{t.withdraw.title}</h2>
      <form onSubmit={handleWithdraw}>
        <div className="form-group">
          <label>{t.withdraw.recipientBloodType}</label>
          <select
            name="recipientBloodType"
            value={formData.recipientBloodType}
            onChange={handleChange}
            required
          >
            <option value="">{t.withdraw.recipientBloodType}</option>
            {bloodTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>{t.withdraw.component}</label>
          <select
            name="component"
            value={formData.component}
            onChange={handleChange}
            required
          >
            <option value="">{t.withdraw.component}</option>
            {bloodComponents.map((comp) => (
              <option key={comp.value} value={comp.value}>
                {comp.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>{t.withdraw.quantity}</label>
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

        <div className="form-group">
          <label>{t.withdraw.hospital}</label>
          <input
            type="text"
            name="hospital"
            value={formData.hospital}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : t.withdraw.submit}
        </button>
      </form>
    </div>
  );
};

export default WithdrawBlood;

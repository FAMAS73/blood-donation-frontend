import React, { useState, useEffect } from "react";
import { useLanguage } from "../LanguageContext";

const DonorList = ({ contract }) => {
  const { t } = useLanguage();
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadDonors();
  }, [contract]);

  const loadDonors = async () => {
    try {
      setLoading(true);
      const totalDonors = await contract.totalDonors();
      const donorsList = [];

      for (let i = 1; i <= totalDonors; i++) {
        try {
          const donorAddress = await contract.getDonorByIndex(i);
          const donor = await contract.donors(donorAddress);
          
          if (donor.isRegistered) {
            donorsList.push({
              id: i,
              address: donorAddress,
              name: donor.name,
              bloodType: donor.bloodType,
              age: donor.age.toString(),
              weight: donor.weight.toString(),
              height: donor.height.toString(),
              isEligible: donor.isEligible,
              lastDonation: donor.lastDonation.toString(),
            });
          }
        } catch (err) {
          console.error(`Error loading donor ${i}:`, err);
        }
      }

      setDonors(donorsList);
    } catch (err) {
      setError("Error loading donors: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredDonors = donors.filter(donor => {
    const matchesSearch = donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donor.bloodType.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "eligible") return matchesSearch && donor.isEligible;
    if (filter === "ineligible") return matchesSearch && !donor.isEligible;
    return matchesSearch;
  });

  const formatDate = (timestamp) => {
    if (timestamp === "0") return "Never";
    return new Date(parseInt(timestamp) * 1000).toLocaleDateString();
  };

  if (loading) return <div>Loading donors...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="donor-list">
      <h2>{t.donors.title}</h2>
      
      <div className="donor-filters">
        <input
          type="text"
          placeholder={t.donors.search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">{t.donors.filter.all}</option>
          <option value="eligible">{t.donors.filter.eligible}</option>
          <option value="ineligible">{t.donors.filter.ineligible}</option>
        </select>

        <button onClick={loadDonors} className="refresh-button">
          {t.donors.refresh}
        </button>
      </div>

      <div className="donors-grid">
        {filteredDonors.length === 0 ? (
          <p>{t.donors.noDonors}</p>
        ) : (
          filteredDonors.map(donor => (
            <div key={donor.id} className={`donor-card ${donor.isEligible ? 'eligible' : 'ineligible'}`}>
              <h3>{donor.name}</h3>
              <div className="donor-details">
                <p><strong>{t.register.bloodType}:</strong> {donor.bloodType}</p>
                <p><strong>{t.register.age}:</strong> {donor.age}</p>
                <p><strong>{t.register.weight}:</strong> {donor.weight} kg</p>
                <p><strong>{t.register.height}:</strong> {donor.height} cm</p>
                <p><strong>Status:</strong> {donor.isEligible ? 'Eligible' : 'Ineligible'}</p>
                <p><strong>Last Donation:</strong> {formatDate(donor.lastDonation)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DonorList;

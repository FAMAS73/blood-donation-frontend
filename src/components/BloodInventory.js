import React, { useState, useEffect } from "react";
import { useLanguage } from "../LanguageContext";

const BloodInventory = ({ contract }) => {
  const { t } = useLanguage();
  const [availableUnits, setAvailableUnits] = useState({});
  const [withdrawnUnits, setWithdrawnUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [hospitalName, setHospitalName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const components = [
    { value: "Whole Blood", label: t.donate.wholeBlood },
    { value: "PRC", label: t.donate.prc },
    { value: "FFP", label: t.donate.ffp }
  ];

  useEffect(() => {
    loadAvailableUnits();
  }, [contract]);

  const loadAvailableUnits = async () => {
    try {
      setLoading(true);
      const totalUnits = await contract.totalBloodUnits();
      const units = {};
      
      // Initialize the units object
      bloodTypes.forEach(bloodType => {
        units[bloodType] = {};
        components.forEach(component => {
          units[bloodType][component.value] = 0;
        });
      });

      // Count available units
      for (let i = 1; i <= totalUnits; i++) {
        try {
          const unit = await contract.bloodUnits(i);
          if (!unit.isUsed && unit.isScreened) {
            if (units[unit.bloodType] && units[unit.bloodType][unit.component] !== undefined) {
              units[unit.bloodType][unit.component]++;
            }
          }
        } catch (err) {
          console.error(`Error loading unit ${i}:`, err);
        }
      }
      
      setAvailableUnits(units);
    } catch (err) {
      setError("Error loading available units: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadWithdrawnUnits = async () => {
    if (!hospitalName) {
      setError("Please enter a hospital name");
      return;
    }

    try {
      setLoading(true);
      const units = await contract.getWithdrawnBloodByHospital(hospitalName);
      const withdrawnDetails = await Promise.all(
        units.map(async (unitId) => {
          const unit = await contract.bloodUnits(unitId);
          return {
            unitId: unitId.toString(),
            bloodType: unit.bloodType,
            component: unit.component,
            quantity: unit.quantity.toString(),
            expiryDate: new Date(unit.expiryDate * 1000).toLocaleDateString(),
            isScreened: unit.isScreened,
            isUsed: unit.isUsed
          };
        })
      );
      setWithdrawnUnits(withdrawnDetails);
    } catch (err) {
      setError("Error loading withdrawn units: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getUnitDetails = async (unitId) => {
    try {
      setLoading(true);
      const unit = await contract.bloodUnits(unitId);
      setSelectedUnit({
        unitId,
        bloodType: unit.bloodType,
        component: unit.component,
        quantity: unit.quantity.toString(),
        expiryDate: new Date(unit.expiryDate * 1000).toLocaleDateString(),
        isScreened: unit.isScreened,
        isUsed: unit.isUsed,
        hospital: unit.hospital
      });
    } catch (err) {
      setError("Error loading unit details: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="blood-inventory">
      <h2>{t.inventory.title}</h2>

      {/* Available Units Section */}
      <div className="inventory-section">
        <h3>{t.inventory.available}</h3>
        <button onClick={loadAvailableUnits} disabled={loading}>
          {loading ? "Loading..." : t.inventory.refresh}
        </button>
        
        <div className="inventory-grid">
          {bloodTypes.map(bloodType => (
            <div key={bloodType} className="blood-type-card">
              <h4>{bloodType}</h4>
              {components.map(component => (
                <div key={component.value} className="component-row">
                  <span>{component.label}:</span>
                  <span>{availableUnits[bloodType]?.[component.value] || '0'} units</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Withdrawn Units Section */}
      <div className="inventory-section">
        <h3>{t.inventory.withdrawn}</h3>
        <div className="search-hospital">
          <input
            type="text"
            placeholder={t.inventory.searchHospital}
            value={hospitalName}
            onChange={(e) => setHospitalName(e.target.value)}
          />
          <button onClick={loadWithdrawnUnits} disabled={loading}>
            {loading ? "Loading..." : "Search"}
          </button>
        </div>

        {withdrawnUnits.length > 0 && (
          <div className="withdrawn-units-grid">
            {withdrawnUnits.map((unit) => (
              <div key={unit.unitId} className="unit-card">
                <h4>Unit ID: {unit.unitId}</h4>
                <p>{t.register.bloodType}: {unit.bloodType}</p>
                <p>{t.withdraw.component}: {unit.component}</p>
                <p>{t.withdraw.quantity}: {unit.quantity} ml</p>
                <p>Expiry: {unit.expiryDate}</p>
                <p>Status: {unit.isUsed ? 'Used' : 'Available'}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Unit Details Section */}
      <div className="inventory-section">
        <h3>{t.inventory.unitDetails}</h3>
        <div className="search-unit">
          <input
            type="number"
            placeholder={t.inventory.enterUnitId}
            onChange={(e) => getUnitDetails(e.target.value)}
          />
        </div>

        {selectedUnit && (
          <div className="unit-details">
            <h4>Unit ID: {selectedUnit.unitId}</h4>
            <p>{t.register.bloodType}: {selectedUnit.bloodType}</p>
            <p>{t.withdraw.component}: {selectedUnit.component}</p>
            <p>{t.withdraw.quantity}: {selectedUnit.quantity} ml</p>
            <p>Expiry Date: {selectedUnit.expiryDate}</p>
            <p>Screened: {selectedUnit.isScreened ? 'Yes' : 'No'}</p>
            <p>Used: {selectedUnit.isUsed ? 'Yes' : 'No'}</p>
            <p>{t.withdraw.hospital}: {selectedUnit.hospital || 'Not assigned'}</p>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default BloodInventory;

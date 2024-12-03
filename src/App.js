import React, { useState, useEffect } from "react";
import { ethers, BrowserProvider } from "ethers";
import RegisterDonor from "./components/RegisterDonor";
import DonateBlood from "./components/DonateBlood";
import WithdrawBlood from "./components/WithdrawBlood";
import DonorList from "./components/DonorList";
import BloodInventory from "./components/BloodInventory";
import { contractAddress, abi, setupNetwork } from "./contract/config";
import { LanguageProvider, useLanguage } from "./LanguageContext";
import "./App.css";

const AppContent = () => {
  const [contract, setContract] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('actions');
  const { t, language, toggleLanguage } = useLanguage();

  useEffect(() => {
    const init = async () => {
      try {
        if (typeof window.ethereum === "undefined") {
          throw new Error("Please install MetaMask to use this application");
        }

        await window.ethereum.request({ method: "eth_requestAccounts" });
        await setupNetwork();

        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const bloodDonationContract = new ethers.Contract(contractAddress, abi, signer);
        
        setContract(bloodDonationContract);
      } catch (err) {
        setError(err.message);
      }
    };

    init();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => window.location.reload());
      window.ethereum.on("chainChanged", () => window.location.reload());
    }
  }, []);

  if (error) {
    return (
      <div className="error-message">
        <h2>Error</h2>
        <p>{error}</p>
        <p>Please make sure MetaMask is installed and connected to Sepolia network.</p>
      </div>
    );
  }

  if (!contract) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>{t.title}</h1>
          <button className="language-toggle" onClick={toggleLanguage}>
            {language === 'en' ? 'ไทย' : 'English'}
          </button>
        </div>
        <div className="main-nav">
          <button 
            className={`main-nav-button ${activeTab === 'actions' ? 'active' : ''}`}
            onClick={() => setActiveTab('actions')}
          >
            {t.tabs.actions}
          </button>
          <button 
            className={`main-nav-button ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            {t.tabs.inventory}
          </button>
        </div>
      </header>

      <main className="app-main">
        {activeTab === 'actions' ? (
          <>
            <div className="components-container">
              <RegisterDonor contract={contract} />
              <DonateBlood contract={contract} />
              <WithdrawBlood contract={contract} />
            </div>
            <div className="donor-list-container">
              <DonorList contract={contract} />
            </div>
          </>
        ) : (
          <BloodInventory contract={contract} />
        )}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;

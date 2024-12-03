import React, { useState, useEffect } from "react";
import { ethers, BrowserProvider } from "ethers";
import RegisterDonor from "./components/RegisterDonor";
import DonateBlood from "./components/DonateBlood";
import WithdrawBlood from "./components/WithdrawBlood";
import { contractAddress, abi, setupNetwork } from "./contract/config";
import "./App.css";

const App = () => {
  const [contract, setContract] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Check if MetaMask is installed
        if (typeof window.ethereum === "undefined") {
          throw new Error("Please install MetaMask to use this application");
        }

        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });
        
        // Setup Sepolia network
        await setupNetwork();

        // Setup provider and contract
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const bloodDonationContract = new ethers.Contract(contractAddress, abi, signer);
        
        setContract(bloodDonationContract);
      } catch (err) {
        setError(err.message);
      }
    };

    init();

    // Listen for account changes
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
    return <div>Loading...</div>;
  }

  return (
    <div className="app-container">
      <h1>Blood Donation System</h1>
      <div className="components-container">
        <RegisterDonor contract={contract} />
        <DonateBlood contract={contract} />
        <WithdrawBlood contract={contract} />
      </div>
    </div>
  );
};

export default App;

import abi from './abi.json';

export const contractAddress = "0x7AB020f7D665D3AEE63DD8C7E19106299fFF6e27";
export const SEPOLIA_CHAIN_ID = "0xaa36a7"; // Chain ID for Sepolia in hex

export const setupNetwork = async () => {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SEPOLIA_CHAIN_ID }],
    });
  } catch (switchError) {
    // If Sepolia network is not added, add it
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: SEPOLIA_CHAIN_ID,
            chainName: "Sepolia Test Network",
            nativeCurrency: {
              name: "SepoliaETH",
              symbol: "ETH",
              decimals: 18,
            },
            rpcUrls: ["https://sepolia.infura.io/v3/"],
            blockExplorerUrls: ["https://sepolia.etherscan.io/"],
          },
        ],
      });
    }
  }
};

export { abi };

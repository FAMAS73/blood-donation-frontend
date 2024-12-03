# Blood Donation DApp Frontend

A decentralized application (DApp) for managing blood donations on the Ethereum blockchain. This frontend interfaces with a smart contract deployed on the Sepolia testnet to facilitate blood donation management.

## Features

- **Donor Registration**: Register as a blood donor with personal details
- **Blood Donation**: Record blood donations with different components
- **Blood Withdrawal**: Hospital interface for withdrawing compatible blood units
- **MetaMask Integration**: Secure blockchain transactions
- **Sepolia Testnet**: Test environment for the DApp

## Smart Contract Features

- Blood type compatibility checking
- Multiple blood components support (Whole Blood, PRC, FFP)
- Donor eligibility verification
- Hospital-based blood unit tracking

## Prerequisites

- Node.js and npm installed
- MetaMask browser extension
- Sepolia testnet ETH for transactions

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd blood-donation-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure the application:
- The smart contract is deployed at: `0x7AB020f7D665D3AEE63DD8C7E19106299fFF6e27` on Sepolia testnet
- Ensure MetaMask is connected to Sepolia testnet

4. Start the development server:
```bash
npm start
```

## Usage

### 1. Register as a Donor
- Connect MetaMask to Sepolia testnet
- Fill in the registration form with:
  - Full name
  - Blood type
  - Weight (minimum 45kg)
  - Height
  - Age (17-70 years)
  - National ID
  - Disease status

### 2. Donate Blood
- Select blood component:
  - Whole Blood
  - PRC (Packed Red Cells)
  - FFP (Fresh Frozen Plasma)
- Confirm the transaction in MetaMask

### 3. Withdraw Blood (Hospitals)
- Enter recipient's blood type
- Select required component
- Specify quantity (in ml)
- Enter hospital name
- System automatically checks blood type compatibility

## Blood Type Compatibility Chart

| Donor    | Can Give To                           |
|----------|---------------------------------------|
| O-       | All blood types                       |
| O+       | O+, A+, B+, AB+                       |
| A-       | A-, A+, AB-, AB+                      |
| A+       | A+, AB+                               |
| B-       | B-, B+, AB-, AB+                      |
| B+       | B+, AB+                               |
| AB-      | AB-, AB+                              |
| AB+      | AB+ only                              |

## Technical Details

### Technologies Used
- React.js
- ethers.js v6
- MetaMask
- Ethereum (Sepolia testnet)

### Smart Contract Integration
- Contract Address: `0x7AB020f7D665D3AEE63DD8C7E19106299fFF6e27`
- Network: Sepolia Testnet
- Interface: ethers.js Contract instance

### Component Structure
```
src/
├── components/
│   ├── RegisterDonor.js
│   ├── DonateBlood.js
│   └── WithdrawBlood.js
├── contract/
│   ├── abi.json
│   └── config.js
└── App.js
```

## Error Handling

The application includes comprehensive error handling for:
- MetaMask connection issues
- Network switching
- Transaction failures
- Form validation
- Smart contract reverts

## Development

### Available Scripts

- `npm start`: Run development server
- `npm build`: Create production build
- `npm test`: Run tests
- `npm eject`: Eject from Create React App

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

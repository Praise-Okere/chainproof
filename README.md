# ChainProof - ISO-Aligned Payment Proof System on Flare

A production-ready React application for generating, verifying, and anchoring ISO-compliant payment proofs on the Flare blockchain. ChainProof combines neo-brutalist design with robust financial compliance standards.

## Core Requirements ✅

### All Tracks
- ✅ **ProofRails Integration**: Generates ISO-aligned records (PAIN, PACS, CAMT, REMT)
- ✅ **Flare Anchoring**: Records are anchored on Flare Network via smart contract
- ✅ **Working Frontend**: Full React UI with real user flow
- ✅ **Real User Flow**: Complete journey from proof generation to download and sharing

## Features

- **ISO-Compliant Records**: Automatically generates PAIN, PACS, CAMT, REMT formats
- **Proof Generation**: Create verifiable payment proofs from Flare transaction hashes
- **Flare Anchoring**: Hash anchoring via smart contract with immutable timestamps
- **Multi-Format Downloads**: Export proofs as JSON or PDF with full compliance metadata
- **Shareable Links**: Generate unique, shareable URLs for instant verification
- **Neo-Brutalist UI**: Bold, distinctive design with electric green accents (#39ff14)
- **Verification Badges**: Real-time blockchain verification status
- **Mobile Responsive**: Fully responsive design using Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

Build for production:
```bash
npm run build
```

### Preview

Preview the production build:
```bash
npm run preview
```

## Usage

1. **Generate Proof**: Enter a Flare transaction hash and click "GENERATE PROOF"
2. **View Details**: See transaction info, verification status, and network anchor
3. **Download Options**:
   - **JSON**: Complete proof bundle with ISO metadata
   - **PDF**: Professional certificate with verification details
4. **Share**: Copy the shareable link (https://chainproof.app/#proof-[id])
5. **Verify**: Recipients can access the proof via the shared link or scan QR code

## Smart Contract Deployment

### Deploy HashAnchor.sol

Using Hardhat (recommended):

```bash
npx hardhat init
# Copy HashAnchor.sol to contracts/
npx hardhat compile
npx hardhat run scripts/deploy.js --network coston2
```

Get the contract address from deployment output and store it for frontend integration.

### Network Configuration (hardhat.config.js)

```javascript
module.exports = {
  solidity: "0.8.0",
  networks: {
    coston2: {
      url: "https://coston2-api.flare.network/ext/C/rpc",
      accounts: ["YOUR_PRIVATE_KEY"]
    }
  }
};
```

## ProofRails Integration

The app automatically generates ISO-compliant records:

```typescript
// Records generated include:
- PAIN: Payment initialization with full transaction details
- PACS: Payment status and verification confirmation  
- CAMT: Cash management and transaction reporting
- REMT: Remittance advice with payment reference
```

All records include:
- Flare network anchor reference
- Transaction hash verification
- Timestamp and sender information
- Compliance metadata

## Technologies

- **React 18** with TypeScript for type-safe UI development
- **Vite** for fast build tooling and development server
- **Tailwind CSS** with custom fonts (DM Sans, JetBrains Mono) for neo-brutalist styling
- **jsPDF** for PDF certificate generation
- **Solidity** (HashAnchor.sol) for smart contract-based hash anchoring on Flare
- **ProofRails** for ISO 20022 record generation (PAIN, PACS, CAMT, REMT)

## Project Structure

```
flare/
├── src/
│   ├── App.tsx              # Main React component with all pages
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── contracts/
│   └── HashAnchor.sol       # Smart contract for hash anchoring
├── scripts/
│   └── deploy.js            # Hardhat deployment script
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

## Troubleshooting

- If the build fails, ensure all dependencies are installed with `npm install`
- For TypeScript errors, check the `tsconfig.json` configuration
- If Tailwind styles are not applying, verify the `tailwind.config.js` content paths
- For smart contract deployment issues, ensure your private key is set in `.env`
- For ProofRails records generation, verify the transaction data format matches ISO 20022 standards
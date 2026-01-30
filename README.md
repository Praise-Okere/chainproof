# Flare Proof-of-Payment Share Links

A single-page React application for generating shareable proof-of-payment links for Flare blockchain transactions.

## Features

- Generate proof-of-payment links from Flare transaction hashes
- Display detailed payment information with verification badge
- Download proof bundles in JSON format
- Shareable links with unique IDs
- Mobile-responsive design using Tailwind CSS
- Mock ProofRails API integration

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

1. Enter a Flare transaction hash in the input field
2. Click "Generate Proof Link" to create a proof
3. View the proof details, including amount, sender, recipient, and timestamp
4. Use the "Download Proof Bundle" button to save the proof as JSON
5. Copy the shareable link using the "Copy Share Link" button

## Mock Data

The application uses mock data for demonstration purposes. In a real implementation, integrate with the actual ProofRails API.

## Technologies

- React 18
- TypeScript
- Vite
- Tailwind CSS

## Troubleshooting

- If the build fails, ensure all dependencies are installed with `npm install`
- For TypeScript errors, check the `tsconfig.json` configuration
- If Tailwind styles are not applying, verify the `tailwind.config.js` content paths
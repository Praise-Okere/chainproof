import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';

interface Proof {
  proofId: string;
  txHash: string;
  amount: string;
  currency: string;
  sender: string;
  recipient: string;
  timestamp: string;
  flareAnchor: string;
  recordHash: string;
  status: string;
}

function App() {
  const [txHash, setTxHash] = useState('');
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentProof, setCurrentProof] = useState<Proof | null>(null);
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#proof-')) {
      const proofId = hash.slice(7);
      const proof = proofs.find(p => p.proofId === proofId);
      if (proof) setCurrentProof(proof);
    }
  }, [proofs]);

  const generateProof = () => {
    if (!txHash.trim()) {
      setError('Please enter a transaction hash');
      return;
    }
    setLoading(true);
    setError('');
    // Simulate API call
    setTimeout(() => {
      const proofId = crypto.randomUUID();
      const proof: Proof = {
        proofId,
        txHash,
        amount: '100.00',
        currency: 'USDT0',
        sender: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        recipient: '0x742d35Cc6634C0532925a3b844Bc454e4438f44f',
        timestamp: new Date().toISOString(),
        flareAnchor: 'block-12345',
        recordHash: '0xdef123...',
        status: 'verified'
      };
      setProofs(prev => [...prev, proof]);
      setCurrentProof(proof);
      window.location.hash = `proof-${proofId}`;
      setLoading(false);
    }, 2000);
  };

  const downloadProof = (proof: Proof, format: 'json' | 'pdf' = 'json') => {
    if (format === 'json') {
      // Enhanced JSON with comprehensive proof data
      const proofBundle = {
        metadata: {
          generator: "ChainProof",
          version: "1.0.0",
          generatedAt: new Date().toISOString(),
          proofId: proof.proofId
        },
        verification: {
          status: proof.status,
          network: "Flare Network",
          anchor: proof.flareAnchor,
          explorerUrl: `https://coston2-explorer.flare.network/tx/${proof.txHash}`
        },
        transaction: {
          hash: proof.txHash,
          amount: proof.amount,
          currency: proof.currency,
          sender: proof.sender,
          recipient: proof.recipient,
          timestamp: proof.timestamp,
          recordHash: proof.recordHash
        },
        proof: {
          type: "Payment Proof",
          description: `Proof of payment of ${proof.amount} ${proof.currency} from ${proof.sender.substring(0, 10)}... to ${proof.recipient.substring(0, 10)}...`,
          shareableUrl: `https://chainproof.app/#proof-${proof.proofId}`
        }
      };

      const dataStr = JSON.stringify(proofBundle, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileDefaultName = `chainproof-${proof.proofId}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } else if (format === 'pdf') {
      // Generate PDF proof certificate
      const doc = new jsPDF();
      
      // Set up the PDF
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.text('ChainProof', 105, 30, { align: 'center' });
      
      doc.setFontSize(16);
      doc.text('Payment Proof Certificate', 105, 45, { align: 'center' });
      
      // Proof ID
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text(`Proof ID: ${proof.proofId}`, 20, 70);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 80);
      
      // Transaction Details
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('Transaction Details', 20, 100);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Amount: ${proof.amount} ${proof.currency}`, 20, 115);
      doc.text(`From: ${proof.sender}`, 20, 125);
      doc.text(`To: ${proof.recipient}`, 20, 135);
      doc.text(`Timestamp: ${new Date(proof.timestamp).toLocaleString()}`, 20, 145);
      doc.text(`Transaction Hash:`, 20, 155);
      doc.text(proof.txHash, 20, 165, { maxWidth: 170 });
      
      // Verification
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('Verification', 20, 185);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Status: ${proof.status.toUpperCase()}`, 20, 200);
      doc.text(`Network: Flare Network`, 20, 210);
      doc.text(`Anchor: ${proof.flareAnchor}`, 20, 220);
      doc.text(`Record Hash: ${proof.recordHash}`, 20, 230, { maxWidth: 170 });
      
      // Footer
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.text('This proof was generated by ChainProof - Verify at chainproof.app', 20, 250);
      doc.text(`Shareable Link: https://chainproof.app/#proof-${proof.proofId}`, 20, 260, { maxWidth: 170 });
      
      // Save the PDF
      doc.save(`chainproof-${proof.proofId}.pdf`);
    }
  };

  const copyLink = () => {
    // Use production URL without network segment to match app routing
    const baseUrl = 'https://chainproof.app';
    const hash = window.location.hash;
    // Result: https://chainproof.app/#proof-...
    const shareUrl = `${baseUrl}${hash}`;
    navigator.clipboard.writeText(shareUrl);
    // Add visual feedback
    const button = document.querySelector('[data-copy-link]');
    if (button) {
      button.classList.add('scale-95');
      setTimeout(() => button.classList.remove('scale-95'), 150);
    }
    alert('Link copied to clipboard');
  };

  if (showLanding) {
    return (
      <div className="min-h-screen bg-black text-gray-100 relative overflow-hidden">
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(57, 255, 20, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(57, 255, 20, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}></div>

        <div className="relative z-10">
          {/* Header */}
          <header className="p-6 border-b-2 border-gray-800">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex items-center space-x-3">
                {/* ChainProof Logo */}
                <svg width="40" height="40" viewBox="0 0 40 40" className="text-[#39ff14]">
                  <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor:'#39ff14', stopOpacity:1}} />
                      <stop offset="100%" style={{stopColor:'#00ffff', stopOpacity:1}} />
                    </linearGradient>
                  </defs>
                  {/* Shield shape with 3 hexagons */}
                  <path d="M20 5 L32 10 L32 20 L20 30 L8 20 L8 10 Z" fill="none" stroke="url(#logoGradient)" strokeWidth="2"/>
                  <polygon points="20,8 26,11 26,17 20,22 14,17 14,11" fill="none" stroke="url(#logoGradient)" strokeWidth="1" opacity="0.7"/>
                  <polygon points="20,12 23,13.5 23,16.5 20,18 17,16.5 17,13.5" fill="url(#logoGradient)" opacity="0.5"/>
                </svg>
                <span className="text-2xl font-bold text-white">ChainProof</span>
              </div>
              <nav className="hidden md:flex space-x-8">
                <a href="#features" className="text-gray-300 hover:text-[#39ff14] transition-colors">Features</a>
                <a href="#how-it-works" className="text-gray-300 hover:text-[#39ff14] transition-colors">How It Works</a>
              </nav>
            </div>
          </header>

          {/* Hero Section - Asymmetric */}
          <section className="py-20 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 lg:col-start-1">
                  <h1 className="text-6xl lg:text-8xl font-black leading-none mb-6 text-white">
                    PROVE<br/>
                    <span className="text-[#39ff14]">PAYMENTS</span><br/>
                    SHARE<br/>
                    TRUST
                  </h1>
                  <p className="text-xl text-gray-300 mb-8 max-w-md">
                    Generate bulletproof payment proofs for Flare blockchain transactions. 
                    Share with confidence, verify with certainty.
                  </p>
                  <button
                    onClick={() => setShowLanding(false)}
                    className="bg-[#39ff14] text-black px-8 py-4 text-lg font-bold border-2 border-[#39ff14] hover:bg-black hover:text-[#39ff14] transition-all duration-200 transform hover:scale-105 shadow-[0_8px_32px_rgba(57,255,20,0.3)]"
                  >
                    START VERIFYING →
                  </button>
                </div>
                <div className="lg:col-span-4 lg:col-start-9">
                  {/* Transaction Input Preview */}
                  <div className="bg-gray-900 border-2 border-gray-700 p-6 transform rotate-1 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
                    <div className="text-sm text-gray-400 mb-2 font-mono">Transaction Hash</div>
                    <div className="bg-black border border-gray-600 p-4 font-mono text-[#39ff14] text-sm">
                      0x742d35Cc6634C0532925a3b844Bc454e4438f44e
                    </div>
                    <button className="w-full bg-[#39ff14] text-black py-3 mt-4 font-bold border-2 border-[#39ff14] hover:bg-black hover:text-[#39ff14] transition-all duration-200">
                      GENERATE PROOF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-20 px-6 bg-gray-900">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-black text-white mb-12 text-center">WHY ChainProof?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-black border-2 border-gray-700 p-8 transform -rotate-1 shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:transform hover:rotate-0 transition-transform duration-300">
                  <div className="w-12 h-12 bg-[#39ff14] mb-4 flex items-center justify-center">
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Immutable Proofs</h3>
                  <p className="text-gray-300">Every proof is anchored to the Flare network, creating unforgeable payment records.</p>
                </div>
                <div className="bg-black border-2 border-gray-700 p-8 transform rotate-1 shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:transform hover:rotate-0 transition-transform duration-300">
                  <div className="w-12 h-12 bg-[#39ff14] mb-4 flex items-center justify-center">
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Instant Sharing</h3>
                  <p className="text-gray-300">Generate unique, shareable links and QR codes for immediate payment verification.</p>
                </div>
                <div className="bg-black border-2 border-gray-700 p-8 transform -rotate-1 shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:transform hover:rotate-0 transition-transform duration-300">
                  <div className="w-12 h-12 bg-[#39ff14] mb-4 flex items-center justify-center">
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Export Ready</h3>
                  <p className="text-gray-300">Download comprehensive proof bundles in JSON format for records and compliance.</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-5xl font-black text-white mb-6">
                READY TO <span className="text-[#39ff14]">PROVE</span> YOUR PAYMENTS?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join the future of transparent crypto payments.
              </p>
              <button
                onClick={() => setShowLanding(false)}
                className="bg-black text-[#39ff14] px-12 py-6 text-2xl font-black border-3 border-[#39ff14] hover:bg-[#39ff14] hover:text-black transition-all duration-200 transform hover:scale-105 shadow-[0_16px_64px_rgba(57,255,20,0.4)]"
              >
                GET STARTED NOW
              </button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (currentProof) {
    return (
      <div className="min-h-screen bg-black text-gray-100 relative overflow-hidden">
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 animate-pulse" style={{
            backgroundImage: `linear-gradient(rgba(57, 255, 20, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(57, 255, 20, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="relative z-10 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <header className="mb-8">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setCurrentProof(null)}
                  className="text-[#39ff14] hover:text-white transition-colors flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  BACK TO FORM
                </button>
                <div className="flex items-center space-x-3">
                  <svg width="32" height="32" viewBox="0 0 40 40" className="text-[#39ff14]">
                    <defs>
                      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{stopColor:'#39ff14', stopOpacity:1}} />
                        <stop offset="100%" style={{stopColor:'#00ffff', stopOpacity:1}} />
                      </linearGradient>
                    </defs>
                    <path d="M20 5 L32 10 L32 20 L20 30 L8 20 L8 10 Z" fill="none" stroke="url(#logoGradient)" strokeWidth="2"/>
                    <polygon points="20,8 26,11 26,17 20,22 14,17 14,11" fill="none" stroke="url(#logoGradient)" strokeWidth="1" opacity="0.7"/>
                    <polygon points="20,12 23,13.5 23,16.5 20,18 17,16.5 17,13.5" fill="url(#logoGradient)" opacity="0.5"/>
                  </svg>
                  <span className="text-2xl font-bold text-white">ChainProof</span>
                </div>
              </div>
            </header>

            {/* Hero Amount */}
            <div className="text-center mb-12">
              <div className="inline-block bg-[#39ff14] text-black px-8 py-4 border-3 border-[#39ff14] transform rotate-1 shadow-[0_16px_64px_rgba(57,255,20,0.4)]">
                <div className="text-sm font-mono text-black/70 mb-1">PAYMENT AMOUNT</div>
                <div className="text-6xl font-black">{currentProof.amount} {currentProof.currency}</div>
              </div>
            </div>

            {/* Verification Badge */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center bg-black text-[#39ff14] px-6 py-3 border-2 border-[#39ff14] font-bold text-lg shadow-[0_8px_32px_rgba(57,255,20,0.3)] animate-pulse">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                VERIFIED ON FLARE NETWORK
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Transaction Details - Terminal Style */}
              <div className="lg:col-span-2">
                <div className="bg-gray-900 border-2 border-gray-700 p-6 font-mono text-sm">
                  <div className="text-[#39ff14] mb-4 font-bold">TRANSACTION DETAILS</div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Hash:</span>
                      <span className="text-[#39ff14] break-all">{currentProof.txHash}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Sender:</span>
                      <span className="text-white break-all">{currentProof.sender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Recipient:</span>
                      <span className="text-white break-all">{currentProof.recipient}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Timestamp:</span>
                      <span className="text-white">{new Date(currentProof.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Network:</span>
                      <span className="text-[#39ff14]">Flare Network</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Flare Anchor:</span>
                      <span className="text-[#39ff14]">{currentProof.flareAnchor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Record Hash:</span>
                      <span className="text-white break-all">{currentProof.recordHash}</span>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-700">
                    <a
                      href={`https://coston2-explorer.flare.network/tx/${currentProof.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[#39ff14] hover:text-white transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      VIEW ON FLARE EXPLORER
                    </a>
                  </div>
                </div>
              </div>

              {/* Share Section */}
              <div className="space-y-6">
                {/* QR Code */}
                <div className="bg-white p-6 border-2 border-gray-800 transform rotate-1">
                  <div className="text-center mb-4">
                    <div className="text-black font-bold">SHARE PROOF</div>
                  </div>
                  {/* Simple QR Code Placeholder */}
                  <div className="w-32 h-32 mx-auto bg-black border-2 border-gray-600 p-2">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-[#39ff14]">
                      <rect x="10" y="10" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="2"/>
                      <rect x="20" y="20" width="20" height="20" fill="currentColor"/>
                      <rect x="60" y="20" width="20" height="20" fill="currentColor"/>
                      <rect x="20" y="60" width="20" height="20" fill="currentColor"/>
                      <rect x="60" y="60" width="20" height="20" fill="currentColor"/>
                      <rect x="40" y="40" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div className="text-center mt-4">
                    <div className="text-xs text-gray-600 font-mono break-all">
                      {`https://chainproof.app${window.location.hash}`}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <button
                    onClick={copyLink}
                    data-copy-link
                    className="w-full bg-[#39ff14] text-black py-4 border-2 border-[#39ff14] font-black text-lg hover:bg-black hover:text-[#39ff14] transition-all duration-200 transform hover:scale-105 shadow-[0_8px_32px_rgba(57,255,20,0.3)]"
                  >
                    COPY LINK
                  </button>
                  <button
                    onClick={() => downloadProof(currentProof, 'json')}
                    className="w-full bg-black text-[#39ff14] py-3 border-2 border-[#39ff14] font-bold hover:bg-[#39ff14] hover:text-black transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    DOWNLOAD JSON
                  </button>
                  <button
                    onClick={() => downloadProof(currentProof, 'pdf')}
                    className="w-full bg-gray-800 text-white py-3 border-2 border-gray-600 font-bold hover:border-[#39ff14] hover:text-[#39ff14] transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    DOWNLOAD PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 animate-pulse" style={{
          backgroundImage: `linear-gradient(rgba(57, 255, 20, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(57, 255, 20, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-12">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setShowLanding(true)}
                className="text-[#39ff14] hover:text-white transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                BACK TO HOME
              </button>
              <div className="flex items-center space-x-3">
                <svg width="32" height="32" viewBox="0 0 40 40" className="text-[#39ff14]">
                  <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor:'#39ff14', stopOpacity:1}} />
                      <stop offset="100%" style={{stopColor:'#00ffff', stopOpacity:1}} />
                    </linearGradient>
                  </defs>
                  <path d="M20 5 L32 10 L32 20 L20 30 L8 20 L8 10 Z" fill="none" stroke="url(#logoGradient)" strokeWidth="2"/>
                  <polygon points="20,8 26,11 26,17 20,22 14,17 14,11" fill="none" stroke="url(#logoGradient)" strokeWidth="1" opacity="0.7"/>
                  <polygon points="20,12 23,13.5 23,16.5 20,18 17,16.5 17,13.5" fill="url(#logoGradient)" opacity="0.5"/>
                </svg>
                <span className="text-2xl font-bold text-white">ChainProof</span>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Form Section */}
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl font-black text-white mb-4">GENERATE PROOF</h1>
                <p className="text-lg text-gray-300">Enter your Flare transaction hash to create an immutable payment proof.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-[#39ff14] mb-2 font-mono">TRANSACTION HASH</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="0x..."
                      value={txHash}
                      onChange={(e) => setTxHash(e.target.value)}
                      className="w-full bg-black border-3 border-gray-600 p-6 text-xl font-mono text-[#39ff14] placeholder-gray-500 focus:border-[#39ff14] focus:outline-none transition-all duration-200"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-[#39ff14] border-t-transparent animate-spin rounded-full"></div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setTxHash('0x742d35Cc6634C0532925a3b844Bc454e4438f44e')}
                  className="w-full bg-gray-800 text-white py-4 border-2 border-gray-600 hover:border-[#39ff14] hover:text-[#39ff14] transition-all duration-200 font-bold"
                >
                  USE SAMPLE HASH
                </button>

                {error && (
                  <div className="bg-[#ff006e] text-black p-4 border-2 border-[#ff006e] font-bold">
                    ERROR: {error}
                  </div>
                )}

                <button
                  onClick={generateProof}
                  disabled={loading}
                  className="w-full bg-[#39ff14] text-black py-6 text-2xl font-black border-3 border-[#39ff14] hover:bg-black hover:text-[#39ff14] transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-[0_12px_40px_rgba(57,255,20,0.4)]"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 border-3 border-black border-t-transparent animate-spin rounded-full mr-3"></div>
                      GENERATING...
                    </div>
                  ) : (
                    'GENERATE PROOF →'
                  )}
                </button>
              </div>
            </div>

            {/* Info Section */}
            <div className="space-y-8">
              <div className="bg-gray-900 border-2 border-gray-700 p-6 transform rotate-1">
                <h3 className="text-2xl font-bold text-white mb-4">HOW IT WORKS</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-[#39ff14] text-black font-bold flex items-center justify-center text-lg">1</div>
                    <div>
                      <h4 className="font-bold text-white">Enter Hash</h4>
                      <p className="text-gray-300 text-sm">Paste your transaction hash from Flare explorer</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-[#39ff14] text-black font-bold flex items-center justify-center text-lg">2</div>
                    <div>
                      <h4 className="font-bold text-white">Generate Proof</h4>
                      <p className="text-gray-300 text-sm">System creates verifiable proof with Flare anchor</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-[#39ff14] text-black font-bold flex items-center justify-center text-lg">3</div>
                    <div>
                      <h4 className="font-bold text-white">Share & Verify</h4>
                      <p className="text-gray-300 text-sm">Share link or download proof bundle</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 border-2 border-gray-700 p-6 transform -rotate-1">
                <h3 className="text-2xl font-bold text-white mb-4">FEATURES</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-[#39ff14] border border-[#39ff14]"></div>
                    <span className="text-gray-300">Immutable blockchain verification</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-[#39ff14] border border-[#39ff14]"></div>
                    <span className="text-gray-300">Instant shareable links</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-[#39ff14] border border-[#39ff14]"></div>
                    <span className="text-gray-300">JSON proof bundles</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-[#39ff14] border border-[#39ff14]"></div>
                    <span className="text-gray-300">Mobile responsive</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
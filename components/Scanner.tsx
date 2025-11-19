import React, { useState, useRef, useEffect } from 'react';
import { Scan, CheckCircle, XCircle, ShieldCheck, Loader2, Camera, X, Zap, ZoomIn, Maximize } from 'lucide-react';
import { Product, Transaction } from '../types';
import { MOCK_PRODUCTS, INITIAL_TRANSACTIONS } from '../constants';
import { analyzeProductChain } from '../services/geminiService';

export const Scanner: React.FC = () => {
  const [scanInput, setScanInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<{ product: Product | null; history: Transaction[]; verified: boolean; analysis: string } | null>(null);

  // Camera State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [zoomRange, setZoomRange] = useState({ min: 1, max: 3, step: 0.1 });
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [cameraError, setCameraError] = useState<string>('');

  const performScan = async (id: string) => {
    setIsScanning(true);
    setResult(null);
    setScanInput(id);

    // Simulate network/blockchain lookup delay
    setTimeout(async () => {
      // In a real app, this queries the blockchain
      const product = MOCK_PRODUCTS.find(p => p.id === id);
      
      if (product) {
        // In a real app, verify hash integrity here
        const history = INITIAL_TRANSACTIONS.filter(t => t.productId === product.id);
        const analysis = await analyzeProductChain(product, history);
        
        setResult({
          product,
          history,
          verified: product.status !== 'Flagged (Suspected Fake)',
          analysis
        });
      } else {
        setResult({
          product: null,
          history: [],
          verified: false,
          analysis: "Product ID not found on the blockchain. This item may be counterfeit."
        });
      }
      setIsScanning(false);
    }, 1500);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performScan(scanInput);
  };

  const startCamera = async () => {
    setCameraError('');
    try {
      // Request HD/4K resolution and environment camera for best clarity
      const constraints = {
        audio: false,
        video: {
          facingMode: 'environment',
          width: { ideal: 3840 }, // 4K Ideal
          height: { ideal: 2160 },
          focusMode: 'continuous' // Attempt continuous focus
        }
      } as any;

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Check for zoom capabilities from the track
      const track = stream.getVideoTracks()[0];
      const capabilities = (track.getCapabilities ? track.getCapabilities() : {}) as any;

      if (capabilities.zoom) {
        setZoomRange({
          min: capabilities.zoom.min,
          max: capabilities.zoom.max,
          step: capabilities.zoom.step
        });
      }

      setShowCamera(true);
    } catch (err: any) {
      console.error("Camera Error:", err);
      setCameraError("Unable to access high-definition camera. Please ensure permissions are granted.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
    setIsTorchOn(false);
    setZoom(1);
  };

  const handleZoom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = parseFloat(e.target.value);
    setZoom(newZoom);
    
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const track = stream.getVideoTracks()[0];
      if ((track as any).applyConstraints) {
         (track as any).applyConstraints({ advanced: [{ zoom: newZoom }] })
           .catch((e: any) => console.log("Zoom constraint not supported:", e));
      }
    }
  };

  const toggleTorch = () => {
    if (videoRef.current && videoRef.current.srcObject) {
       const stream = videoRef.current.srcObject as MediaStream;
       const track = stream.getVideoTracks()[0];
       const newStatus = !isTorchOn;
       setIsTorchOn(newStatus);
       if ((track as any).applyConstraints) {
         (track as any).applyConstraints({ advanced: [{ torch: newStatus }] })
           .catch((e: any) => console.log("Torch not supported:", e));
       }
    }
  };

  const captureImage = () => {
      // In a real app, we would capture a frame and decode the QR code here.
      // For this demo, we'll simulate finding a valid product ID.
      stopCamera();
      
      // Randomly select one of the demo IDs for variety
      const demoIds = ['TC-IN-7829', 'TC-IN-9921', 'TC-IN-FAKE'];
      const randomId = demoIds[Math.floor(Math.random() * demoIds.length)];
      
      performScan(randomId);
  };

  useEffect(() => {
      return () => {
          if (showCamera) stopCamera();
      };
  }, [showCamera]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Verify Authenticity</h2>
        <p className="mt-2 text-gray-600">Scan the QR code or enter the Product ID to verify origin.</p>
      </div>

      {/* Camera / Input Section */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mb-8">
        
        {showCamera ? (
          <div className="relative bg-black h-96">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover" 
            />
            
            {/* Camera Controls Overlay */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 z-20">
               <div className="flex justify-between items-start">
                  <div className="bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full flex items-center">
                     <Maximize className="w-3 h-3 mr-1" />
                     HD Mode Active
                  </div>
                  <button onClick={stopCamera} className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors">
                     <X className="w-6 h-6" />
                  </button>
               </div>

               <div className="flex flex-col items-center gap-4 pb-4">
                  {/* Zoom Slider */}
                  <div className="flex items-center gap-3 w-full max-w-xs bg-black/40 px-4 py-2 rounded-full backdrop-blur-md">
                     <ZoomIn className="w-4 h-4 text-white" />
                     <input 
                       type="range" 
                       min={zoomRange.min} 
                       max={zoomRange.max} 
                       step={zoomRange.step} 
                       value={zoom} 
                       onChange={handleZoom}
                       className="w-full h-1 bg-gray-400 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                     />
                     <span className="text-white text-xs w-8 text-right font-mono">{zoom.toFixed(1)}x</span>
                  </div>

                  <div className="flex items-center gap-8">
                     <button 
                       onClick={toggleTorch} 
                       className={`p-4 rounded-full ${isTorchOn ? 'bg-yellow-400 text-black' : 'bg-white/20 text-white'} backdrop-blur-md transition-all`}
                     >
                        <Zap className={`w-6 h-6 ${isTorchOn ? 'fill-current' : ''}`} />
                     </button>
                     
                     <button 
                       onClick={captureImage} 
                       className="w-20 h-20 rounded-full bg-white border-4 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                     >
                        <div className="w-16 h-16 rounded-full bg-indigo-600"></div>
                     </button>
                     
                     <div className="w-14"></div> {/* Spacer for centering */}
                  </div>
               </div>
            </div>
            
            {/* Scanning Guide Lines */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white/30 rounded-xl pointer-events-none z-10">
               <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-indigo-500 -mt-1 -ml-1 rounded-tl-lg"></div>
               <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-indigo-500 -mt-1 -mr-1 rounded-tr-lg"></div>
               <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-indigo-500 -mb-1 -ml-1 rounded-bl-lg"></div>
               <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-indigo-500 -mb-1 -mr-1 rounded-br-lg"></div>
               
               {/* Scanning Line Animation */}
               <div className="absolute top-0 left-0 w-full h-0.5 bg-indigo-400 shadow-[0_0_10px_#818cf8] animate-[scan_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
        ) : (
          // Default State: Call to Action
          <div className="p-10 bg-gradient-to-br from-indigo-600 to-blue-600 text-white text-center relative overflow-hidden">
             <div className="relative z-10">
               <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20">
                 <Scan className="w-10 h-10 text-white" />
               </div>
               <h3 className="font-bold text-2xl mb-3">Secure Blockchain Scanner</h3>
               <p className="text-indigo-100 mb-8 max-w-md mx-auto">
                 Point your camera at a product QR code to verify its digital twin on the TrueChain ledger.
               </p>
               <button 
                 onClick={startCamera}
                 className="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-indigo-50 transition-all transform hover:-translate-y-0.5 flex items-center mx-auto"
               >
                 <Camera className="w-5 h-5 mr-2" />
                 Open HD Scanner
               </button>
               {cameraError && (
                 <p className="mt-4 text-sm text-red-200 bg-red-900/30 py-2 px-4 rounded inline-block">{cameraError}</p>
               )}
             </div>
             
             {/* Decorative Elements */}
             <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
             <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-900 opacity-20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
          </div>
        )}

        <div className="p-8 bg-white">
          <div className="relative flex items-center justify-center mb-8">
             <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
             <span className="relative bg-white px-4 text-sm text-gray-500 uppercase tracking-wider font-medium">Or enter manually</span>
          </div>

          <form onSubmit={handleManualSubmit} className="relative">
            <input
              type="text"
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              placeholder="Enter Product ID (e.g. TC-IN-7829)"
              className="w-full pl-4 pr-32 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 text-lg transition-all"
            />
            <button 
              type="submit"
              disabled={isScanning || !scanInput}
              className="absolute right-2 top-2 bottom-2 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isScanning ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify'}
            </button>
          </form>

          <div className="mt-6 flex flex-wrap gap-2 justify-center text-sm text-gray-500">
            <span>Try demo IDs:</span>
            <button onClick={() => performScan('TC-IN-7829')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors">Pharma</button>
            <button onClick={() => performScan('TC-IN-9921')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors">Luxury</button>
            <button onClick={() => performScan('TC-IN-FAKE')} className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors">Fake</button>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
          {result.verified ? (
            <div className="bg-white border-l-4 border-green-500 rounded-r-xl shadow-md p-6">
              <div className="flex items-start">
                <CheckCircle className="w-8 h-8 text-green-500 mr-4 flex-shrink-0" />
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    Authentic Product Verified
                    <span className="ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Blockchain Verified
                    </span>
                  </h3>
                  <p className="text-gray-600 mt-1">{result.product?.name}</p>
                  
                  {/* AI Analysis */}
                  <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                    <div className="flex items-center mb-2">
                        <ShieldCheck className="w-4 h-4 text-indigo-600 mr-2" />
                        <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">AI Safety Analysis</span>
                    </div>
                    <p className="text-sm text-gray-800 leading-relaxed">
                        {result.analysis}
                    </p>
                  </div>

                  {/* Product Details Grid */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                     <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase">Manufacturer</p>
                        <p className="font-medium text-gray-900">{result.product?.manufacturer}</p>
                     </div>
                     <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase">Batch No.</p>
                        <p className="font-medium text-gray-900">{result.product?.batchNumber}</p>
                     </div>
                     <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase">Expiry</p>
                        <p className="font-medium text-gray-900">{result.product?.expiryDate || 'N/A'}</p>
                     </div>
                     <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase">Current Status</p>
                        <p className="font-medium text-indigo-600">{result.product?.status}</p>
                     </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="mt-8 relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4 ml-1">Supply Chain Journey</h4>
                <div className="space-y-6">
                  {result.history.map((tx, idx) => (
                    <div key={idx} className="relative flex items-start ml-10">
                        <div className="absolute -left-10 mt-1 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-white"></div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <p className="font-medium text-gray-900">{tx.action.replace(/_/g, ' ')}</p>
                                <span className="text-xs text-gray-400">{tx.timestamp}</span>
                            </div>
                            <p className="text-sm text-gray-500">{tx.location}</p>
                            <p className="text-xs text-gray-400 mt-0.5">Tx: {tx.hash}</p>
                        </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl shadow-md p-8 text-center">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900">Verification Failed</h3>
                <p className="text-red-700 mt-2 font-medium">
                    {result.product 
                        ? "This product ID exists but has been flagged as potentially counterfeit or stolen." 
                        : "Product ID not found in the ledger."}
                </p>
                <p className="text-gray-600 mt-4 text-sm">
                    Do not consume or use this product. Please report this incident to the authorities or the brand owner immediately.
                </p>
                <div className="mt-6 p-4 bg-white rounded-lg border border-red-100 inline-block text-left w-full">
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">Why did this fail?</h4>
                    <p className="text-sm text-gray-600">{result.analysis}</p>
                </div>
            </div>
          )}
        </div>
      )}
      
      <style>{`
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};
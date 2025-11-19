import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Stats } from './components/Stats';
import { Scanner } from './components/Scanner';
import { LedgerViewer } from './components/LedgerViewer';
import { SupplyChainManager } from './components/SupplyChainManager';
import { UserRole, Product, Transaction } from './types';
import { MOCK_PRODUCTS as InitialMockProducts, INITIAL_TRANSACTIONS as InitialTransactions } from './constants';
import { Shield, Globe, Database, Lock } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [userRole, setUserRole] = useState<UserRole>(UserRole.CONSUMER);
  
  // Global state to simulate blockchain persistence
  const [products, setProducts] = useState<Product[]>(InitialMockProducts);
  const [transactions, setTransactions] = useState<Transaction[]>(InitialTransactions);

  const handleAddProduct = (newProduct: Product) => {
    setProducts([...products, newProduct]);
  };

  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions([newTx, ...transactions]);
    // Update product status implicitly (simplified)
    const updatedProducts = products.map(p => {
        if (p.id === newTx.productId) {
            return { ...p, currentLocation: newTx.location, status: newTx.action as any };
        }
        return p;
    });
    setProducts(updatedProducts);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        currentUserRole={userRole}
        setCurrentUserRole={setUserRole}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'home' && (
          <div className="space-y-12">
            <div className="text-center max-w-4xl mx-auto py-12">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight mb-6">
                Trust, Transparency, and Truth in <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Every Product</span>.
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Combating counterfeits in India's pharmaceutical and luxury markets using an immutable blockchain ledger. 
                Verify origin, ensure safety, and protect authentic brands.
              </p>
              <div className="flex justify-center gap-4">
                <button onClick={() => setCurrentView('verify')} className="px-8 py-3 bg-indigo-600 text-white rounded-full font-medium shadow-lg hover:bg-indigo-700 transition-all transform hover:-translate-y-1">
                  Verify a Product
                </button>
                <button onClick={() => setCurrentView('ledger')} className="px-8 py-3 bg-white text-indigo-600 border border-indigo-200 rounded-full font-medium hover:bg-indigo-50 transition-all">
                  View Public Ledger
                </button>
              </div>
            </div>

            <Stats />

            <div className="grid md:grid-cols-3 gap-8">
               <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Tamper-Proof Records</h3>
                  <p className="text-gray-600 leading-relaxed">Once a product is manufactured, its digital twin is minted on the blockchain. Every movement is signed and immutable.</p>
               </div>
               <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6 text-green-600">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">End-to-End Traceability</h3>
                  <p className="text-gray-600 leading-relaxed">From raw materials in Mumbai to the pharmacy in Bangalore, track the entire lifecycle in real-time.</p>
               </div>
               <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6 text-purple-600">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Consumer Empowerment</h3>
                  <p className="text-gray-600 leading-relaxed">Scan a simple QR code to verify authenticity instantly. Protect your health and wallet from fakes.</p>
               </div>
            </div>
          </div>
        )}

        {currentView === 'verify' && <Scanner />}
        
        {currentView === 'supply-chain' && (
          userRole !== UserRole.CONSUMER ? (
            <SupplyChainManager 
                onAddProduct={handleAddProduct}
                onAddTransaction={handleAddTransaction}
                products={products}
            />
          ) : (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="bg-yellow-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Restricted Access</h2>
                <p className="text-gray-600 mb-6">You are viewing as a Consumer. Switch to Manufacturer role to manage the supply chain.</p>
                <button onClick={() => setUserRole(UserRole.MANUFACTURER)} className="text-indigo-600 font-medium hover:underline">
                    Switch to Manufacturer Mode
                </button>
            </div>
          )
        )}
        
        {currentView === 'ledger' && <LedgerViewer transactions={transactions} />}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
            <p>&copy; 2024 TrueChain India. Built for a safer future.</p>
            <div className="flex justify-center space-x-6 mt-4">
                <span>Privacy Policy</span>
                <span>Terms of Service</span>
                <span>Blockchain Explorer</span>
            </div>
          </div>
      </footer>
    </div>
  );
}

export default App;
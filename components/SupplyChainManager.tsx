import React, { useState } from 'react';
import { PlusCircle, Truck, ArrowRight, PackageCheck } from 'lucide-react';
import { Product, Transaction, ProductStatus } from '../types';

interface SupplyChainManagerProps {
  onAddProduct: (p: Product) => void;
  onAddTransaction: (t: Transaction) => void;
  products: Product[];
}

export const SupplyChainManager: React.FC<SupplyChainManagerProps> = ({ onAddProduct, onAddTransaction, products }) => {
  const [activeTab, setActiveTab] = useState<'mint' | 'update'>('mint');
  
  // Form state for new product
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Pharmaceuticals');
  const [newBatch, setNewBatch] = useState('');

  // Form state for update
  const [selectedProductId, setSelectedProductId] = useState('');
  const [updateAction, setUpdateAction] = useState('SHIPPED');
  const [updateLocation, setUpdateLocation] = useState('');

  const handleMint = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `TC-IN-${Math.floor(Math.random() * 10000)}`;
    const newProduct: Product = {
      id,
      name: newName,
      category: newCategory as any,
      description: "New product created",
      manufacturer: "My Factory Ltd",
      manufactureDate: new Date().toISOString().split('T')[0],
      batchNumber: newBatch,
      imageUrl: `https://picsum.photos/200/200?random=${id}`,
      status: ProductStatus.MANUFACTURED,
      currentLocation: "Factory Warehouse, Mumbai"
    };

    const genesisTx: Transaction = {
      hash: `0x${Math.random().toString(16).substr(2, 10)}...`,
      timestamp: new Date().toLocaleString(),
      productId: id,
      action: "MANUFACTURED",
      actor: "My Factory Ltd",
      location: "Mumbai",
      previousHash: "0x00000"
    };

    onAddProduct(newProduct);
    onAddTransaction(genesisTx);
    alert(`Product ${id} minted on blockchain!`);
    setNewName('');
    setNewBatch('');
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    const tx: Transaction = {
      hash: `0x${Math.random().toString(16).substr(2, 10)}...`,
      timestamp: new Date().toLocaleString(),
      productId: selectedProductId,
      action: updateAction,
      actor: "Logistics Partner",
      location: updateLocation,
      previousHash: "0xPrevHash..."
    };

    onAddTransaction(tx);
    alert(`Product ${selectedProductId} status updated!`);
    setUpdateLocation('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex space-x-4">
        <button
          onClick={() => setActiveTab('mint')}
          className={`flex-1 py-4 rounded-xl text-lg font-medium flex items-center justify-center transition-all ${
            activeTab === 'mint' 
            ? 'bg-indigo-600 text-white shadow-lg' 
            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Mint New Product
        </button>
        <button
          onClick={() => setActiveTab('update')}
          className={`flex-1 py-4 rounded-xl text-lg font-medium flex items-center justify-center transition-all ${
            activeTab === 'update' 
            ? 'bg-indigo-600 text-white shadow-lg' 
            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Truck className="w-5 h-5 mr-2" />
          Update Logistics
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
        {activeTab === 'mint' ? (
          <form onSubmit={handleMint} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input required value={newName} onChange={e => setNewName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g. Cancer Drug X" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg">
                    <option>Pharmaceuticals</option>
                    <option>Luxury</option>
                    <option>FMCG</option>
                    <option>Electronics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number</label>
                  <input required value={newBatch} onChange={e => setNewBatch(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="e.g. B-2024-001" />
                </div>
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
              Generate Digital Twin & Mint Token
            </button>
          </form>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Product ID</label>
              <select value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg">
                <option value="">-- Select Product --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                ))}
              </select>
            </div>
            {selectedProductId && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                        <select value={updateAction} onChange={e => setUpdateAction(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg">
                            <option value="SHIPPED">Shipped</option>
                            <option value="RECEIVED_DISTRIBUTOR">Received at Distributor</option>
                            <option value="QUALITY_CHECK_PASSED">Quality Check Passed</option>
                            <option value="RETAIL_STOCK">Stocked at Retail</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Location</label>
                        <input required value={updateLocation} onChange={e => setUpdateLocation(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="e.g. Warehouse 4, Delhi" />
                    </div>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex justify-center items-center">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Record Transaction on Ledger
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
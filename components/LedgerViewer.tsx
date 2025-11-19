import React from 'react';
import { Hash, Clock, MapPin, Box, User } from 'lucide-react';
import { Transaction } from '../types';

interface LedgerViewerProps {
  transactions: Transaction[];
}

export const LedgerViewer: React.FC<LedgerViewerProps> = ({ transactions }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Hash className="w-5 h-5 mr-2 text-gray-500" />
          Immutable Ledger
        </h3>
        <span className="text-xs font-mono bg-gray-200 px-2 py-1 rounded text-gray-600">
          Total Blocks: {transactions.length}
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tx Hash</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actor</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((tx) => (
              <tr key={tx.hash} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-xs font-mono text-indigo-600 bg-indigo-50 px-2 py-1 rounded w-fit">
                    {tx.hash.substring(0, 10)}...
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                        <Box className="w-4 h-4 mr-2 text-gray-400" />
                        {tx.productId}
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {tx.action.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                        <User className="w-4 h-4 mr-1.5 text-gray-400" />
                        {tx.actor}
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                        {tx.location}
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                    <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                    {tx.timestamp}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
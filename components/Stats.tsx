import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { generateMarketInsights } from '../services/geminiService';
import { Lightbulb } from 'lucide-react';

const data = [
  { name: 'Pharma', counterfeit: 20, authentic: 80 },
  { name: 'Luxury', counterfeit: 35, authentic: 65 },
  { name: 'FMCG', counterfeit: 15, authentic: 85 },
  { name: 'Auto', counterfeit: 10, authentic: 90 },
];

const pieData = [
  { name: 'Verified Safe', value: 780 },
  { name: 'Failed Scan', value: 45 },
  { name: 'Suspect', value: 120 },
];

const COLORS = ['#4f46e5', '#ef4444', '#f59e0b'];

export const Stats: React.FC = () => {
  const [insight, setInsight] = useState<string>("Loading AI insights...");

  useEffect(() => {
    const fetchInsight = async () => {
      const text = await generateMarketInsights();
      setInsight(text);
    };
    fetchInsight();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Counterfeit Risk by Industry</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="authentic" stackId="a" fill="#4f46e5" name="Authentic" radius={[0, 0, 4, 4]} />
              <Bar dataKey="counterfeit" stackId="a" fill="#ef4444" name="Counterfeit" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Live Verification Stats</h3>
        <div className="flex-1 flex items-center justify-center h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="ml-4 space-y-2 text-sm">
             {pieData.map((entry, index) => (
               <div key={entry.name} className="flex items-center">
                 <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }}></div>
                 <span className="text-gray-600">{entry.name}: {entry.value}</span>
               </div>
             ))}
          </div>
        </div>
        <div className="mt-4 p-3 bg-indigo-50 rounded-lg flex items-start">
            <Lightbulb className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-indigo-800 italic">"{insight}"</p>
        </div>
      </div>
    </div>
  );
};
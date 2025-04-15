"use client";

import React, { useState } from 'react';
import { PingResult } from '../api/ping/route';
import { TracerouteResult } from '../api/traceroute/route';

interface NetworkToolsProps {
  defaultTarget?: string;
}

const NetworkTools: React.FC<NetworkToolsProps> = ({ defaultTarget = '' }) => {
  const [target, setTarget] = useState(defaultTarget);
  const [activeTab, setActiveTab] = useState<'ping' | 'traceroute'>('ping');
  const [isLoading, setIsLoading] = useState(false);
  const [pingResult, setPingResult] = useState<PingResult | null>(null);
  const [tracerouteResult, setTracerouteResult] = useState<TracerouteResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTarget(e.target.value);
  };

  const executePing = async () => {
    if (!target) {
      setError('Please enter a target IP or domain');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      setPingResult(null);
      
      const response = await fetch(`/api/ping?target=${encodeURIComponent(target)}`);
      
      if (!response.ok) {
        throw new Error('Failed to execute ping');
      }
      
      const data = await response.json();
      setPingResult(data);
    } catch (err) {
      console.error('Error executing ping:', err);
      setError('Failed to execute ping. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const executeTraceroute = async () => {
    if (!target) {
      setError('Please enter a target IP or domain');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      setTracerouteResult(null);
      
      const response = await fetch(`/api/traceroute?target=${encodeURIComponent(target)}`);
      
      if (!response.ok) {
        throw new Error('Failed to execute traceroute');
      }
      
      const data = await response.json();
      setTracerouteResult(data);
    } catch (err) {
      console.error('Error executing traceroute:', err);
      setError('Failed to execute traceroute. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'ping') {
      executePing();
    } else {
      executeTraceroute();
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Network Tools</h2>
      
      <div className="flex border-b mb-4">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'ping' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('ping')}
        >
          Ping
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'traceroute' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('traceroute')}
        >
          Traceroute
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            value={target}
            onChange={handleTargetChange}
            placeholder="Enter IP address or domain"
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:bg-blue-400"
          >
            {isLoading ? 'Running...' : activeTab === 'ping' ? 'Run Ping' : 'Run Traceroute'}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {activeTab === 'ping' && pingResult && (
        <div className="mt-4">
          <h3 className="font-medium text-gray-700 mb-2">Ping Results:</h3>
          <div className="bg-gray-100 p-3 rounded-md font-mono text-sm whitespace-pre-wrap">
            {pingResult.output.map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
        </div>
      )}
      
      {activeTab === 'traceroute' && tracerouteResult && (
        <div className="mt-4">
          <h3 className="font-medium text-gray-700 mb-2">Traceroute Results:</h3>
          <div className="bg-gray-100 p-3 rounded-md font-mono text-sm whitespace-pre-wrap">
            {tracerouteResult.output.map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
          
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hop</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Host</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time (ms)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tracerouteResult.hops.map((hop) => (
                  <tr key={hop.hop}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hop.hop}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hop.host}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hop.ip}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hop.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkTools;

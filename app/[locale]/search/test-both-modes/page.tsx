'use client';

import { useState } from 'react';
import HashSearchHandler from '../components/HashSearchHandler';

export default function TestBothModesPage() {
  const [mode, setMode] = useState<'iframe' | 'direct'>('iframe');

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Both Rendering Modes</h1>
        
        {/* Toggle Buttons */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setMode('iframe')}
            className={`px-6 py-3 rounded-lg font-semibold ${
              mode === 'iframe'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600 border-2 border-blue-600'
            }`}
          >
            iframe Mode (Recommended)
          </button>
          <button
            onClick={() => setMode('direct')}
            className={`px-6 py-3 rounded-lg font-semibold ${
              mode === 'direct'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600 border-2 border-blue-600'
            }`}
          >
            Direct Content Mode (Test)
          </button>
        </div>

        {/* Display Current Mode */}
        <div className={`mb-6 p-4 rounded-lg ${
          mode === 'iframe' ? 'bg-green-50 border-2 border-green-500' : 'bg-yellow-50 border-2 border-yellow-500'
        }`}>
          <h2 className="font-bold text-lg mb-2">
            Current Mode: {mode === 'iframe' ? 'iframe (Working)' : 'Direct Content (Limited)'}
          </h2>
          <p className="text-sm text-gray-700">
            {mode === 'iframe'
              ? '✅ All features work: JavaScript executes, dynamic content loads, booking buttons work'
              : '⚠️ Limited functionality: JavaScript may not execute, dynamic content may not load'}
          </p>
        </div>

        {/* Render Search Widget */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <HashSearchHandler 
            fallbackSearchCode="JFK2310LHR241011"
            locale="en"
            useDirectContent={mode === 'direct'}
          />
        </div>

        {/* Comparison Table */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Comparison</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Feature</th>
                <th className="border p-3">iframe Mode</th>
                <th className="border p-3">Direct Content</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-3">JavaScript Execution</td>
                <td className="border p-3 text-center text-green-600">✅ Works</td>
                <td className="border p-3 text-center text-red-600">❌ Limited</td>
              </tr>
              <tr>
                <td className="border p-3">Dynamic Content Loading</td>
                <td className="border p-3 text-center text-green-600">✅ Works</td>
                <td className="border p-3 text-center text-red-600">❌ May Fail</td>
              </tr>
              <tr>
                <td className="border p-3">Booking Buttons</td>
                <td className="border p-3 text-center text-green-600">✅ Works</td>
                <td className="border p-3 text-center text-yellow-600">⚠️ Partial</td>
              </tr>
              <tr>
                <td className="border p-3">SEO Benefits</td>
                <td className="border p-3 text-center text-yellow-600">⚠️ Limited</td>
                <td className="border p-3 text-center text-green-600">✅ Better</td>
              </tr>
              <tr>
                <td className="border p-3">Security</td>
                <td className="border p-3 text-center text-green-600">✅ Isolated</td>
                <td className="border p-3 text-center text-yellow-600">⚠️ XSS Risk</td>
              </tr>
              <tr>
                <td className="border p-3">Maintenance</td>
                <td className="border p-3 text-center text-green-600">✅ Easy</td>
                <td className="border p-3 text-center text-red-600">❌ Complex</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Recommendations */}
        <div className="mt-8 bg-blue-50 border-2 border-blue-500 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-3">💡 Recommendation</h2>
          <p className="mb-2">
            <strong>Use iframe mode</strong> for production because:
          </p>
          <ul className="list-disc ml-6 space-y-1">
            <li>All widget features work properly</li>
            <li>Dynamic content loads correctly</li>
            <li>Booking buttons function normally</li>
            <li>No security concerns</li>
            <li>Less maintenance overhead</li>
          </ul>
          <p className="mt-4">
            <strong>Direct content mode</strong> can be useful for:
          </p>
          <ul className="list-disc ml-6 space-y-1">
            <li>SEO optimization (but limited benefit if content is empty)</li>
            <li>Static content display only</li>
            <li>Custom implementations that fetch data separately</li>
          </ul>
        </div>
      </div>
    </div>
  );
}



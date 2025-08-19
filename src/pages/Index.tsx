import { useState } from 'react';

export default function Index() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const testAPI = async () => {
    try {
      const res = await fetch('/api/hello', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse('Error: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Minimal Template
        </h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Message
            </label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a message..."
            />
          </div>
          
          <button
            onClick={testAPI}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Test API
          </button>
          
          {response && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Response
              </label>
              <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-auto">
                {response}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
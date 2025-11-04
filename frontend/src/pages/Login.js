import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { testBackendConnection } from '../services/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // Test backend connection on component mount
  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    setBackendStatus('checking');
    const result = await testBackendConnection();
    if (result.success) {
      setBackendStatus('connected');
    } else {
      setBackendStatus('disconnected');
      setError(`Backend connection failed: ${result.error}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (backendStatus !== 'connected') {
      setError('Cannot connect to backend server. Please check if backend is running.');
      return;
    }

    setLoading(true);
    setError('');

    console.log('Attempting login with:', { username, password });

    try {
      const result = await login(username, password);
      console.log('Login result:', result);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message || 'Login failed - check credentials');
      }
    } catch (error) {
      console.error('Login catch error:', error);
      setError('Login failed - check console for details');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (role) => {
    if (role === 'hospital') {
      setUsername('hospital1');
      setPassword('password123');
    } else if (role === 'ambulance') {
      setUsername('ambulance1');
      setPassword('password123');
    }
  };

  const getStatusColor = () => {
    switch (backendStatus) {
      case 'connected': return 'bg-green-100 border-green-400 text-green-700';
      case 'disconnected': return 'bg-red-100 border-red-400 text-red-700';
      default: return 'bg-yellow-100 border-yellow-400 text-yellow-700';
    }
  };

  const getStatusText = () => {
    switch (backendStatus) {
      case 'connected': return '✅ Backend connected';
      case 'disconnected': return '❌ Backend disconnected';
      default: return '⏳ Checking backend connection...';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl">
            🚑
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Secure Ambulance Data System
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to access the real-time dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Backend Status */}
        <div className={`mb-4 border rounded-md p-3 text-sm ${getStatusColor()}`}>
          <div className="flex items-center justify-between">
            <span>{getStatusText()}</span>
            {backendStatus === 'disconnected' && (
              <button
                onClick={checkBackendConnection}
                className="text-sm underline hover:no-underline"
              >
                Retry
              </button>
            )}
          </div>
          {backendStatus === 'disconnected' && (
            <div className="mt-2 text-xs">
              💡 Make sure to run: <code className="bg-black text-white px-1 rounded">cd backend && npm start</code>
            </div>
          )}
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
                <strong>Error:</strong> {error}
              </div>
            )}
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username or Email
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your username or email"
                  disabled={loading || backendStatus !== 'connected'}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                  disabled={loading || backendStatus !== 'connected'}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || backendStatus !== 'connected'}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          {/* Demo credentials section */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo Credentials</span>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials('hospital')}
                disabled={backendStatus !== 'connected'}
                className="flex-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-3 rounded disabled:opacity-50"
              >
                Hospital Demo
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('ambulance')}
                disabled={backendStatus !== 'connected'}
                className="flex-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-3 rounded disabled:opacity-50"
              >
                Ambulance Demo
              </button>
            </div>

            <div className="mt-4 text-xs text-gray-600 space-y-1">
              <p><strong>Hospital Staff:</strong> hospital1 / password123</p>
              <p><strong>Ambulance Staff:</strong> ambulance1 / password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
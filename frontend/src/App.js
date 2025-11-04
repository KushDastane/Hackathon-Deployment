import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PatientDetails from './pages/PatientDetails';
import Alerts from './pages/Alerts';
import MapView from './pages/MapView';
import Layout from './components/Layout';
import './index.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/patients/:id" element={
              <ProtectedRoute>
                <Layout>
                  <PatientDetails />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/alerts" element={
              <ProtectedRoute>
                <Layout>
                  <Alerts />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/map" element={
              <ProtectedRoute>
                <Layout>
                  <MapView />
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
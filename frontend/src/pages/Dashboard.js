import React, { useState, useEffect } from 'react';
import { patientService } from '../services/api';
import socketService from '../services/socket';
import { EncryptionService, DataSimulator } from '../utils/encryption';
import PatientCard from '../components/PatientCard';
import VitalsChart from '../components/VitalsChart';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    loadPatients();
    setupSocketConnection();

    return () => {
      socketService.disconnect();
    };
  }, []);

  const loadPatients = async () => {
    try {
      const response = await patientService.getAll();
      setPatients(response.data);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupSocketConnection = async () => {
    try {
      await socketService.connect();

      // Listen for real-time vitals updates
      socketService.on('patient_vitals_update', (encryptedData) => {
        try {
          const decryptedData = EncryptionService.decrypt(encryptedData);
          updatePatientVitals(decryptedData.patient);
        } catch (error) {
          console.error('Error processing vitals update:', error);
        }
      });

      // Listen for critical alerts
      socketService.on('critical_alert', (alert) => {
        console.log('Critical alert received:', alert);
        // You can implement notification system here
      });

    } catch (error) {
      console.error('Socket connection error:', error);
    }
  };

  const updatePatientVitals = (updatedPatient) => {
    setPatients(prevPatients => 
      prevPatients.map(patient => 
        patient._id === updatedPatient._id ? updatedPatient : patient
      )
    );
  };

  // For demo: Simulate vitals transmission (ambulance staff role)
  const simulateVitalsTransmission = () => {
    if (patients.length === 0) return;

    const randomPatient = patients[Math.floor(Math.random() * patients.length)];
    const simulatedData = DataSimulator.generateVitals(randomPatient._id);
    
    try {
      const encryptedData = EncryptionService.encrypt(simulatedData);
      socketService.emit('transmit_vitals', encryptedData);
    } catch (error) {
      console.error('Error transmitting vitals:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading patients...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
          <p className="text-gray-600">Real-time monitoring of ambulance patients</p>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={simulateVitalsTransmission}
            className="px-4 py-2 bg-medical-blue text-white rounded hover:bg-blue-700 transition-colors"
          >
            Simulate Vitals Update
          </button>
          
          <div className="bg-white px-4 py-2 rounded border">
            <div className="text-sm text-gray-600">Total Patients</div>
            <div className="text-xl font-bold">{patients.length}</div>
          </div>
        </div>
      </div>

      {/* Emergency Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="font-semibold text-red-800">Critical</span>
          </div>
          <div className="text-2xl font-bold text-red-800 mt-2">
            {patients.filter(p => p.emergencyLevel === 'critical').length}
          </div>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
            <span className="font-semibold text-orange-800">Moderate</span>
          </div>
          <div className="text-2xl font-bold text-orange-800 mt-2">
            {patients.filter(p => p.emergencyLevel === 'moderate').length}
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="font-semibold text-green-800">Stable</span>
          </div>
          <div className="text-2xl font-bold text-green-800 mt-2">
            {patients.filter(p => p.emergencyLevel === 'stable').length}
          </div>
        </div>
      </div>

      {/* Patients Grid and Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patients List */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Active Patients</h2>
          {patients.length === 0 ? (
            <div className="bg-white rounded-lg border p-8 text-center">
              <p className="text-gray-500">No patients currently being monitored</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {patients.map(patient => (
                <PatientCard 
                  key={patient._id} 
                  patient={patient}
                  onSelect={setSelectedPatient}
                />
              ))}
            </div>
          )}
        </div>

        {/* Vitals Chart */}
        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4">Vitals Monitoring</h2>
          <div className="bg-white rounded-lg border p-4">
            {selectedPatient ? (
              <VitalsChart patient={selectedPatient} />
            ) : (
              <div className="text-center text-gray-500 py-8">
                Select a patient to view vitals chart
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import { patientService } from '../services/api';
import { Link } from 'react-router-dom';

const Alerts = () => {
  const [criticalPatients, setCriticalPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCriticalPatients();
  }, []);

  const loadCriticalPatients = async () => {
    try {
      const response = await patientService.getCritical();
      setCriticalPatients(response.data);
    } catch (error) {
      console.error('Error loading critical patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const updated = new Date(timestamp);
    const diffInMinutes = Math.floor((now - updated) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading alerts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Critical Alerts</h1>
          <p className="text-gray-600">Emergency cases requiring immediate attention</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2">
          <div className="text-sm text-red-600">Critical Patients</div>
          <div className="text-xl font-bold text-red-800">{criticalPatients.length}</div>
        </div>
      </div>

      {criticalPatients.length === 0 ? (
        <div className="bg-white rounded-lg border p-8 text-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Critical Alerts</h3>
          <p className="text-gray-600">All patients are currently stable</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {criticalPatients.map(patient => {
            const latestVitals = patient.vitals && patient.vitals.length > 0 
              ? patient.vitals[patient.vitals.length - 1] 
              : null;

            return (
              <div key={patient._id} className="bg-red-50 border-2 border-red-300 rounded-lg p-6 pulse-critical">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-xl">
                      ⚠️
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-red-900">{patient.name}</h3>
                      <p className="text-red-700">
                        {patient.age} years • {patient.gender} • {patient.ambulanceId?.ambulanceId}
                      </p>
                      <div className="mt-2 flex items-center space-x-4">
                        {latestVitals && (
                          <>
                            <div className="text-sm">
                              <span className="text-red-600 font-medium">HR: </span>
                              {latestVitals.heartRate} BPM
                            </div>
                            <div className="text-sm">
                              <span className="text-red-600 font-medium">SpO₂: </span>
                              {latestVitals.spo2}%
                            </div>
                            <div className="text-sm">
                              <span className="text-red-600 font-medium">BP: </span>
                              {latestVitals.bloodPressure.systolic}/{latestVitals.bloodPressure.diastolic}
                            </div>
                            <div className="text-sm">
                              <span className="text-red-600 font-medium">Temp: </span>
                              {latestVitals.temperature}°C
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                      CRITICAL
                    </div>
                    <p className="text-sm text-red-600">
                      Updated: {getTimeAgo(patient.updatedAt)}
                    </p>
                    <Link
                      to={`/patients/${patient._id}`}
                      className="inline-block mt-2 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
                
                {patient.medicalHistory?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-red-200">
                    <h4 className="text-sm font-medium text-red-800 mb-2">Medical History:</h4>
                    <p className="text-sm text-red-700">{patient.medicalHistory.join(', ')}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Alerts;
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { patientService } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PatientDetails = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatient();
  }, [id]);

  const loadPatient = async () => {
    try {
      const response = await patientService.getById(id);
      setPatient(response.data);
    } catch (error) {
      console.error('Error loading patient:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEmergencyLevelColor = (level) => {
    switch (level) {
      case 'critical': return 'text-red-600';
      case 'moderate': return 'text-orange-600';
      case 'stable': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading patient details...</div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Patient not found</div>
      </div>
    );
  }

  const latestVitals = patient.vitals && patient.vitals.length > 0 
    ? patient.vitals[patient.vitals.length - 1] 
    : null;

  // Prepare chart data
  const chartData = patient.vitals?.map((vital, index) => ({
    time: index,
    heartRate: vital.heartRate,
    spo2: vital.spo2,
    temperature: vital.temperature,
    systolic: vital.bloodPressure.systolic,
    diastolic: vital.bloodPressure.diastolic
  })) || [];

  return (
    <div className="space-y-6">
      {/* Patient Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
            <p className="text-gray-600">
              {patient.age} years • {patient.gender} • Patient ID: {patient.patientId}
            </p>
            <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEmergencyLevelColor(patient.emergencyLevel)} bg-opacity-10 ${
              patient.emergencyLevel === 'critical' ? 'bg-red-100' :
              patient.emergencyLevel === 'moderate' ? 'bg-orange-100' :
              'bg-green-100'
            }`}>
              Status: <span className="ml-1 capitalize">{patient.emergencyLevel}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Ambulance</p>
            <p className="font-semibold">{patient.ambulanceId?.ambulanceId || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Vitals */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">Current Vitals</h2>
            {latestVitals ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Heart Rate</span>
                  <span className="font-semibold">{latestVitals.heartRate} BPM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Blood Pressure</span>
                  <span className="font-semibold">
                    {latestVitals.bloodPressure.systolic}/{latestVitals.bloodPressure.diastolic} mmHg
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">SpO₂</span>
                  <span className="font-semibold">{latestVitals.spo2}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Temperature</span>
                  <span className="font-semibold">{latestVitals.temperature}°C</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Respiratory Rate</span>
                  <span className="font-semibold">{latestVitals.respiratoryRate} BPM</span>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500">
                    Last updated: {new Date(latestVitals.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No vitals data available</p>
            )}
          </div>

          {/* Medical Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">Medical Information</h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-medium text-gray-700">Medical History</h3>
                <div className="mt-1">
                  {patient.medicalHistory?.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {patient.medicalHistory.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">None reported</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Allergies</h3>
                <div className="mt-1">
                  {patient.allergies?.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {patient.allergies.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">None reported</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Current Medications</h3>
                <div className="mt-1">
                  {patient.currentMedications?.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {patient.currentMedications.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">None reported</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vitals Charts */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">Vitals Trends</h2>
            {chartData.length > 0 ? (
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Heart Rate & SpO₂</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="heartRate" stroke="#3b82f6" name="Heart Rate (BPM)" />
                      <Line type="monotone" dataKey="spo2" stroke="#10b981" name="SpO₂ (%)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Blood Pressure</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="systolic" stroke="#ef4444" name="Systolic (mmHg)" />
                      <Line type="monotone" dataKey="diastolic" stroke="#f97316" name="Diastolic (mmHg)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Temperature</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="temperature" stroke="#8b5cf6" name="Temperature (°C)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No vitals history available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
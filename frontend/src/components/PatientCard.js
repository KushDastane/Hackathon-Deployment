import React from 'react';
import { Link } from 'react-router-dom';

const PatientCard = ({ patient }) => {
  const getEmergencyLevelStyles = (level) => {
    switch (level) {
      case 'critical':
        return 'emergency-critical pulse-critical border-red-300';
      case 'moderate':
        return 'emergency-moderate border-orange-300';
      case 'stable':
        return 'emergency-stable border-green-300';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getLatestVitals = () => {
    if (!patient.vitals || patient.vitals.length === 0) return null;
    return patient.vitals[patient.vitals.length - 1];
  };

  const latestVitals = getLatestVitals();

  if (!latestVitals) {
    return null;
  }

  return (
    <div className={`rounded-lg border-2 p-4 shadow-sm ${getEmergencyLevelStyles(patient.emergencyLevel)}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg">{patient.name}</h3>
          <p className="text-sm text-gray-600">
            {patient.age} yrs • {patient.gender} • {patient.ambulanceId?.ambulanceId}
          </p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
          patient.emergencyLevel === 'critical' ? 'bg-red-100 text-red-800' :
          patient.emergencyLevel === 'moderate' ? 'bg-orange-100 text-orange-800' :
          'bg-green-100 text-green-800'
        }`}>
          {patient.emergencyLevel}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold">{latestVitals.heartRate}</p>
          <p className="text-xs text-gray-500">Heart Rate</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{latestVitals.spo2}%</p>
          <p className="text-xs text-gray-500">SpO₂</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold">
            {latestVitals.bloodPressure.systolic}/{latestVitals.bloodPressure.diastolic}
          </p>
          <p className="text-xs text-gray-500">BP</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{latestVitals.temperature}°C</p>
          <p className="text-xs text-gray-500">Temp</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">
          Updated: {new Date(latestVitals.timestamp).toLocaleTimeString()}
        </span>
        <Link
          to={`/patients/${patient._id}`}
          className="px-3 py-1 bg-medical-blue text-white text-sm rounded hover:bg-blue-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PatientCard;
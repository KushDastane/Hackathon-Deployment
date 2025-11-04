import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const VitalsChart = ({ patient }) => {
  if (!patient || !patient.vitals || patient.vitals.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No vitals data available for this patient
      </div>
    );
  }

  // Prepare chart data
  const chartData = patient.vitals.map((vital, index) => ({
    time: index,
    heartRate: vital.heartRate,
    spo2: vital.spo2,
    temperature: vital.temperature,
    systolic: vital.bloodPressure.systolic,
    diastolic: vital.bloodPressure.diastolic,
    respiratoryRate: vital.respiratoryRate
  }));

  return (
    <div className="space-y-6">
      {/* Heart Rate Chart */}
      <div>
        <h3 className="font-medium mb-2 text-sm text-gray-700">Heart Rate</h3>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" tick={false} />
            <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="heartRate" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* SpO2 Chart */}
      <div>
        <h3 className="font-medium mb-2 text-sm text-gray-700">SpO₂</h3>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" tick={false} />
            <YAxis domain={[90, 100]} />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="spo2" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Blood Pressure Chart */}
      <div>
        <h3 className="font-medium mb-2 text-sm text-gray-700">Blood Pressure</h3>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" tick={false} />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="systolic" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={false}
              name="Systolic"
            />
            <Line 
              type="monotone" 
              dataKey="diastolic" 
              stroke="#f97316" 
              strokeWidth={2}
              dot={false}
              name="Diastolic"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VitalsChart;
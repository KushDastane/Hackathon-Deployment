import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.REACT_APP_ENCRYPTION_KEY || 'ambulance_secret_key_256';

export class EncryptionService {
  // AES Encryption
  static encrypt(data) {
    try {
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
      return encrypted;
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  // AES Decryption
  static decrypt(encryptedData) {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
      const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  // Generate simulated ECG data
  static generateSimulatedECG() {
    const dataPoints = [];
    for (let i = 0; i < 100; i++) {
      // Simulate ECG waveform with some noise
      const base = Math.sin(i * 0.2) * 50;
      const noise = (Math.random() - 0.5) * 20;
      dataPoints.push(Math.round(base + noise + 100)); // Center around 100
    }
    return dataPoints;
  }
}

// Data simulator for demo purposes
export class DataSimulator {
  static generateVitals(patientId) {
    const heartRate = Math.floor(Math.random() * 60) + 60; // 60-120 bpm
    const systolic = Math.floor(Math.random() * 60) + 100; // 100-160 mmHg
    const diastolic = Math.floor(Math.random() * 30) + 60; // 60-90 mmHg
    const spo2 = Math.floor(Math.random() * 6) + 95; // 95-100%
    const temperature = (Math.random() * 2) + 36.5; // 36.5-38.5°C
    const respiratoryRate = Math.floor(Math.random() * 10) + 12; // 12-22 bpm

    return {
      patientId,
      vitals: {
        heartRate,
        bloodPressure: { systolic, diastolic },
        spo2,
        temperature: parseFloat(temperature.toFixed(1)),
        ecg: EncryptionService.generateSimulatedECG(),
        respiratoryRate,
        timestamp: new Date()
      },
      location: {
        latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
        longitude: -74.0060 + (Math.random() - 0.5) * 0.1,
        address: 'Ambulance in transit'
      }
    };
  }
}
class EmergencyClassifier {
  static classifyVitals(vitals) {
    let criticalCount = 0;
    let moderateCount = 0;

    // Heart Rate classification
    if (vitals.heartRate < 50 || vitals.heartRate > 130) criticalCount++;
    else if (vitals.heartRate < 60 || vitals.heartRate > 100) moderateCount++;

    // Blood Pressure classification
    if (vitals.bloodPressure.systolic > 180 || vitals.bloodPressure.systolic < 90 ||
        vitals.bloodPressure.diastolic > 120 || vitals.bloodPressure.diastolic < 60) {
      criticalCount++;
    } else if (vitals.bloodPressure.systolic > 140 || vitals.bloodPressure.systolic < 100 ||
               vitals.bloodPressure.diastolic > 90 || vitals.bloodPressure.diastolic < 70) {
      moderateCount++;
    }

    // SpO2 classification
    if (vitals.spo2 < 90) criticalCount++;
    else if (vitals.spo2 < 95) moderateCount++;

    // Temperature classification
    if (vitals.temperature > 39.5 || vitals.temperature < 35) criticalCount++;
    else if (vitals.temperature > 38 || vitals.temperature < 36) moderateCount++;

    // Respiratory Rate classification
    if (vitals.respiratoryRate < 10 || vitals.respiratoryRate > 30) criticalCount++;
    else if (vitals.respiratoryRate < 12 || vitals.respiratoryRate > 24) moderateCount++;

    // Determine emergency level
    if (criticalCount >= 2) return 'critical';
    if (criticalCount >= 1 || moderateCount >= 3) return 'moderate';
    return 'stable';
  }

  static getVitalsThresholds() {
    return {
      heartRate: { min: 60, max: 100 },
      bloodPressure: { systolic: { min: 90, max: 140 }, diastolic: { min: 60, max: 90 } },
      spo2: { min: 95, max: 100 },
      temperature: { min: 36.1, max: 37.8 },
      respiratoryRate: { min: 12, max: 20 }
    };
  }
}

module.exports = EmergencyClassifier;
/**
 * Generates randomized test data for network flow features
 * All features are within realistic ranges for network traffic analysis
 */

export const FEATURE_RANGES: Record<string, [number, number]> = {
  "Flow Duration": [100, 3600000],
  "Total Fwd Packets": [1, 5000],
  "Total Backward Packets": [0, 5000],
  "Total Length of Fwd Packets": [20, 500000],
  "Total Length of Bwd Packets": [0, 500000],
  "Fwd Packet Length Max": [20, 65535],
  "Fwd Packet Length Min": [0, 1500],
  "Fwd Packet Length Mean": [0, 1500],
  "Fwd Packet Length Std": [0, 1000],
  "Bwd Packet Length Max": [0, 65535],
  "Bwd Packet Length Min": [0, 1500],
  "Bwd Packet Length Mean": [0, 1500],
  "Bwd Packet Length Std": [0, 1000],
  "Min Packet Length": [0, 1500],
  "Max Packet Length": [20, 65535],
  "Packet Length Mean": [0, 1500],
  "Packet Length Std": [0, 1000],
  "Packet Length Variance": [0, 1000000],
  "Flow Bytes/s": [0, 100000],
  "Flow Packets/s": [0, 10000],
  "Fwd Packets/s": [0, 10000],
  "Bwd Packets/s": [0, 10000],
  "Flow IAT Mean": [0, 100000],
  "Flow IAT Std": [0, 100000],
  "Fwd IAT Total": [0, 3600000],
  "Fwd IAT Mean": [0, 100000],
  "Fwd IAT Std": [0, 100000],
  "Fwd IAT Max": [0, 1000000],
  "Fwd IAT Min": [0, 10000],
  "Bwd IAT Total": [0, 3600000],
  "Bwd IAT Mean": [0, 100000],
  "Bwd IAT Std": [0, 100000],
  "Bwd IAT Max": [0, 1000000],
  "Bwd IAT Min": [0, 10000],
  "FIN Flag Count": [0, 100],
  "SYN Flag Count": [0, 100],
  "RST Flag Count": [0, 100],
  "PSH Flag Count": [0, 100],
  "ACK Flag Count": [0, 5000],
  "URG Flag Count": [0, 100],
  "CWE Flag Count": [0, 100],
  "ECE Flag Count": [0, 100],
  "Fwd PSH Flags": [0, 100],
  "Bwd PSH Flags": [0, 100],
  "Fwd URG Flags": [0, 100],
  "Bwd URG Flags": [0, 100],
  "Fwd Header Length": [20, 1000],
  "Bwd Header Length": [0, 1000],
  "Fwd Header Length.1": [0, 1000],
  "Down/Up Ratio": [0, 100],
  "Average Packet Size": [0, 1500],
  "Avg Fwd Segment Size": [0, 1500],
  "Avg Bwd Segment Size": [0, 1500],
  "Fwd Avg Bytes/Bulk Rate": [0, 1000000],
  "Fwd Avg Packets/Bulk Rate": [0, 10000],
  "Fwd Avg Bulk Rate": [0, 1000000],
  "Bwd Avg Bytes/Bulk Rate": [0, 1000000],
  "Bwd Avg Packets/Bulk Rate": [0, 10000],
  "Bwd Avg Bulk Rate": [0, 1000000],
  "Subflow Fwd Packets": [0, 5000],
  "Subflow Fwd Bytes": [0, 500000],
  "Subflow Bwd Packets": [0, 5000],
  "Subflow Bwd Bytes": [0, 500000],
  "Init Win Bytes Fwd": [0, 65535],
  "Init Win Bytes Bwd": [0, 65535],
  "Fwd Act Data Pkts": [0, 5000],
  "Fwd Seg Size Min": [0, 1500],
  "Active Mean": [0, 1000000],
  "Active Std": [0, 1000000],
  "Active Max": [0, 3600000],
  "Active Min": [0, 100000],
  "Idle Mean": [0, 1000000],
  "Idle Std": [0, 1000000],
  "Idle Max": [0, 3600000],
  "Idle Min": [0, 100000],
}

/**
 * Generate a random number within a given range
 */
function randomInRange(min: number, max: number, isInteger = false): number {
  const value = Math.random() * (max - min) + min
  return isInteger ? Math.floor(value) : Math.round(value * 100) / 100
}

/**
 * Determine if a feature should be an integer based on its name
 */
function shouldBeInteger(featureName: string): boolean {
  const integerFeatures = ["Packets", "Count", "Flags", "Bytes", "Length", "Ratio", "Header"]
  return integerFeatures.some((term) => featureName.includes(term))
}

/**
 * Generate random values for all network flow features
 */
export function generateRandomFeatures(): Record<string, number> {
  const features: Record<string, number> = {}

  Object.entries(FEATURE_RANGES).forEach(([featureName, [min, max]]) => {
    const isInteger = shouldBeInteger(featureName)
    features[featureName] = randomInRange(min, max, isInteger)
  })

  return features
}

/**
 * Generate random JSON batch data with multiple flows
 */
export function generateRandomBatchJson(numberOfFlows = 3): string {
  const flows = Array.from({ length: numberOfFlows }, () => ({
    features: generateRandomFeatures(),
  }))

  return JSON.stringify(flows, null, 2)
}

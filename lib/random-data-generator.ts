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
 * Generate random values for all network flow features (benign traffic)
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
 * Generate malicious attack patterns (DDoS, PortScan, Brute Force, etc.)
 * Characteristics: high packet rates, one-way traffic, many SYN flags, short duration
 */
export function generateMaliciousFeatures(): Record<string, number> {
  const features: Record<string, number> = {}
  
  // Short duration (1-30 seconds for attacks)
  features["Flow Duration"] = randomInRange(1000, 30000, true)
  
  // High forward packets, low/no backward (one-way attack traffic)
  const fwdPackets = randomInRange(500, 10000, true)
  const bwdPackets = randomInRange(0, Math.floor(fwdPackets * 0.1), true)
  features["Total Fwd Packets"] = fwdPackets
  features["Total Backward Packets"] = bwdPackets
  
  // High forward bytes, low backward
  features["Total Length of Fwd Packets"] = randomInRange(10000, 1000000, true)
  features["Total Length of Bwd Packets"] = randomInRange(0, 10000, true)
  
  // Variable packet sizes (attack patterns)
  features["Fwd Packet Length Max"] = randomInRange(100, 1500, true)
  features["Fwd Packet Length Min"] = randomInRange(10, 100, true)
  features["Fwd Packet Length Mean"] = randomInRange(40, 200, true)
  features["Fwd Packet Length Std"] = randomInRange(50, 300, true)
  
  // Low or zero backward packets
  features["Bwd Packet Length Max"] = randomInRange(0, 200, true)
  features["Bwd Packet Length Min"] = 0
  features["Bwd Packet Length Mean"] = randomInRange(0, 100, true)
  features["Bwd Packet Length Std"] = randomInRange(0, 50, true)
  
  // High packet/byte rates (attack intensity)
  features["Flow Bytes/s"] = randomInRange(5000, 500000, true)
  features["Flow Packets/s"] = randomInRange(50, 2000, true)
  features["Fwd Packets/s"] = randomInRange(50, 2000, true)
  features["Bwd Packets/s"] = randomInRange(0, 50, true)
  
  // Low inter-arrival times (rapid packets)
  features["Flow IAT Mean"] = randomInRange(1, 50, true)
  features["Flow IAT Std"] = randomInRange(0.5, 20, true)
  features["Fwd IAT Total"] = features["Flow Duration"] * 0.8
  features["Fwd IAT Mean"] = randomInRange(1, 30, true)
  features["Fwd IAT Std"] = randomInRange(0.5, 15, true)
  features["Fwd IAT Max"] = randomInRange(5, 100, true)
  features["Fwd IAT Min"] = randomInRange(0.1, 5, true)
  
  // Low backward IAT (if any)
  features["Bwd IAT Total"] = randomInRange(0, features["Flow Duration"] * 0.2, true)
  features["Bwd IAT Mean"] = randomInRange(0, 100, true)
  features["Bwd IAT Std"] = randomInRange(0, 50, true)
  features["Bwd IAT Max"] = randomInRange(0, 200, true)
  features["Bwd IAT Min"] = randomInRange(0, 10, true)
  
  // Attack flags: Many SYN (port scan), some RST, low ACK
  features["SYN Flag Count"] = randomInRange(100, 5000, true)
  features["RST Flag Count"] = randomInRange(0, 100, true)
  features["ACK Flag Count"] = randomInRange(0, Math.floor(fwdPackets * 0.2), true)
  features["FIN Flag Count"] = randomInRange(0, 10, true)
  features["PSH Flag Count"] = randomInRange(0, 50, true)
  features["URG Flag Count"] = randomInRange(0, 20, true)
  features["CWE Flag Count"] = randomInRange(0, 10, true)
  features["ECE Flag Count"] = randomInRange(0, 10, true)
  features["Fwd PSH Flags"] = randomInRange(0, 20, true)
  features["Bwd PSH Flags"] = 0
  features["Fwd URG Flags"] = randomInRange(0, 10, true)
  features["Bwd URG Flags"] = 0
  
  // Header lengths
  features["Fwd Header Length"] = randomInRange(20, 60, true)
  features["Bwd Header Length"] = randomInRange(0, 40, true)
  features["Fwd Header Length.1"] = randomInRange(20, 60, true)
  
  // Packet statistics
  features["Min Packet Length"] = randomInRange(10, 100, true)
  features["Max Packet Length"] = randomInRange(200, 1500, true)
  features["Packet Length Mean"] = randomInRange(40, 200, true)
  features["Packet Length Std"] = randomInRange(50, 300, true)
  features["Packet Length Variance"] = randomInRange(2500, 90000, true)
  features["Average Packet Size"] = randomInRange(40, 200, true)
  features["Avg Fwd Segment Size"] = randomInRange(40, 200, true)
  features["Avg Bwd Segment Size"] = randomInRange(0, 100, true)
  
  // Bulk rates (usually low for attacks)
  features["Fwd Avg Bytes/Bulk Rate"] = randomInRange(0, 100000, true)
  features["Fwd Avg Packets/Bulk Rate"] = randomInRange(0, 1000, true)
  features["Fwd Avg Bulk Rate"] = randomInRange(0, 100000, true)
  features["Bwd Avg Bytes/Bulk Rate"] = 0
  features["Bwd Avg Packets/Bulk Rate"] = 0
  features["Bwd Avg Bulk Rate"] = 0
  
  // Subflow features
  features["Subflow Fwd Packets"] = fwdPackets
  features["Subflow Fwd Bytes"] = features["Total Length of Fwd Packets"]
  features["Subflow Bwd Packets"] = bwdPackets
  features["Subflow Bwd Bytes"] = features["Total Length of Bwd Packets"]
  
  // Window sizes
  features["Init Win Bytes Fwd"] = randomInRange(0, 65535, true)
  features["Init Win Bytes Bwd"] = randomInRange(0, 10000, true)
  features["Fwd Act Data Pkts"] = randomInRange(0, Math.floor(fwdPackets * 0.8), true)
  features["Fwd Seg Size Min"] = randomInRange(0, 100, true)
  
  // Activity/Idle times (short for attacks)
  features["Active Mean"] = randomInRange(100, 5000, true)
  features["Active Std"] = randomInRange(50, 2000, true)
  features["Active Max"] = randomInRange(500, 10000, true)
  features["Active Min"] = randomInRange(10, 100, true)
  features["Idle Mean"] = randomInRange(0, 1000, true)
  features["Idle Std"] = randomInRange(0, 500, true)
  features["Idle Max"] = randomInRange(0, 2000, true)
  features["Idle Min"] = 0
  
  // Down/Up ratio (very low for one-way attacks)
  features["Down/Up Ratio"] = randomInRange(0, 0.1, false)

  return features
}

/**
 * Generate random JSON batch data with multiple flows
 * @param numberOfFlows Number of flows to generate
 * @param malicious Whether to generate malicious attack patterns (default: false for benign)
 */
export function generateRandomBatchJson(numberOfFlows = 3, malicious = false): string {
  const generator = malicious ? generateMaliciousFeatures : generateRandomFeatures
  const flows = Array.from({ length: numberOfFlows }, () => ({
    features: generator(),
  }))

  return JSON.stringify(flows, null, 2)
}

/**
 * Generate mixed batch data with both benign and malicious flows
 * @param numberOfFlows Total number of flows
 * @param maliciousRatio Ratio of malicious flows (0.0 to 1.0)
 */
export function generateMixedBatchJson(numberOfFlows = 5, maliciousRatio = 0.5): string {
  const numMalicious = Math.floor(numberOfFlows * maliciousRatio)
  const numBenign = numberOfFlows - numMalicious
  
  const flows: Array<{ features: Record<string, number> }> = []
  
  // Generate benign flows
  for (let i = 0; i < numBenign; i++) {
    flows.push({ features: generateRandomFeatures() })
  }
  
  // Generate malicious flows
  for (let i = 0; i < numMalicious; i++) {
    flows.push({ features: generateMaliciousFeatures() })
  }
  
  // Shuffle to mix benign and malicious
  for (let i = flows.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [flows[i], flows[j]] = [flows[j], flows[i]]
  }

  return JSON.stringify(flows, null, 2)
}

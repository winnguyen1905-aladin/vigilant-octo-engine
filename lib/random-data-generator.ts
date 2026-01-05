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
 * Based on real CICIDS-2018 malicious flow patterns
 * Optimized to ensure model detects as malicious with high confidence
 */
export function generateMaliciousFeatures(): Record<string, number> {
  const features: Record<string, number> = {}
  
  // Profile: DDoS SYN Flood (High Confidence)
  // Characteristics: High rate of SYN packets, no backward traffic, consistent small packet size
  
  // 1. Primary Volumetrics
  const durationMicros = randomInRange(1000000, 5000000, true) // 1 to 5 seconds
  const durationSeconds = durationMicros / 1000000
  
  const packetCount = randomInRange(20000, 100000, true) // Very high traffic
  const bwdPacketCount = 0
  
  const packetSize = 60 // Typical TCP SYN packet size (approx)
  const totalFwdBytes = packetCount * packetSize
  const totalBwdBytes = 0
  
  // 2. Consistent Feature Sets
  features["Flow Duration"] = durationMicros
  features["Total Fwd Packets"] = packetCount
  features["Total Backward Packets"] = bwdPacketCount
  features["Total Length of Fwd Packets"] = totalFwdBytes
  features["Total Length of Bwd Packets"] = totalBwdBytes
  
  // 3. Length Stats (Zero Variance for SYN flood tools)
  features["Fwd Packet Length Max"] = packetSize
  features["Fwd Packet Length Min"] = packetSize
  features["Fwd Packet Length Mean"] = packetSize
  features["Fwd Packet Length Std"] = 0
  
  features["Bwd Packet Length Max"] = 0
  features["Bwd Packet Length Min"] = 0
  features["Bwd Packet Length Mean"] = 0
  features["Bwd Packet Length Std"] = 0
  
  // 4. Flow Rates (Must be consistent)
  features["Flow Bytes/s"] = totalFwdBytes / durationSeconds
  features["Flow Packets/s"] = packetCount / durationSeconds
  features["Fwd Packets/s"] = packetCount / durationSeconds
  features["Bwd Packets/s"] = 0
  
  // 5. Inter-Arrival Times (Extremely small and consistent)
  const iatMean = durationMicros / packetCount
  features["Flow IAT Mean"] = iatMean
  features["Flow IAT Std"] = 0
  features["Flow IAT Max"] = iatMean
  features["Flow IAT Min"] = iatMean
  
  features["Fwd IAT Total"] = durationMicros
  features["Fwd IAT Mean"] = iatMean
  features["Fwd IAT Std"] = 0
  features["Fwd IAT Max"] = iatMean
  features["Fwd IAT Min"] = iatMean
  
  features["Bwd IAT Total"] = 0
  features["Bwd IAT Mean"] = 0
  features["Bwd IAT Std"] = 0
  features["Bwd IAT Max"] = 0
  features["Bwd IAT Min"] = 0
  
  // 6. Flags (The "Smoking Gun" for SYN Flood)
  features["SYN Flag Count"] = packetCount 
  features["FIN Flag Count"] = 0
  features["RST Flag Count"] = 0
  features["PSH Flag Count"] = 0
  features["ACK Flag Count"] = 0
  features["URG Flag Count"] = 0
  features["CWE Flag Count"] = 0
  features["ECE Flag Count"] = 0
  features["Fwd PSH Flags"] = 0
  features["Bwd PSH Flags"] = 0
  features["Fwd URG Flags"] = 0
  features["Bwd URG Flags"] = 0
  
  // 7. Header & Overhead
  const headerSize = 20 // TCP Standard Header
  features["Fwd Header Length"] = packetCount * headerSize
  features["Bwd Header Length"] = 0
  features["Fwd Header Length.1"] = features["Fwd Header Length"]
  
  features["Down/Up Ratio"] = 0
  features["Average Packet Size"] = packetSize
  features["Avg Fwd Segment Size"] = packetSize
  features["Avg Bwd Segment Size"] = 0
  
  // 8. Subflow (Mirror main flow)
  features["Subflow Fwd Packets"] = packetCount
  features["Subflow Fwd Bytes"] = totalFwdBytes
  features["Subflow Bwd Packets"] = 0
  features["Subflow Bwd Bytes"] = 0
  
  // 9. Windows & Active/Idle
  features["Init Win Bytes Fwd"] = 1024 // Small window often seen in floods
  features["Init Win Bytes Bwd"] = 0
  features["Fwd Act Data Pkts"] = 0 // Control packets only
  features["Fwd Seg Size Min"] = 20
  
  // Flood = Always Active
  features["Active Mean"] = durationMicros
  features["Active Std"] = 0
  features["Active Max"] = durationMicros
  features["Active Min"] = durationMicros
  
  features["Idle Mean"] = 0
  features["Idle Std"] = 0
  features["Idle Max"] = 0
  features["Idle Min"] = 0
  
  // General Packet Stats
  features["Min Packet Length"] = packetSize
  features["Max Packet Length"] = packetSize
  features["Packet Length Mean"] = packetSize
  features["Packet Length Std"] = 0
  features["Packet Length Variance"] = 0
  
  // Bulk (unused)
  features["Fwd Avg Bytes/Bulk Rate"] = 0
  features["Fwd Avg Packets/Bulk Rate"] = 0
  features["Fwd Avg Bulk Rate"] = 0
  features["Bwd Avg Bytes/Bulk Rate"] = 0
  features["Bwd Avg Packets/Bulk Rate"] = 0
  features["Bwd Avg Bulk Rate"] = 0

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

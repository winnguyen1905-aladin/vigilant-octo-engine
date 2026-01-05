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
  
  // Short duration (1-10 seconds) - typical for attacks
  const duration = randomInRange(1000, 10000, true)
  features["Flow Duration"] = duration
  
  // High forward packets, ZERO backward (strong one-way attack pattern)
  // Based on MALICIOUS_FLOW: 1000 packets, 0 backward
  const fwdPackets = randomInRange(500, 3000, true)
  const bwdPackets = 0 // Always zero for pure attack pattern
  features["Total Fwd Packets"] = fwdPackets
  features["Total Backward Packets"] = bwdPackets
  
  // Forward bytes: ~50 bytes per packet (small SYN packets)
  // Based on MALICIOUS_FLOW: 50000 bytes for 1000 packets = 50 bytes/packet
  const avgPacketSize = randomInRange(40, 60, true)
  const fwdBytes = fwdPackets * avgPacketSize
  features["Total Length of Fwd Packets"] = fwdBytes
  features["Total Length of Bwd Packets"] = 0
  
  // Packet sizes: small packets typical of port scans/DDoS
  // Based on MALICIOUS_FLOW: Mean=50, Min=10, Max=1000, Std=100
  features["Fwd Packet Length Max"] = randomInRange(100, 1000, true)
  features["Fwd Packet Length Min"] = randomInRange(10, 60, true)
  features["Fwd Packet Length Mean"] = avgPacketSize
  features["Fwd Packet Length Std"] = randomInRange(50, 150, true) // High variance
  
  // Zero backward packets
  features["Bwd Packet Length Max"] = 0
  features["Bwd Packet Length Min"] = 0
  features["Bwd Packet Length Mean"] = 0
  features["Bwd Packet Length Std"] = 0
  
  // Calculate rates based on actual values (like MALICIOUS_FLOW)
  const durationSec = duration / 1000
  const flowBytesPerSec = fwdBytes / durationSec
  const flowPacketsPerSec = fwdPackets / durationSec
  
  features["Flow Bytes/s"] = Math.round(flowBytesPerSec * 100) / 100
  features["Flow Packets/s"] = Math.round(flowPacketsPerSec * 100) / 100
  features["Fwd Packets/s"] = features["Flow Packets/s"]
  features["Bwd Packets/s"] = 0
  
  // Inter-arrival times: very low (rapid attack)
  // Based on MALICIOUS_FLOW: IAT Mean = 5.0, Std = 2.0
  const iatMean = duration / fwdPackets
  const iatStd = iatMean * randomInRange(0.3, 0.5, false)
  
  features["Flow IAT Mean"] = Math.round(iatMean * 100) / 100
  features["Flow IAT Std"] = Math.round(iatStd * 100) / 100
  features["Fwd IAT Total"] = duration
  features["Fwd IAT Mean"] = features["Flow IAT Mean"]
  features["Fwd IAT Std"] = features["Flow IAT Std"]
  features["Fwd IAT Max"] = Math.round((features["Fwd IAT Mean"] + features["Fwd IAT Std"] * 2) * 100) / 100
  features["Fwd IAT Min"] = Math.max(0.1, Math.round((features["Fwd IAT Mean"] - features["Fwd IAT Std"]) * 100) / 100)
  
  // Zero backward IAT
  features["Bwd IAT Total"] = 0
  features["Bwd IAT Mean"] = 0
  features["Bwd IAT Std"] = 0
  features["Bwd IAT Max"] = 0
  features["Bwd IAT Min"] = 0
  
  // Attack flags: SYN flood pattern
  // Based on MALICIOUS_FLOW: SYN = Total Fwd Packets (each packet is SYN)
  features["SYN Flag Count"] = fwdPackets
  features["RST Flag Count"] = 0
  features["ACK Flag Count"] = 0 // No ACK = no proper connection
  features["FIN Flag Count"] = 0 // No proper termination
  features["PSH Flag Count"] = 0
  features["URG Flag Count"] = 0
  features["CWE Flag Count"] = 0
  features["ECE Flag Count"] = 0
  features["Fwd PSH Flags"] = 0
  features["Bwd PSH Flags"] = 0
  features["Fwd URG Flags"] = 0
  features["Bwd URG Flags"] = 0
  
  // Header lengths: small (SYN packets are ~20-40 bytes)
  // Based on MALICIOUS_FLOW: Fwd Header Length = 20
  features["Fwd Header Length"] = randomInRange(20, 40, true)
  features["Bwd Header Length"] = 0
  features["Fwd Header Length.1"] = features["Fwd Header Length"]
  
  // Packet statistics
  features["Min Packet Length"] = features["Fwd Packet Length Min"]
  features["Max Packet Length"] = features["Fwd Packet Length Max"]
  features["Packet Length Mean"] = features["Fwd Packet Length Mean"]
  features["Packet Length Std"] = features["Fwd Packet Length Std"]
  features["Packet Length Variance"] = Math.round(Math.pow(features["Packet Length Std"], 2) * 100) / 100
  features["Average Packet Size"] = features["Fwd Packet Length Mean"]
  features["Avg Fwd Segment Size"] = features["Fwd Packet Length Mean"]
  features["Avg Bwd Segment Size"] = 0
  
  // Bulk rates: zero (no bulk transfer in port scans)
  features["Fwd Avg Bytes/Bulk Rate"] = 0
  features["Fwd Avg Packets/Bulk Rate"] = 0
  features["Fwd Avg Bulk Rate"] = 0
  features["Bwd Avg Bytes/Bulk Rate"] = 0
  features["Bwd Avg Packets/Bulk Rate"] = 0
  features["Bwd Avg Bulk Rate"] = 0
  
  // Subflow features match main flow exactly
  features["Subflow Fwd Packets"] = fwdPackets
  features["Subflow Fwd Bytes"] = fwdBytes
  features["Subflow Bwd Packets"] = 0
  features["Subflow Bwd Bytes"] = 0
  
  // Window sizes: low or zero (no proper connection)
  features["Init Win Bytes Fwd"] = randomInRange(0, 5000, true)
  features["Init Win Bytes Bwd"] = 0
  features["Fwd Act Data Pkts"] = 0 // No data packets in SYN flood
  features["Fwd Seg Size Min"] = randomInRange(0, 20, true)
  
  // Activity/Idle times: very short for rapid attacks
  features["Active Mean"] = randomInRange(50, 1000, true)
  features["Active Std"] = randomInRange(20, 300, true)
  features["Active Max"] = randomInRange(100, 2000, true)
  features["Active Min"] = randomInRange(5, 50, true)
  features["Idle Mean"] = 0 // No idle time
  features["Idle Std"] = 0
  features["Idle Max"] = 0
  features["Idle Min"] = 0
  
  // Down/Up ratio = 0 (pure one-way attack)
  features["Down/Up Ratio"] = 0

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

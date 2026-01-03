// API service with TypeScript interfaces matching the API documentation
import axios, { type AxiosInstance } from "axios"

const API_BASE_URL = "http://localhost:8000"

// Response Types
export interface HealthResponse {
  status: "healthy" | "degraded"
  model_loaded: boolean
  device: "cuda" | "cpu"
  num_features: number
}

export interface InfoResponse {
  model_type: string
  device: "cuda" | "cpu"
  num_features: number
  num_parameters: number
  feature_columns: string[]
}

export interface PredictionResponse {
  prediction: "Benign" | "Malicious"
  probability: number
  is_attack: boolean
  confidence: "Very High" | "High" | "Medium" | "Low"
}

export interface BatchPredictionResult {
  index: number
  prediction: "Benign" | "Malicious"
  probability: number
  is_attack: boolean
  confidence: "Very High" | "High" | "Medium" | "Low"
  attack_probability: number
  benign_probability: number
}

export interface BatchPredictionResponse {
  predictions: BatchPredictionResult[]
  summary: {
    total: number
    attacks: number
    benign: number
    attack_rate: number
  }
}

export interface PredictRequest {
  features: Record<string, number>
}

export interface BatchPredictRequest {
  flows: Array<{ features: Record<string, number> }>
}

class ApiService {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  async getHealth(): Promise<HealthResponse> {
    const response = await this.client.get<HealthResponse>("/health")
    return response.data
  }

  async getInfo(): Promise<InfoResponse> {
    const response = await this.client.get<InfoResponse>("/info")
    return response.data
  }

  async predict(features: Record<string, number>): Promise<PredictionResponse> {
    const response = await this.client.post<PredictionResponse>("/predict", {
      features,
    })
    return response.data
  }

  async batchPredict(flows: Array<{ features: Record<string, number> }>): Promise<BatchPredictionResponse> {
    const response = await this.client.post<BatchPredictionResponse>("/predict/batch", {
      flows,
    })
    return response.data
  }
}

export const apiService = new ApiService()

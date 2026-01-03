"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { useApi } from "@/hooks/use-api"
import { apiService, type HealthResponse, type InfoResponse } from "@/lib/api-service"
import { AlertCircle, Database, Zap, Cpu } from "lucide-react"

export default function ModelInfo() {
  const healthApi = useApi<HealthResponse>()
  const infoApi = useApi<InfoResponse>()

  useEffect(() => {
    const loadData = async () => {
      try {
        await healthApi.execute(() => apiService.getHealth())
        await infoApi.execute(() => apiService.getInfo())
      } catch (err) {
        console.error("Failed to load model info:", err)
      }
    }

    loadData()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Model Information</h1>
          <p className="text-muted-foreground">Details about the GNN model and system configuration</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Health Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {healthApi.loading ? (
                <div className="flex items-center gap-2">
                  <Spinner className="w-4 h-4" />
                  <span>Loading...</span>
                </div>
              ) : healthApi.error ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{healthApi.error}</AlertDescription>
                </Alert>
              ) : healthApi.data ? (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <p className="text-sm font-medium mb-1">Status</p>
                    <p
                      className={`text-lg font-bold ${
                        healthApi.data.status === "healthy" ? "text-green-600" : "text-yellow-600"
                      }`}
                    >
                      {healthApi.data.status === "healthy" ? "✓ Healthy" : "⚠ Degraded"}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <p className="text-sm font-medium mb-1">Model Loaded</p>
                    <p
                      className={`text-lg font-bold ${healthApi.data.model_loaded ? "text-green-600" : "text-red-600"}`}
                    >
                      {healthApi.data.model_loaded ? "✓ Yes" : "✗ No"}
                    </p>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Hardware Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="w-5 h-5" />
                Hardware Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              {healthApi.loading ? (
                <div className="flex items-center gap-2">
                  <Spinner className="w-4 h-4" />
                  <span>Loading...</span>
                </div>
              ) : healthApi.error ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{healthApi.error}</AlertDescription>
                </Alert>
              ) : healthApi.data ? (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <p className="text-sm font-medium mb-1">Device</p>
                    <p className="text-lg font-bold">{healthApi.data.device === "cuda" ? "🚀 GPU (CUDA)" : "💻 CPU"}</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <p className="text-sm font-medium mb-1">Expected Features</p>
                    <p className="text-lg font-bold">{healthApi.data.num_features}</p>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        {/* Model Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Model Architecture
            </CardTitle>
            <CardDescription>Technical specifications of the GNN classifier</CardDescription>
          </CardHeader>
          <CardContent>
            {infoApi.loading ? (
              <div className="flex items-center gap-2">
                <Spinner className="w-4 h-4" />
                <span>Loading...</span>
              </div>
            ) : infoApi.error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{infoApi.error}</AlertDescription>
              </Alert>
            ) : infoApi.data ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Specifications</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Model Type</p>
                      <p className="font-mono">{infoApi.data.model_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Parameters</p>
                      <p className="font-mono">{infoApi.data.num_parameters.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Input Features</p>
                      <p className="font-mono">{infoApi.data.num_features}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Processing Device</p>
                      <p className="font-mono">{infoApi.data.device}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Input Features (First 10)</h3>
                  <div className="space-y-2">
                    {infoApi.data.feature_columns.map((feature, idx) => (
                      <div key={idx} className="text-sm">
                        <span className="text-muted-foreground">{idx + 1}.</span> {feature}
                      </div>
                    ))}
                  </div>
                  {infoApi.data.num_features > 10 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      ... and {infoApi.data.num_features - 10} more features
                    </p>
                  )}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* API Performance Info */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Benchmarks</CardTitle>
            <CardDescription>Typical performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm font-medium text-muted-foreground mb-1">Single Prediction</p>
                <p className="text-2xl font-bold">10-50ms</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm font-medium text-muted-foreground mb-1">Batch (50 flows)</p>
                <p className="text-2xl font-bold">100-300ms</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm font-medium text-muted-foreground mb-1">Throughput</p>
                <p className="text-2xl font-bold">20-100/sec</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

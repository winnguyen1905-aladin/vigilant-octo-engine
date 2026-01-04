"use client"

import { useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { useApi } from "@/hooks/use-api"
import { apiService, type BatchPredictionResponse } from "@/lib/api-service"
import { 
  AlertCircle, 
  Upload, 
  Wand2, 
  FileJson,
  CheckCircle,
  XCircle,
  TrendingUp,
  Activity,
  Shield,
  Target,
  BarChart3,
  Layers,
  AlertTriangle,
  Info,
  Download,
  Copy,
  Check
} from "lucide-react"
import { generateRandomBatchJson, generateMixedBatchJson } from "@/lib/random-data-generator"

interface FormData {
  jsonData: string
  numFlows: number
  seed: number
}

export default function BatchPrediction() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      numFlows: 5,
      seed: 42
    }
  })
  const batchApi = useApi<BatchPredictionResponse>()
  const [isVisible, setIsVisible] = useState(false)
  const [jsonValid, setJsonValid] = useState<boolean | null>(null)
  const [copied, setCopied] = useState(false)
  const [dataType, setDataType] = useState<"benign" | "malicious" | "mixed">("benign")

  const jsonData = watch("jsonData")
  const numFlows = watch("numFlows")
  const seed = watch("seed")

  useState(() => {
    setIsVisible(true)
  })

  // Validate JSON in real-time
  useMemo(() => {
    if (!jsonData || jsonData.trim() === "") {
      setJsonValid(null)
      return
    }
    try {
      const parsed = JSON.parse(jsonData)
      setJsonValid(Array.isArray(parsed))
    } catch {
      setJsonValid(false)
    }
  }, [jsonData])

  const onSubmit = async (data: FormData) => {
    try {
      const parsed = JSON.parse(data.jsonData)

      if (!Array.isArray(parsed)) {
        throw new Error("Input must be an array of flows")
      }

      const flows = parsed.map((item: any) => ({
        features: typeof item.features === "object" ? item.features : item,
      }))

      await batchApi.execute(() => apiService.batchPredict(flows))
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Invalid JSON format"
      batchApi
        .execute(async () => {
          throw new Error(errorMsg)
        })
        .catch(() => {})
    }
  }

  const loadSample = () => {
    const sampleData = [
      {
        features: {
          "Flow Duration": 123456,
          "Total Fwd Packets": 10,
          "Total Backward Packets": 8,
          "Total Length of Fwd Packets": 1200,
          "Total Length of Bwd Packets": 800,
        },
      },
      {
        features: {
          "Flow Duration": 5000,
          "Total Fwd Packets": 1000,
          "Total Backward Packets": 950,
          "Total Length of Fwd Packets": 50000,
          "Total Length of Bwd Packets": 45000,
        },
      },
    ]

    setValue("jsonData", JSON.stringify(sampleData, null, 2))
  }

  const generateRandomBatch = () => {
    let randomJson: string
    if (dataType === "mixed") {
      randomJson = generateMixedBatchJson(numFlows || 5, 0.5)
    } else {
      randomJson = generateRandomBatchJson(numFlows || 5, dataType === "malicious")
    }
    setValue("jsonData", randomJson)
  }

  const copyToClipboard = () => {
    if (batchApi.data) {
      const resultJson = JSON.stringify(batchApi.data, null, 2)
      navigator.clipboard.writeText(resultJson)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const downloadResults = () => {
    if (batchApi.data) {
      const blob = new Blob([JSON.stringify(batchApi.data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `batch-prediction-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-700 dark:to-pink-800 rounded-2xl p-8 shadow-2xl">
            <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Layers className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white">Batch Flow Analysis</h1>
                  <p className="text-purple-100 text-lg">Phân tích hàng loạt nhiều network flows cùng lúc để phát hiện tấn công</p>
                </div>
              </div>
              
              {/* Stats Preview */}
              {batchApi.data && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-white/80 text-xs mb-1">Total Analyzed</p>
                    <p className="text-white text-2xl font-bold">{batchApi.data.summary.total}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-white/80 text-xs mb-1">Benign Flows</p>
                    <p className="text-green-300 text-2xl font-bold">{batchApi.data.summary.benign}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-white/80 text-xs mb-1">Attack Flows</p>
                    <p className="text-red-300 text-2xl font-bold">{batchApi.data.summary.attacks}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-white/80 text-xs mb-1">Attack Rate</p>
                    <p className="text-yellow-300 text-2xl font-bold">{(batchApi.data.summary.attack_rate * 100).toFixed(1)}%</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <Card className={`lg:col-span-2 transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileJson className="w-6 h-6 text-purple-600" />
                JSON Input Configuration
              </CardTitle>
              <CardDescription>
                Nhập dữ liệu JSON chứa mảng các network flows hoặc tạo dữ liệu test với seed tùy chỉnh
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Random Generation Controls */}
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl border border-purple-200 dark:border-purple-800">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-purple-600" />
                    Random Data Generator
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium block mb-2">Number of Flows</label>
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        {...register("numFlows", { 
                          valueAsNumber: true,
                          min: 1,
                          max: 100
                        })}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Generate 1-100 flows</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">Random Seed</label>
                      <Input
                        type="number"
                        {...register("seed", { valueAsNumber: true })}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Control randomness for reproducibility</p>
                    </div>
                  </div>
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center gap-3">
                      <Label className="text-sm font-medium">Data Type:</Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={dataType === "benign" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setDataType("benign")}
                          className="gap-1"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Benign
                        </Button>
                        <Button
                          type="button"
                          variant={dataType === "malicious" ? "destructive" : "outline"}
                          size="sm"
                          onClick={() => setDataType("malicious")}
                          className="gap-1"
                        >
                          <AlertTriangle className="w-3 h-3" />
                          Malicious
                        </Button>
                        <Button
                          type="button"
                          variant={dataType === "mixed" ? "secondary" : "outline"}
                          size="sm"
                          onClick={() => setDataType("mixed")}
                          className="gap-1"
                        >
                          <Activity className="w-3 h-3" />
                          Mixed
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={generateRandomBatch}
                        className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        <Wand2 className="w-4 h-4" />
                        Generate {dataType === "mixed" ? "Mixed" : dataType === "malicious" ? "Malicious" : "Benign"} Data
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={loadSample}
                      >
                        Load Sample Data
                      </Button>
                    </div>
                  </div>
                </div>

                {/* JSON Input Area */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <FileJson className="w-4 h-4" />
                      JSON Input
                    </label>
                    {jsonValid !== null && (
                      <div className="flex items-center gap-1.5">
                        {jsonValid ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-xs text-green-600 font-medium">Valid JSON Array</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-red-600" />
                            <span className="text-xs text-red-600 font-medium">Invalid JSON</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <Textarea
                    placeholder={`[
  {
    "features": {
      "Flow Duration": 123456,
      "Total Fwd Packets": 10,
      "Total Backward Packets": 8,
      ...
    }
  },
  {
    "features": { ... }
  }
]`}
                    className={`font-mono text-sm min-h-96 transition-all ${
                      jsonValid === true 
                        ? 'border-green-500 ring-1 ring-green-200 dark:ring-green-900'
                        : jsonValid === false
                        ? 'border-red-500 ring-1 ring-red-200 dark:ring-red-900'
                        : ''
                    }`}
                    {...register("jsonData", { required: "JSON data is required" })}
                  />
                  {errors.jsonData && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.jsonData.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Paste an array of flow objects. Each flow should have a "features" object with network flow metrics.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSubmit(onSubmit)}
                    disabled={batchApi.loading || !jsonValid} 
                    className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    size="lg"
                  >
                    {batchApi.loading && <Spinner className="w-4 h-4" />}
                    <Upload className="w-4 h-4" />
                    Analyze Batch
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className={`space-y-6 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Summary Card */}
            <Card className="sticky top-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    Analysis Summary
                  </CardTitle>
                  {batchApi.data && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={copyToClipboard}
                        className="h-8 w-8 p-0"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={downloadResults}
                        className="h-8 w-8 p-0"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {batchApi.loading ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <div className="relative">
                      <Spinner className="w-12 h-12 text-purple-600" />
                      <div className="absolute inset-0 w-12 h-12 border-4 border-purple-200 rounded-full animate-ping"></div>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">Processing batch...</p>
                    <p className="text-xs text-muted-foreground">Running GNN inference on multiple flows</p>
                  </div>
                ) : batchApi.error ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{batchApi.error}</AlertDescription>
                  </Alert>
                ) : batchApi.data ? (
                  <div className="space-y-6">
                    {/* Statistics Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-medium text-muted-foreground">Total Flows</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">{batchApi.data.summary.total}</p>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-xs font-medium text-muted-foreground">Benign</span>
                        </div>
                        <p className="text-2xl font-bold text-green-600">{batchApi.data.summary.benign}</p>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 rounded-lg border border-red-200 dark:border-red-800">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="text-xs font-medium text-muted-foreground">Attacks</span>
                        </div>
                        <p className="text-2xl font-bold text-red-600">{batchApi.data.summary.attacks}</p>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-purple-600" />
                          <span className="text-xs font-medium text-muted-foreground">Attack Rate</span>
                        </div>
                        <p className="text-2xl font-bold text-purple-600">
                          {(batchApi.data.summary.attack_rate * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground font-medium">Threat Distribution</span>
                        <span className="text-muted-foreground">
                          {batchApi.data.summary.benign} benign / {batchApi.data.summary.attacks} attacks
                        </span>
                      </div>
                      <div className="flex w-full h-3 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000"
                          style={{ width: `${(batchApi.data.summary.benign / batchApi.data.summary.total) * 100}%` }}
                        />
                        <div 
                          className="bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-1000"
                          style={{ width: `${(batchApi.data.summary.attacks / batchApi.data.summary.total) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Individual Predictions */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Individual Results
                        </p>
                        <span className="text-xs text-muted-foreground">{batchApi.data.predictions.length} flows</span>
                      </div>
                      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
                        {batchApi.data.predictions.map((pred) => (
                          <div 
                            key={pred.index} 
                            className={`p-3 rounded-lg border-2 transition-all hover:shadow-md ${
                              pred.is_attack 
                                ? 'bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-red-200 dark:border-red-900' 
                                : 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-900'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {pred.is_attack ? (
                                  <div className="p-1.5 bg-red-500 rounded">
                                    <AlertTriangle className="w-3 h-3 text-white" />
                                  </div>
                                ) : (
                                  <div className="p-1.5 bg-green-500 rounded">
                                    <CheckCircle className="w-3 h-3 text-white" />
                                  </div>
                                )}
                                <span className="font-semibold text-sm">Flow #{pred.index}</span>
                              </div>
                              <Badge 
                                variant={pred.is_attack ? "destructive" : "secondary"}
                                className="text-xs"
                              >
                                {pred.prediction}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                <span>{(pred.probability * 100).toFixed(1)}%</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                <span>{pred.confidence}</span>
                              </div>
                            </div>
                            {/* Mini progress bar */}
                            <div className="mt-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1 overflow-hidden">
                              <div
                                className={`h-full transition-all ${
                                  pred.is_attack 
                                    ? 'bg-gradient-to-r from-red-500 to-orange-500' 
                                    : 'bg-gradient-to-r from-green-500 to-emerald-500'
                                }`}
                                style={{ width: `${pred.probability * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Info Box */}
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border-l-4 border-blue-500">
                      <div className="flex gap-2">
                        <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-muted-foreground">
                          <p className="font-semibold mb-1 text-blue-700 dark:text-blue-300">Batch Processing Complete</p>
                          <p>All flows have been analyzed using the GNN model. Use the copy or download buttons to export results.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
                      <Layers className="w-8 h-8 text-purple-600" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 font-medium">Ready to Process</p>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                      Generate random data or paste JSON to analyze multiple flows at once.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Guide Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Batch Processing Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2 text-muted-foreground">
                <p>• <strong>Seed Control:</strong> Use the same seed to reproduce exact results</p>
                <p>• <strong>Scalability:</strong> Process 1-100 flows in a single batch</p>
                <p>• <strong>Real-time Validation:</strong> JSON is validated as you type</p>
                <p>• <strong>Export Results:</strong> Copy or download analysis results</p>
                <p>• <strong>Visual Feedback:</strong> Color-coded results for quick identification</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
"use client"

import { useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useApi } from "@/hooks/use-api"
import { apiService, type PredictionResponse } from "@/lib/api-service"
import { 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Wand2, 
  ChevronDown,
  ChevronUp,
  Info,
  Activity,
  Network,
  Flag,
  Layers,
  TrendingUp,
  Shield,
  AlertTriangle,
  Clock,
  Zap,
  Target
} from "lucide-react"
import { generateRandomFeatures, generateMaliciousFeatures } from "@/lib/random-data-generator"

// Feature groups with descriptions and icons
const FEATURE_GROUPS = [
  {
    id: "basic",
    title: "Basic Flow Metrics",
    icon: Activity,
    color: "blue",
    description: "Fundamental flow characteristics including duration, packet counts, and data volume",
    features: [
      "Flow Duration",
      "Total Fwd Packets",
      "Total Backward Packets",
      "Total Length of Fwd Packets",
      "Total Length of Bwd Packets",
      "Fwd Packet Length Max",
      "Fwd Packet Length Min",
      "Fwd Packet Length Mean",
      "Fwd Packet Length Std",
      "Bwd Packet Length Max",
      "Bwd Packet Length Min",
      "Bwd Packet Length Mean",
      "Bwd Packet Length Std",
    ]
  },
  {
    id: "packet",
    title: "Packet Statistics",
    icon: Network,
    color: "green",
    description: "Statistical analysis of packet sizes and distribution patterns",
    features: [
      "Min Packet Length",
      "Max Packet Length",
      "Packet Length Mean",
      "Packet Length Std",
      "Packet Length Variance",
      "Average Packet Size",
      "Avg Fwd Segment Size",
      "Avg Bwd Segment Size",
    ]
  },
  {
    id: "rate",
    title: "Flow Rate Metrics",
    icon: TrendingUp,
    color: "indigo",
    description: "Throughput and rate measurements for data and packet flow",
    features: [
      "Flow Bytes/s",
      "Flow Packets/s",
      "Fwd Packets/s",
      "Bwd Packets/s",
      "Fwd Avg Bytes/Bulk Rate",
      "Fwd Avg Packets/Bulk Rate",
      "Fwd Avg Bulk Rate",
      "Bwd Avg Bytes/Bulk Rate",
      "Bwd Avg Packets/Bulk Rate",
      "Bwd Avg Bulk Rate",
    ]
  },
  {
    id: "iat",
    title: "Inter-Arrival Time (IAT)",
    icon: Clock,
    color: "purple",
    description: "Time intervals between consecutive packets in the flow",
    features: [
      "Flow IAT Mean",
      "Flow IAT Std",
      "Fwd IAT Total",
      "Fwd IAT Mean",
      "Fwd IAT Std",
      "Fwd IAT Max",
      "Fwd IAT Min",
      "Bwd IAT Total",
      "Bwd IAT Mean",
      "Bwd IAT Std",
      "Bwd IAT Max",
      "Bwd IAT Min",
    ]
  },
  {
    id: "flags",
    title: "TCP Flags Analysis",
    icon: Flag,
    color: "orange",
    description: "TCP control flags indicating connection states and behaviors",
    features: [
      "FIN Flag Count",
      "SYN Flag Count",
      "RST Flag Count",
      "PSH Flag Count",
      "ACK Flag Count",
      "URG Flag Count",
      "CWE Flag Count",
      "ECE Flag Count",
      "Fwd PSH Flags",
      "Bwd PSH Flags",
      "Fwd URG Flags",
      "Bwd URG Flags",
    ]
  },
  {
    id: "header",
    title: "Header & Protocol",
    icon: Layers,
    color: "pink",
    description: "Header information and protocol-specific measurements",
    features: [
      "Fwd Header Length",
      "Bwd Header Length",
      "Fwd Header Length.1",
      "Down/Up Ratio",
      "Fwd Seg Size Min",
    ]
  },
  {
    id: "subflow",
    title: "Subflow Features",
    icon: Target,
    color: "cyan",
    description: "Characteristics of bidirectional subflows within the connection",
    features: [
      "Subflow Fwd Packets",
      "Subflow Fwd Bytes",
      "Subflow Bwd Packets",
      "Subflow Bwd Bytes",
      "Init Win Bytes Fwd",
      "Init Win Bytes Bwd",
      "Fwd Act Data Pkts",
    ]
  },
  {
    id: "activity",
    title: "Activity & Idle Time",
    icon: Zap,
    color: "emerald",
    description: "Active and idle periods during the flow lifetime",
    features: [
      "Active Mean",
      "Active Std",
      "Active Max",
      "Active Min",
      "Idle Mean",
      "Idle Std",
      "Idle Max",
      "Idle Min",
    ]
  }
]

interface FormData {
  [key: string]: string | number
}

export default function SinglePrediction() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>()
  const predictionApi = useApi<PredictionResponse>()
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(["basic"]))
  const [isVisible, setIsVisible] = useState(false)
  const [generateMalicious, setGenerateMalicious] = useState(false)

  const formValues = watch()

  // Calculate filled fields percentage for each group
  const groupProgress = useMemo(() => {
    const progress: Record<string, number> = {}
    FEATURE_GROUPS.forEach(group => {
      const filled = group.features.filter(f => formValues[f] && formValues[f] !== "").length
      progress[group.id] = (filled / group.features.length) * 100
    })
    return progress
  }, [formValues])

  // Calculate overall progress
  const overallProgress = useMemo(() => {
    const allFeatures = FEATURE_GROUPS.flatMap(g => g.features)
    const filled = allFeatures.filter(f => formValues[f] && formValues[f] !== "").length
    return (filled / allFeatures.length) * 100
  }, [formValues])

  useState(() => {
    setIsVisible(true)
  })

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev)
      if (newSet.has(groupId)) {
        newSet.delete(groupId)
      } else {
        newSet.add(groupId)
      }
      return newSet
    })
  }

  const expandAll = () => {
    setExpandedGroups(new Set(FEATURE_GROUPS.map(g => g.id)))
  }

  const collapseAll = () => {
    setExpandedGroups(new Set())
  }

  const onSubmit = async (data: FormData) => {
    const features: Record<string, number> = {}
    Object.entries(data).forEach(([key, value]) => {
      features[key] = value ? Number(value) : 0
    })

    try {
      await predictionApi.execute(() => apiService.predict(features))
    } catch (err) {
      console.error("Prediction failed:", err)
    }
  }

  const generateRandom = () => {
    const randomData = generateMalicious 
      ? generateMaliciousFeatures() 
      : generateRandomFeatures()
    Object.entries(randomData).forEach(([featureName, value]) => {
      setValue(featureName, String(value))
    })

    // Auto-submit if generating malicious data for immediate feedback
    if (generateMalicious) {
      setTimeout(() => {
        handleSubmit(onSubmit)()
      }, 100)
    }
  }

  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    indigo: "from-indigo-500 to-indigo-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
    pink: "from-pink-500 to-pink-600",
    cyan: "from-cyan-500 to-cyan-600",
    emerald: "from-emerald-500 to-emerald-600",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-800 rounded-2xl p-8 shadow-2xl">
            <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white">Single Flow Analysis</h1>
                  <p className="text-indigo-100 text-lg">Phân tích chi tiết một network flow để phát hiện tấn công</p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">Form Completion</span>
                  <span className="text-white text-sm font-bold">{overallProgress.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-white to-indigo-200 transition-all duration-500 rounded-full"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <Card className={`lg:col-span-2 transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="w-6 h-6 text-indigo-600" />
                    Network Flow Features
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Nhập các đặc trưng của network flow để phân tích. Bạn có thể nhập thủ công hoặc tạo dữ liệu ngẫu nhiên.
                  </CardDescription>
                </div>
              </div>
              
              {/* Quick Actions */}
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    type="button" 
                    variant={generateMalicious ? "default" : "outline"}
                    size="sm"
                    onClick={generateRandom} 
                    className={`gap-2 transition-all duration-300 ${
                      generateMalicious 
                        ? "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white border-0" 
                        : ""
                    }`}
                  >
                    {generateMalicious ? <AlertTriangle className="w-4 h-4" /> : <Wand2 className="w-4 h-4" />}
                    {generateMalicious ? "Generate Attack Data" : "Generate Random Data"}
                  </Button>
                  <div className="flex items-center gap-2 px-3 py-1.5 border rounded-md bg-muted/50">
                    <Label htmlFor="malicious-toggle" className="text-sm cursor-pointer">
                      Malicious Pattern
                    </Label>
                    <Switch
                      id="malicious-toggle"
                      checked={generateMalicious}
                      onCheckedChange={setGenerateMalicious}
                    />
                    <Badge variant={generateMalicious ? "destructive" : "default"} className="text-xs">
                      {generateMalicious ? "Attack" : "Benign"}
                    </Badge>
                  </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={expandAll}
                >
                  Expand All
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={collapseAll}
                >
                  Collapse All
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => reset()}
                >
                  Clear All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {FEATURE_GROUPS.map((group, idx) => {
                  const isExpanded = expandedGroups.has(group.id)
                  const Icon = group.icon
                  const progress = groupProgress[group.id] || 0
                  
                  return (
                    <div 
                      key={group.id}
                      className="border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      {/* Group Header */}
                      <button
                        type="button"
                        onClick={() => toggleGroup(group.id)}
                        className={`w-full p-4 bg-gradient-to-r ${colorClasses[group.color as keyof typeof colorClasses]} text-white hover:opacity-90 transition-all`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5" />
                            <div className="text-left">
                              <h3 className="font-semibold text-lg">{group.title}</h3>
                              <p className="text-xs text-white/80 mt-1">{group.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="text-xs opacity-90">{group.features.length} features</div>
                              <div className="text-xs font-bold">{progress.toFixed(0)}% filled</div>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </div>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="mt-3 w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full bg-white transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </button>

                      {/* Group Content */}
                      {isExpanded && (
                        <div className="p-4 bg-white dark:bg-slate-900">
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {group.features.map((feature) => {
                              const isFilled = formValues[feature] && formValues[feature] !== ""
                              return (
                                <div key={feature} className="space-y-1.5">
                                  <label className={`text-xs font-medium block transition-colors ${isFilled ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                                    {feature}
                                  </label>
                                  <Input
                                    type="number"
                                    placeholder="0"
                                    step="0.01"
                                    {...register(feature, {
                                      valueAsNumber: false,
                                    })}
                                    className={`w-full h-9 text-sm transition-all ${isFilled ? 'border-green-500 ring-1 ring-green-200 dark:ring-green-900' : ''}`}
                                  />
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}

                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit" 
                    disabled={predictionApi.loading} 
                    className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    size="lg"
                  >
                    {predictionApi.loading && <Spinner className="w-4 h-4" />}
                    <Shield className="w-4 h-4" />
                    Analyze Flow
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className={`space-y-6 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Main Result Card */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-600" />
                  Analysis Result
                </CardTitle>
              </CardHeader>
              <CardContent>
                {predictionApi.loading ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <div className="relative">
                      <Spinner className="w-12 h-12 text-indigo-600" />
                      <div className="absolute inset-0 w-12 h-12 border-4 border-indigo-200 rounded-full animate-ping"></div>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">Analyzing network flow...</p>
                    <p className="text-xs text-muted-foreground">Running GNN inference</p>
                  </div>
                ) : predictionApi.error ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{predictionApi.error}</AlertDescription>
                  </Alert>
                ) : predictionApi.data ? (
                  <div className="space-y-6">
                    {/* Main Prediction */}
                    <div
                      className={`p-6 rounded-xl border-2 transition-all duration-500 ${
                        predictionApi.data.is_attack 
                          ? 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border-red-500' 
                          : 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-500'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${predictionApi.data.is_attack ? 'bg-red-500' : 'bg-green-500'}`}>
                          {predictionApi.data.is_attack ? (
                            <AlertTriangle className="w-8 h-8 text-white" />
                          ) : (
                            <CheckCircle className="w-8 h-8 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold mb-2">{predictionApi.data.prediction}</h3>
                          <p className={`text-sm ${predictionApi.data.is_attack ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300'}`}>
                            {predictionApi.data.is_attack 
                              ? 'Malicious traffic pattern detected. This flow exhibits characteristics of an attack.'
                              : 'Normal traffic pattern. This flow appears to be benign with no suspicious activity.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-medium text-muted-foreground">Probability</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">
                          {(predictionApi.data.probability * 100).toFixed(2)}%
                        </p>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-4 h-4 text-purple-600" />
                          <span className="text-xs font-medium text-muted-foreground">Confidence</span>
                        </div>
                        <Badge
                          variant={
                            predictionApi.data.confidence === "Very High"
                              ? "default"
                              : predictionApi.data.confidence === "High"
                                ? "secondary"
                                : "outline"
                          }
                          className="text-sm"
                        >
                          {predictionApi.data.confidence}
                        </Badge>
                      </div>
                    </div>

                    {/* Confidence Visualization */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">Confidence Level</span>
                        <span className="text-xs font-mono text-muted-foreground">
                          {predictionApi.data.probability.toFixed(4)}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3 overflow-hidden shadow-inner">
                        <div
                          className={`h-full transition-all duration-1000 ${
                            predictionApi.data.is_attack 
                              ? 'bg-gradient-to-r from-red-500 to-orange-500' 
                              : 'bg-gradient-to-r from-green-500 to-emerald-500'
                          }`}
                          style={{ width: `${predictionApi.data.probability * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Info Box */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border-l-4 border-blue-500">
                      <div className="flex gap-2">
                        <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-muted-foreground">
                          <p className="font-semibold mb-1 text-blue-700 dark:text-blue-300">Model Information</p>
                          <p>This prediction was generated using a Graph Neural Network trained on the CICIDS 2018 dataset. The model analyzes {FEATURE_GROUPS.flatMap(g => g.features).length} features to identify attack patterns.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
                      <Target className="w-8 h-8 text-indigo-600" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 font-medium">Ready to Analyze</p>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                      Fill in the network flow features and click "Analyze Flow" to detect potential attacks.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Helper Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Quick Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2 text-muted-foreground">
                <p>• Click on feature groups to expand/collapse them</p>
                <p>• Use "Generate Random Data" to quickly test the system</p>
                <p>• Filled fields are highlighted in green</p>
                <p>• Progress bars show completion status for each group</p>
                <p>• All 77 features must be provided for accurate prediction</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
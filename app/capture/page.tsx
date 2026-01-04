"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { useApi } from "@/hooks/use-api"
import { apiService, type LiveCaptureResponse, type LiveCaptureRequest } from "@/lib/api-service"
import { 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Radio,
  Activity,
  Network,
  Shield,
  AlertTriangle,
  Clock,
  Filter,
  Wifi,
  Zap,
  Eye,
  BarChart3,
  Info,
  Play,
  Square
} from "lucide-react"

interface CaptureFormData {
  useDuration: boolean
  duration: number
  usePacketCount: boolean
  packetCount: number
  interface: string
  useFilter: boolean
  displayFilter: string
}

export default function LiveCapture() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CaptureFormData>({
    defaultValues: {
      useDuration: true,
      duration: 60,
      usePacketCount: false,
      packetCount: 100,
      interface: "",
      useFilter: false,
      displayFilter: "",
    },
  })

  const captureApi = useApi<LiveCaptureResponse>()
  const interfacesApi = useApi<{ interfaces: string[], auto_selected?: string }>()
  const [isCapturing, setIsCapturing] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const useDuration = watch("useDuration")
  const usePacketCount = watch("usePacketCount")
  const useFilter = watch("useFilter")

  useEffect(() => {
    setIsVisible(true)
    loadInterfaces()
  }, [])

  const loadInterfaces = async () => {
    try {
      await interfacesApi.execute(() => apiService.getInterfaces())
    } catch (err) {
      console.error("Failed to load interfaces:", err)
    }
  }

  const onSubmit = async (data: CaptureFormData) => {
    const request: LiveCaptureRequest = {}

    if (data.useDuration && data.duration > 0) {
      request.duration = data.duration
    }

    if (data.usePacketCount && data.packetCount > 0) {
      request.packet_count = data.packetCount
    }

    if (data.interface && data.interface.trim()) {
      request.interface = data.interface.trim()
    }

    if (data.useFilter && data.displayFilter.trim()) {
      request.display_filter = data.displayFilter.trim()
    }

    if (!request.duration && !request.packet_count) {
      return
    }

    setIsCapturing(true)
    try {
      await captureApi.execute(() => apiService.captureLive(request))
    } catch (err) {
      console.error("Capture failed:", err)
    } finally {
      setIsCapturing(false)
    }
  }

  const presetFilters = [
    { label: "HTTP/HTTPS", value: "tcp port 80 or tcp port 443" },
    { label: "DNS", value: "udp port 53" },
    { label: "SSH", value: "tcp port 22" },
    { label: "FTP", value: "tcp port 21" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-800 rounded-2xl p-8 shadow-2xl">
            <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Radio className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white">Live Traffic Capture</h1>
                  <p className="text-green-100 text-lg">Capture và phân tích network traffic trực tiếp từ interface</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <Card className={`lg:col-span-2 transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-6 h-6 text-green-600" />
                Capture Configuration
              </CardTitle>
              <CardDescription>
                Cấu hình các tham số để capture live traffic. Tất cả các trường đều tùy chọn và linh hoạt.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Duration Option */}
                <div className="space-y-3 p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <Label htmlFor="useDuration" className="text-base font-semibold cursor-pointer">
                        Capture theo thời gian (Duration)
                      </Label>
                    </div>
                    <Switch
                      id="useDuration"
                      checked={useDuration}
                      onCheckedChange={(checked) => setValue("useDuration", checked)}
                    />
                  </div>
                  {useDuration && (
                    <div className="ml-8">
                      <Label htmlFor="duration" className="text-sm text-muted-foreground">
                        Thời gian (giây)
                      </Label>
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        placeholder="60"
                        {...register("duration", {
                          valueAsNumber: true,
                          min: { value: 1, message: "Duration phải lớn hơn 0" },
                        })}
                        className="mt-1"
                      />
                      {errors.duration && (
                        <p className="text-xs text-red-500 mt-1">{errors.duration.message}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Packet Count Option */}
                <div className="space-y-3 p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Activity className="w-5 h-5 text-purple-600" />
                      <Label htmlFor="usePacketCount" className="text-base font-semibold cursor-pointer">
                        Capture theo số gói (Packet Count)
                      </Label>
                    </div>
                    <Switch
                      id="usePacketCount"
                      checked={usePacketCount}
                      onCheckedChange={(checked) => setValue("usePacketCount", checked)}
                    />
                  </div>
                  {usePacketCount && (
                    <div className="ml-8">
                      <Label htmlFor="packetCount" className="text-sm text-muted-foreground">
                        Số gói cần capture
                      </Label>
                      <Input
                        id="packetCount"
                        type="number"
                        min="1"
                        placeholder="100"
                        {...register("packetCount", {
                          valueAsNumber: true,
                          min: { value: 1, message: "Packet count phải lớn hơn 0" },
                        })}
                        className="mt-1"
                      />
                      {errors.packetCount && (
                        <p className="text-xs text-red-500 mt-1">{errors.packetCount.message}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Interface Selection */}
                <div className="space-y-3 p-4 border rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
                  <div className="flex items-center gap-3">
                    <Wifi className="w-5 h-5 text-emerald-600" />
                    <Label htmlFor="interface" className="text-base font-semibold">
                      Network Interface (Tùy chọn)
                    </Label>
                  </div>
                  <div className="ml-8">
                    <Label htmlFor="interface" className="text-sm text-muted-foreground">
                      Để trống để tự động chọn interface
                    </Label>
                    <Input
                      id="interface"
                      placeholder="wlp2s0, eth0, enp3s0..."
                      {...register("interface")}
                      className="mt-1"
                    />
                    {interfacesApi.data && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {interfacesApi.data.interfaces.map((iface) => (
                          <Badge
                            key={iface}
                            variant="outline"
                            className="cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900"
                            onClick={() => setValue("interface", iface)}
                          >
                            {iface}
                            {interfacesApi.data?.auto_selected === iface && (
                              <span className="ml-1 text-xs">(auto)</span>
                            )}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Display Filter */}
                <div className="space-y-3 p-4 border rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Filter className="w-5 h-5 text-orange-600" />
                      <Label htmlFor="useFilter" className="text-base font-semibold cursor-pointer">
                        BPF Filter (Tùy chọn)
                      </Label>
                    </div>
                    <Switch
                      id="useFilter"
                      checked={useFilter}
                      onCheckedChange={(checked) => setValue("useFilter", checked)}
                    />
                  </div>
                  {useFilter && (
                    <div className="ml-8 space-y-3">
                      <div>
                        <Label htmlFor="displayFilter" className="text-sm text-muted-foreground">
                          Filter expression (ví dụ: "tcp port 80")
                        </Label>
                        <Input
                          id="displayFilter"
                          placeholder='tcp port 80 or tcp port 443'
                          {...register("displayFilter")}
                          className="mt-1 font-mono text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-2 block">Preset Filters:</Label>
                        <div className="flex flex-wrap gap-2">
                          {presetFilters.map((preset) => (
                            <Badge
                              key={preset.label}
                              variant="outline"
                              className="cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900"
                              onClick={() => setValue("displayFilter", preset.value)}
                            >
                              {preset.label}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Validation Alert */}
                {!useDuration && !usePacketCount && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Bạn phải chọn ít nhất một trong hai: Duration hoặc Packet Count
                    </AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit" 
                    disabled={captureApi.loading || isCapturing || (!useDuration && !usePacketCount)}
                    className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 flex-1"
                    size="lg"
                  >
                    {captureApi.loading || isCapturing ? (
                      <>
                        <Spinner className="w-4 h-4" />
                        <span>Đang capture...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Bắt đầu Capture</span>
                      </>
                    )}
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
                  <Eye className="w-5 h-5 text-green-600" />
                  Capture Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {captureApi.loading || isCapturing ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <div className="relative">
                      <Spinner className="w-12 h-12 text-green-600" />
                      <div className="absolute inset-0 w-12 h-12 border-4 border-green-200 rounded-full animate-ping"></div>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">Đang capture traffic...</p>
                    <p className="text-xs text-muted-foreground">Vui lòng đợi trong giây lát</p>
                  </div>
                ) : captureApi.error ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{captureApi.error}</AlertDescription>
                  </Alert>
                ) : captureApi.data ? (
                  <div className="space-y-6">
                    {/* Capture Info */}
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2 mb-3">
                        <Network className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-sm">Capture Information</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Interface:</span>
                          <Badge variant="outline">{captureApi.data.interface}</Badge>
                        </div>
                        {captureApi.data.auto_selected && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Auto-selected:</span>
                            <Badge variant="secondary">Yes</Badge>
                          </div>
                        )}
                        {captureApi.data.duration && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Duration:</span>
                            <span className="font-mono">{captureApi.data.duration}s</span>
                          </div>
                        )}
                        {captureApi.data.packet_count && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Packets:</span>
                            <span className="font-mono">{captureApi.data.packet_count}</span>
                          </div>
                        )}
                        {captureApi.data.filter && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Filter:</span>
                            <code className="text-xs bg-muted px-1 rounded">{captureApi.data.filter}</code>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Summary */}
                    {captureApi.data.status === "success" && (
                      <>
                        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg border-2 border-green-500">
                          <div className="flex items-center gap-2 mb-3">
                            <BarChart3 className="w-5 h-5 text-green-600" />
                            <span className="font-semibold">Summary</span>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Total Flows</div>
                              <div className="text-2xl font-bold text-green-600">
                                {captureApi.data.summary.total}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Attack Rate</div>
                              <div className="text-2xl font-bold text-red-600">
                                {(captureApi.data.summary.attack_rate * 100).toFixed(1)}%
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Attacks</div>
                              <div className="text-lg font-semibold text-red-600">
                                {captureApi.data.summary.attacks}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Benign</div>
                              <div className="text-lg font-semibold text-green-600">
                                {captureApi.data.summary.benign}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Predictions List */}
                        {captureApi.data.predictions.length > 0 && (
                          <div className="space-y-2 max-h-96 overflow-y-auto">
                            <div className="flex items-center gap-2 mb-2">
                              <Shield className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm font-semibold">Flow Predictions</span>
                            </div>
                            {captureApi.data.predictions.slice(0, 20).map((pred, idx) => (
                              <div
                                key={idx}
                                className={`p-3 rounded-lg border text-xs ${
                                  pred.is_attack
                                    ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
                                    : "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2">
                                    {pred.is_attack ? (
                                      <AlertTriangle className="w-3 h-3 text-red-600" />
                                    ) : (
                                      <CheckCircle className="w-3 h-3 text-green-600" />
                                    )}
                                    <span className="font-semibold">Flow #{pred.flow_index + 1}</span>
                                  </div>
                                  <Badge
                                    variant={pred.is_attack ? "destructive" : "default"}
                                    className="text-xs"
                                  >
                                    {pred.prediction}
                                  </Badge>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                  <span>Confidence: {pred.confidence}</span>
                                  <span>{(pred.probability * 100).toFixed(1)}%</span>
                                </div>
                              </div>
                            ))}
                            {captureApi.data.predictions.length > 20 && (
                              <p className="text-xs text-muted-foreground text-center pt-2">
                                ... và {captureApi.data.predictions.length - 20} flows khác
                              </p>
                            )}
                          </div>
                        )}
                      </>
                    )}

                    {captureApi.data.status === "no_flows" && (
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          Không tìm thấy network flows trong quá trình capture. Thử tăng duration hoặc packet count.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center">
                      <Radio className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 font-medium">Sẵn sàng Capture</p>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                      Cấu hình các tham số và nhấn "Bắt đầu Capture" để bắt đầu phân tích live traffic.
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
                  Hướng dẫn
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2 text-muted-foreground">
                <p>• Chọn Duration hoặc Packet Count (hoặc cả hai)</p>
                <p>• Để trống Interface để tự động chọn</p>
                <p>• Sử dụng BPF filter để lọc traffic cụ thể</p>
                <p>• Cần quyền root để capture (chạy API với sudo)</p>
                <p>• Capture có thể mất vài giây tùy vào cấu hình</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}


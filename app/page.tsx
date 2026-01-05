"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { useApi } from "@/hooks/use-api"
import { apiService, type HealthResponse, type InfoResponse, type BatchPredictionResponse } from "@/lib/api-service"
import { 
  AlertCircle, 
  CheckCircle, 
  TrendingUp, 
  Shield, 
  Network, 
  Brain, 
  Target, 
  Activity,
  Lock,
  Cpu,
  GitBranch,
  Layers,
  Zap,
  Eye,
  BarChart3,
  Radio
} from "lucide-react"

interface DashboardState {
  health: HealthResponse | null
  info: InfoResponse | null
  recentPredictions: BatchPredictionResponse | null
}

export default function Dashboard() {
  const healthApi = useApi<HealthResponse>()
  const infoApi = useApi<InfoResponse>()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const loadData = async () => {
      try {
        await healthApi.execute(() => apiService.getHealth())
        await infoApi.execute(() => apiService.getInfo())
      } catch (err) {
        console.error("Failed to load dashboard data:", err)
      }
    }

    loadData()
    const interval = setInterval(loadData, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section with Animation */}
        <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-800 rounded-2xl p-8 shadow-2xl">
            <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-white">IoT Attack Detection System</h1>
              </div>
              <p className="text-blue-100 text-lg max-w-3xl">
                Hệ thống phát hiện tấn công IoT sử dụng Graph Neural Networks trên tập dữ liệu CICIDS 2018
              </p>
            </div>
          </div>
        </div>

        {/* Project Introduction with Enhanced Design */}
        <Card className={`mb-8 overflow-hidden transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"></div>
          <CardHeader className="relative">
            <CardTitle className="text-2xl flex items-center gap-3">
              <Network className="w-7 h-7 text-blue-600" />
              Đề tài 26: Phát hiện IoT Attack bằng Graph Neural Networks trên CICIDS 2018
            </CardTitle>
            <CardDescription className="text-base">
              Nghiên cứu ứng dụng Deep Learning và Graph-based Learning cho bài toán Intrusion Detection trong hệ thống IoT
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 relative">
            {/* Team Members with Animation */}
            <div className="group">
              <h3 className="font-semibold mb-4 text-lg flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                Thành viên nhóm nghiên cứu
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: "Nguyễn Minh Triết", id: "N22DCCN090", delay: "0ms" },
                  { name: "Nguyễn Thắng Lợi", id: "N22DCCN051", delay: "100ms" },
                  { name: "Đậu Văn Đăng Khoa", id: "N22DCCN040", delay: "200ms" }
                ].map((member, idx) => (
                  <div 
                    key={idx}
                    className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-xl border border-blue-200 dark:border-blue-800 hover:shadow-lg hover:scale-105 transition-all duration-300"
                    style={{ animationDelay: member.delay }}
                  >
                    <p className="font-semibold text-lg">{member.name}</p>
                    <p className="text-sm text-muted-foreground font-mono">{member.id}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Overview with Technical Depth */}
            <div>
              <h3 className="font-semibold mb-4 text-lg flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                Bối cảnh và động lực nghiên cứu
              </h3>
              <div className="prose prose-sm max-w-none dark:prose-invert space-y-4">
                <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl border-l-4 border-amber-500">
                  <p className="text-muted-foreground leading-relaxed">
                    Theo báo cáo của Gartner, số lượng thiết bị IoT toàn cầu đã vượt mốc <strong>25 tỷ thiết bị</strong> và 
                    dự kiến đạt <strong>75 tỷ thiết bị</strong> vào năm 2025. Sự phát triển bùng nổ này đi kèm với các thách thức 
                    nghiêm trọng về an ninh mạng: hơn <strong>60% thiết bị IoT</strong> có ít nhất một lỗ hổng bảo mật nghiêm trọng, 
                    và các cuộc tấn công DDoS từ botnet IoT như Mirai đã gây thiệt hại hàng tỷ đô la.
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Các phương pháp phát hiện xâm nhập truyền thống (IDS) dựa trên signature-based và anomaly-based detection 
                  gặp nhiều hạn chế khi áp dụng cho môi trường IoT: <strong>(1)</strong> Không thể phát hiện zero-day attacks, 
                  <strong>(2)</strong> Tỷ lệ false positive cao, <strong>(3)</strong> Không khai thác được mối quan hệ topology 
                  giữa các thiết bị trong mạng IoT.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>Graph Neural Networks (GNN)</strong> mang đến một paradigm hoàn toàn mới: thay vì xem các network flows 
                  như các mẫu độc lập, GNN biểu diễn toàn bộ network traffic dưới dạng đồ thị động (dynamic graph), trong đó 
                  nodes đại diện cho thiết bị/IP addresses và edges thể hiện communication patterns. Kiến trúc này cho phép 
                  mô hình học được cả <strong>local features</strong> (đặc trưng của từng flow) và <strong>global structural patterns</strong> 
                  (mô hình tấn công phân tán trên toàn mạng).
                </p>
              </div>
            </div>

            {/* Technical Architecture */}
            <div>
              <h3 className="font-semibold mb-4 text-lg flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                Kiến trúc kỹ thuật và phương pháp luận
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 border-2 border-blue-200 dark:border-blue-800 rounded-xl hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50 dark:from-slate-900 dark:to-blue-950">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Layers className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-lg">Graph Construction</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span><strong>Nodes:</strong> Representation của IP addresses (source/destination) với node features được trích xuất từ 80 đặc trưng của CICIDS 2018</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span><strong>Edges:</strong> Directed edges thể hiện network flows với edge weights là aggregated statistics (packet count, byte volume, duration)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span><strong>Temporal Windows:</strong> Sliding window approach để capture time-series behavior của attacks</span>
                    </li>
                  </ul>
                </div>

                <div className="p-5 border-2 border-indigo-200 dark:border-indigo-800 rounded-xl hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-indigo-50 dark:from-slate-900 dark:to-indigo-950">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-indigo-500 rounded-lg">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-lg">GNN Architecture</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500 font-bold">•</span>
                      <span><strong>Message Passing:</strong> Graph Convolutional Layers để aggregate thông tin từ neighboring nodes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500 font-bold">•</span>
                      <span><strong>Attention Mechanism:</strong> Graph Attention Networks (GAT) để học importance của từng neighbor</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500 font-bold">•</span>
                      <span><strong>Readout Function:</strong> Global pooling để tổng hợp graph-level representations cho classification</span>
                    </li>
                  </ul>
                </div>

                <div className="p-5 border-2 border-purple-200 dark:border-purple-800 rounded-xl hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-purple-50 dark:from-slate-900 dark:to-purple-950">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <Cpu className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-lg">Feature Engineering</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 font-bold">•</span>
                      <span><strong>Statistical Features:</strong> Mean, variance, min/max của packet sizes, inter-arrival times</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 font-bold">•</span>
                      <span><strong>Flow-based Features:</strong> Forward/backward packets ratio, flags distribution, protocol types</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 font-bold">•</span>
                      <span><strong>Normalization:</strong> StandardScaler và MinMaxScaler để đảm bảo numerical stability</span>
                    </li>
                  </ul>
                </div>

                <div className="p-5 border-2 border-green-200 dark:border-green-800 rounded-xl hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-green-50 dark:from-slate-900 dark:to-green-950">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-lg">Training Strategy</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">•</span>
                      <span><strong>Loss Function:</strong> Binary Cross-Entropy với class weights để handle imbalanced data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">•</span>
                      <span><strong>Optimization:</strong> Adam optimizer với learning rate scheduling và gradient clipping</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">•</span>
                      <span><strong>Regularization:</strong> Dropout, L2 regularization, và Early Stopping để prevent overfitting</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Research Objectives */}
            <div>
              <h3 className="font-semibold mb-4 text-lg flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                Mục tiêu nghiên cứu cụ thể
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  {
                    icon: GitBranch,
                    color: "blue",
                    title: "Thiết kế Graph Representation Learning",
                    desc: "Phát triển phương pháp biểu diễn network traffic dưới dạng attributed dynamic graphs, với node embeddings capture được temporal evolution của device behaviors và edge features reflect communication patterns giữa các thiết bị IoT"
                  },
                  {
                    icon: Brain,
                    color: "indigo",
                    title: "Xây dựng GNN-based IDS",
                    desc: "Thiết kế và implement kiến trúc GNN tối ưu cho binary classification (benign vs malicious), kết hợp Graph Convolutional Networks và Graph Attention mechanisms để học hierarchical representations từ graph structure"
                  },
                  {
                    icon: BarChart3,
                    color: "purple",
                    title: "Đánh giá hiệu năng toàn diện",
                    desc: "Thực hiện empirical evaluation với các metrics: Accuracy, Precision, Recall, F1-Score, AUC-ROC, và confusion matrix. So sánh performance với baseline methods (Random Forest, SVM, traditional DNN) để chứng minh ưu việt của GNN approach"
                  },
                  {
                    icon: Zap,
                    color: "green",
                    title: "Tối ưu hóa Real-time Detection",
                    desc: "Nghiên cứu techniques để reduce inference latency: model pruning, quantization, và efficient graph sampling strategies, nhằm đạt detection speed phù hợp với production deployment (< 100ms per prediction)"
                  }
                ].map((objective, idx) => (
                  <div 
                    key={idx}
                    className={`group p-4 border-l-4 border-${objective.color}-500 bg-gradient-to-r from-${objective.color}-50/50 to-transparent dark:from-${objective.color}-950/20 rounded-lg hover:shadow-lg transition-all duration-300`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 bg-${objective.color}-500 rounded-lg group-hover:scale-110 transition-transform`}>
                        <objective.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">{objective.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{objective.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact and Applications */}
            <div>
              <h3 className="font-semibold mb-4 text-lg flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                Tầm quan trọng khoa học và ứng dụng thực tiễn
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <Lock className="w-8 h-8" />
                    <h4 className="font-bold text-xl">Đóng góp khoa học</h4>
                  </div>
                  <ul className="space-y-3 text-blue-50">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-200 font-bold text-lg">→</span>
                      <span className="text-sm">Mở rộng ứng dụng của Graph Neural Networks vào lĩnh vực Network Security và Intrusion Detection Systems</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-200 font-bold text-lg">→</span>
                      <span className="text-sm">Chứng minh tính hiệu quả của graph-based learning trong việc capture structural attack patterns mà traditional methods bỏ lỡ</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-200 font-bold text-lg">→</span>
                      <span className="text-sm">Đóng góp dataset và benchmark results cho cộng đồng nghiên cứu về IoT Security</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-200 font-bold text-lg">→</span>
                      <span className="text-sm">Phát triển methodology có thể replicate và extend cho các attack categories khác (multi-class classification)</span>
                    </li>
                  </ul>
                </div>
                <div className="p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-xl text-white shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <Eye className="w-8 h-8" />
                    <h4 className="font-bold text-xl">Ứng dụng thực tiễn</h4>
                  </div>
                  <ul className="space-y-3 text-green-50">
                    <li className="flex items-start gap-2">
                      <span className="text-green-200 font-bold text-lg">→</span>
                      <span className="text-sm"><strong>Enterprise Networks:</strong> Triển khai Network Intrusion Detection Systems (NIDS) bảo vệ hạ tầng IoT trong doanh nghiệp</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-200 font-bold text-lg">→</span>
                      <span className="text-sm"><strong>Smart Cities:</strong> Monitoring và securing critical infrastructure như traffic systems, power grids, water management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-200 font-bold text-lg">→</span>
                      <span className="text-sm"><strong>Healthcare IoT:</strong> Bảo vệ medical devices và patient data khỏi ransomware và targeted attacks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-200 font-bold text-lg">→</span>
                      <span className="text-sm"><strong>Industrial IoT (IIoT):</strong> Security monitoring cho SCADA systems, manufacturing automation, supply chain IoT</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Cards with Animation */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Health Status Card */}
          <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-green-300 dark:hover:border-green-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {healthApi.data?.status === "healthy" ? (
                  <div className="relative">
                    <CheckCircle className="w-5 h-5 text-green-500 animate-pulse" />
                    <div className="absolute inset-0 w-5 h-5 bg-green-500 rounded-full animate-ping opacity-20"></div>
                  </div>
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500 animate-bounce" />
                )}
                API Health Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {healthApi.loading ? (
                <div className="flex items-center gap-2">
                  <Spinner className="w-4 h-4" />
                  <span>Đang kiểm tra trạng thái hệ thống...</span>
                </div>
              ) : healthApi.error ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{healthApi.error}</AlertDescription>
                </Alert>
              ) : healthApi.data ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg">
                    <span className="font-semibold flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      System Status
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${healthApi.data.status === "healthy" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                      {healthApi.data.status === "healthy" ? "✓ Operational" : "✗ Down"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg">
                    <span className="font-semibold flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      Model Status
                    </span>
                    {healthApi.data.model_loaded ? (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500 text-white">✓ Loaded</span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-500 text-white">✗ Not Loaded</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg">
                    <span className="font-semibold flex items-center gap-2">
                      <Cpu className="w-4 h-4" />
                      Computing Device
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-500 text-white">{healthApi.data.device}</span>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Model Info Card */}
          <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300 dark:hover:border-blue-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Model Specifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {infoApi.loading ? (
                <div className="flex items-center gap-2">
                  <Spinner className="w-4 h-4" />
                  <span>Đang tải thông tin mô hình...</span>
                </div>
              ) : infoApi.error ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{infoApi.error}</AlertDescription>
                </Alert>
              ) : infoApi.data ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-lg">
                    <span className="font-semibold flex items-center gap-2">
                      <Network className="w-4 h-4" />
                      Architecture
                    </span>
                    <span className="text-sm font-mono bg-blue-500 text-white px-3 py-1 rounded-full">{infoApi.data.model_type}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-lg">
                    <span className="font-semibold flex items-center gap-2">
                      <GitBranch className="w-4 h-4" />
                      Input Features
                    </span>
                    <span className="text-sm font-mono bg-indigo-500 text-white px-3 py-1 rounded-full">{infoApi.data.num_features} dims</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg">
                    <span className="font-semibold flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      Parameters
                    </span>
                    <span className="text-sm font-mono bg-purple-500 text-white px-3 py-1 rounded-full">
                      {infoApi.data.num_parameters !== undefined ? infoApi.data.num_parameters.toLocaleString() : 'N/A'}
                    </span>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        {/* Quick Start Guide with Enhanced Design */}
        <Card className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-500" />
              Quick Start Guide
            </CardTitle>
            <CardDescription>Bắt đầu phát hiện tấn công IoT với hệ thống của chúng tôi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  step: "1",
                  icon: Target,
                  title: "Single Flow Analysis",
                  desc: "Phân tích chi tiết một network flow bằng cách nhập các đặc trưng thống kê của flow đó",
                  color: "blue",
                  href: "/predict"
                },
                // {
                //   step: "2",
                //   icon: Activity,
                //   title: "Batch Processing",
                //   desc: "Xử lý hàng loạt nhiều flows đồng thời để tăng throughput và hiệu suất phát hiện",
                //   color: "indigo",
                //   href: "/batch"
                // },
                {
                  step: "3",
                  icon: Radio,
                  title: "Live Capture",
                  desc: "Capture và phân tích network traffic trực tiếp từ interface với các tham số linh hoạt",
                  color: "green",
                  href: "/capture"
                },
                {
                  step: "4",
                  icon: Eye,
                  title: "Model Analytics",
                  desc: "Xem chi tiết kiến trúc mô hình, hyperparameters, và performance metrics",
                  color: "purple",
                  href: "/model-info"
                }
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  className={`group p-5 border-2 border-${item.color}-200 dark:border-${item.color}-800 rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-gradient-to-br from-white to-${item.color}-50 dark:from-slate-900 dark:to-${item.color}-950 cursor-pointer block`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-full bg-${item.color}-500 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform`}>
                      {item.step}
                    </div>
                    <item.icon className={`w-6 h-6 text-${item.color}-600 dark:text-${item.color}-400 group-hover:animate-pulse`} />
                  </div>
                  <h3 className="font-semibold mb-2 text-lg">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
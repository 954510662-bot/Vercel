import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Download, 
  Monitor, 
  Apple, 
  CheckCircle,
  ChevronDown,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react'

const platforms = [
  {
    id: 'windows',
    name: 'Windows',
    icon: Monitor,
    versions: ['Windows 10', 'Windows 11'],
    format: '.exe',
    size: '156 MB',
    requirements: '64位系统，4GB内存',
  },
  {
    id: 'macos',
    name: 'macOS',
    icon: Apple,
    versions: ['macOS 11+', 'macOS 12+', 'macOS 13+'],
    format: '.dmg',
    size: '142 MB',
    requirements: 'Apple Silicon 或 Intel',
  },
  {
    id: 'linux',
    name: 'Linux',
    icon: Monitor,
    versions: ['Ubuntu 20.04+', 'Debian 11+', 'Fedora 36+'],
    format: '.AppImage',
    size: '128 MB',
    requirements: '64位系统，GLIBC 2.31+',
  },
]

const versions = [
  {
    version: 'v2.0.0',
    date: '2024-01-15',
    type: 'stable',
    highlight: true,
    features: [
      '全新UI设计系统',
      '实时协作性能提升200%',
      '插件API v2发布',
      '支持深色模式',
      '新增20+官方插件',
    ],
    fixes: [
      '修复了大型项目卡顿问题',
      '解决了协作同步延迟',
      '优化了内存占用',
    ],
  },
  {
    version: 'v1.9.2',
    date: '2023-12-20',
    type: 'patch',
    features: [
      '性能优化',
      '稳定性提升',
    ],
    fixes: [
      '修复了导出SVG格式错误',
      '修复了快捷键冲突',
    ],
  },
  {
    version: 'v1.9.1',
    date: '2023-12-05',
    type: 'patch',
    features: [],
    fixes: [
      '修复了登录闪退问题',
      '修复了文件保存丢失',
    ],
  },
  {
    version: 'v1.9.0',
    date: '2023-11-28',
    type: 'minor',
    features: [
      '新增云端版本历史',
      '新增团队空间功能',
      '支持自定义快捷键',
    ],
    fixes: [
      '修复了多个已知问题',
    ],
  },
]

const stats = [
  { label: '总下载量', value: '2.5M+', icon: Download, change: '+12%' },
  { label: 'Windows', value: '45%', icon: Monitor, change: '+8%' },
  { label: 'macOS', value: '35%', icon: Apple, change: '+15%' },
  { label: 'Linux', value: '20%', icon: Monitor, change: '+5%' },
]

export default function DownloadPage() {
  const [selectedPlatform, setSelectedPlatform] = useState('windows')
  const [expandedVersion, setExpandedVersion] = useState('v2.0.0')

  const currentPlatform = platforms.find(p => p.id === selectedPlatform) || platforms[0]

  return (
    <div className="overflow-hidden">
      <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-purple-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="heading-1 mb-6">
            下载 CodeBrush
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            为您的平台选择合适的版本，开始高效设计之旅
          </p>

          <div className="flex justify-center gap-4 mb-8">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id)}
                className={`px-6 py-4 rounded-xl font-medium transition-all ${
                  selectedPlatform === platform.id
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <platform.icon className="w-8 h-8 mx-auto mb-2" />
                {platform.name}
              </button>
            ))}
          </div>

          <motion.div
            key={selectedPlatform}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-purple-600 rounded-2xl flex items-center justify-center">
                  <currentPlatform.icon className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">CodeBrush {versions[0].version}</h3>
                  <p className="text-gray-600">最新稳定版</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{currentPlatform.size}</div>
                <div className="text-sm text-gray-600">{currentPlatform.format}</div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">支持系统</h4>
              <div className="flex flex-wrap gap-2">
                {currentPlatform.versions.map((version) => (
                  <span key={version} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                    {version}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6 text-sm text-gray-600">
              <Shield className="w-4 h-4 inline mr-1" />
              {currentPlatform.requirements}
            </div>

            <button className="w-full btn-primary text-lg py-4 flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              下载 for {currentPlatform.name}
            </button>

            <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-yellow-500" />
                快速安装
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-green-500" />
                安全可靠
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl border border-gray-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-6 h-6 text-gray-400" />
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="changelog" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-2 mb-12 text-center">更新日志</h2>

            <div className="space-y-6">
              {versions.map((version, index) => (
                <motion.div
                  key={version.version}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`rounded-2xl border ${
                    version.highlight
                      ? 'border-primary-300 bg-primary-50/50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <button
                    onClick={() => setExpandedVersion(
                      expandedVersion === version.version ? '' : version.version
                    )}
                    className="w-full p-6 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold">{version.version}</h3>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            version.type === 'stable' ? 'bg-green-100 text-green-700' :
                            version.type === 'minor' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {version.type === 'stable' ? '稳定版' :
                             version.type === 'minor' ? '功能更新' : '补丁'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{version.date}</p>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedVersion === version.version ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {expandedVersion === version.version && (
                    <div className="px-6 pb-6 border-t border-gray-200 pt-4">
                      {version.features.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-primary-600" />
                            新增功能
                          </h4>
                          <ul className="space-y-1">
                            {version.features.map((feature, i) => (
                              <li key={i} className="flex items-start gap-2 text-gray-700">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {version.fixes.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">问题修复</h4>
                          <ul className="space-y-1">
                            {version.fixes.map((fix, i) => (
                              <li key={i} className="flex items-start gap-2 text-gray-700">
                                <CheckCircle className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                                {fix}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

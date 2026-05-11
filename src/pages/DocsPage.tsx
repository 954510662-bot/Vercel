import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Book, 
  Code, 
  Puzzle, 
  Search,
  ChevronRight,
  Copy,
  Check,
  Layers,
  Keyboard,
  Zap
} from 'lucide-react'

const docs = [
  {
    category: '快速入门',
    icon: Zap,
    items: [
      { title: '安装指南', href: '#install' },
      { title: '创建第一个项目', href: '#first-project' },
      { title: '基础操作', href: '#basic' },
      { title: '快捷键入门', href: '#shortcuts' },
    ],
  },
  {
    category: '用户指南',
    icon: Book,
    items: [
      { title: '图层管理', href: '#layers' },
      { title: '组件系统', href: '#components' },
      { title: '样式与设计', href: '#styles' },
      { title: '导出设置', href: '#export' },
    ],
  },
  {
    category: '开发者文档',
    icon: Code,
    items: [
      { title: 'API概述', href: '#api' },
      { title: '认证方式', href: '#auth' },
      { title: '接口列表', href: '#endpoints' },
      { title: '错误码说明', href: '#errors' },
    ],
  },
  {
    category: '插件开发',
    icon: Puzzle,
    items: [
      { title: '插件架构', href: '#architecture' },
      { title: '创建插件', href: '#create-plugin' },
      { title: 'API参考', href: '#plugin-api' },
      { title: '示例代码', href: '#examples' },
    ],
  },
]

const apiEndpoints = [
  {
    method: 'GET',
    path: '/api/v1/projects',
    description: '获取项目列表',
    parameters: ['page', 'limit', 'sort'],
  },
  {
    method: 'POST',
    path: '/api/v1/projects',
    description: '创建新项目',
    parameters: ['name', 'template'],
  },
  {
    method: 'GET',
    path: '/api/v1/projects/:id',
    description: '获取项目详情',
    parameters: ['id'],
  },
  {
    method: 'PUT',
    path: '/api/v1/projects/:id',
    description: '更新项目',
    parameters: ['id', 'data'],
  },
  {
    method: 'DELETE',
    path: '/api/v1/projects/:id',
    description: '删除项目',
    parameters: ['id'],
  },
]

const shortcuts = [
  { keys: ['Ctrl', 'Z'], action: '撤销' },
  { keys: ['Ctrl', 'Shift', 'Z'], action: '重做' },
  { keys: ['Ctrl', 'C'], action: '复制' },
  { keys: ['Ctrl', 'V'], action: '粘贴' },
  { keys: ['Ctrl', 'G'], action: '组合图层' },
  { keys: ['Ctrl', 'Shift', 'G'], action: '取消组合' },
  { keys: ['Ctrl', 'D'], action: '复制图层' },
  { keys: ['Delete'], action: '删除选中' },
  { keys: ['V'], action: '选择工具' },
  { keys: ['R'], action: '矩形工具' },
  { keys: ['T'], action: '文本工具' },
  { keys: ['Space'], action: '临时手型工具' },
]

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedCode, setCopiedCode] = useState('')

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(''), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex-1 max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索文档..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-2 bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/contact" className="text-sm text-gray-600 hover:text-gray-900">
                需要帮助？
              </Link>
              <Link to="/download" className="btn-primary text-sm py-2">
                下载App
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <aside className="w-64 flex-shrink-0">
            <nav className="sticky top-24 space-y-6">
              {docs.map((section) => (
                <div key={section.category}>
                  <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-3">
                    <section.icon className="w-5 h-5 text-primary-600" />
                    {section.category}
                  </h3>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item.title}>
                        <a
                          href={item.href}
                          className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          <main className="flex-1 max-w-4xl">
            <section id="quickstart" className="mb-12">
              <h1 className="text-4xl font-bold mb-6">快速入门</h1>
              <p className="text-lg text-gray-600 mb-8">
                欢迎使用 CodeBrush！本指南将帮助您快速上手，开始高效设计工作。
              </p>

              <div className="bg-white rounded-2xl border p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Layers className="w-6 h-6 text-primary-600" />
                  创建第一个项目
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>1. 打开 CodeBrush 应用</p>
                  <p>2. 点击左上角的「新建项目」按钮</p>
                  <p>3. 选择空白画布或使用模板</p>
                  <p>4. 开始添加图层和设计元素</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Keyboard className="w-6 h-6 text-primary-600" />
                  常用快捷键
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {shortcuts.slice(0, 8).map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">{shortcut.action}</span>
                      <div className="flex gap-1">
                        {shortcut.keys.map((key) => (
                          <kbd key={key} className="px-2 py-1 bg-white border rounded text-sm font-mono">
                            {key}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="api" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">API 文档</h2>
              <p className="text-lg text-gray-600 mb-8">
                CodeBrush 提供完整的 RESTful API，支持项目管理、文件操作、用户认证等功能。
              </p>

              <div className="space-y-4">
                {apiEndpoints.map((endpoint, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl border p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        endpoint.method === 'GET' ? 'bg-green-100 text-green-700' :
                        endpoint.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                        endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="font-mono text-sm">{endpoint.path}</code>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{endpoint.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {endpoint.parameters.map((param) => (
                        <span key={param} className="px-2 py-1 bg-gray-100 rounded text-xs">
                          {param}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 bg-gray-900 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium">请求示例</span>
                  <button
                    onClick={() => copyCode('curl -X GET "https://api.codebrush.com/v1/projects"', 'curl')}
                    className="flex items-center gap-1 text-sm text-gray-400 hover:text-white"
                  >
                    {copiedCode === 'curl' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedCode === 'curl' ? '已复制' : '复制'}
                  </button>
                </div>
                <pre className="font-mono text-sm overflow-x-auto">
                  <code>{`curl -X GET "https://api.codebrush.com/v1/projects" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}</code>
                </pre>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}

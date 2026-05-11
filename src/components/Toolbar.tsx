import { useStore } from '../store'
import { exportProject } from '../store'
import { 
  MousePointer2, 
  Square, 
  Circle, 
  Triangle, 
  Minus, 
  PenTool, 
  Type,
  Hand,
  ZoomIn,
  Undo2,
  Redo2,
  Plus,
  LayoutGrid,
  Download
} from 'lucide-react'
import { ToolType } from '../types'

const tools: { type: ToolType; icon: typeof MousePointer2; label: string }[] = [
  { type: 'select', icon: MousePointer2, label: '选择工具' },
  { type: 'rectangle', icon: Square, label: '矩形工具' },
  { type: 'ellipse', icon: Circle, label: '椭圆工具' },
  { type: 'polygon', icon: Triangle, label: '多边形工具' },
  { type: 'line', icon: Minus, label: '线条工具' },
  { type: 'pen', icon: PenTool, label: '钢笔工具' },
  { type: 'text', icon: Type, label: '文本工具' },
  { type: 'frame', icon: LayoutGrid, label: '画板工具' },
  { type: 'hand', icon: Hand, label: '手型工具' },
  { type: 'zoom', icon: ZoomIn, label: '缩放工具' },
]

function Toolbar() {
  const { currentTool, selectTool, undo, redo, createProject, projects, currentProjectId } = useStore()

  const handleToolClick = (tool: ToolType) => {
    selectTool(tool)
  }

  const handleExport = () => {
    if (!currentProjectId) return
    
    const svgContent = exportProject(projects, currentProjectId, 'svg')
    if (svgContent) {
      const blob = new Blob([svgContent], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'export.svg'
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="w-16 bg-gray-900 flex flex-col items-center py-4 gap-2">
      <button
        onClick={() => createProject('未命名项目')}
        className="w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white mb-4"
        title="新建项目"
      >
        <Plus size={20} />
      </button>

      <div className="border-t border-gray-700 w-full px-2 py-2">
        {tools.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => handleToolClick(type)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center mb-1 transition-colors ${
              currentTool === type
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
            title={label}
          >
            <Icon size={20} />
          </button>
        ))}
      </div>

      <div className="border-t border-gray-700 w-full px-2 py-2 mt-auto">
        <button
          onClick={undo}
          className="w-10 h-10 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 flex items-center justify-center mb-1"
          title="撤销"
        >
          <Undo2 size={20} />
        </button>
        <button
          onClick={redo}
          className="w-10 h-10 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 flex items-center justify-center mb-1"
          title="重做"
        >
          <Redo2 size={20} />
        </button>
        <button
          onClick={handleExport}
          className="w-10 h-10 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 flex items-center justify-center"
          title="导出SVG"
        >
          <Download size={20} />
        </button>
      </div>
    </div>
  )
}

export default Toolbar

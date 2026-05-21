import { useState } from 'react'
import { useStore } from '../store'
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
import ImageUploader from './ImageUploader'
import { downloadAsPNG, downloadAsSVG, downloadAsJSON } from '../utils/export'
import { useI18n } from '../i18n'
import LanguageSwitcher from './LanguageSwitcher'

interface ToolConfig {
  type: ToolType
  icon: typeof MousePointer2
  labelKey: string
}

const tools: ToolConfig[] = [
  { type: 'select', icon: MousePointer2, labelKey: 'toolbar.selectTool' },
  { type: 'rectangle', icon: Square, labelKey: 'toolbar.rectangleTool' },
  { type: 'ellipse', icon: Circle, labelKey: 'toolbar.ellipseTool' },
  { type: 'polygon', icon: Triangle, labelKey: 'toolbar.polygonTool' },
  { type: 'line', icon: Minus, labelKey: 'toolbar.lineTool' },
  { type: 'pen', icon: PenTool, labelKey: 'toolbar.penTool' },
  { type: 'text', icon: Type, labelKey: 'toolbar.textTool' },
  { type: 'frame', icon: LayoutGrid, labelKey: 'toolbar.frameTool' },
  { type: 'hand', icon: Hand, labelKey: 'toolbar.handTool' },
  { type: 'zoom', icon: ZoomIn, labelKey: 'toolbar.zoomTool' },
]

function Toolbar() {
  const { currentTool, selectTool, undo, redo, createProject, projects, currentProjectId } = useStore()
  const { t } = useI18n()
  const [showExportMenu, setShowExportMenu] = useState(false)

  const handleToolClick = (tool: ToolType) => {
    selectTool(tool)
  }

  const getCurrentProject = () => {
    if (!currentProjectId) return null
    return projects.find(p => p.id === currentProjectId)
  }

  const handleExportPNG = async () => {
    const project = getCurrentProject()
    if (project) {
      await downloadAsPNG(project)
    }
    setShowExportMenu(false)
  }

  const handleExportSVG = () => {
    const project = getCurrentProject()
    if (project) {
      downloadAsSVG(project)
    }
    setShowExportMenu(false)
  }

  const handleExportJSON = () => {
    const project = getCurrentProject()
    if (project) {
      downloadAsJSON(project)
    }
    setShowExportMenu(false)
  }

  return (
    <div className="w-16 bg-gray-900 flex flex-col items-center py-4 gap-2">
      <button
        onClick={() => createProject('Untitled Project')}
        className="w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white mb-4 transition-colors"
        title={t('toolbar.newProject')}
      >
        <Plus size={20} />
      </button>

      <div className="border-t border-gray-700 w-full px-2 py-2">
        {tools.map(({ type, icon: Icon, labelKey }) => (
          <button
            key={type}
            onClick={() => handleToolClick(type)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center mb-1 transition-colors ${
              currentTool === type
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
            title={t(labelKey)}
          >
            <Icon size={20} />
          </button>
        ))}
        <ImageUploader />
      </div>

      <div className="border-t border-gray-700 w-full px-2 py-2 mt-auto">
        <button
          onClick={undo}
          className="w-10 h-10 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 flex items-center justify-center mb-1 transition-colors"
          title={t('toolbar.undo')}
        >
          <Undo2 size={20} />
        </button>
        <button
          onClick={redo}
          className="w-10 h-10 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 flex items-center justify-center mb-1 transition-colors"
          title={t('toolbar.redo')}
        >
          <Redo2 size={20} />
        </button>
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="w-10 h-10 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 flex items-center justify-center transition-colors"
            title={t('toolbar.export')}
          >
            <Download size={20} />
          </button>
          {showExportMenu && (
            <div className="absolute right-0 top-full mt-1 bg-gray-800 rounded-lg shadow-lg py-1 min-w-[140px] z-50 border border-gray-700">
              <button
                onClick={handleExportPNG}
                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                {t('toolbar.exportPNG')}
              </button>
              <button
                onClick={handleExportSVG}
                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                {t('toolbar.exportSVG')}
              </button>
              <button
                onClick={handleExportJSON}
                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                {t('toolbar.exportJSON')}
              </button>
            </div>
          )}
        </div>
        <div className="mt-2 pt-2 border-t border-gray-700">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  )
}

export default Toolbar

import { useState, useCallback } from 'react'
import { useStore } from '../store'
import { Eye, EyeOff, Lock, Unlock, ChevronRight, ChevronDown, Folder, Type, Copy, Trash2, Group } from 'lucide-react'
import { Layer } from '../types'

const layerIcons: Record<string, typeof Type> = {
  frame: Folder,
  group: Folder,
  rectangle: Type,
  ellipse: Type,
  polygon: Type,
  line: Type,
  path: Type,
  text: Type,
  image: Type,
  component: Folder,
  boolean: Type,
}

function LayerItem({ 
  layer, 
  depth = 0, 
  onDrop,
  projects,
  currentProjectId
}: { 
  layer: Layer; 
  depth: number;
  onDrop?: (layerId: string, targetId: string) => void;
  projects: { id: string; layers: Layer[]; selectedLayerIds: string[] }[];
  currentProjectId: string | null;
}) {
  const { selectLayers, updateLayer, deleteLayer, duplicateLayer } = useStore()
  const [expanded, setExpanded] = useState(true)
  const currentProject = projects.find(p => p.id === currentProjectId)
  const isSelected = currentProject?.selectedLayerIds.includes(layer.id)
  const hasChildren = layer.children.length > 0

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    selectLayers(currentProject!.id, [layer.id])
  }

  const toggleVisibility = (e: React.MouseEvent) => {
    e.stopPropagation()
    updateLayer(currentProject!.id, layer.id, { visible: !layer.visible })
  }

  const toggleLock = (e: React.MouseEvent) => {
    e.stopPropagation()
    updateLayer(currentProject!.id, layer.id, { locked: !layer.locked })
  }

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation()
    duplicateLayer(currentProject!.id, layer.id)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('确定要删除这个图层吗？')) {
      deleteLayer(currentProject!.id, layer.id)
    }
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('layerId', layer.id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const draggedLayerId = e.dataTransfer.getData('layerId')
    if (draggedLayerId && draggedLayerId !== layer.id && onDrop) {
      onDrop(draggedLayerId, layer.id)
    }
  }

  const Icon = layerIcons[layer.type] || Type

  const childLayers = currentProject?.layers.filter(l => layer.children.includes(l.id)) || []

  return (
    <div className="select-none">
      <div
        onClick={handleClick}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        draggable
        className={`flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-gray-50 ${
          isSelected ? 'bg-blue-50' : ''
        } ${layer.type === 'group' ? 'group/container' : ''}`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {hasChildren && (
          <button 
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded) }}
            className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-transform"
          >
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        )}
        {!hasChildren && <div className="w-4" />}
        
        <button
          onClick={toggleVisibility}
          className={`w-4 h-4 flex items-center justify-center ${
            layer.visible ? 'text-gray-400 hover:text-gray-600' : 'text-gray-200'
          }`}
        >
          {layer.visible ? <Eye size={12} /> : <EyeOff size={12} />}
        </button>
        
        <button
          onClick={toggleLock}
          className={`w-4 h-4 flex items-center justify-center ${
            layer.locked ? 'text-gray-400' : 'text-gray-200'
          }`}
        >
          {layer.locked ? <Lock size={12} /> : <Unlock size={12} />}
        </button>
        
        <Icon size={14} className="text-gray-400" />
        
        <span className={`text-sm flex-1 truncate ${
          !layer.visible ? 'text-gray-300 italic' : 'text-gray-700'
        }`}>
          {layer.name}
        </span>
        
        <div className="flex items-center gap-1 opacity-0 group-hover/container:opacity-100 transition-opacity">
          <button
            onClick={handleDuplicate}
            className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600"
            title="复制"
          >
            <Copy size={12} />
          </button>
          <button
            onClick={handleDelete}
            className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-red-500"
            title="删除"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
      
      {hasChildren && expanded && childLayers.map((child) => (
        <LayerItem 
          key={child.id} 
          layer={child} 
          depth={depth + 1}
          onDrop={onDrop}
          projects={projects}
          currentProjectId={currentProjectId}
        />
      ))}
    </div>
  )
}

function LayersPanel() {
  const { projects, currentProjectId, groupLayers, deleteLayer } = useStore()
  const currentProject = projects.find(p => p.id === currentProjectId)

  const handleDrop = useCallback((draggedLayerId: string, targetLayerId: string) => {
    if (!currentProject) return
    const draggedLayer = currentProject.layers.find((l: Layer) => l.id === draggedLayerId)
    const targetLayer = currentProject.layers.find((l: Layer) => l.id === targetLayerId)
    
    if (draggedLayer && targetLayer && targetLayer.type === 'group') {
      const newChildren = [...targetLayer.children, draggedLayerId]
      groupLayers(currentProject.id, newChildren)
    }
  }, [currentProject, groupLayers])

  const handleDeleteSelected = () => {
    if (!currentProject || currentProject.selectedLayerIds.length === 0) return
    if (confirm(`确定要删除选中的 ${currentProject.selectedLayerIds.length} 个图层吗？`)) {
      currentProject.selectedLayerIds.forEach((id: string) => {
        deleteLayer(currentProject!.id, id)
      })
    }
  }

  const handleGroupSelected = () => {
    if (!currentProject || currentProject.selectedLayerIds.length < 2) return
    groupLayers(currentProject.id, currentProject.selectedLayerIds)
  }

  const rootLayers = currentProject?.layers.filter((l: Layer) => l.parentId === null) || []

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-800">图层</h2>
          <p className="text-xs text-gray-500">
            {currentProject?.layers.length || 0} 个图层
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleGroupSelected}
            disabled={!currentProject || currentProject.selectedLayerIds.length < 2}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded flex items-center gap-1"
            title="分组"
          >
            <Group size={12} />
            分组
          </button>
          <button
            onClick={handleDeleteSelected}
            disabled={!currentProject || currentProject.selectedLayerIds.length === 0}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-red-100 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed rounded"
            title="删除选中"
          >
            删除
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {rootLayers.map((layer: Layer) => (
          <LayerItem 
            key={layer.id} 
            layer={layer} 
            depth={0} 
            onDrop={handleDrop}
            projects={projects}
            currentProjectId={currentProjectId}
          />
        ))}
        
        {(!currentProject || currentProject.layers.length === 0) && (
          <div className="px-4 py-8 text-center text-gray-400 text-sm">
            暂无图层
          </div>
        )}
      </div>
    </div>
  )
}

export default LayersPanel

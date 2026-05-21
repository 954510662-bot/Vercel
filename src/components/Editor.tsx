import { useEffect, useRef, useState, useCallback, memo } from 'react'
import { useStore } from '../store'
import { useI18n } from '../i18n'
import { Layer, LayerType, Transform, LayerStyle, Effect, ShadowParams, BlurParams, ToolType, RGBA } from '../types'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

interface LayerBounds {
  left: number
  top: number
  right: number
  bottom: number
  width: number
  height: number
}

function getLayerBounds(layer: Layer): LayerBounds {
  let width = 0
  let height = 0
  
  switch (layer.type) {
    case 'rectangle':
    case 'ellipse':
    case 'image':
      width = (layer.metadata.width as number) || 200
      height = (layer.metadata.height as number) || 100
      break
    case 'polygon':
      width = ((layer.metadata.radius as number) || 50) * 2
      height = ((layer.metadata.radius as number) || 50) * 2
      break
    case 'line':
      width = Math.abs((layer.metadata.endX as number) || 100)
      height = Math.abs((layer.metadata.endY as number) || 100)
      break
    case 'frame':
      width = (layer.metadata.width as number) || 800
      height = (layer.metadata.height as number) || 600
      break
    case 'text':
      width = 200
      height = (layer.metadata.fontSize as number) || 16
      break
    default:
      width = 100
      height = 100
  }
  
  return {
    left: layer.transform.x,
    top: layer.transform.y,
    right: layer.transform.x + width,
    bottom: layer.transform.y + height,
    width,
    height
  }
}

function checkCollision(bounds1: LayerBounds, bounds2: LayerBounds): boolean {
  return !(
    bounds1.right <= bounds2.left ||
    bounds1.left >= bounds2.right ||
    bounds1.bottom <= bounds2.top ||
    bounds1.top >= bounds2.bottom
  )
}

function createDefaultLayer(type: LayerType, x: number, y: number): Layer {
  const defaultTransform: Transform = {
    x,
    y,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    skewX: 0,
    skewY: 0
  }
  
  const defaultFillColor: RGBA = { r: 255, g: 255, b: 255, a: 1 }
  
  const defaultStyle: LayerStyle = {
    fills: [{ type: 'solid', color: defaultFillColor, visible: true }],
    strokes: [{
      color: { r: 0, g: 0, b: 0, a: 0.5 },
      width: 1,
      style: 'solid',
      cap: 'butt',
      join: 'miter',
      position: 'center'
    }],
    effects: []
  }

  const names: Record<LayerType, string> = {
    frame: 'Frame',
    group: 'Group',
    rectangle: 'Rectangle',
    ellipse: 'Ellipse',
    polygon: 'Polygon',
    line: 'Line',
    path: 'Path',
    text: 'Text',
    image: 'Image',
    component: 'Component',
    boolean: 'Boolean Group'
  }

  return {
    id: generateId(),
    type,
    name: names[type],
    parentId: null,
    children: [],
    transform: defaultTransform,
    style: defaultStyle,
    locked: false,
    visible: true,
    opacity: 1,
    blendMode: 'normal',
    metadata: {}
  }
}

const applyEffects = (ctx: CanvasRenderingContext2D, effects: Effect[]) => {
  const shadowEffect = effects.find(e => e.type === 'shadow' && e.visible)
  const blurEffect = effects.find(e => e.type === 'blur' && e.visible)
  
  if (shadowEffect) {
    const params = shadowEffect.params as ShadowParams
    ctx.shadowColor = `rgba(${params.color.r}, ${params.color.g}, ${params.color.b}, ${params.color.a})`
    ctx.shadowBlur = params.blur
    ctx.shadowOffsetX = params.offsetX
    ctx.shadowOffsetY = params.offsetY
  }
  
  if (blurEffect) {
    const params = blurEffect.params as BlurParams
    ctx.filter = `blur(${params.radius}px)`
  }
}

const drawLayer = (
  ctx: CanvasRenderingContext2D,
  layer: Layer,
  draggedLayerId: string | null,
  dragOffset: { x: number; y: number }
) => {
  if (!layer.visible) return
  
  ctx.save()
  
  let offsetX = 0
  let offsetY = 0
  if (layer.id === draggedLayerId) {
    offsetX = dragOffset.x
    offsetY = dragOffset.y
  }
  
  ctx.translate(layer.transform.x + offsetX, layer.transform.y + offsetY)
  ctx.rotate((layer.transform.rotation * Math.PI) / 180)
  ctx.scale(layer.transform.scaleX, layer.transform.scaleY)
  ctx.globalAlpha = layer.opacity

  const fill = layer.style.fills.find(f => f.visible)
  if (fill && fill.color) {
    ctx.fillStyle = `rgba(${fill.color.r}, ${fill.color.g}, ${fill.color.b}, ${fill.color.a})`
  }

  const stroke = layer.style.strokes.find(s => s.width > 0)
  if (stroke) {
    ctx.strokeStyle = `rgba(${stroke.color.r}, ${stroke.color.g}, ${stroke.color.b}, ${stroke.color.a})`
    ctx.lineWidth = stroke.width
    if (stroke.cap) ctx.lineCap = stroke.cap as CanvasLineCap
    if (stroke.join) ctx.lineJoin = stroke.join as CanvasLineJoin
  }

  let width = 0
  let height = 0

  switch (layer.type) {
    case 'rectangle': {
      width = (layer.metadata.width as number) || 200
      height = (layer.metadata.height as number) || 100
      const rectRadius = (layer.metadata.radius as number) || 0
      applyEffects(ctx, layer.style.effects)
      ctx.beginPath()
      ctx.roundRect(0, 0, width, height, rectRadius)
      if (fill) ctx.fill()
      if (stroke) ctx.stroke()
      
      if (layer.id === draggedLayerId) {
        ctx.strokeStyle = '#2563EB'
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.strokeRect(-2, -2, width + 4, height + 4)
        ctx.setLineDash([])
      }
      break
    }

    case 'ellipse': {
      width = (layer.metadata.width as number) || 100
      height = (layer.metadata.height as number) || 100
      applyEffects(ctx, layer.style.effects)
      ctx.beginPath()
      ctx.ellipse(width / 2, height / 2, width / 2, height / 2, 0, 0, Math.PI * 2)
      if (fill) ctx.fill()
      if (stroke) ctx.stroke()
      
      if (layer.id === draggedLayerId) {
        ctx.strokeStyle = '#2563EB'
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.ellipse(width / 2, height / 2, width / 2 + 2, height / 2 + 2, 0, 0, Math.PI * 2)
        ctx.stroke()
        ctx.setLineDash([])
      }
      break
    }

    case 'polygon': {
      const polySides = (layer.metadata.sides as number) || 3
      const polyRadius = (layer.metadata.radius as number) || 50
      width = polyRadius * 2
      height = polyRadius * 2
      applyEffects(ctx, layer.style.effects)
      ctx.beginPath()
      for (let i = 0; i < polySides; i++) {
        const angle = (i * 2 * Math.PI) / polySides - Math.PI / 2
        const px = polyRadius * Math.cos(angle) + polyRadius
        const py = polyRadius * Math.sin(angle) + polyRadius
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      if (fill) ctx.fill()
      if (stroke) ctx.stroke()
      break
    }

    case 'line': {
      const lineEndX = (layer.metadata.endX as number) || 100
      const lineEndY = (layer.metadata.endY as number) || 0
      width = Math.abs(lineEndX)
      height = Math.abs(lineEndY)
      applyEffects(ctx, layer.style.effects)
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(lineEndX, lineEndY)
      ctx.stroke()
      break
    }

    case 'frame': {
      width = (layer.metadata.width as number) || 800
      height = (layer.metadata.height as number) || 600
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)
      ctx.strokeStyle = '#e5e7eb'
      ctx.lineWidth = 1
      ctx.strokeRect(0, 0, width, height)
      break
    }

    case 'text': {
      const text = (layer.metadata.text as string) || 'Double-click to edit'
      const fontSize = (layer.metadata.fontSize as number) || 16
      const fontFamily = (layer.metadata.fontFamily as string) || 'Inter'
      ctx.font = `${fontSize}px ${fontFamily}`
      ctx.textBaseline = 'top'
      const metrics = ctx.measureText(text)
      width = metrics.width + 20
      height = fontSize + 10
      applyEffects(ctx, layer.style.effects)
      ctx.fillText(text, 0, 0)
      
      if (layer.id === draggedLayerId) {
        ctx.strokeStyle = '#2563EB'
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.strokeRect(-2, -2, width + 4, height + 4)
        ctx.setLineDash([])
      }
      break
    }

    case 'image': {
      width = (layer.metadata.width as number) || 200
      height = (layer.metadata.height as number) || 150
      applyEffects(ctx, layer.style.effects)
      const img = new Image()
      img.src = (layer.metadata.imageData as string) || ''
      if (img.complete) {
        ctx.drawImage(img, 0, 0, width, height)
      }
      
      if (layer.id === draggedLayerId) {
        ctx.strokeStyle = '#2563EB'
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.strokeRect(-2, -2, width + 4, height + 4)
        ctx.setLineDash([])
      }
      break
    }
  }

  ctx.restore()
}

const Editor = memo(function Editor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { currentTool, currentProjectId, projects, addLayer, selectLayers, updateViewport, selectTool, createTextLayer, updateLayer } = useStore()
  const { t } = useI18n()
  
  const [isDragging, setIsDragging] = useState(false)
  const [isPanning, setIsPanning] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [draggedLayerId, setDraggedLayerId] = useState<string | null>(null)
  const [viewportStart, setViewportStart] = useState({ x: 0, y: 0 })
  const [collidingLayers, setCollidingLayers] = useState<Set<string>>(new Set())

  const currentProject = projects.find(p => p.id === currentProjectId)

  const getCanvasCoords = useCallback((clientX: number, clientY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect || !currentProject) return { x: 0, y: 0 }
    
    return {
      x: clientX - rect.left + currentProject.viewport.x,
      y: clientY - rect.top + currentProject.viewport.y
    }
  }, [currentProject])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const resizeCanvas = () => {
      const container = containerRef.current
      if (!container) return
      
      const dpr = window.devicePixelRatio || 1
      canvas.width = container.clientWidth * dpr
      canvas.height = container.clientHeight * dpr
      canvas.style.width = `${container.clientWidth}px`
      canvas.style.height = `${container.clientHeight}px`
      ctx.scale(dpr, dpr)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || !currentProject) return

    const render = () => {
      const container = containerRef.current
      if (!container) return

      ctx.clearRect(0, 0, container.clientWidth, container.clientHeight)

      const gridSize = 20
      const viewport = currentProject.viewport

      ctx.save()
      ctx.translate(-viewport.x, -viewport.y)

      ctx.strokeStyle = '#e5e7eb'
      ctx.lineWidth = 0.5
      const startX = -((viewport.x % gridSize) - gridSize)
      const startY = -((viewport.y % gridSize) - gridSize)

      for (let x = startX; x < container.clientWidth + viewport.x + gridSize; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, container.clientHeight)
        ctx.stroke()
      }

      for (let y = startY; y < container.clientHeight + viewport.y + gridSize; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(container.clientWidth, y)
        ctx.stroke()
      }

      const rootLayerIds = currentProject.layers.filter(l => l.parentId === null).map(l => l.id)
      
      const renderLayerTree = (layerIds: string[]) => {
        layerIds.forEach(layerId => {
          const layer = currentProject.layers.find(l => l.id === layerId)
          if (!layer) return
          
          if (layer.id !== draggedLayerId) {
            drawLayer(ctx, layer, null, { x: 0, y: 0 })
          }
          
          if (layer.children.length > 0) {
            renderLayerTree(layer.children)
          }
        })
      }

      renderLayerTree(rootLayerIds)
      
      if (draggedLayerId) {
        const draggedLayer = currentProject.layers.find(l => l.id === draggedLayerId)
        if (draggedLayer) {
          drawLayer(ctx, draggedLayer, draggedLayerId, dragOffset)
        }
      }

      ctx.restore()
    }

    render()
  }, [currentProject, draggedLayerId, dragOffset])

  const checkLayerCollisions = useCallback((layerId: string, newX: number, newY: number): Set<string> => {
    if (!currentProject) return new Set()
    
    const colliding = new Set<string>()
    const draggedLayer = currentProject.layers.find(l => l.id === layerId)
    if (!draggedLayer) return colliding
    
    const draggedBounds: LayerBounds = {
      ...getLayerBounds(draggedLayer),
      left: newX,
      top: newY,
      right: newX + getLayerBounds(draggedLayer).width,
      bottom: newY + getLayerBounds(draggedLayer).height
    }
    
    currentProject.layers.forEach(layer => {
      if (layer.id === layerId || !layer.visible) return
      
      const layerBounds = getLayerBounds(layer)
      if (checkCollision(draggedBounds, layerBounds)) {
        colliding.add(layer.id)
      }
    })
    
    return colliding
  }, [currentProject])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!currentProjectId || !currentProject) return

    const coords = getCanvasCoords(e.clientX, e.clientY)
    const x = coords.x
    const y = coords.y

    if (currentTool === 'hand') {
      setIsPanning(true)
      setDragStart({ x: e.clientX, y: e.clientY })
      setViewportStart({ x: currentProject.viewport.x, y: currentProject.viewport.y })
    } else if (currentTool === 'select') {
      const clickedLayer = [...currentProject.layers]
        .reverse()
        .find(layer => {
          if (!layer.visible || layer.locked) return false
          const bounds = getLayerBounds(layer)
          return (
            x >= bounds.left &&
            x <= bounds.right &&
            y >= bounds.top &&
            y <= bounds.bottom
          )
        })

      if (clickedLayer) {
        setIsDragging(true)
        setDraggedLayerId(clickedLayer.id)
        setDragStart({ x, y })
        setDragOffset({ x: 0, y: 0 })
        selectLayers(currentProjectId, [clickedLayer.id])
      } else {
        selectLayers(currentProjectId, [])
      }
    } else if (currentTool === 'text') {
      createTextLayer(currentProjectId, x, y)
      selectTool('select')
    } else {
      const layerTypes: ToolType[] = ['rectangle', 'ellipse', 'polygon', 'line', 'frame']
      if (!layerTypes.includes(currentTool)) return
      
      const layerType = currentTool as LayerType
      const newLayer = createDefaultLayer(layerType, x, y)
      
      if (currentTool === 'rectangle') {
        newLayer.metadata.width = 200
        newLayer.metadata.height = 100
      } else if (currentTool === 'ellipse') {
        newLayer.metadata.width = 100
        newLayer.metadata.height = 100
      } else if (currentTool === 'polygon') {
        newLayer.metadata.sides = 3
        newLayer.metadata.radius = 50
      } else if (currentTool === 'line') {
        newLayer.metadata.endX = 100
        newLayer.metadata.endY = 0
      } else if (currentTool === 'frame') {
        newLayer.metadata.width = 800
        newLayer.metadata.height = 600
        newLayer.style.fills = []
        newLayer.style.strokes = []
      }

      addLayer(currentProjectId, newLayer)
      selectTool('select')
    }
  }, [currentTool, currentProjectId, currentProject, getCanvasCoords, selectLayers, createTextLayer, selectTool, addLayer])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning && currentProjectId && currentProject) {
      const dx = e.clientX - dragStart.x
      const dy = e.clientY - dragStart.y

      updateViewport(currentProjectId, {
        x: viewportStart.x - dx,
        y: viewportStart.y - dy
      })
    } else if (isDragging && draggedLayerId && currentProjectId) {
      const coords = getCanvasCoords(e.clientX, e.clientY)
      const newOffsetX = coords.x - dragStart.x
      const newOffsetY = coords.y - dragStart.y
      
      setDragOffset({ x: newOffsetX, y: newOffsetY })
      
      const draggedLayer = currentProject?.layers.find(l => l.id === draggedLayerId)
      if (draggedLayer) {
        const newX = draggedLayer.transform.x + newOffsetX
        const newY = draggedLayer.transform.y + newOffsetY
        const collisions = checkLayerCollisions(draggedLayerId, newX, newY)
        setCollidingLayers(collisions)
      }
    }
  }, [isPanning, isDragging, draggedLayerId, dragStart, viewportStart, currentProjectId, currentProject, getCanvasCoords, updateViewport, checkLayerCollisions])

  const handleMouseUp = useCallback(() => {
    if (isDragging && draggedLayerId && currentProjectId && currentProject) {
      const draggedLayer = currentProject.layers.find(l => l.id === draggedLayerId)
      if (draggedLayer) {
        const newX = draggedLayer.transform.x + dragOffset.x
        const newY = draggedLayer.transform.y + dragOffset.y
        
        updateLayer(currentProjectId, draggedLayerId, {
          transform: {
            ...draggedLayer.transform,
            x: newX,
            y: newY
          }
        })
      }
    }
    
    setIsDragging(false)
    setIsPanning(false)
    setDraggedLayerId(null)
    setDragOffset({ x: 0, y: 0 })
    setCollidingLayers(new Set())
  }, [isDragging, draggedLayerId, currentProjectId, currentProject, dragOffset, updateLayer])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    if (!currentProjectId || !currentProject) return

    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1
    const newZoom = Math.max(0.1, Math.min(10, currentProject.viewport.zoom * zoomFactor))
    
    updateViewport(currentProjectId, { zoom: newZoom })
  }, [currentProjectId, currentProject, updateViewport])

  const getCursor = () => {
    if (isPanning) return 'grabbing'
    if (currentTool === 'hand') return 'grab'
    if (currentTool === 'select') return isDragging ? 'move' : 'default'
    return 'crosshair'
  }

  return (
    <div 
      ref={containerRef}
      className="flex-1 relative overflow-hidden bg-white"
      onWheel={handleWheel}
      style={{ cursor: getCursor() }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseEnter={() => {
          if (currentTool === 'select') {
            const canvas = canvasRef.current
            if (canvas) canvas.style.cursor = 'default'
          }
        }}
      />
      
      {collidingLayers.size > 0 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg shadow-lg text-sm">
          ⚠️ Collision detected with {collidingLayers.size} layer(s)
        </div>
      )}
      
      {!currentProject && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="text-6xl mb-4">🎨</div>
            <h2 className="text-xl font-semibold text-gray-600 mb-2">{t('editor.welcome')}</h2>
            <p className="text-gray-400 mb-4">{t('editor.createProject')}</p>
          </div>
        </div>
      )}
    </div>
  )
})

export default Editor

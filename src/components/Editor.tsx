import { useEffect, useRef, useState, useCallback } from 'react'
import { useStore } from '../store'
import { Layer, LayerType, Transform, LayerStyle, Effect, ShadowParams, BlurParams, ToolType, RGBA } from '../types'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
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
    frame: '画板',
    group: '组',
    rectangle: '矩形',
    ellipse: '椭圆',
    polygon: '多边形',
    line: '线条',
    path: '路径',
    text: '文本',
    image: '图片',
    component: '组件',
    boolean: '布尔运算组'
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

function Editor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { currentTool, currentProjectId, projects, addLayer, selectLayers, updateViewport, selectTool } = useStore()
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [viewportStart, setViewportStart] = useState({ x: 0, y: 0 })

  const currentProject = projects.find(p => p.id === currentProjectId)

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

    const drawLayer = (layer: Layer) => {
      if (!layer.visible) return
      
      ctx.save()
      ctx.translate(layer.transform.x, layer.transform.y)
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
          width = layer.metadata.width || 200
          height = layer.metadata.height || 100
          const rectRadius = layer.metadata.radius || 0
          applyEffects(ctx, layer.style.effects)
          ctx.beginPath()
          ctx.roundRect(0, 0, width, height, rectRadius)
          if (fill) ctx.fill()
          if (stroke) ctx.stroke()
          break
        }

        case 'ellipse': {
          width = layer.metadata.width || 100
          height = layer.metadata.height || 100
          applyEffects(ctx, layer.style.effects)
          ctx.beginPath()
          ctx.ellipse(width / 2, height / 2, width / 2, height / 2, 0, 0, Math.PI * 2)
          if (fill) ctx.fill()
          if (stroke) ctx.stroke()
          break
        }

        case 'polygon': {
          const polySides = layer.metadata.sides || 3
          const polyRadius = layer.metadata.radius || 50
          width = polyRadius * 2
          height = polyRadius * 2
          applyEffects(ctx, layer.style.effects)
          ctx.beginPath()
          for (let i = 0; i < polySides; i++) {
            const angle = (i * 2 * Math.PI) / polySides - Math.PI / 2
            const x = polyRadius * Math.cos(angle) + polyRadius
            const y = polyRadius * Math.sin(angle) + polyRadius
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.closePath()
          if (fill) ctx.fill()
          if (stroke) ctx.stroke()
          break
        }

        case 'line': {
          const lineEndX = layer.metadata.endX || 100
          const lineEndY = layer.metadata.endY || 0
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
          width = layer.metadata.width || 800
          height = layer.metadata.height || 600
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, width, height)
          ctx.strokeStyle = '#e5e7eb'
          ctx.lineWidth = 1
          ctx.strokeRect(0, 0, width, height)
          break
        }
      }

      ctx.restore()
    }

    const rootLayerIds = currentProject.layers.filter(l => l.parentId === null).map(l => l.id)
    
    const renderLayerTree = (layerIds: string[]) => {
      layerIds.forEach(layerId => {
        const layer = currentProject.layers.find(l => l.id === layerId)
        if (!layer) return
        
        drawLayer(layer)
        
        if (layer.children.length > 0) {
          renderLayerTree(layer.children)
        }
      })
    }

    renderLayerTree(rootLayerIds)

      ctx.restore()
    }

    render()
  }, [currentProject])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!currentProjectId || !currentProject) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left + currentProject.viewport.x
    const y = e.clientY - rect.top + currentProject.viewport.y

    if (currentTool === 'hand' || currentTool === 'zoom') {
      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
      setViewportStart({ x: currentProject.viewport.x, y: currentProject.viewport.y })
    } else if (currentTool === 'select') {
      const clickedLayer = [...currentProject.layers]
        .reverse()
        .find(layer => {
          if (!layer.visible) return false
          const width = layer.metadata.width || 200
          const height = layer.metadata.height || 100
          return (
            x >= layer.transform.x &&
            x <= layer.transform.x + width &&
            y >= layer.transform.y &&
            y <= layer.transform.y + height
          )
        })

      if (clickedLayer) {
        selectLayers(currentProjectId, [clickedLayer.id])
      } else {
        selectLayers(currentProjectId, [])
      }
    } else {
      const layerTypes: ToolType[] = ['rectangle', 'ellipse', 'polygon', 'line', 'frame', 'text']
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
  }, [currentTool, currentProjectId, currentProject, addLayer, selectLayers, selectTool])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !currentProjectId || !currentProject) return

    const dx = e.clientX - dragStart.x
    const dy = e.clientY - dragStart.y

    if (currentTool === 'hand') {
      updateViewport(currentProjectId, {
        x: viewportStart.x - dx,
        y: viewportStart.y - dy
      })
    }
  }, [isDragging, dragStart, viewportStart, currentTool, currentProjectId, currentProject, updateViewport])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    if (!currentProjectId || !currentProject) return

    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1
    const newZoom = Math.max(0.1, Math.min(10, currentProject.viewport.zoom * zoomFactor))
    
    updateViewport(currentProjectId, { zoom: newZoom })
  }, [currentProjectId, currentProject, updateViewport])

  return (
    <div 
      ref={containerRef}
      className="flex-1 relative overflow-hidden bg-white"
      onWheel={handleWheel}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      
      {!currentProject && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="text-6xl mb-4">🎨</div>
            <h2 className="text-xl font-semibold text-gray-600 mb-2">欢迎使用 CodeBrush</h2>
            <p className="text-gray-400 mb-4">点击左侧"+"按钮创建新项目</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Editor

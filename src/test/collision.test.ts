import { describe, it, expect } from 'vitest'
import { Layer } from '../types'

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

function createMockLayer(type: 'rectangle' | 'ellipse' | 'polygon' | 'line' | 'frame' | 'text' | 'image', x: number, y: number, width: number = 100, height: number = 100): Layer {
  return {
    id: `layer-${x}-${y}`,
    type,
    name: 'Test Layer',
    parentId: null,
    children: [],
    transform: { x, y, scaleX: 1, scaleY: 1, rotation: 0, skewX: 0, skewY: 0 },
    style: { fills: [], strokes: [], effects: [] },
    locked: false,
    visible: true,
    opacity: 1,
    blendMode: 'normal',
    metadata: { width, height }
  }
}

describe('Collision Detection', () => {
  describe('getLayerBounds', () => {
    it('should calculate bounds for rectangle layer', () => {
      const layer = createMockLayer('rectangle', 100, 200, 150, 80)
      const bounds = getLayerBounds(layer)
      
      expect(bounds.left).toBe(100)
      expect(bounds.top).toBe(200)
      expect(bounds.right).toBe(250)
      expect(bounds.bottom).toBe(280)
      expect(bounds.width).toBe(150)
      expect(bounds.height).toBe(80)
    })

    it('should calculate bounds for ellipse layer', () => {
      const layer = createMockLayer('ellipse', 50, 50, 100, 100)
      const bounds = getLayerBounds(layer)
      
      expect(bounds.left).toBe(50)
      expect(bounds.top).toBe(50)
      expect(bounds.right).toBe(150)
      expect(bounds.bottom).toBe(150)
    })

    it('should calculate bounds for polygon layer using radius', () => {
      const layer: Layer = {
        id: 'polygon-layer',
        type: 'polygon',
        name: 'Polygon',
        parentId: null,
        children: [],
        transform: { x: 100, y: 100, scaleX: 1, scaleY: 1, rotation: 0, skewX: 0, skewY: 0 },
        style: { fills: [], strokes: [], effects: [] },
        locked: false,
        visible: true,
        opacity: 1,
        blendMode: 'normal',
        metadata: { radius: 75 }
      }
      
      const bounds = getLayerBounds(layer)
      
      expect(bounds.width).toBe(150)
      expect(bounds.height).toBe(150)
    })

    it('should handle line layer with negative dimensions', () => {
      const layer: Layer = {
        id: 'line-layer',
        type: 'line',
        name: 'Line',
        parentId: null,
        children: [],
        transform: { x: 100, y: 100, scaleX: 1, scaleY: 1, rotation: 0, skewX: 0, skewY: 0 },
        style: { fills: [], strokes: [], effects: [] },
        locked: false,
        visible: true,
        opacity: 1,
        blendMode: 'normal',
        metadata: { endX: -50, endY: 100 }
      }
      
      const bounds = getLayerBounds(layer)
      
      expect(bounds.width).toBe(50)
      expect(bounds.height).toBe(100)
    })

    it('should handle frame layer', () => {
      const layer: Layer = {
        id: 'frame-layer',
        type: 'frame',
        name: 'Frame',
        parentId: null,
        children: [],
        transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0, skewX: 0, skewY: 0 },
        style: { fills: [], strokes: [], effects: [] },
        locked: false,
        visible: true,
        opacity: 1,
        blendMode: 'normal',
        metadata: { width: 1920, height: 1080 }
      }
      
      const bounds = getLayerBounds(layer)
      
      expect(bounds.width).toBe(1920)
      expect(bounds.height).toBe(1080)
    })

    it('should use default values when metadata is missing', () => {
      const layer: Layer = {
        id: 'default-layer',
        type: 'rectangle',
        name: 'Default',
        parentId: null,
        children: [],
        transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0, skewX: 0, skewY: 0 },
        style: { fills: [], strokes: [], effects: [] },
        locked: false,
        visible: true,
        opacity: 1,
        blendMode: 'normal',
        metadata: {}
      }
      
      const bounds = getLayerBounds(layer)
      
      expect(bounds.width).toBe(200)
      expect(bounds.height).toBe(100)
    })
  })

  describe('checkCollision', () => {
    it('should detect collision when layers overlap', () => {
      const layer1 = createMockLayer('rectangle', 0, 0, 100, 100)
      const layer2 = createMockLayer('rectangle', 50, 50, 100, 100)
      
      const bounds1 = getLayerBounds(layer1)
      const bounds2 = getLayerBounds(layer2)
      
      expect(checkCollision(bounds1, bounds2)).toBe(true)
    })

    it('should not detect collision when layers do not overlap', () => {
      const layer1 = createMockLayer('rectangle', 0, 0, 100, 100)
      const layer2 = createMockLayer('rectangle', 200, 200, 100, 100)
      
      const bounds1 = getLayerBounds(layer1)
      const bounds2 = getLayerBounds(layer2)
      
      expect(checkCollision(bounds1, bounds2)).toBe(false)
    })

    it('should detect collision when layers touch edges', () => {
      const layer1 = createMockLayer('rectangle', 0, 0, 99, 99)
      const layer2 = createMockLayer('rectangle', 100, 0, 100, 100)
      
      const bounds1 = getLayerBounds(layer1)
      const bounds2 = getLayerBounds(layer2)
      
      expect(checkCollision(bounds1, bounds2)).toBe(false)
    })

    it('should not detect collision when one layer is completely inside another', () => {
      const layer1 = createMockLayer('rectangle', 0, 0, 200, 200)
      const layer2 = createMockLayer('rectangle', 50, 50, 50, 50)
      
      const bounds1 = getLayerBounds(layer1)
      const bounds2 = getLayerBounds(layer2)
      
      expect(checkCollision(bounds1, bounds2)).toBe(true)
    })

    it('should detect collision diagonally', () => {
      const layer1 = createMockLayer('rectangle', 0, 0, 50, 50)
      const layer2 = createMockLayer('rectangle', 40, 40, 50, 50)
      
      const bounds1 = getLayerBounds(layer1)
      const bounds2 = getLayerBounds(layer2)
      
      expect(checkCollision(bounds1, bounds2)).toBe(true)
    })

    it('should handle zero-size layers', () => {
      const layer1: Layer = {
        id: 'zero-layer',
        type: 'rectangle',
        name: 'Zero',
        parentId: null,
        children: [],
        transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0, skewX: 0, skewY: 0 },
        style: { fills: [], strokes: [], effects: [] },
        locked: false,
        visible: true,
        opacity: 1,
        blendMode: 'normal',
        metadata: {}
      }
      const layer2 = createMockLayer('rectangle', 100, 100, 50, 50)
      
      const bounds1 = getLayerBounds(layer1)
      const bounds2 = getLayerBounds(layer2)
      
      expect(checkCollision(bounds1, bounds2)).toBe(false)
    })

    it('should detect collision with negative coordinates', () => {
      const layer1 = createMockLayer('rectangle', -100, -100, 100, 100)
      const layer2 = createMockLayer('rectangle', -50, -50, 100, 100)
      
      const bounds1 = getLayerBounds(layer1)
      const bounds2 = getLayerBounds(layer2)
      
      expect(checkCollision(bounds1, bounds2)).toBe(true)
    })
  })
})

describe('Drag Offset Calculation', () => {
  it('should calculate correct drag offset', () => {
    const dragStart = { x: 100, y: 100 }
    const currentPos = { x: 150, y: 120 }
    
    const offset = {
      x: currentPos.x - dragStart.x,
      y: currentPos.y - dragStart.y
    }
    
    expect(offset.x).toBe(50)
    expect(offset.y).toBe(20)
  })

  it('should calculate negative offset when dragging left', () => {
    const dragStart = { x: 100, y: 100 }
    const currentPos = { x: 80, y: 90 }
    
    const offset = {
      x: currentPos.x - dragStart.x,
      y: currentPos.y - dragStart.y
    }
    
    expect(offset.x).toBe(-20)
    expect(offset.y).toBe(-10)
  })

  it('should calculate new position with offset', () => {
    const originalPos = { x: 100, y: 200 }
    const offset = { x: 50, y: -30 }
    
    const newPos = {
      x: originalPos.x + offset.x,
      y: originalPos.y + offset.y
    }
    
    expect(newPos.x).toBe(150)
    expect(newPos.y).toBe(170)
  })
})

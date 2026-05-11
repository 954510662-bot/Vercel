import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { useStore } from '../store'
import { Layer } from '../types'

describe('CodeBrush Editor - Core Functionality Tests', () => {
  let testProjectId: string

  beforeEach(() => {
    const store = useStore.getState()
    store.createProject('Test Project')
    const project = store.getCurrentProject()
    if (project) {
      testProjectId = project.id
    }
  })

  afterEach(() => {
    useStore.setState({ projects: [], currentProjectId: null })
  })

  describe('Project Management', () => {
    it('should create a new project', () => {
      const store = useStore.getState()
      const project = store.getCurrentProject()
      expect(project).toBeDefined()
      expect(project?.name).toBe('Test Project')
      expect(project?.layers).toEqual([])
      expect(project?.selectedLayerIds).toEqual([])
    })

    it('should have default viewport settings', () => {
      const store = useStore.getState()
      const project = store.getCurrentProject()
      expect(project?.viewport.x).toBe(0)
      expect(project?.viewport.y).toBe(0)
      expect(project?.viewport.zoom).toBe(1)
    })
  })

  describe('Layer Operations', () => {
    it('should add a rectangle layer', () => {
      const store = useStore.getState()
      const layer: Layer = {
        id: 'test-layer',
        type: 'rectangle',
        name: 'Test Rectangle',
        parentId: null,
        children: [],
        transform: { x: 10, y: 20, scaleX: 1, scaleY: 1, rotation: 0, skewX: 0, skewY: 0 },
        style: { fills: [{ type: 'solid', color: { r: 255, g: 0, b: 0, a: 1 }, visible: true }], strokes: [], effects: [] },
        locked: false,
        visible: true,
        opacity: 1,
        blendMode: 'normal',
        metadata: { width: 100, height: 50 }
      }
      
      store.addLayer(testProjectId, layer)
      const project = store.getCurrentProject()
      
      expect(project?.layers.length).toBe(1)
      expect(project?.layers[0].id).toBe('test-layer')
      expect(project?.layers[0].type).toBe('rectangle')
    })

    it('should select a layer', () => {
      const store = useStore.getState()
      const layer: Layer = {
        id: 'select-test',
        type: 'rectangle',
        name: 'Select Test',
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
      
      store.addLayer(testProjectId, layer)
      store.selectLayers(testProjectId, ['select-test'])
      const project = store.getCurrentProject()
      
      expect(project?.selectedLayerIds).toEqual(['select-test'])
    })

    it('should update layer properties', () => {
      const store = useStore.getState()
      const layer: Layer = {
        id: 'update-test',
        type: 'ellipse',
        name: 'Original',
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
      
      store.addLayer(testProjectId, layer)
      store.updateLayer(testProjectId, 'update-test', { name: 'Updated', opacity: 0.5 })
      const project = store.getCurrentProject()
      const updatedLayer = project?.layers.find(l => l.id === 'update-test')
      
      expect(updatedLayer?.name).toBe('Updated')
      expect(updatedLayer?.opacity).toBe(0.5)
    })

    it('should delete a layer', () => {
      const store = useStore.getState()
      const layer: Layer = {
        id: 'delete-test',
        type: 'rectangle',
        name: 'Delete Me',
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
      
      store.addLayer(testProjectId, layer)
      expect(store.getCurrentProject()?.layers.length).toBe(1)
      
      store.deleteLayer(testProjectId, 'delete-test')
      expect(store.getCurrentProject()?.layers.length).toBe(0)
    })

    it('should group multiple layers', () => {
      const store = useStore.getState()
      const layer1: Layer = { id: 'group-layer-1', type: 'rectangle', name: 'Layer 1', parentId: null, children: [], transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0, skewX: 0, skewY: 0 }, style: { fills: [], strokes: [], effects: [] }, locked: false, visible: true, opacity: 1, blendMode: 'normal', metadata: {} }
      const layer2: Layer = { id: 'group-layer-2', type: 'ellipse', name: 'Layer 2', parentId: null, children: [], transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0, skewX: 0, skewY: 0 }, style: { fills: [], strokes: [], effects: [] }, locked: false, visible: true, opacity: 1, blendMode: 'normal', metadata: {} }
      
      store.addLayer(testProjectId, layer1)
      store.addLayer(testProjectId, layer2)
      store.selectLayers(testProjectId, ['group-layer-1', 'group-layer-2'])
      store.groupLayers(testProjectId, ['group-layer-1', 'group-layer-2'])
      
      const project = store.getCurrentProject()
      const groupLayer = project?.layers.find(l => l.type === 'group')
      
      expect(groupLayer).toBeDefined()
      expect(groupLayer?.children).toContain('group-layer-1')
      expect(groupLayer?.children).toContain('group-layer-2')
    })

    it('should duplicate a layer', () => {
      const store = useStore.getState()
      const layer: Layer = {
        id: 'duplicate-test',
        type: 'rectangle',
        name: 'Original',
        parentId: null,
        children: [],
        transform: { x: 10, y: 20, scaleX: 1, scaleY: 1, rotation: 0, skewX: 0, skewY: 0 },
        style: { fills: [], strokes: [], effects: [] },
        locked: false,
        visible: true,
        opacity: 1,
        blendMode: 'normal',
        metadata: {}
      }
      
      store.addLayer(testProjectId, layer)
      store.duplicateLayer(testProjectId, 'duplicate-test')
      
      const project = store.getCurrentProject()
      const duplicatedLayer = project?.layers.find(l => l.name === 'Original 副本')
      
      expect(duplicatedLayer).toBeDefined()
      expect(duplicatedLayer?.transform.x).toBe(30)
      expect(duplicatedLayer?.transform.y).toBe(40)
    })
  })

  describe('Style System', () => {
    it('should update fill color', () => {
      const store = useStore.getState()
      const layer: Layer = {
        id: 'style-test',
        type: 'rectangle',
        name: 'Style Test',
        parentId: null,
        children: [],
        transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0, skewX: 0, skewY: 0 },
        style: { fills: [{ type: 'solid', color: { r: 255, g: 255, b: 255, a: 1 }, visible: true }], strokes: [], effects: [] },
        locked: false,
        visible: true,
        opacity: 1,
        blendMode: 'normal',
        metadata: {}
      }
      
      store.addLayer(testProjectId, layer)
      store.updateLayer(testProjectId, 'style-test', {
        style: {
          fills: [{ type: 'solid', color: { r: 255, g: 0, b: 0, a: 1 }, visible: true }],
          strokes: [],
          effects: []
        }
      })
      
      const updatedLayer = store.getCurrentProject()?.layers.find(l => l.id === 'style-test')
      expect(updatedLayer?.style.fills[0].color).toEqual({ r: 255, g: 0, b: 0, a: 1 })
    })

    it('should update stroke properties', () => {
      const store = useStore.getState()
      const layer: Layer = {
        id: 'stroke-test',
        type: 'rectangle',
        name: 'Stroke Test',
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
      
      store.addLayer(testProjectId, layer)
      store.updateLayer(testProjectId, 'stroke-test', {
        style: {
          fills: [],
          strokes: [{ color: { r: 0, g: 0, b: 0, a: 1 }, width: 2, style: 'solid', cap: 'round', join: 'round', position: 'center' }],
          effects: []
        }
      })
      
      const updatedLayer = store.getCurrentProject()?.layers.find(l => l.id === 'stroke-test')
      expect(updatedLayer?.style.strokes[0].width).toBe(2)
      expect(updatedLayer?.style.strokes[0].cap).toBe('round')
    })

    it('should add shadow effect', () => {
      const store = useStore.getState()
      const layer: Layer = {
        id: 'effect-test',
        type: 'rectangle',
        name: 'Effect Test',
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
      
      store.addLayer(testProjectId, layer)
      store.updateLayer(testProjectId, 'effect-test', {
        style: {
          fills: [],
          strokes: [],
          effects: [{ type: 'shadow', params: { color: { r: 0, g: 0, b: 0, a: 0.5 }, blur: 10, offsetX: 2, offsetY: 4, inner: false }, visible: true }]
        }
      })
      
      const updatedLayer = store.getCurrentProject()?.layers.find(l => l.id === 'effect-test')
      expect(updatedLayer?.style.effects.length).toBe(1)
      expect(updatedLayer?.style.effects[0].type).toBe('shadow')
    })
  })

  describe('History System', () => {
    it('should undo layer creation', () => {
      const store = useStore.getState()
      const layer: Layer = {
        id: 'undo-test',
        type: 'rectangle',
        name: 'Undo Test',
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
      
      store.addLayer(testProjectId, layer)
      expect(store.getCurrentProject()?.layers.length).toBe(1)
      
      store.undo()
      expect(store.getCurrentProject()?.layers.length).toBe(0)
    })

    it('should redo undone action', () => {
      const store = useStore.getState()
      const layer: Layer = {
        id: 'redo-test',
        type: 'rectangle',
        name: 'Redo Test',
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
      
      store.addLayer(testProjectId, layer)
      store.undo()
      expect(store.getCurrentProject()?.layers.length).toBe(0)
      
      store.redo()
      expect(store.getCurrentProject()?.layers.length).toBe(1)
    })
  })

  describe('Viewport Management', () => {
    it('should update viewport zoom', () => {
      const store = useStore.getState()
      store.updateViewport(testProjectId, { zoom: 2 })
      
      const project = store.getCurrentProject()
      expect(project?.viewport.zoom).toBe(2)
    })

    it('should update viewport position', () => {
      const store = useStore.getState()
      store.updateViewport(testProjectId, { x: 100, y: 200 })
      
      const project = store.getCurrentProject()
      expect(project?.viewport.x).toBe(100)
      expect(project?.viewport.y).toBe(200)
    })
  })

  describe('Tool Selection', () => {
    it('should select different tools', () => {
      const store = useStore.getState()
      
      store.selectTool('rectangle')
      expect(useStore.getState().currentTool).toBe('rectangle')
      
      store.selectTool('ellipse')
      expect(useStore.getState().currentTool).toBe('ellipse')
      
      store.selectTool('select')
      expect(useStore.getState().currentTool).toBe('select')
    })
  })

  describe('Component System', () => {
    it('should create a component', () => {
      const store = useStore.getState()
      store.createComponent('Button', 'base-layer-id', [
        { id: 'prop-1', name: 'Variant', type: 'select', options: ['Primary', 'Secondary'], defaultValue: 'Primary' }
      ])
      
      const newState = useStore.getState()
      expect(newState.components.length).toBe(1)
      expect(newState.components[0].name).toBe('Button')
    })

    it('should add component variant', () => {
      const store = useStore.getState()
      store.createComponent('Card', 'card-layer-id', [])
      
      const state1 = useStore.getState()
      store.addVariant(state1.components[0].id, 'Small', { size: 'small' }, 'small-layer-id')
      
      const state2 = useStore.getState()
      expect(state2.components[0].variants.length).toBe(1)
      expect(state2.components[0].variants[0].name).toBe('Small')
    })
  })
})
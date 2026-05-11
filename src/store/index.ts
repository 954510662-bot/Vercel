import { create } from 'zustand'
import { Layer, ToolType, Project, Viewport, HistoryAction, Transform, LayerStyle, Component, ComponentVariant, ComponentProperty } from '../types'

interface EditorState {
  projects: Project[]
  currentProjectId: string | null
  currentTool: ToolType
  history: HistoryAction[]
  historyIndex: number
  components: Component[]
  componentProperties: ComponentProperty[]
  
  getCurrentProject: () => Project | undefined
  selectTool: (tool: ToolType) => void
  addLayer: (projectId: string, layer: Layer) => void
  updateLayer: (projectId: string, layerId: string, updates: Partial<Layer>) => void
  deleteLayer: (projectId: string, layerId: string) => void
  selectLayers: (projectId: string, layerIds: string[]) => void
  updateViewport: (projectId: string, viewport: Partial<Viewport>) => void
  undo: () => void
  redo: () => void
  createProject: (name: string) => void
  groupLayers: (projectId: string, layerIds: string[]) => void
  ungroupLayer: (projectId: string, groupId: string) => void
  duplicateLayer: (projectId: string, layerId: string) => void
  moveLayer: (projectId: string, layerId: string, targetIndex: number) => void
  
  createComponent: (name: string, baseLayerId: string, properties: ComponentProperty[]) => void
  addVariant: (componentId: string, name: string, propertyValues: Record<string, string>, layerId: string) => void
  updateVariant: (componentId: string, variantId: string, updates: Partial<ComponentVariant>) => void
  deleteVariant: (componentId: string, variantId: string) => void
  addComponentProperty: (property: ComponentProperty) => void
  updateComponentProperty: (propertyId: string, updates: Partial<ComponentProperty>) => void
  deleteComponentProperty: (propertyId: string) => void
  createInstance: (projectId: string, componentId: string, variantId: string, x: number, y: number) => void
}

const defaultTransform: Transform = {
  x: 0,
  y: 0,
  scaleX: 1,
  scaleY: 1,
  rotation: 0,
  skewX: 0,
  skewY: 0
}

const defaultStyle: LayerStyle = {
  fills: [{ type: 'solid', color: { r: 255, g: 255, b: 255, a: 1 }, visible: true }],
  strokes: [],
  effects: []
}

const defaultViewport: Viewport = {
  x: 0,
  y: 0,
  zoom: 1
}

export const useStore = create<EditorState>((set, get) => ({
  projects: [],
  currentProjectId: null,
  currentTool: 'select',
  history: [],
  historyIndex: -1,
  components: [],
  componentProperties: [],
  
  getCurrentProject: () => {
    const { projects, currentProjectId } = get()
    return projects.find(p => p.id === currentProjectId)
  },
  
  selectTool: (tool) => set({ currentTool: tool }),
  
  addLayer: (projectId, layer) => {
    set((state) => {
      const projects = state.projects.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            layers: [...p.layers, layer],
            selectedLayerIds: [layer.id]
          }
        }
        return p
      })
      
      const action: HistoryAction = {
        id: `${Date.now()}`,
        type: 'create',
        layerId: layer.id,
        newState: layer
      }
      
      return {
        projects,
        history: [...state.history.slice(0, state.historyIndex + 1), action],
        historyIndex: state.historyIndex + 1
      }
    })
  },
  
  updateLayer: (projectId, layerId, updates) => {
    set((state) => {
      let previousState: Layer | undefined
      
      const projects = state.projects.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            layers: p.layers.map(layer => {
              if (layer.id === layerId) {
                previousState = { ...layer }
                return { ...layer, ...updates }
              }
              return layer
            })
          }
        }
        return p
      })
      
      const action: HistoryAction = {
        id: `${Date.now()}`,
        type: 'update',
        layerId,
        previousState,
        newState: projects.find(p => p.id === projectId)?.layers.find(l => l.id === layerId)
      }
      
      return {
        projects,
        history: [...state.history.slice(0, state.historyIndex + 1), action],
        historyIndex: state.historyIndex + 1
      }
    })
  },
  
  deleteLayer: (projectId, layerId) => {
    set((state) => {
      let deletedLayer: Layer | undefined
      
      const projects = state.projects.map(p => {
        if (p.id === projectId) {
          const deleted = p.layers.find(l => l.id === layerId)
          if (deleted) {
            deletedLayer = deleted
          }
          return {
            ...p,
            layers: p.layers.filter(l => l.id !== layerId),
            selectedLayerIds: p.selectedLayerIds.filter(id => id !== layerId)
          }
        }
        return p
      })
      
      const action: HistoryAction = {
        id: `${Date.now()}`,
        type: 'delete',
        layerId,
        previousState: deletedLayer
      }
      
      return {
        projects,
        history: [...state.history.slice(0, state.historyIndex + 1), action],
        historyIndex: state.historyIndex + 1
      }
    })
  },
  
  selectLayers: (projectId, layerIds) => {
    set((state) => ({
      projects: state.projects.map(p => 
        p.id === projectId ? { ...p, selectedLayerIds: layerIds } : p
      )
    }))
  },
  
  updateViewport: (projectId, viewport) => {
    set((state) => ({
      projects: state.projects.map(p => 
        p.id === projectId ? { ...p, viewport: { ...p.viewport, ...viewport } } : p
      )
    }))
  },
  
  undo: () => {
    set((state) => {
      if (state.historyIndex < 0) return state
      
      const action = state.history[state.historyIndex]
      const newHistoryIndex = state.historyIndex - 1
      
      let projects: Project[] = [...state.projects]
      
      if (action.type === 'create') {
        projects = projects.map(p => ({
          ...p,
          layers: p.layers.filter((l): l is Layer => l.id !== action.layerId),
          selectedLayerIds: p.selectedLayerIds.filter(id => id !== action.layerId)
        }))
      } else if (action.type === 'delete' && action.previousState) {
        const restoredLayer = action.previousState
        projects = projects.map(p => ({
          ...p,
          layers: [...p.layers, restoredLayer],
          selectedLayerIds: [...p.selectedLayerIds, action.layerId!]
        }))
      } else if (action.type === 'update' && action.previousState) {
        const prevState = action.previousState
        projects = projects.map(p => ({
          ...p,
          layers: p.layers.map(l => l.id === action.layerId ? prevState : l)
        }))
      }
      
      return { projects, historyIndex: newHistoryIndex }
    })
  },
  
  redo: () => {
    set((state) => {
      if (state.historyIndex >= state.history.length - 1) return state
      
      const newHistoryIndex = state.historyIndex + 1
      const action = state.history[newHistoryIndex]
      
      let projects: Project[] = [...state.projects]
      
      if (action.type === 'create' && action.newState) {
        const newLayer = action.newState
        projects = projects.map(p => ({
          ...p,
          layers: [...p.layers, newLayer],
          selectedLayerIds: [action.layerId!]
        }))
      } else if (action.type === 'delete') {
        projects = projects.map(p => ({
          ...p,
          layers: p.layers.filter(l => l.id !== action.layerId),
          selectedLayerIds: p.selectedLayerIds.filter(id => id !== action.layerId)
        }))
      } else if (action.type === 'update' && action.newState) {
        projects = projects.map(p => ({
          ...p,
          layers: p.layers.map(l => l.id === action.layerId ? action.newState! : l)
        }))
      }
      
      return { projects, historyIndex: newHistoryIndex }
    })
  },
  
  createProject: (name) => {
    const newProject: Project = {
      id: `${Date.now()}`,
      name,
      layers: [],
      selectedLayerIds: [],
      viewport: { ...defaultViewport }
    }
    
    set((state) => ({
      projects: [...state.projects, newProject],
      currentProjectId: newProject.id,
      history: [],
      historyIndex: -1
    }))
  },
  
  groupLayers: (projectId, layerIds) => {
    set((state) => {
      const groupId = `${Date.now()}`
      const layersToGroup = state.projects
        .find(p => p.id === projectId)
        ?.layers.filter(l => layerIds.includes(l.id)) || []
      
      const projects = state.projects.map(p => {
        if (p.id === projectId) {
          const remainingLayers = p.layers.filter(l => !layerIds.includes(l.id))
          const groupLayer: Layer = {
            id: groupId,
            type: 'group',
            name: '组',
            parentId: null,
            children: layerIds,
            transform: { ...defaultTransform },
            style: { ...defaultStyle },
            locked: false,
            visible: true,
            opacity: 1,
            blendMode: 'normal',
            metadata: {}
          }
          
          const updatedGroupedLayers = layersToGroup.map(l => ({
            ...l,
            parentId: groupId
          }))
          
          return {
            ...p,
            layers: [...remainingLayers, groupLayer, ...updatedGroupedLayers],
            selectedLayerIds: [groupId]
          }
        }
        return p
      })
      
      const action: HistoryAction = {
        id: `${Date.now()}`,
        type: 'group',
        layerIds,
        groupId
      }
      
      return {
        projects,
        history: [...state.history.slice(0, state.historyIndex + 1), action],
        historyIndex: state.historyIndex + 1
      }
    })
  },
  
  ungroupLayer: (projectId, groupId) => {
    set((state) => {
      const projects = state.projects.map(p => {
        if (p.id === projectId) {
          const group = p.layers.find(l => l.id === groupId)
          if (!group) return p
          
          const ungroupedLayers = p.layers
            .filter(l => group.children.includes(l.id))
            .map(l => ({ ...l, parentId: null }))
          
          return {
            ...p,
            layers: p.layers.filter(l => l.id !== groupId).concat(ungroupedLayers),
            selectedLayerIds: group.children
          }
        }
        return p
      })
      
      const action: HistoryAction = {
        id: `${Date.now()}`,
        type: 'ungroup',
        layerId: groupId
      }
      
      return {
        projects,
        history: [...state.history.slice(0, state.historyIndex + 1), action],
        historyIndex: state.historyIndex + 1
      }
    })
  },
  
  duplicateLayer: (projectId, layerId) => {
    set((state) => {
      let duplicatedLayer: Layer | undefined
      
      const projects = state.projects.map(p => {
        if (p.id === projectId) {
          const layer = p.layers.find(l => l.id === layerId)
          if (!layer) return p
          
          duplicatedLayer = {
            ...layer,
            id: `${Date.now()}`,
            name: `${layer.name} 副本`,
            transform: {
              ...layer.transform,
              x: layer.transform.x + 20,
              y: layer.transform.y + 20
            }
          }
          
          return {
            ...p,
            layers: [...p.layers, duplicatedLayer],
            selectedLayerIds: [duplicatedLayer.id]
          }
        }
        return p
      })
      
      const action: HistoryAction = {
        id: `${Date.now()}`,
        type: 'create',
        layerId: duplicatedLayer?.id,
        newState: duplicatedLayer
      }
      
      return {
        projects,
        history: [...state.history.slice(0, state.historyIndex + 1), action],
        historyIndex: state.historyIndex + 1
      }
    })
  },
  
  moveLayer: (projectId, layerId, targetIndex) => {
    set((state) => {
      const projects = state.projects.map(p => {
        if (p.id === projectId) {
          const layers = [...p.layers]
          const currentIndex = layers.findIndex(l => l.id === layerId)
          if (currentIndex === -1 || currentIndex === targetIndex) return p
          
          const [removed] = layers.splice(currentIndex, 1)
          layers.splice(targetIndex, 0, removed)
          
          return { ...p, layers }
        }
        return p
      })
      
      return { projects }
    })
  },
  
  createComponent: (name, baseLayerId, properties) => {
    set((state) => {
      const newComponent: Component = {
        id: `${Date.now()}`,
        name,
        variants: [],
        baseLayerId,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
      
      const newProperties = properties.map((p, index) => ({
        ...p,
        id: `${newComponent.id}-prop-${index}`
      }))
      
      return {
        components: [...state.components, newComponent],
        componentProperties: [...state.componentProperties, ...newProperties]
      }
    })
  },
  
  addVariant: (componentId, name, propertyValues, layerId) => {
    set((state) => ({
      components: state.components.map(c => {
        if (c.id === componentId) {
          const newVariant: ComponentVariant = {
            id: `${Date.now()}`,
            name,
            propertyValues,
            layerId
          }
          return {
            ...c,
            variants: [...c.variants, newVariant],
            updatedAt: Date.now()
          }
        }
        return c
      })
    }))
  },
  
  updateVariant: (componentId, variantId, updates) => {
    set((state) => ({
      components: state.components.map(c => {
        if (c.id === componentId) {
          return {
            ...c,
            variants: c.variants.map(v => 
              v.id === variantId ? { ...v, ...updates } : v
            ),
            updatedAt: Date.now()
          }
        }
        return c
      })
    }))
  },
  
  deleteVariant: (componentId, variantId) => {
    set((state) => ({
      components: state.components.map(c => {
        if (c.id === componentId) {
          return {
            ...c,
            variants: c.variants.filter(v => v.id !== variantId),
            updatedAt: Date.now()
          }
        }
        return c
      })
    }))
  },
  
  addComponentProperty: (property) => {
    set((state) => ({
      componentProperties: [...state.componentProperties, { ...property, id: `${Date.now()}` }]
    }))
  },
  
  updateComponentProperty: (propertyId, updates) => {
    set((state) => ({
      componentProperties: state.componentProperties.map(p => 
        p.id === propertyId ? { ...p, ...updates } : p
      )
    }))
  },
  
  deleteComponentProperty: (propertyId) => {
    set((state) => ({
      componentProperties: state.componentProperties.filter(p => p.id !== propertyId)
    }))
  },
  
  createInstance: (projectId, componentId, variantId, x, y) => {
    set((state) => {
      const component = state.components.find(c => c.id === componentId)
      if (!component) return state
      
      const variant = component.variants.find(v => v.id === variantId)
      const sourceLayerId = variant?.layerId || component.baseLayerId
      const sourceLayer = state.projects
        .flatMap(p => p.layers)
        .find(l => l.id === sourceLayerId)
      
      if (!sourceLayer) return state
      
      const instanceLayer: Layer = {
        ...sourceLayer,
        id: `${Date.now()}`,
        type: 'component',
        name: `${component.name} 实例`,
        transform: { ...sourceLayer.transform, x, y },
        metadata: {
          ...sourceLayer.metadata,
          componentId,
          variantId,
          isInstance: true
        }
      }
      
      return {
        projects: state.projects.map(p => 
          p.id === projectId 
            ? { ...p, layers: [...p.layers, instanceLayer] }
            : p
        )
      }
    })
  },
  
  }))

export function exportProject(projects: Project[], projectId: string, format: 'json' | 'png' | 'svg'): string | null {
  const project = projects.find(p => p.id === projectId)
  if (!project) return null
  
  switch (format) {
    case 'json':
      return JSON.stringify(project, null, 2)
    case 'png':
      return null
    case 'svg':
      return generateSVG(project)
    default:
      return null
  }
}

function generateSVG(project: Project): string {
  const layers = project.layers.filter(l => l.visible)
  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">\n`
  
  layers.forEach(layer => {
    switch (layer.type) {
      case 'rectangle': {
        const width = layer.metadata.width || 200
        const height = layer.metadata.height || 100
        const fill = layer.style.fills.find(f => f.visible)
        const stroke = layer.style.strokes.find(s => s.width > 0)
        
        svgContent += `  <rect x="${layer.transform.x}" y="${layer.transform.y}" width="${width}" height="${height}" `
        if (fill?.color) {
          svgContent += `fill="rgba(${fill.color.r},${fill.color.g},${fill.color.b},${fill.color.a})" `
        }
        if (stroke) {
          svgContent += `stroke="rgba(${stroke.color.r},${stroke.color.g},${stroke.color.b},${stroke.color.a})" stroke-width="${stroke.width}" `
        }
        svgContent += `/>\n`
        break
      }
      case 'ellipse': {
        const width = layer.metadata.width || 100
        const height = layer.metadata.height || 100
        const fill = layer.style.fills.find(f => f.visible)
        const stroke = layer.style.strokes.find(s => s.width > 0)
        
        svgContent += `  <ellipse cx="${layer.transform.x + width/2}" cy="${layer.transform.y + height/2}" rx="${width/2}" ry="${height/2}" `
        if (fill?.color) {
          svgContent += `fill="rgba(${fill.color.r},${fill.color.g},${fill.color.b},${fill.color.a})" `
        }
        if (stroke) {
          svgContent += `stroke="rgba(${stroke.color.r},${stroke.color.g},${stroke.color.b},${stroke.color.a})" stroke-width="${stroke.width}" `
        }
        svgContent += `/>\n`
        break
      }
      case 'frame': {
        const width = layer.metadata.width || 800
        const height = layer.metadata.height || 600
        svgContent += `  <rect x="${layer.transform.x}" y="${layer.transform.y}" width="${width}" height="${height}" fill="white" stroke="#e5e7eb" stroke-width="1"/>\n`
        break
      }
    }
  })
  
  svgContent += `</svg>`
  return svgContent
}

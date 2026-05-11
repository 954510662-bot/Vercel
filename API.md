# CodeBrush API 文档

## 概述

CodeBrush 是一个基于 React 的专业设计工具，提供完整的图形编辑能力。本文档描述了项目的核心 API 和状态管理接口。

---

## 状态管理 API

### useStore

Zustand store 提供的核心状态管理接口。

```typescript
const { 
  projects, 
  currentProjectId, 
  currentTool, 
  components,
  // ... 方法
} = useStore()
```

### 项目管理

#### createProject

创建新项目。

```typescript
createProject(name: string) => void
```

**参数**:
- `name`: 项目名称 (string)

**示例**:
```typescript
createProject('我的设计')
```

#### getCurrentProject

获取当前活跃项目。

```typescript
getCurrentProject() => Project | undefined
```

**返回**: 当前项目对象或 undefined

---

### 图层操作

#### addLayer

添加新图层。

```typescript
addLayer(projectId: string, layer: Layer) => void
```

**参数**:
- `projectId`: 项目 ID (string)
- `layer`: 图层对象 (Layer)

**Layer 类型**:
```typescript
interface Layer {
  id: string
  type: LayerType
  name: string
  parentId: string | null
  children: string[]
  transform: Transform
  style: LayerStyle
  locked: boolean
  visible: boolean
  opacity: number
  blendMode: BlendMode
  metadata: Record<string, any>
}
```

#### updateLayer

更新图层属性。

```typescript
updateLayer(projectId: string, layerId: string, updates: Partial<Layer>) => void
```

**参数**:
- `projectId`: 项目 ID (string)
- `layerId`: 图层 ID (string)
- `updates`: 要更新的属性 (Partial<Layer>)

**示例**:
```typescript
updateLayer('project-1', 'layer-1', { 
  name: '新名称', 
  opacity: 0.5 
})
```

#### deleteLayer

删除图层。

```typescript
deleteLayer(projectId: string, layerId: string) => void
```

**参数**:
- `projectId`: 项目 ID (string)
- `layerId`: 图层 ID (string)

#### selectLayers

选择图层。

```typescript
selectLayers(projectId: string, layerIds: string[]) => void
```

**参数**:
- `projectId`: 项目 ID (string)
- `layerIds`: 图层 ID 数组 (string[])

#### groupLayers

将多个图层分组。

```typescript
groupLayers(projectId: string, layerIds: string[]) => void
```

**参数**:
- `projectId`: 项目 ID (string)
- `layerIds`: 要分组的图层 ID 数组 (string[])

#### ungroupLayer

取消图层分组。

```typescript
ungroupLayer(projectId: string, groupId: string) => void
```

**参数**:
- `projectId`: 项目 ID (string)
- `groupId`: 组图层 ID (string)

#### duplicateLayer

复制图层。

```typescript
duplicateLayer(projectId: string, layerId: string) => void
```

**参数**:
- `projectId`: 项目 ID (string)
- `layerId`: 要复制的图层 ID (string)

---

### 工具操作

#### selectTool

选择当前工具。

```typescript
selectTool(tool: ToolType) => void
```

**ToolType**:
```typescript
type ToolType = 
  | 'select'
  | 'rectangle'
  | 'ellipse'
  | 'polygon'
  | 'line'
  | 'pen'
  | 'text'
  | 'frame'
  | 'hand'
  | 'zoom'
```

**示例**:
```typescript
selectTool('rectangle')
```

---

### 历史记录

#### undo

撤销上一步操作。

```typescript
undo() => void
```

#### redo

重做上一步撤销的操作。

```typescript
redo() => void
```

---

### 视口管理

#### updateViewport

更新视口设置。

```typescript
updateViewport(projectId: string, viewport: Partial<Viewport>) => void
```

**Viewport 类型**:
```typescript
interface Viewport {
  x: number        // 水平偏移
  y: number        // 垂直偏移
  zoom: number     // 缩放级别
}
```

**示例**:
```typescript
updateViewport('project-1', { zoom: 2 })
```

---

### 组件系统

#### createComponent

创建组件。

```typescript
createComponent(name: string, baseLayerId: string, properties: ComponentProperty[]) => void
```

**参数**:
- `name`: 组件名称 (string)
- `baseLayerId`: 基础图层 ID (string)
- `properties`: 属性定义数组 (ComponentProperty[])

**ComponentProperty**:
```typescript
interface ComponentProperty {
  id: string
  name: string
  type: 'text' | 'number' | 'boolean' | 'select'
  options?: string[]
  defaultValue: string | number | boolean
}
```

#### addVariant

添加组件变体。

```typescript
addVariant(componentId: string, name: string, propertyValues: Record<string, string>, layerId: string) => void
```

**参数**:
- `componentId`: 组件 ID (string)
- `name`: 变体名称 (string)
- `propertyValues`: 属性值映射 (Record<string, string>)
- `layerId`: 变体对应的图层 ID (string)

#### updateVariant

更新组件变体。

```typescript
updateVariant(componentId: string, variantId: string, updates: Partial<ComponentVariant>) => void
```

#### deleteVariant

删除组件变体。

```typescript
deleteVariant(componentId: string, variantId: string) => void
```

#### createInstance

创建组件实例。

```typescript
createInstance(projectId: string, componentId: string, variantId: string, x: number, y: number) => void
```

**参数**:
- `projectId`: 目标项目 ID (string)
- `componentId`: 组件 ID (string)
- `variantId`: 变体 ID (string)
- `x`: X 坐标 (number)
- `y`: Y 坐标 (number)

---

## 类型定义

### LayerType

图层类型枚举。

```typescript
type LayerType = 
  | 'frame'
  | 'group'
  | 'rectangle'
  | 'ellipse'
  | 'polygon'
  | 'line'
  | 'path'
  | 'text'
  | 'image'
  | 'component'
  | 'boolean'
```

### BlendMode

混合模式枚举。

```typescript
type BlendMode = 
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion'
  | 'hue'
  | 'saturation'
  | 'color'
  | 'luminosity'
```

### Transform

变换属性。

```typescript
interface Transform {
  x: number        // X 位置
  y: number        // Y 位置
  scaleX: number   // X 缩放
  scaleY: number   // Y 缩放
  rotation: number // 旋转角度
  skewX: number    // X 倾斜
  skewY: number    // Y 倾斜
}
```

### LayerStyle

图层样式。

```typescript
interface LayerStyle {
  fills: Fill[]    // 填充样式
  strokes: Stroke[] // 描边样式
  effects: Effect[] // 效果
}
```

### Fill

填充样式。

```typescript
interface Fill {
  type: 'solid' | 'gradient' | 'pattern'
  color?: RGBA
  visible: boolean
}
```

### Stroke

描边样式。

```typescript
interface Stroke {
  color: RGBA
  width: number
  style: 'solid' | 'dashed' | 'dotted'
  cap: 'butt' | 'round' | 'square'
  join: 'miter' | 'round' | 'bevel'
  position: 'center' | 'inside' | 'outside'
}
```

### Effect

效果。

```typescript
interface Effect {
  type: 'shadow' | 'blur'
  params: ShadowParams | BlurParams
  visible: boolean
}
```

### RGBA

颜色值。

```typescript
interface RGBA {
  r: number // 红色 (0-255)
  g: number // 绿色 (0-255)
  b: number // 蓝色 (0-255)
  a: number // 透明度 (0-1)
}
```

---

## 导出功能

### exportProject

导出项目数据。

```typescript
exportProject(projects: Project[], projectId: string, format: 'json' | 'png' | 'svg') => string | null
```

**参数**:
- `projects`: 项目数组 (Project[])
- `projectId`: 项目 ID (string)
- `format`: 导出格式 (json | png | svg)

**返回**: 导出的字符串内容或 null

**示例**:
```typescript
const svgContent = exportProject(projects, 'project-1', 'svg')
```

---

## 使用示例

### 完整示例

```typescript
import { useStore } from './store'

function MyComponent() {
  const { 
    currentProject, 
    addLayer, 
    updateLayer, 
    selectTool,
    undo,
    redo 
  } = useStore()

  const handleAddRectangle = () => {
    const newLayer = {
      id: 'rect-1',
      type: 'rectangle',
      name: '矩形',
      parentId: null,
      children: [],
      transform: { x: 100, y: 100, scaleX: 1, scaleY: 1, rotation: 0, skewX: 0, skewY: 0 },
      style: { 
        fills: [{ type: 'solid', color: { r: 255, g: 0, b: 0, a: 1 }, visible: true }],
        strokes: [],
        effects: []
      },
      locked: false,
      visible: true,
      opacity: 1,
      blendMode: 'normal',
      metadata: { width: 200, height: 100 }
    }
    
    addLayer(currentProject.id, newLayer)
  }

  return (
    <div>
      <button onClick={handleAddRectangle}>添加矩形</button>
      <button onClick={() => selectTool('rectangle')}>选择矩形工具</button>
      <button onClick={undo}>撤销</button>
      <button onClick={redo}>重做</button>
    </div>
  )
}
```

---

## 注意事项

1. **状态更新**: 所有状态修改方法都会自动触发组件重渲染
2. **历史记录**: 图层的创建、更新、删除操作都会自动记录到历史中
3. **异步操作**: 当前版本所有操作均为同步操作
4. **错误处理**: 建议在调用方法前检查项目是否存在
5. **性能考虑**: 对于大量图层操作，建议批量处理
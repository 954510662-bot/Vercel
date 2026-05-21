# CodeBrush Component Documentation

This document provides usage instructions and API reference for the core components of the CodeBrush design tool.

---

## 📋 Table of Contents

1. [Component Overview](#component-overview)
2. [Core Components](#core-components)
   - [Editor](#editor)
   - [Toolbar](#toolbar)
   - [LayersPanel](#layerspanel)
3. [UI Components](#ui-components)
   - [Button](#button)
   - [Input](#input)
4. [Custom Hooks](#custom-hooks)
5. [State Management](#state-management)

---

## Component Overview

### Component Architecture

```
App
├── Toolbar                    # Toolbar
├── MainLayout
│   ├── LayersPanel           # Layers Panel
│   └── MainContent
│       ├── Editor            # Canvas Editor
│       └── PropertiesPanel   # Properties Panel
└── ExportModal               # Export Modal
```

---

## Core Components

### Editor

The canvas editor is the core of the application, responsible for rendering the design canvas and handling user interactions.

#### File Location

```
src/components/Editor.tsx
```

#### Features

- Canvas rendering engine
- Layer drawing (rectangle, ellipse, text, image)
- Mouse event handling
- Drag-to-create shapes
- Viewport zoom and pan

#### Usage Example

```tsx
import { Editor } from './components/Editor'

function App() {
  return (
    <div className="h-screen">
      <Editor />
    </div>
  )
}
```

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `className` | `string` | No | Custom CSS class |

#### Internal State

- Current project layers list
- Viewport position and zoom
- Currently selected layers
- Mouse state (pressed, position)

#### Lifecycle

1. **On Mount**: Initialize Canvas context, read current project
2. **On Layer Change**: Re-render Canvas
3. **On Unmount**: Clean up event listeners

---

### Toolbar

Toolbar component providing drawing tool selection and common operations.

#### File Location

```
src/components/Toolbar.tsx
```

#### Features

- Tool selection (Select, Rectangle, Ellipse, Polygon, etc.)
- Undo/Redo operations
- New project creation
- Export functionality (PNG, SVG, JSON)

#### Usage Example

```tsx
import Toolbar from './components/Toolbar'

function App() {
  return (
    <div className="flex h-screen">
      <Toolbar />
      <Editor />
    </div>
  )
}
```

#### Tool List

| Tool | Icon | Shortcut | Description |
|------|------|----------|-------------|
| Select Tool | MousePointer2 | V | Select and move layers |
| Rectangle Tool | Square | R | Draw rectangles |
| Ellipse Tool | Circle | O | Draw ellipses |
| Polygon Tool | Triangle | Y | Draw polygons |
| Line Tool | Minus | L | Draw straight lines |
| Pen Tool | PenTool | P | Bezier curves |
| Text Tool | Type | T | Add text |
| Frame Tool | LayoutGrid | F | Create frames |
| Hand Tool | Hand | H | Pan canvas |
| Zoom Tool | ZoomIn | Z | Zoom view |

#### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+Z | Undo |
| Ctrl+Y | Redo |
| Ctrl+S | Save project |
| Delete | Delete selected layers |
| Ctrl+G | Group selected layers |
| Ctrl+Shift+G | Ungroup layers |

---

### LayersPanel

Layers panel displaying and managing all layers in the project.

#### File Location

```
src/components/LayersPanel.tsx
```

#### Features

- Layer list display
- Layer selection
- Layer visibility toggle
- Layer locking
- Layer renaming
- Layer sorting (drag)
- Layer deletion

#### Usage Example

```tsx
import LayersPanel from './components/LayersPanel'

function App() {
  return (
    <div className="flex h-screen">
      <LayersPanel />
      <Editor />
    </div>
  )
}
```

#### Layer Operations

| Operation | Method | Description |
|-----------|--------|-------------|
| Select Layer | `selectLayers(ids)` | Select specified layers |
| Show/Hide | `layer.visible` | Toggle visibility |
| Lock/Unlock | `layer.locked` | Toggle lock state |
| Delete | `deleteLayer(id)` | Delete layer |

---

## UI Components

### Button

Universal button component.

#### File Location

```
src/components/ui/Button.tsx
```

#### Features

- Multiple variants (primary, secondary, outline, ghost, danger)
- Multiple sizes (sm, md, lg)
- Disabled state support
- Loading state support

#### Usage Example

```tsx
import { Button } from './components/ui/Button'

// Basic usage
<Button>Click Me</Button>

// Primary button
<Button variant="primary">Primary Action</Button>

// Disabled button
<Button disabled>Disabled</Button>

// Danger action
<Button variant="danger">Delete</Button>

// With icon
<Button icon={<SaveIcon />}>Save</Button>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger'` | `'primary'` | Button style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `disabled` | `boolean` | `false` | Whether disabled |
| `loading` | `boolean` | `false` | Loading state |
| `icon` | `ReactNode` | - | Button icon |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Icon position |

---

### Input

Input component.

#### File Location

```
src/components/ui/Input.tsx
```

#### Features

- Text input
- Label display
- Error message
- Disabled state
- Custom styles

#### Usage Example

```tsx
import { Input } from './components/ui/Input'

// Basic input
<Input placeholder="Enter content" />

// With label
<Input label="Username" placeholder="Enter username" />

// Error state
<Input 
  label="Email" 
  error="Please enter a valid email address"
  placeholder="example@email.com" 
/>

// Disabled state
<Input label="Readonly" disabled value="Cannot modify" />
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Input label |
| `placeholder` | `string` | - | Placeholder text |
| `error` | `string` | - | Error message |
| `disabled` | `boolean` | `false` | Whether disabled |
| `value` | `string` | - | Input value (controlled) |
| `onChange` | `(e: ChangeEvent) => void` | - | Value change callback |
| `className` | `string` | - | Custom styles |

---

## Custom Hooks

### useShortcuts

Keyboard shortcut management.

#### File Location

```
src/hooks/useShortcuts.ts
```

#### Usage Example

```tsx
import { useShortcuts } from './hooks/useShortcuts'

function MyComponent() {
  useShortcuts({
    onUndo: () => undo(),
    onRedo: () => redo(),
    onDelete: () => deleteSelection(),
    onCopy: () => copySelection(),
    onPaste: () => pasteSelection(),
    onSelectAll: () => selectAll(),
    onGroup: () => groupSelection(),
    onUngroup: () => ungroupSelection()
  })
  
  return <div>Use keyboard shortcuts</div>
}
```

#### Parameters

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onUndo` | `() => void` | No | Undo callback |
| `onRedo` | `() => void` | No | Redo callback |
| `onDelete` | `() => void` | No | Delete callback |
| `onCopy` | `() => void` | No | Copy callback |
| `onPaste` | `() => void` | No | Paste callback |
| `onSelectAll` | `() => void` | No | Select all callback |
| `onGroup` | `() => void` | No | Group callback |
| `onUngroup` | `() => void` | No | Ungroup callback |

---

### useWebVitals

Web Vitals performance monitoring.

#### File Location

```
src/hooks/useWebVitals.ts
```

#### Usage Example

```tsx
import { useWebVitals } from './hooks/useWebVitals'

function App() {
  useWebVitals()
  
  return <Editor />
}
```

#### Monitored Metrics

| Metric | Name | Target |
|--------|------|--------|
| LCP | Largest Contentful Paint | < 2.5s |
| FID | First Input Delay | < 100ms |
| CLS | Cumulative Layout Shift | < 0.1 |
| FCP | First Contentful Paint | < 1.8s |
| TTFB | Time to First Byte | < 800ms |
| INP | Interaction to Next Paint | < 200ms |

---

## State Management

### useStore

Global state management using Zustand.

#### File Location

```
src/store/index.ts
```

#### Usage Example

```tsx
import { useStore } from './store'

function MyComponent() {
  const { 
    projects,           // Project list
    currentTool,        // Current tool
    selectTool,         // Select tool
    createProject,       // Create project
    addLayer,           // Add layer
    updateLayer,        // Update layer
    deleteLayer,        // Delete layer
    undo,               // Undo
    redo                // Redo
  } = useStore()
  
  // Use state and methods
}
```

#### Project Management

```tsx
// Create project
createProject('New Project')

// Get current project
const currentProject = projects.find(p => p.id === currentProjectId)

// Get project layers
const layers = currentProject?.layers || []
```

#### Layer Operations

```tsx
// Add layer
addLayer(projectId, {
  id: 'layer-1',
  type: 'rectangle',
  name: 'Rectangle 1',
  transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0, skewX: 0, skewY: 0 },
  style: { fills: [], strokes: [], effects: [] },
  metadata: { width: 100, height: 100 }
})

// Update layer
updateLayer(projectId, layerId, { 
  transform: { x: 100, y: 100 } 
})

// Delete layer
deleteLayer(projectId, layerId)

// Select layers
selectLayers(projectId, ['layer-1', 'layer-2'])

// Group
groupLayers(projectId, ['layer-1', 'layer-2'])

// Ungroup
ungroupLayer(projectId, groupId)

// Duplicate layer
duplicateLayer(projectId, layerId)
```

---

## Type Definitions

### LayerType

Supported layer types:

```typescript
type LayerType = 
  | 'frame'     // Frame
  | 'group'     // Group
  | 'rectangle' // Rectangle
  | 'ellipse'   // Ellipse
  | 'polygon'   // Polygon
  | 'line'      // Line
  | 'path'      // Path
  | 'text'      // Text
  | 'image'     // Image
  | 'component' // Component
  | 'boolean'   // Boolean operation
```

### ToolType

Supported tool types:

```typescript
type ToolType = 
  | 'select'    // Select
  | 'rectangle' // Rectangle
  | 'ellipse'   // Ellipse
  | 'polygon'   // Polygon
  | 'line'      // Line
  | 'pen'       // Pen
  | 'text'      // Text
  | 'frame'     // Frame
  | 'hand'      // Hand
  | 'zoom'      // Zoom
```

---

**Last Updated**: 2026-05-12

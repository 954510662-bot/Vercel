export interface LayerMetadata {
  width?: number
  height?: number
  radius?: number
  sides?: number
  endX?: number
  endY?: number
  componentId?: string
  variantId?: string
  isInstance?: boolean
  [key: string]: unknown
}

export interface Layer {
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
  metadata: LayerMetadata
  isMask?: boolean
  maskId?: string
  clipContent?: boolean
}

export type LayerType = 
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

export interface Transform {
  x: number
  y: number
  scaleX: number
  scaleY: number
  rotation: number
  skewX: number
  skewY: number
}

export interface LayerStyle {
  fills: Fill[]
  strokes: Stroke[]
  effects: Effect[]
}

export interface Fill {
  type: 'solid' | 'gradient' | 'pattern'
  color?: RGBA
  gradient?: Gradient
  pattern?: Pattern
  visible: boolean
}

export interface Stroke {
  color: RGBA
  width: number
  style: 'solid' | 'dashed' | 'dotted'
  cap: 'butt' | 'round' | 'square'
  join: 'miter' | 'round' | 'bevel'
  position: 'inside' | 'outside' | 'center'
}

export interface Effect {
  type: 'shadow' | 'blur' | 'overlay'
  params: ShadowParams | BlurParams | OverlayParams
  visible: boolean
}

export interface RGBA {
  r: number
  g: number
  b: number
  a: number
}

export interface Gradient {
  type: 'linear' | 'radial' | 'angle'
  stops: GradientStop[]
}

export interface GradientStop {
  offset: number
  color: RGBA
}

export interface Pattern {
  src: string
  scale: number
}

export interface ShadowParams {
  color: RGBA
  blur: number
  offsetX: number
  offsetY: number
  inner: boolean
}

export interface BlurParams {
  radius: number
  type: 'gaussian' | 'motion'
}

export interface OverlayParams {
  color: RGBA
  blendMode: BlendMode
}

export type BlendMode = 
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

export type ToolType = 
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

export interface Project {
  id: string
  name: string
  description?: string
  layers: Layer[]
  selectedLayerIds: string[]
  viewport: Viewport
}

export interface Viewport {
  x: number
  y: number
  zoom: number
}

export interface HistoryAction {
  id: string
  type: 'create' | 'update' | 'delete' | 'move' | 'group' | 'ungroup'
  layerId?: string
  layerIds?: string[]
  previousState?: Layer
  newState?: Layer
  groupId?: string
}

export interface TextStyle {
  fontFamily: string
  fontSize: number
  fontWeight: 'normal' | 'bold' | 'light' | 'medium' | 'semibold'
  textAlign: 'left' | 'center' | 'right' | 'justify'
  lineHeight: number | 'auto'
  letterSpacing: number
  textDecoration: 'none' | 'underline' | 'line-through'
  verticalAlign: 'top' | 'middle' | 'bottom'
  color: RGBA
}

export interface FrameInfo {
  width: number
  height: number
  background: Fill
  guides: Guide[]
}

export interface Guide {
  id: string
  type: 'horizontal' | 'vertical'
  position: number
}

export interface PathData {
  commands: PathCommand[]
}

export interface PathCommand {
  type: 'M' | 'L' | 'C' | 'Q' | 'Z'
  points: number[]
}

export interface Component {
  id: string
  name: string
  description?: string
  thumbnail?: string
  variants: ComponentVariant[]
  baseLayerId: string
  createdAt: number
  updatedAt: number
}

export interface ComponentVariant {
  id: string
  name: string
  propertyValues: Record<string, string>
  layerId: string
}

export interface ComponentProperty {
  id: string
  name: string
  type: 'text' | 'number' | 'boolean' | 'select'
  options?: string[]
  defaultValue: string | number | boolean
}

export interface Instance {
  componentId: string
  variantId?: string
  overrides: Record<string, string | number | boolean | unknown>
}

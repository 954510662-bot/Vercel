import { useStore } from '../store'
import { BlendMode, Fill, Stroke, Effect, ShadowParams, BlurParams, Layer } from '../types'

function PropertiesPanel() {
  const { projects, currentProjectId, updateLayer } = useStore()
  const currentProject = projects.find(p => p.id === currentProjectId)
  
  const selectedLayer = currentProject?.layers.find((layer: Layer) => 
    currentProject.selectedLayerIds.includes(layer.id)
  )

  if (!selectedLayer) {
    return (
      <div className="h-full flex flex-col">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">属性</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400 text-sm">选择一个图层查看属性</p>
        </div>
      </div>
    )
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateLayer(currentProject!.id, selectedLayer.id, { name: e.target.value })
  }

  const handleTransformChange = (field: string, value: number) => {
    updateLayer(currentProject!.id, selectedLayer.id, {
      transform: { ...selectedLayer.transform, [field]: value }
    })
  }

  const handleFillChange = (fill: Fill) => {
    updateLayer(currentProject!.id, selectedLayer.id, {
      style: { ...selectedLayer.style, fills: [fill] }
    })
  }

  const handleStrokeChange = (stroke: Stroke) => {
    updateLayer(currentProject!.id, selectedLayer.id, {
      style: { ...selectedLayer.style, strokes: [stroke] }
    })
  }

  const handleEffectChange = (effects: Effect[]) => {
    updateLayer(currentProject!.id, selectedLayer.id, {
      style: { ...selectedLayer.style, effects }
    })
  }

  const handleBlendModeChange = (blendMode: BlendMode) => {
    updateLayer(currentProject!.id, selectedLayer.id, { blendMode })
  }

  const blendModes: BlendMode[] = [
    'normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten',
    'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference',
    'exclusion', 'hue', 'saturation', 'color', 'luminosity'
  ]

  const currentFill = selectedLayer.style.fills[0] || { type: 'solid', visible: true }
  const currentStroke = selectedLayer.style.strokes[0]
  const currentShadow = selectedLayer.style.effects.find((e: Effect) => e.type === 'shadow')
  const currentBlur = selectedLayer.style.effects.find((e: Effect) => e.type === 'blur')

  return (
    <div className="h-full flex flex-col overflow-y-auto">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="font-semibold text-gray-800">属性</h2>
      </div>
      
      <div className="flex-1 p-4 space-y-6">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">名称</label>
          <input
            type="text"
            value={selectedLayer.name}
            onChange={handleNameChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">变换</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-1">X</label>
              <input
                type="number"
                value={Math.round(selectedLayer.transform.x)}
                onChange={(e) => handleTransformChange('x', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Y</label>
              <input
                type="number"
                value={Math.round(selectedLayer.transform.y)}
                onChange={(e) => handleTransformChange('y', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">宽度</label>
              <input
                type="number"
                value={selectedLayer.metadata.width || 200}
                onChange={(e) => updateLayer(currentProject!.id, selectedLayer.id, {
                  metadata: { ...selectedLayer.metadata, width: parseFloat(e.target.value) || 0 }
                })}
                className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">高度</label>
              <input
                type="number"
                value={selectedLayer.metadata.height || 100}
                onChange={(e) => updateLayer(currentProject!.id, selectedLayer.id, {
                  metadata: { ...selectedLayer.metadata, height: parseFloat(e.target.value) || 0 }
                })}
                className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">旋转</label>
              <input
                type="number"
                value={selectedLayer.transform.rotation}
                onChange={(e) => handleTransformChange('rotation', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">不透明度</label>
              <input
                type="number"
                value={Math.round(selectedLayer.opacity * 100)}
                onChange={(e) => updateLayer(currentProject!.id, selectedLayer.id, { opacity: (parseFloat(e.target.value) || 0) / 100 })}
                className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">填充</label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <select
                value={currentFill.type}
                onChange={(e) => handleFillChange({ type: e.target.value as 'solid' | 'gradient' | 'pattern', visible: true })}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
              >
                <option value="solid">纯色</option>
                <option value="gradient">渐变</option>
                <option value="pattern">图案</option>
              </select>
            </div>
            {currentFill.type === 'solid' && currentFill.color && (
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentFill.color ? `#${currentFill.color.r.toString(16).padStart(2, '0')}${currentFill.color.g.toString(16).padStart(2, '0')}${currentFill.color.b.toString(16).padStart(2, '0')}` : '#ffffff'}
                  onChange={(e) => {
                    const color = e.target.value
                    const hex = color.replace('#', '')
                    const r = parseInt(hex.substring(0, 2), 16)
                    const g = parseInt(hex.substring(2, 4), 16)
                    const b = parseInt(hex.substring(4, 6), 16)
                    handleFillChange({ ...currentFill, color: { r, g, b, a: currentFill.color?.a || 1 } })
                  }}
                  className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="text-xs text-gray-500">RGB</div>
                  <div className="text-xs text-gray-700">
                    {currentFill.color ? `(${currentFill.color.r}, ${currentFill.color.g}, ${currentFill.color.b})` : '无'}
                  </div>
                </div>
              </div>
            )}
            {(selectedLayer.type === 'rectangle' || selectedLayer.type === 'frame') && (
              <div>
                <label className="block text-xs text-gray-500 mb-1">圆角</label>
                <input
                  type="number"
                  value={selectedLayer.metadata.radius || 0}
                  onChange={(e) => updateLayer(currentProject!.id, selectedLayer.id, {
                    metadata: { ...selectedLayer.metadata, radius: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">描边</label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentStroke?.color 
                  ? `#${currentStroke.color.r.toString(16).padStart(2, '0')}${currentStroke.color.g.toString(16).padStart(2, '0')}${currentStroke.color.b.toString(16).padStart(2, '0')}`
                  : '#000000'}
                onChange={(e) => {
                  const color = e.target.value
                  const hex = color.replace('#', '')
                  const r = parseInt(hex.substring(0, 2), 16)
                  const g = parseInt(hex.substring(2, 4), 16)
                  const b = parseInt(hex.substring(4, 6), 16)
                  handleStrokeChange({
                    ...(currentStroke || { color: { r: 0, g: 0, b: 0, a: 1 }, width: 1, style: 'solid', cap: 'butt', join: 'miter', position: 'center' }),
                    color: { r, g, b, a: currentStroke?.color?.a || 1 }
                  })
                }}
                className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
              />
              <div className="flex-1">
                <div className="text-xs text-gray-500">颜色</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">宽度</label>
                <input
                  type="number"
                  value={currentStroke?.width || 1}
                  onChange={(e) => handleStrokeChange({
                    ...(currentStroke || { color: { r: 0, g: 0, b: 0, a: 1 }, width: 1, style: 'solid', cap: 'butt', join: 'miter', position: 'center' }),
                    width: parseFloat(e.target.value) || 0
                  })}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">样式</label>
                <select
                  value={currentStroke?.style || 'solid'}
                  onChange={(e) => handleStrokeChange({
                    ...(currentStroke || { color: { r: 0, g: 0, b: 0, a: 1 }, width: 1, style: 'solid', cap: 'butt', join: 'miter', position: 'center' }),
                    style: e.target.value as 'solid' | 'dashed' | 'dotted'
                  })}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                >
                  <option value="solid">实线</option>
                  <option value="dashed">虚线</option>
                  <option value="dotted">点线</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">效果</label>
          <div className="space-y-3">
            <div className="border border-gray-200 rounded p-2">
              <label className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                <input
                  type="checkbox"
                  checked={!!currentShadow}
                  onChange={(e) => {
                    if (e.target.checked) {
                      const shadowParams: ShadowParams = {
                        color: { r: 0, g: 0, b: 0, a: 0.5 },
                        blur: 10,
                        offsetX: 0,
                        offsetY: 4,
                        inner: false
                      }
                      handleEffectChange([...selectedLayer.style.effects.filter((e: Effect) => e.type !== 'shadow'), { type: 'shadow', params: shadowParams, visible: true }])
                    } else {
                      handleEffectChange(selectedLayer.style.effects.filter((e: Effect) => e.type !== 'shadow'))
                    }
                  }}
                  className="rounded"
                />
                阴影
              </label>
              {currentShadow && (
                <div className="space-y-2 pl-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={((currentShadow.params as ShadowParams).color) 
                        ? `#${((currentShadow.params as ShadowParams).color).r.toString(16).padStart(2, '0')}${((currentShadow.params as ShadowParams).color).g.toString(16).padStart(2, '0')}${((currentShadow.params as ShadowParams).color).b.toString(16).padStart(2, '0')}`
                        : '#000000'}
                      onChange={(e) => {
                        const color = e.target.value
                        const hex = color.replace('#', '')
                        const r = parseInt(hex.substring(0, 2), 16)
                        const g = parseInt(hex.substring(2, 4), 16)
                        const b = parseInt(hex.substring(4, 6), 16)
                        const newEffects = selectedLayer.style.effects.map((e: Effect) => 
                          e.type === 'shadow' 
                            ? { ...e, params: { ...(e.params as ShadowParams), color: { r, g, b, a: ((e.params as ShadowParams).color).a } } }
                            : e
                        )
                        handleEffectChange(newEffects)
                      }}
                      className="w-6 h-6 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="number"
                      value={((currentShadow.params as ShadowParams).blur)}
                      onChange={(event) => {
                        const newValue = parseFloat(event.target.value) || 0
                        const newEffects = selectedLayer.style.effects.map((effect: Effect) => 
                          effect.type === 'shadow' 
                            ? { ...effect, params: { ...(effect.params as ShadowParams), blur: newValue } }
                            : effect
                        )
                        handleEffectChange(newEffects)
                      }}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                      placeholder="模糊"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={((currentShadow.params as ShadowParams).offsetX)}
                      onChange={(e) => {
                        const newEffects = selectedLayer.style.effects.map((effect: Effect) => 
                          effect.type === 'shadow' 
                            ? { ...effect, params: { ...(effect.params as ShadowParams), offsetX: parseFloat(e.target.value) || 0 } }
                            : effect
                        )
                        handleEffectChange(newEffects)
                      }}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                      placeholder="X偏移"
                    />
                    <input
                      type="number"
                      value={((currentShadow.params as ShadowParams).offsetY)}
                      onChange={(e) => {
                        const newEffects = selectedLayer.style.effects.map((effect: Effect) => 
                          effect.type === 'shadow' 
                            ? { ...effect, params: { ...(effect.params as ShadowParams), offsetY: parseFloat(e.target.value) || 0 } }
                            : effect
                        )
                        handleEffectChange(newEffects)
                      }}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                      placeholder="Y偏移"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="border border-gray-200 rounded p-2">
              <label className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                <input
                  type="checkbox"
                  checked={!!currentBlur}
                  onChange={(e) => {
                    if (e.target.checked) {
                      const blurParams: BlurParams = { radius: 10, type: 'gaussian' }
                      handleEffectChange([...selectedLayer.style.effects.filter((e: Effect) => e.type !== 'blur'), { type: 'blur', params: blurParams, visible: true }])
                    } else {
                      handleEffectChange(selectedLayer.style.effects.filter((e: Effect) => e.type !== 'blur'))
                    }
                  }}
                  className="rounded"
                />
                模糊
              </label>
              {currentBlur && (
                <div className="pl-4">
                  <input
                    type="number"
                    value={((currentBlur.params as BlurParams).radius)}
                    onChange={(e) => {
                      const newEffects = selectedLayer.style.effects.map((effect: Effect) => 
                        effect.type === 'blur' 
                          ? { ...effect, params: { ...(effect.params as BlurParams), radius: parseFloat(e.target.value) || 0 } }
                          : effect
                      )
                      handleEffectChange(newEffects)
                    }}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                    placeholder="半径"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">混合模式</label>
          <select
            value={selectedLayer.blendMode}
            onChange={(e) => handleBlendModeChange(e.target.value as BlendMode)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
          >
            {blendModes.map(mode => (
              <option key={mode} value={mode}>{mode}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs text-gray-600">
            <input
              type="checkbox"
              checked={selectedLayer.locked}
              onChange={(e) => updateLayer(currentProject!.id, selectedLayer.id, { locked: e.target.checked })}
              className="rounded"
            />
            锁定
          </label>
          <label className="flex items-center gap-2 text-xs text-gray-600">
            <input
              type="checkbox"
              checked={selectedLayer.visible}
              onChange={(e) => updateLayer(currentProject!.id, selectedLayer.id, { visible: e.target.checked })}
              className="rounded"
            />
            显示
          </label>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">类型</label>
          <div className="px-3 py-2 bg-gray-50 rounded-md text-sm text-gray-600 capitalize">
            {selectedLayer.type}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">ID</label>
          <div className="px-3 py-2 bg-gray-50 rounded-md text-xs text-gray-400 font-mono break-all">
            {selectedLayer.id}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertiesPanel
import { Project } from '../types'

function getProjectDimensions(project: Project): { width: number; height: number } {
  const frameLayer = project.layers.find(l => l.type === 'frame')
  if (frameLayer) {
    return {
      width: frameLayer.metadata.width || 1200,
      height: frameLayer.metadata.height || 800
    }
  }
  
  let maxX = 0
  let maxY = 0
  project.layers.forEach(layer => {
    const right = layer.transform.x + (layer.metadata.width || 0)
    const bottom = layer.transform.y + (layer.metadata.height || 0)
    maxX = Math.max(maxX, right)
    maxY = Math.max(maxY, bottom)
  })
  
  return {
    width: Math.max(maxX, 1200),
    height: Math.max(maxY, 800)
  }
}

export function generateSVG(project: Project): string {
  const { width, height } = getProjectDimensions(project)
  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`
  
  project.layers.forEach(layer => {
    const { x, y } = layer.transform
    const opacity = layer.opacity || 1
    
    switch (layer.type) {
      case 'rectangle':
        const rectWidth = layer.metadata.width || 100
        const rectHeight = layer.metadata.height || 100
        const rectFill = layer.style.fills?.[0]?.color
        const rectStroke = layer.style.strokes?.[0]?.color
        const strokeWidth = layer.style.strokes?.[0]?.width || 0
        
        svgContent += `
          <rect 
            x="${x}" y="${y}" 
            width="${rectWidth}" height="${rectHeight}" 
            fill="${rectFill ? `rgba(${rectFill.r},${rectFill.g},${rectFill.b},${rectFill.a})` : 'transparent'}"
            stroke="${rectStroke ? `rgba(${rectStroke.r},${rectStroke.g},${rectStroke.b},${rectStroke.a})` : 'none'}"
            stroke-width="${strokeWidth}"
            opacity="${opacity}"
          />`
        break
        
      case 'ellipse':
        const circleRadiusX = (layer.metadata.width || 50) / 2
        const circleRadiusY = (layer.metadata.height || 50) / 2
        const circleFill = layer.style.fills?.[0]?.color
        const circleStroke = layer.style.strokes?.[0]?.color
        const circleStrokeWidth = layer.style.strokes?.[0]?.width || 0
        
        svgContent += `
          <ellipse 
            cx="${x + circleRadiusX}" cy="${y + circleRadiusY}" rx="${circleRadiusX}" ry="${circleRadiusY}"
            fill="${circleFill ? `rgba(${circleFill.r},${circleFill.g},${circleFill.b},${circleFill.a})` : 'transparent'}"
            stroke="${circleStroke ? `rgba(${circleStroke.r},${circleStroke.g},${circleStroke.b},${circleStroke.a})` : 'none'}"
            stroke-width="${circleStrokeWidth}"
            opacity="${opacity}"
          />`
        break
        
      case 'text':
        const text = (layer.metadata.text as string) || ''
        const fontSize = (layer.metadata.fontSize as number) || 16
        const fontFamily = (layer.metadata.fontFamily as string) || 'Inter'
        const textColor = layer.style.fills?.[0]?.color
        
        svgContent += `
          <text 
            x="${x}" y="${y + fontSize}" 
            font-size="${fontSize}" 
            font-family="${fontFamily}"
            fill="${textColor ? `rgba(${textColor.r},${textColor.g},${textColor.b},${textColor.a})` : '#000'}"
            opacity="${opacity}"
          >${text}</text>`
        break
        
      case 'image':
        const imgData = layer.metadata.imageData as string
        if (imgData) {
          const imgWidth = layer.metadata.width || 200
          const imgHeight = layer.metadata.height || 150
          svgContent += `
            <image 
              x="${x}" y="${y}" 
              width="${imgWidth}" height="${imgHeight}" 
              href="${imgData}"
              opacity="${opacity}"
            />`
        }
        break
        
      default:
        break
    }
  })
  
  svgContent += '</svg>'
  return svgContent
}

export async function exportToPNG(project: Project, canvas: HTMLCanvasElement): Promise<string> {
  return new Promise((resolve) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      resolve('')
      return
    }
    
    const { width, height } = getProjectDimensions(project)
    canvas.width = width
    canvas.height = height
    ctx.clearRect(0, 0, width, height)
    
    project.layers.forEach(layer => {
      const { x, y } = layer.transform
      ctx.globalAlpha = layer.opacity || 1
      
      switch (layer.type) {
        case 'rectangle':
          const rectWidth = layer.metadata.width || 100
          const rectHeight = layer.metadata.height || 100
          const rectFill = layer.style.fills?.[0]?.color
          const rectStroke = layer.style.strokes?.[0]?.color
          const rectStrokeWidth = layer.style.strokes?.[0]?.width || 0
          
          if (rectFill) {
            ctx.fillStyle = `rgba(${rectFill.r}, ${rectFill.g}, ${rectFill.b}, ${rectFill.a})`
            ctx.fillRect(x, y, rectWidth, rectHeight)
          }
          if (rectStroke && rectStrokeWidth > 0) {
            ctx.strokeStyle = `rgba(${rectStroke.r}, ${rectStroke.g}, ${rectStroke.b}, ${rectStroke.a})`
            ctx.lineWidth = rectStrokeWidth
            ctx.strokeRect(x, y, rectWidth, rectHeight)
          }
          break
          
        case 'ellipse':
          const ellipseWidth = layer.metadata.width || 50
          const ellipseHeight = layer.metadata.height || 50
          const ellipseRadiusX = ellipseWidth / 2
          const ellipseRadiusY = ellipseHeight / 2
          const ellipseFill = layer.style.fills?.[0]?.color
          const ellipseStroke = layer.style.strokes?.[0]?.color
          const ellipseStrokeWidth = layer.style.strokes?.[0]?.width || 0
          
          ctx.beginPath()
          ctx.ellipse(x + ellipseRadiusX, y + ellipseRadiusY, ellipseRadiusX, ellipseRadiusY, 0, 0, Math.PI * 2)
          if (ellipseFill) {
            ctx.fillStyle = `rgba(${ellipseFill.r}, ${ellipseFill.g}, ${ellipseFill.b}, ${ellipseFill.a})`
            ctx.fill()
          }
          if (ellipseStroke && ellipseStrokeWidth > 0) {
            ctx.strokeStyle = `rgba(${ellipseStroke.r}, ${ellipseStroke.g}, ${ellipseStroke.b}, ${ellipseStroke.a})`
            ctx.lineWidth = ellipseStrokeWidth
            ctx.stroke()
          }
          break
          
        case 'text':
          const text = (layer.metadata.text as string) || ''
          const fontSize = (layer.metadata.fontSize as number) || 16
          const fontFamily = (layer.metadata.fontFamily as string) || 'Inter'
          const textColor = layer.style.fills?.[0]?.color
          
          ctx.font = `${fontSize}px ${fontFamily}`
          ctx.fillStyle = textColor ? `rgba(${textColor.r}, ${textColor.g}, ${textColor.b}, ${textColor.a})` : '#000'
          ctx.fillText(text, x, y + fontSize)
          break
          
        case 'image':
          const imgData = layer.metadata.imageData as string
          if (imgData) {
            const imgWidth = layer.metadata.width || 200
            const imgHeight = layer.metadata.height || 150
            const img = new Image()
            img.crossOrigin = 'anonymous'
            img.onload = () => {
              ctx.drawImage(img, x, y, imgWidth, imgHeight)
            }
            img.src = imgData
          }
          break
          
        default:
          break
      }
    })
    
    setTimeout(() => {
      const dataUrl = canvas.toDataURL('image/png')
      resolve(dataUrl)
    }, 100)
  })
}

export function exportToJSON(project: Project): string {
  return JSON.stringify(project, null, 2)
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function downloadAsPNG(project: Project): Promise<void> {
  const canvas = document.createElement('canvas')
  const dataUrl = await exportToPNG(project, canvas)
  if (dataUrl) {
    const base64Data = dataUrl.split(',')[1]
    if (base64Data) {
      downloadFile(base64Data, `${project.name}.png`, 'image/png')
    }
  }
}

export function downloadAsSVG(project: Project): void {
  const svg = generateSVG(project)
  downloadFile(svg, `${project.name}.svg`, 'image/svg+xml')
}

export function downloadAsJSON(project: Project): void {
  const json = exportToJSON(project)
  downloadFile(json, `${project.name}.json`, 'application/json')
}
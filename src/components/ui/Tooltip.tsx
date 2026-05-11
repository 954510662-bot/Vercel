import { ReactNode, useState } from 'react'

export interface TooltipProps {
  content: ReactNode
  children: ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

const placementStyles: Record<string, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2'
}

const arrowPlacementStyles: Record<string, string> = {
  top: 'top-full left-1/2 -translate-x-1/2 border-t-blue-600',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-blue-600',
  left: 'left-full top-1/2 -translate-y-1/2 border-l-blue-600',
  right: 'right-full top-1/2 -translate-y-1/2 border-r-blue-600'
}

export function Tooltip({ content, children, placement = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative inline-flex">
      <div 
        className="cursor-pointer"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <>
          <div
            className={`absolute z-50 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg shadow-lg whitespace-nowrap ${placementStyles[placement]}`}
          >
            {content}
          </div>
          <div
            className={`absolute z-50 w-0 h-0 border-4 border-transparent ${arrowPlacementStyles[placement]}`}
          />
        </>
      )}
    </div>
  )
}
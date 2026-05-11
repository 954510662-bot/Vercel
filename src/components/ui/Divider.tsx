export interface DividerProps {
  className?: string
  vertical?: boolean
}

export function Divider({ className = '', vertical = false }: DividerProps) {
  return (
    <div 
      className={`${vertical ? 'w-px h-full' : 'h-px w-full'} bg-gray-200 ${className}`}
    />
  )
}
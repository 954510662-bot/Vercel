import { InputHTMLAttributes } from 'react'

export interface SwitchProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function Switch({ label, className = '', ...props }: SwitchProps) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        role="switch"
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          props.checked ? 'bg-blue-600' : 'bg-gray-300'
        } ${className}`}
        {...props}
        style={{
          appearance: 'none',
          backgroundImage: props.checked 
            ? 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\'%3e%3cpath fill=\'%23fff\' fill-rule=\'evenodd\' d=\'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z\' clip-rule=\'evenodd\'/%3e%3c/svg%3e")' 
            : 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\'%3e%3cpath fill=\'%239ca3af\' fill-rule=\'evenodd\' d=\'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z\' clip-rule=\'evenodd\'/%3e%3c/svg%3e")',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '50%'
        }}
      />
      {label && (
        <span className="text-sm text-gray-700">{label}</span>
      )}
    </label>
  )
}
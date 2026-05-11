import { forwardRef, type InputHTMLAttributes } from 'react'
import { Warning } from '@phosphor-icons/react'
import { cn } from '@/lib/cn'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  prefix?: string
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, prefix, id, className, ...rest }, ref) => {
    const inputId = id ?? `field-${label.replace(/\s+/g, '-').toLowerCase()}`

    return (
      <div className="field">
        <label
          htmlFor={inputId}
          className={cn('field-label', error && 'text-danger')}
        >
          {label}
        </label>

        <div className="relative">
          {prefix && (
            <span
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2
                         text-body-md text-gray-400 select-none"
            >
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'field-input',
              prefix && 'pl-[112px]',
              error && 'field-input--error',
              className,
            )}
            {...rest}
          />
        </div>

        {error && (
          <p className="field-error" role="alert">
            <Warning size={16} weight="fill" />
            {error}
          </p>
        )}
      </div>
    )
  },
)
TextField.displayName = 'TextField'

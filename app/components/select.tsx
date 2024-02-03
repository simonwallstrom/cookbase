import type { VariantProps } from 'cva'
import React from 'react'
import { cva, cx } from '../lib/cva.config'

const selectVariants = cva({
  base: [
    'w-full appearance-none border border-gray-300 bg-no-repeat [background-position:right_0.4rem_center] [background-size:16px_16px] focus:outline-none dark:border-gray-700 dark:bg-gray-950',
    'placeholder:text-gray-500',
    'focus-visible:border-gray-950 dark:focus-visible:border-gray-100',
  ],
  variants: {
    size: {
      default: 'px-2.5 py-1.5',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

type selectProps = React.SelectHTMLAttributes<HTMLSelectElement> &
  VariantProps<typeof selectVariants>

export const Select = React.forwardRef<HTMLSelectElement, selectProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <select
        ref={ref}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
        }}
        draggable="false"
        className={cx(selectVariants({ size, className }))}
        {...props}
      />
    )
  },
)

Select.displayName = 'Select'

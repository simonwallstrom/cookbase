import type { VariantProps } from 'cva'
import React from 'react'
import { cva, cx } from '../lib/cva.config'

const inputVariants = cva({
  base: [
    'appearance-none rounded-none border border-gray-300 outline-none dark:border-gray-700 dark:bg-gray-950',
    'placeholder:text-gray-500',
    'focus-visible:border-gray-950 dark:focus-visible:border-gray-500',
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

type inputProps = React.InputHTMLAttributes<HTMLInputElement> & VariantProps<typeof inputVariants>

export const Input = React.forwardRef<HTMLInputElement, inputProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <input
        ref={ref}
        draggable="false"
        className={cx(inputVariants({ size, className }))}
        {...props}
      />
    )
  },
)

Input.displayName = 'Input'

import type { VariantProps } from 'cva'
import React from 'react'
import { cva, cx } from '../lib/cva.config'

const textareaVariants = cva({
  base: [
    'w-full appearance-none rounded-none border border-gray-300 outline-none [field-sizing:content] dark:border-gray-700 dark:bg-gray-950',
    'placeholder:text-gray-500',
    'focus-visible:border-gray-950 dark:focus-visible:border-gray-500',
  ],
  variants: {
    size: {
      default: 'px-2.5 py-2',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

type inputProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> &
  VariantProps<typeof textareaVariants>

export const Textarea = React.forwardRef<HTMLTextAreaElement, inputProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        draggable="false"
        className={cx(textareaVariants({ size, className }))}
        {...props}
      />
    )
  },
)

Textarea.displayName = 'Textarea'

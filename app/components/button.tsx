import type { VariantProps } from 'cva'
import React from 'react'
import { cva, cx } from '../lib/cva.config'

export const buttonVariants = cva({
  base: ['inline-flex touch-none select-none outline-none'],
  variants: {
    variant: {
      button: [
        'cursor-default items-center justify-center border border-gray-300 border-gray-950 bg-gray-950 px-4 py-1.5 text-gray-100 dark:border-gray-700 dark:bg-gray-800',
        'hover:border-gray-600 hover:bg-gray-700/60',
        'active:scale-[.98] active:bg-gray-700/80',
        'focus-visible:border-gray-100',
      ],
      link: [
        'underline decoration-1 underline-offset-2',
        'hover:decoration-2',
        'active:bg-gray-500/20 active:no-underline',
        'focus-visible:bg-yellow-300 focus-visible:no-underline dark:focus-visible:text-gray-950',
      ],
    },
  },
})

type buttonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>

export const Button = React.forwardRef<HTMLButtonElement, buttonProps>(
  ({ className, variant = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        draggable="false"
        className={cx(buttonVariants({ variant, className }))}
        {...props}
      />
    )
  },
)

Button.displayName = 'Button'

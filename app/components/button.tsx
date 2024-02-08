import type { VariantProps } from 'cva'
import React from 'react'
import { cva, cx } from '~/lib/cva.config'

const buttonVariants = cva({
  base: [
    'inline-flex touch-none select-none underline decoration-gray-300 underline-offset-4 outline-none dark:decoration-gray-600',
    'hover:text-gray-950 hover:decoration-gray-950 dark:hover:text-gray-300 dark:hover:decoration-gray-300',
    'active:bg-gray-500/20 active:text-gray-950 active:decoration-gray-950 dark:active:text-gray-300 dark:active:decoration-gray-300',
    'focus-visible:bg-yellow-300 focus-visible:no-underline dark:focus-visible:text-gray-950',
  ],
})

type buttonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>

export const Button = React.forwardRef<HTMLButtonElement, buttonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        draggable="false"
        className={cx(buttonVariants({ className }))}
        {...props}
      />
    )
  },
)

Button.displayName = 'Button'

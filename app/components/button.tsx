import type { VariantProps } from 'cva'
import React from 'react'
import { cva, cx } from '~/lib/cva.config'

const buttonVariants = cva({
  base: [
    'inline-flex touch-none select-none underline decoration-1 underline-offset-2 outline-none dark:decoration-gray-600',
    'hover:decoration-2',
    'active:bg-gray-500/20 active:no-underline',
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

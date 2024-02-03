import { Link as RemixLink } from '@remix-run/react'
import type { VariantProps } from 'cva'
import React, { type ComponentProps } from 'react'
import { cva, cx } from '~/lib/cva.config'

const buttonVariants = cva({
  base: [
    'inline-flex touch-none select-none items-center justify-center gap-2 border border-gray-950 font-[450] outline-none dark:border-white',
    'active:scale-[.98]',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  variants: {
    intent: {
      default: [
        'bg-gray-700 text-white dark:bg-gray-300 dark:text-gray-950',
        'dark:hover:bg-gray-100',
        'outline-1 focus-visible:outline-gray-100',
      ],
      destructive: ['bg-red-600 text-white'],
    },
    size: {
      default: 'px-4 py-1.5',
    },
  },
  defaultVariants: {
    intent: 'default',
    size: 'default',
  },
})

type buttonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>

export const Button = React.forwardRef<HTMLButtonElement, buttonProps>(
  ({ className, intent, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        draggable="false"
        className={cx(buttonVariants({ intent, size, className }))}
        {...props}
      />
    )
  },
)

Button.displayName = 'Button'

type buttonLinkProps = VariantProps<typeof buttonVariants> & ComponentProps<typeof RemixLink>

export function ButtonLink({ className, intent, size, ...props }: buttonLinkProps) {
  return (
    <RemixLink
      draggable="false"
      className={cx(buttonVariants({ intent, size, className }))}
      {...props}
    />
  )
}

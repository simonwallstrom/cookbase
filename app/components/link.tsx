import { forwardRef } from 'react'
import { Link as RemixLink } from '@remix-run/react'
import type { VariantProps } from 'cva'
import { type ComponentProps } from 'react'
import { buttonVariants } from '~/components/button'
import { cx } from '~/lib/cva.config'

type LinkProps = VariantProps<typeof buttonVariants> & ComponentProps<typeof RemixLink>

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant = 'link', ...props }, ref) => {
    return (
      <RemixLink
        draggable="false"
        ref={ref}
        className={cx(buttonVariants({ variant, className }))}
        {...props}
      />
    )
  },
)

Link.displayName = 'Link'

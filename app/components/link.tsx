import { Link as RemixLink } from '@remix-run/react'
import type { VariantProps } from 'cva'
import { type ComponentProps } from 'react'
import { buttonVariants } from '~/components/button'
import { cx } from '~/lib/cva.config'

type linkProps = VariantProps<typeof buttonVariants> & ComponentProps<typeof RemixLink>

export function Link({ className, variant = 'link', ...props }: linkProps) {
  return (
    <RemixLink
      draggable="false"
      className={cx(buttonVariants({ variant, className }))}
      {...props}
    />
  )
}

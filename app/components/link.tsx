import { Link as RemixLink } from '@remix-run/react'
import type { VariantProps } from 'cva'
import { type ComponentProps } from 'react'
import { cva, cx } from '~/lib/cva.config'

const linkVariants = cva({
  base: ['inline-flex touch-none select-none outline-none focus-visible:bg-yellow-300'],
})

type linkProps = VariantProps<typeof linkVariants> & ComponentProps<typeof RemixLink>

export function Link({ className, ...props }: linkProps) {
  return <RemixLink draggable="false" className={cx(linkVariants({ className }))} {...props} />
}

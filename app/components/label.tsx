import type { VariantProps } from 'cva'
import { cva, cx } from '~/lib/cva.config'

const labelVariants = cva({
  base: ['inline-flex select-none pb-2 font-medium'],
})

type labelProps = React.LabelHTMLAttributes<HTMLLabelElement> &
  VariantProps<typeof labelVariants> & {
    htmlFor: HTMLLabelElement['htmlFor']
  }

export function Label({ className, htmlFor, ...props }: labelProps) {
  return (
    <label
      htmlFor={htmlFor}
      draggable="false"
      className={cx(labelVariants({ className }))}
      {...props}
    />
  )
}

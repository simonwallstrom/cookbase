import * as React from 'react'
import * as SwitchPrimitives from '@radix-ui/react-switch'
import { cx } from '~/lib/cva.config'

type SwitchProps = React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & {
  className?: string
}

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitives.Root>, SwitchProps>(
  ({ className, ...props }, ref) => (
    <SwitchPrimitives.Root
      className={cx(
        'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent outline-none transition-colors focus-visible:outline-1 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-gray-950 data-[state=unchecked]:bg-gray-300 dark:focus-visible:outline-gray-300 dark:data-[state=checked]:bg-gray-300 dark:data-[state=unchecked]:bg-gray-700',
        className,
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cx(
          'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 dark:bg-gray-950',
        )}
      />
    </SwitchPrimitives.Root>
  ),
)
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }

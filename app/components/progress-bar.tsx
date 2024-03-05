import { useNavigation } from '@remix-run/react'
import { useEffect, useRef, useState } from 'react'
import { useSpinDelay } from 'spin-delay'
import { cx } from '~/lib/cva.config'

function ProgressBar() {
  const transition = useNavigation()
  const busy = transition.state !== 'idle'
  const delayedPending = useSpinDelay(busy, {
    delay: 100,
    minDuration: 400,
  })
  const ref = useRef<HTMLDivElement>(null)
  const [animationComplete, setAnimationComplete] = useState(true)

  useEffect(() => {
    if (!ref.current) return
    if (delayedPending) setAnimationComplete(false)

    const animationPromises = ref.current.getAnimations().map(({ finished }) => finished)

    Promise.allSettled(animationPromises).then(() => {
      if (!delayedPending) setAnimationComplete(true)
    })
  }, [delayedPending])

  return (
    <div
      role="progressbar"
      aria-hidden={delayedPending ? undefined : true}
      aria-valuetext={delayedPending ? 'Loading' : undefined}
      className="fixed inset-x-0 left-0 z-50 h-px animate-pulse max-sm:bottom-[calc(theme('spacing.16')_+_env(safe-area-inset-bottom))] sm:top-16"
    >
      <div
        ref={ref}
        className={cx(
          'h-full w-0 bg-gray-500 duration-500 ease-in-out',
          transition.state === 'idle' &&
            (animationComplete ? 'transition-none' : 'w-full opacity-0 transition-all'),
          delayedPending && transition.state === 'submitting' && 'w-5/12',
          delayedPending && transition.state === 'loading' && 'w-8/12',
        )}
      />
    </div>
  )
}

export { ProgressBar }

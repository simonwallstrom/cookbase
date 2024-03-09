import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:rounded-none group-[.toaster]:ring-1 group-[.toaster]:ring-gray-950/10 dark:group-[.toaster]:ring-white/20 group-[.toaster]:bg-white dark:group-[.toaster]:bg-gray-800 dark:group-[.toaster]:text-gray-300 group-[.toaster]:border-none group-[.toaster]:shadow-xl',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

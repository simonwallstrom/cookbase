import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="bottom-left"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:rounded-none group-[.toaster]:ring-1 group-[.toaster]:ring-gray-950/10 group-[.toaster]:border-none group-[.toaster]:bg-white dark:group-[.toaster]:bg-gray-800 dark:group-[.toaster]:text-gray-300 group-[.toaster]:border-inherit dark:group-[.toaster]:border-gray-700 group-[.toaster]:shadow-xl',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

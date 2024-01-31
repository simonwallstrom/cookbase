type DividerHeadingProps = {
  children: React.ReactNode
  as: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
} & Partial<Omit<HTMLHeadingElement, 'children'>>

export function DividerHeading(props: DividerHeadingProps) {
  return (
    <props.as className="relative text-sm font-medium uppercase tracking-widest after:absolute after:inset-x-0 after:top-1/2 after:h-px after:bg-gray-200 dark:after:bg-gray-800">
      <span className="relative z-10 bg-white pr-3 text-gray-500 dark:bg-gray-950">
        {props.children}
      </span>
    </props.as>
  )
}

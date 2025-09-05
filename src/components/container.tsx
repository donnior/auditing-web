import React from 'react'
import { cn } from '@/lib/utils'
import { Space } from './space'

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    className?: string
    rounded?: boolean
    border?: boolean
    spaced?: boolean
}

const Container = ({ children, className, rounded, border, spaced, ...props }: ContainerProps) => {
    const defaultClassNames = 'p-2'
    return <div className={cn(
        rounded && 'rounded-md',
        border && 'border border-gray-300',
        defaultClassNames,
        className
    )} {...props}>
        {spaced ? <Space>{children}</Space> : children}
    </div>
}

export { Container }

import React from 'react'

const Space = ({ children, className, splitter }: { children: React.ReactNode, className?: string, splitter?: React.ReactNode }) => {
    const childrenArray = React.Children.toArray(children)

    if (childrenArray.length === 0) {
        return null
    }

    if (childrenArray.length === 1) {
        return <div className={`flex ${className}`}>{children}</div>
    }

    const elementsWithSplitters = childrenArray.reduce((acc: React.ReactNode[], child, index) => {
        acc.push(child)

        // 如果不是最后一个元素，添加splitter
        if (index < childrenArray.length - 1 && splitter) {
            acc.push(
                <span key={`splitter-${index}`} className="flex-shrink-0">
                    {splitter}
                </span>
            )
        }

        return acc
    }, [])

    return (
        <div className={`flex items-center justify-between ${className}`}>
            {elementsWithSplitters.map((element, index) => (
                <React.Fragment key={index}>{element}</React.Fragment>
            ))}
        </div>
    )
}

export { Space }

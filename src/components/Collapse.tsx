const Collapse = ({ children, title }: { children: React.ReactNode, title: string }) => {
    return (
        // <details className="border rounded-lg border-gray-200 p-2 [&_svg]:open:-rotate-180 [&_summary]:open:border-b">
        <details className="border rounded-lg border-gray-200 p-2 [&[open]_svg]:-rotate-180 [&[open]_summary]:border-b">
            <summary className="flex cursor-pointer list-none items-center p-2 gap-4">
                <div>
                    <svg className="rotate-0 transform text-blue-700 transition-all duration-300" fill="none" height="20" width="20" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" viewBox="0 0 24 24">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
                <div>{title}</div>
            </summary>

            {children}
        </details>
    )
}
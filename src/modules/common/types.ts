export interface PageResponse<T> {
    items?: T[]
    content?: T[]
    total_elements: number
}

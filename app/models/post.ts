
export default class Post{
    userId: number
    id: number
    title: string
    body: string

    constructor(title: string, body: string, userId: number, id?: number) {
        this.title = title
        this.body = body
        this.userId = userId
        this.id = id ?? 0
    }
}
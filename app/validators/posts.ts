import vine, { SimpleMessagesProvider } from "@vinejs/vine"

export const createAndUpdatePostValidator = vine.create(
    vine.object({
        title: vine.string(),
        body: vine.string(),
        userId: vine.number(),
    })
)

createAndUpdatePostValidator.messagesProvider = new SimpleMessagesProvider({
    'title.required': 'Title is required',
    'title.string': 'Title must be a string',
    'body.required': 'Body is required',
    'body.string': 'Body must be a string',
    'userId.required': 'User ID is required',
    'userId.number': 'User ID must be a number',
})
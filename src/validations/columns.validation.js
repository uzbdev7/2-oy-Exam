import Joi from "joi"

export const schema = Joi.object({
    name: Joi.string().min(2).max(40).required(),
    board_id: Joi.string()
        .uuid()
        .message("board_id noto'g'ri UUID formatda kiritilgan")
        .required()

})

export const schemaUpdate = Joi.object({
    name: Joi.string().min(2).max(50),
    board_id: Joi.string()
        .uuid()
        .message("board_id noto'g'ri UUID formatda kiritilgan")
        .optional()
})






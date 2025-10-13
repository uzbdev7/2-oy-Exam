import Joi from "joi"

export const schema = Joi.object({
    name: Joi.string().min(2).max(20).required(),
    board_id: Joi.required()

})

export const schemaUpdate = Joi.object({
    name: Joi.string().min(2).max(20),
    board_id: Joi.string()
})

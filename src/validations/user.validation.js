import Joi from "joi";

    export const userSchema = Joi.object({
        name : Joi.string().min(2).max(20).required(),
        email: Joi.string().email().required(),
        password : Joi.string().min(8).max(20).required()
    })


    export const userSchemaUpdate = Joi.object({
        name : Joi.string().min(2).max(20),
        email: Joi.string().email(),
        password : Joi.string().min(8).max(20)
    })

    
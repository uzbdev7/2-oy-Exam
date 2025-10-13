import Joi from "joi";

export const boardschema = Joi.object({
        title: Joi.string().min(2).max(20).required(),
        user_id: Joi.required()
    })


export const boardschemaUpdate = Joi.object({
        title:Joi.string().min(2).max(20)
    });



import Joi from "joi";

export const boardschema = Joi.object({
        title: Joi.string().min(2).max(20).required(),
        user_id: Joi.string()
        .uuid()
        .message("user_id noto'g'ri UUID formatda kiritilgan")
        .required()
    })


export const boardschemaUpdate = Joi.object({
        title:Joi.string().min(2).max(20).optional(),
        user_id: Joi.string()
        .uuid()
        .message("user_id noto'g'ri UUID formatda kiritilgan").optional()
    });
    
    



    
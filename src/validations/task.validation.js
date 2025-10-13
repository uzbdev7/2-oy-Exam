import Joi from "joi";

    export const taskschema = Joi.object({
        title: Joi.string().min(2).max(255).required(),
        description: Joi.string().required(),
        user_id: Joi.string().required(),
        board_id: Joi.string().required(),
        column_id: Joi.string().required()
    });

   export const taskschemaUpdate = Joi.object({
        title: Joi.string().min(2).max(20),
        description: Joi.string(),
        user_id: Joi.string(),
        board_id: Joi.string(),
        column_id: Joi.string()
    });


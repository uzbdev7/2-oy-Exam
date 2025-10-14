import Joi from "joi";

    export const taskschema = Joi.object({
        title: Joi.string().min(2).max(255).required(),
        description: Joi.string().required(),
         user_id: Joi.string()
         
        .uuid()
        .message("user_id noto'g'ri UUID formatda kiritilgan")
        .required(),

        board_id: Joi.string()
        .uuid()
        .message("board_id noto'g'ri UUID formatda kiritilgan")
        .required(),

        column_id: Joi.string()
        .uuid()
        .message("column_id noto'g'ri UUID formatda kiritilgan")
        .required()
});

   export const taskschemaUpdate = Joi.object({

        title: Joi.string().min(2).max(20).optional(),
        description: Joi.string().optional(),
        user_id: Joi.string()
        .uuid()
        .message("user_id noto'g'ri UUID formatda kiritilgan")
        .optional(),

        board_id: Joi.string()
        .uuid()
        .message("board_id noto'g'ri UUID formatda kiritilgan")
        .optional(),

        column_id: Joi.string()
        .uuid()
        .message("column_id noto'g'ri UUID formatda kiritilgan")
        .optional()

});



import Joi from "joi";

function userValidation(data) {
    const userSchema = Joi.object({
        name : Joi.string().min(2).max(20).required(),
        email: Joi.string().email().required(),
        password : Joi.string().min(8).max(20).required()
    })
    return userSchema.validate(data, {abortEarly: true})
}

function userValidationUpdate(data) {
    const userSchema = Joi.object({
        username : Joi.string().min(2).max(20),
        email: Joi.string().email(),
        password : Joi.string().min(8).max(20)
    })
    return userSchema.validate(data, {abortEarly: true})
}

export { userValidation, userValidationUpdate} 
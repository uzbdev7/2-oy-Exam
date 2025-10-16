import Joi from "joi";

export const userSchema = Joi.object({
  name: Joi.string().min(2).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .max(20)
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")
    )
    .message(
      "Parolda kamida 1 ta kichik harf, 1 ta katta harf, 1 ta raqam va 1 ta maxsus belgi bo'lishi kerak"
    )
    .required()
});


export const userSchemaUpdate = Joi.object({
    name : Joi.string().min(2).max(20).optional(),
    email: Joi.string().email().optional(),
    password : Joi.string()
        .min(8)
        .max(20)
        .pattern(
         new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")
        )
        .message(
        "Parolda kamida 1 ta kichik harf, 1 ta katta harf, 1 ta raqam va 1 ta maxsus belgi bo'lishi kerak"
        ).optional()
        
    });

   
    
    
    
    
    
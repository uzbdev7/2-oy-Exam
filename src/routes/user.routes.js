import { Router } from "express";
import { createUser,getAll, login, UserUpdate, deleteUser,searchUser } from "../controller/user.controller.js";
import { validate } from "../validations/validation.js";
import { userSchema, userSchemaUpdate } from "../validations/user.validation.js";

const router = Router()

router.get("/search", searchUser);

router.get("/", getAll);

router.post("/", validate(userSchema,"body"), createUser);

router.post("/login", login);

router.put("/:id", validate(userSchemaUpdate,"body"), UserUpdate);

router.delete("/:id", deleteUser);



export default router;

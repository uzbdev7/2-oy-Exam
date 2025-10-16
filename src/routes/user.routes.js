import { Router } from "express";
import { createUser,getAll, login, UserUpdate, deleteUser, getOneById } from "../controller/user.controller.js";
import { validate } from "../validations/validation.js";
import { userSchema, userSchemaUpdate } from "../validations/user.validation.js";

const router = Router()

// GET USERS WITH PAGINATION AND SEARCH USERS
router.get("/", getAll);

// GET ONE USER BY ID
router.get("/:id", getOneById);

// CREATE USER.
router.post("/register", validate(userSchema,"body"), createUser);

// LOGIN USER
router.post("/login", login);

// UPDATE USER BY ID
router.put("/:id", validate(userSchemaUpdate,"body"), UserUpdate);

// DELETE USER BY ID
router.delete("/:id", deleteUser);


export default router;



import { Router } from "express";
import { createUser,getAll,login } from "../controller/userController.js";

const UserRouter = Router()
UserRouter.get("/",createUser);
UserRouter.get("/",getAll);
UserRouter.post("/login",login)


export default UserRouter;
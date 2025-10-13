import {Router } from "express"
import userRouter from "./user.routes.js";
import boardRouter from "./boards.routes.js";
import taskRouter from "./task.routes.js";
import columnsRouter from "./columns.routes.js";

const router = Router()

router.use("/boards", boardRouter);

router.use("/users", userRouter);

router.use("/columns", columnsRouter);

router.use("/tasks", taskRouter);

export default router;



import { Router } from "express";
import { createTasks,getAllTasks,UpdateTasks,deleteTasks, getOneById } from "../controller/task.controller.js";
import { validate } from "../validations/validation.js";
import {taskschema, taskschemaUpdate} from "../validations/task.validation.js"

const router = Router();

router.get("/:id", getOneById);

router.get("/", getAllTasks);

router.post("/",validate(taskschema,"body"), createTasks);

router.put("/:id", validate(taskschemaUpdate, "body"), UpdateTasks );

router.delete("/:id", deleteTasks);

export default router;







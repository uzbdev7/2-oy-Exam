import { Router } from "express";
import { createColumn, getAllColumns, UpdateColumns, deleteColumn,getOneById } from "../controller/column.controller.js";
import { validate } from "../validations/validation.js";
import { schema, schemaUpdate } from "../validations/columns.validation.js";

const router = Router()


router.get("/", getAllColumns)

router.get("/:id", getOneById);

router.post("/", validate(schema,"body"), createColumn);

router.put("/:id", validate(schemaUpdate, "body"), UpdateColumns);

router.delete("/:id", deleteColumn);

export default router;





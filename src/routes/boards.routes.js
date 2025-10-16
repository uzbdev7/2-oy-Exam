import { Router } from "express";
import { getAll, createBoard, updateBoard, deleteBoard,getOneById } from "../controller/board.controller.js";
import { boardschema, boardschemaUpdate } from "../validations/board.validation.js";
import { validate } from "../validations/validation.js";

const router = Router()

router.get("/", getAll); 

router.get("/:id", getOneById);

router.post("/", validate(boardschema,"body"), createBoard); 

router.put("/:id", validate(boardschemaUpdate,"body"), updateBoard); 

router.delete("/:id",deleteBoard)

export default router;



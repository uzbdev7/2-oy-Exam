import { Router } from "express";
import { getAll, createBoard, updateBoard, deleteBoard,searchBoard } from "../controller/board.controller.js";
import { boardschema, boardschemaUpdate } from "../validations/board.validation.js";
import { validate } from "../validations/validation.js";

const router = Router()

router.get("/search", searchBoard);

router.get("/", getAll); 

router.post("/", validate(boardschema,"body"), createBoard); 

router.put("/:id", validate(boardschemaUpdate,"body"), updateBoard); 

router.delete("/:id",deleteBoard)

export default router;
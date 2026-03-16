import { Router } from "express";
import { evaluatePrompt } from "../controllers/evaluationController";

const router = Router();

router.post("/", evaluatePrompt);

export default router;

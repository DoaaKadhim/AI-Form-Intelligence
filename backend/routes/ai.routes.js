import express from "express";
import {
  formCheck,
  chatAI,
  explainStatus
} from "../controllers/ai.controller.js";

const router = express.Router();

// AI endpoints
router.post("/form-check", formCheck);
router.post("/chat", chatAI);
router.post("/explain-status", explainStatus);

export default router;
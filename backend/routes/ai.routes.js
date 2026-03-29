import express from "express";
import { handleAIRequest } from "../controllers/ai.controller.js";

const router = express.Router();

// ONE SMART ENDPOINT
router.post("/", handleAIRequest);

export default router;
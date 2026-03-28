import {
    formCheckService,
    chatService,
    statusService
  } from "../services/ai.service.js";
  
  // 1. FORM AI
  export const formCheck = (req, res) => {
    const { field, value } = req.body;
  
    const result = formCheckService(field, value);
  
    res.json(result);
  };
  
  // 2. CHAT AI
  export const chatAI = (req, res) => {
    const { message } = req.body;
  
    const reply = chatService(message);
  
    res.json({ reply });
  };
  
  // 3. STATUS EXPLAINER
  export const explainStatus = (req, res) => {
    const { status } = req.body;
  
    const explanation = statusService(status);
  
    res.json({ explanation });
  };
  
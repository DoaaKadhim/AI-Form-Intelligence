import {
    formCheckService,
    chatService,
    statusService,
    riskCheckService
  } from "../services/ai.service.js";
  
  import { sendSuccess, sendError } from "../utils/response.js";
  
  export const handleAIRequest = (req, res) => {
    const { type, message, field, value, status } = req.body;
  
    let result = null;
  
    console.log("REQ BODY:", req.body);
  
    // 🤖 CHAT
    if (type === "chat") {
      const input = message || value;
      result = chatService(input);
    }
  
    // 🧾 SIMPLE FORM VALIDATION
    if (type === "form") {
      result = formCheckService(field, value);
    }
  
    // 🏦 🔥 FORM DECISION (BONUS FEATURE)
    if (type === "form_decision") {
      try {
        const data = JSON.parse(value);
  
        // ❌ BONUS VALIDATION
        if (!data.ssn || data.ssn.length !== 9) {
          return sendError(res, "Invalid SSN", 400);
        }
  
        if (!data.email || !data.email.includes("@")) {
          return sendError(res, "Invalid email", 400);
        }
  
        // 🧠 DECISION LOGIC
        const decision = data.decision || "UNDER REVIEW";
        const score = data.riskScore || 0;
  
        result = `🏦 Decision: ${decision}
  📊 Risk Score: ${score}
  
  👤 Name: ${data.name}
  📧 Email: ${data.email}
  📱 Phone: ${data.phone}
  🆔 SSN: ${data.ssn}`;
  
      } catch (err) {
        return sendError(res, "Invalid JSON format", 400);
      }
    }
  
    // 📊 STATUS
    if (type === "status") {
      result = statusService(status || value);
    }
  
    // ⚠️ RISK CHECK
    if (type === "risk") {
      result = riskCheckService(message || value);
    }
  
    console.log("RESULT:", result);
  
    // ❌ NO RESULT
    if (!result) {
      return sendError(res, "No result generated");
    }
  
    // ✅ SUCCESS
    return sendSuccess(res, result);
  };
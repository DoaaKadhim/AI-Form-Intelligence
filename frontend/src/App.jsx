import { useState } from "react";
import { sendToAI } from "./api/ai";

export default function App() {
  const [mode, setMode] = useState("chat");

  const [chatValue, setChatValue] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    ssn: ""
  });

  const [statusValue, setStatusValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🧾 UPDATE FORM
  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // 🧠 RISK ENGINE
  const calculateRiskScore = () => {
    let score = 0;

    const name = formData.name?.trim();
    const email = formData.email?.trim().toLowerCase();
    const phone = formData.phone?.toString().trim();
    const ssn = formData.ssn?.toString().trim();

    if (!name || name.length < 2) score += 40;

    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!emailRegex.test(email)) score += 30;

    if (!/^[0-9]{10}$/.test(phone)) score += 20;

    if (!/^[0-9]{9}$/.test(ssn)) score += 10;

    return score;
  };

  // 🏦 DECISION ENGINE
  const getDecision = (score) => {
    if (score === 0) return { status: "APPROVED", msg: "✅ Account approved" };
    if (score <= 30) return { status: "UNDER REVIEW", msg: "⚠ Sent to compliance review" };
    return { status: "REJECTED", msg: "❌ Application rejected" };
  };

  // 🚨 REAL-TIME VALIDATION (THIS IS WHAT YOU WANTED)
  const validateForm = () => {
    const errors = [];

    const name = formData.name?.trim();
    const email = formData.email?.trim();
    const phone = formData.phone?.trim();
    const ssn = formData.ssn?.trim();

    if (!name || name.split(" ").length < 2) {
      errors.push("❌ Enter full name (first + last)");
    }

    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!emailRegex.test(email)) {
      errors.push("❌ Invalid email format");
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      errors.push("❌ Phone must be 10 digits");
    }

    if (!/^[0-9]{9}$/.test(ssn)) {
      errors.push("❌ SSN must be 9 digits");
    }

    return errors;
  };

  // 🚀 SEND
  const handleSend = async () => {
    let payload = {};
    let inputValue = "";

    try {
      setLoading(true);

      // 🤖 CHAT
      if (mode === "chat") {
        inputValue = chatValue;
        payload = { type: "chat", value: chatValue };
      }

      // 📊 STATUS
      if (mode === "status") {
        inputValue = statusValue;
        payload = { type: "status", value: statusValue };
      }

      // 🧾 FORM
      if (mode === "form") {
        const errors = validateForm();

        // ❌ STOP IF ERRORS EXIST
        if (errors.length > 0) {
          setMessages((prev) => [
            ...prev,
            { role: "ai", text: errors.join("\n") }
          ]);
          setLoading(false);
          return;
        }

        const score = calculateRiskScore();
        const decision = getDecision(score);

        const result = {
          ...formData,
          riskScore: score,
          decision: decision.status
        };

        inputValue = decision.msg;

        payload = {
          type: "chat",
          value: `Decision: ${decision.status} | Score: ${score}`
        };
      }

      const res = await sendToAI(payload);

      const text =
        typeof res.data === "object"
          ? res.data.message
          : res.data;

      setMessages((prev) => [
        ...prev,
        { role: "user", text: inputValue },
        { role: "ai", text }
      ]);

      setChatValue("");
      setStatusValue("");

    } catch (error) {
      console.error("❌ ERROR:", error);

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "❌ Server error or no response" }
      ]);
    }

    setLoading(false);
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f8fafc" }}>

      {/* SIDEBAR */}
      <div style={{
        width: "260px",
        background: "#0f172a",
        color: "white",
        padding: "20px"
      }}>
        <h2>🏦 AI Console</h2>

        <p onClick={() => setMode("chat")} style={{ cursor: "pointer" }}>
          🤖 Chat Assistant
        </p>

        <p onClick={() => setMode("form")} style={{ cursor: "pointer" }}>
          🧾 Form Checker
        </p>

        <p onClick={() => setMode("status")} style={{ cursor: "pointer" }}>
          📊 Status Checker
        </p>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: 30 }}>

        <h1>Enterprise Banking AI Panel</h1>

        {/* CHAT */}
        {mode === "chat" && (
          <div style={{ background: "white", padding: 20, borderRadius: 10 }}>
            <h3>Chat Assistant</h3>
            <input
              value={chatValue}
              onChange={(e) => setChatValue(e.target.value)}
              placeholder="Enter request..."
              style={{ width: "100%", padding: 8 }}
            />
          </div>
        )}

        {/* FORM */}
        {mode === "form" && (
          <div style={{ background: "white", padding: 20, borderRadius: 10 }}>
            <h3>Form Checker (Bank Decision Engine)</h3>

            <input placeholder="Full Name (First Last)"
              value={formData.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
              style={{ width: "100%", padding: 8, marginBottom: 10 }} />

            <input placeholder="Full Name (First Last)"
              value={formData.email}
              onChange={(e) => handleFormChange("email", e.target.value)}
              style={{ width: "100%", padding: 8, marginBottom: 10 }} />

            <input placeholder="Phone number (10 digits only)"
              value={formData.phone}
              onChange={(e) => handleFormChange("phone", e.target.value)}
              style={{ width: "100%", padding: 8, marginBottom: 10 }} />

            <input placeholder="SSN (9 digits)"
              value={formData.ssn}
              onChange={(e) => handleFormChange("ssn", e.target.value)}
              style={{ width: "100%", padding: 8 }} />
          </div>
        )}

        {/* STATUS */}
        {mode === "status" && (
          <div style={{ background: "white", padding: 20, borderRadius: 10 }}>
            <h3>Status Checker</h3>
            <input
              value={statusValue}
              onChange={(e) => setStatusValue(e.target.value)}
              placeholder="Enter status..."
              style={{ width: "100%", padding: 8 }}
            />
          </div>
        )}

        {/* BUTTON */}
        <button onClick={handleSend} disabled={loading} style={{ marginTop: 10 }}>
          {loading ? "Processing..." : "Run Decision Engine"}
        </button>

        {/* OUTPUT */}
        <div style={{
          marginTop: 20,
          background: "white",
          padding: 20,
          borderRadius: 10,
          height: "300px",
          overflowY: "auto"
        }}>
          {messages.map((m, i) => (
            <p key={i} style={{
              textAlign: m.role === "user" ? "right" : "left"
            }}>
              {m.text}
            </p>
          ))}
        </div>

      </div>
    </div>
  );
}
import { useState } from "react";
import { sendToAI } from "./api/ai";

export default function App() {
  const [mode, setMode] = useState("chat");

  const [chatValue, setChatValue] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: ""
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

  // 🧠 VALIDATION
  const validateForm = () => {
    const errors = [];

    const name = formData.name?.trim();
    const email = formData.email?.trim();
    const phone = formData.phone?.trim();
    const exp = Number(formData.experience);

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

    if (isNaN(exp) || exp < 0 || exp > 10) {
      errors.push("❌ Experience must be between 0 and 10");
    }

    return errors;
  };

  // 🧠 SCORE ENGINE
  const calculateScore = () => {
    let score = 0;
    const exp = Number(formData.experience);

    if (exp >= 8) score += 0;
    else if (exp >= 5) score += 20;
    else score += 40;

    return score;
  };

  // 🧠 DECISION ENGINE
  const getDecision = (score) => {
    if (score === 0)
      return {
        status: "VALID",
        msg: "✅ High-quality input. Ready for processing."
      };

    if (score <= 30)
      return {
        status: "REVIEW",
        msg: "⚠ Some fields need attention."
      };

    return {
      status: "REJECTED",
      msg: "❌ Low data quality detected. Please review input fields."
    };
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
      
        const text = chatValue.toLowerCase();
      
        let aiReply = "🤖 I'm here to help with form validation.";
      
        if (text.includes("email")) {
          aiReply = "📧 Make sure your email follows this format: example@domain.com";
        } else if (text.includes("phone")) {
          aiReply = "📱 Phone number should be 10 digits with no spaces.";
        } else if (text.includes("name")) {
          aiReply = "👤 Please enter your full name (first and last).";
        } else if (text.includes("experience")) {
          aiReply = "⭐ Experience score should be between 0 and 10.";
        } else if (text.includes("help")) {
          aiReply = "🧠 I can help you fill forms correctly. Ask about email, phone, name, or experience.";
        } else if (text.includes("hi") || text.includes("hello")) {
          aiReply = "👋 Hello! How can I assist you with your form today?";
        }
      
        setMessages((prev) => [
          ...prev,
          { role: "user", text: inputValue },
          { role: "ai", text: aiReply }
        ]);
      
        setChatValue("");
        setLoading(false);
        return;
      }

      // 📊 STATUS
      if (mode === "status") {
        inputValue = statusValue;
        payload = { type: "status", value: statusValue };
      }

      // 🧾 FORM
      if (mode === "form") {
        const errors = validateForm();

        if (errors.length > 0) {
          setMessages((prev) => [
            ...prev,
            { role: "ai", text: errors.join("\n") }
          ]);
          setLoading(false);
          return;
        }

        const score = calculateScore();
        const decision = getDecision(score);

        inputValue = decision.msg;

        payload = {
          type: "chat",
          value: `Validation Result: ${decision.status} | Score: ${score}`
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
        <h2>AI Form Intelligence</h2>

        <p onClick={() => setMode("chat")} style={{ cursor: "pointer" }}>
          🤖 AI Assistant
        </p>

        <p onClick={() => setMode("form")} style={{ cursor: "pointer" }}>
          🧾 Smart Form
        </p>

        <p onClick={() => setMode("status")} style={{ cursor: "pointer" }}>
          📊 Insights
        </p>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: 30 }}>

        <h1>AI Form Intelligence Platform</h1>

        {/* CHAT */}
        {mode === "chat" && (
          <div style={{ background: "white", padding: 20, borderRadius: 10 }}>
            <h3>AI Assistant</h3>
            <input
              value={chatValue}
              onChange={(e) => setChatValue(e.target.value)}
              placeholder="Ask about filling forms, validation..."
              style={{ width: "100%", padding: 8 }}
            />
          </div>
        )}

        {/* FORM */}
        {mode === "form" && (
          <div style={{ background: "white", padding: 20, borderRadius: 10 }}>
            <h3>Smart Form Engine</h3>

            <input
              placeholder="Full Name (First Last)"
              value={formData.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
              style={{ width: "100%", padding: 8, marginBottom: 10 }}
            />

            <input
              placeholder="Email (example@domain.com)"
              value={formData.email}
              onChange={(e) => handleFormChange("email", e.target.value)}
              style={{ width: "100%", padding: 8, marginBottom: 10 }}
            />

            <input
              placeholder="Phone (10 digits)"
              value={formData.phone}
              onChange={(e) => handleFormChange("phone", e.target.value)}
              style={{ width: "100%", padding: 8, marginBottom: 10 }}
            />

            <input
              placeholder="Experience Score (0–10)"
              value={formData.experience}
              onChange={(e) => handleFormChange("experience", e.target.value)}
              style={{ width: "100%", padding: 8 }}
            />
          </div>
        )}

        {/* STATUS */}
        {mode === "status" && (
          <div style={{ background: "white", padding: 20, borderRadius: 10 }}>
            <h3>System Insights</h3>
            <input
              value={statusValue}
              onChange={(e) => setStatusValue(e.target.value)}
              placeholder="Enter query..."
              style={{ width: "100%", padding: 8 }}
            />
          </div>
        )}

        {/* BUTTON */}
        <button
          onClick={handleSend}
          disabled={loading}
          style={{ marginTop: 10 }}
        >
          {loading
            ? "Processing..."
            : mode === "chat"
            ? "Send Message"
            : mode === "form"
            ? "Validate Input"
            : "Check Insights"}
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

// 🧾 FORM VALIDATION SERVICE (BANK-GRADE)
export const formCheckService = (field, value) => {
  if (!value) {
    return {
      valid: false,
      message: "❌ Value is required"
    };
  }

  const text = value.toString().trim();

  // 📧 EMAIL VALIDATION (STRICT)
  if (field === "email") {
    const email = text.toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return {
        valid: false,
        message: "❌ Invalid email format"
      };
    }

    // extra banking rule: no fake domains
    if (email.includes("test") || email.includes("fake")) {
      return {
        valid: false,
        message: "❌ Suspicious email domain"
      };
    }

    return {
      valid: true,
      message: "✅ Valid email"
    };
  }

  // 📱 PHONE VALIDATION (BANK RULES)
  if (field === "phone") {
    const phone = text.replace(/\s/g, "");

    const phoneRegex = /^[0-9]{10,15}$/;

    if (!phoneRegex.test(phone)) {
      return {
        valid: false,
        message: "❌ Invalid phone number (10–15 digits only)"
      };
    }

    // 🚨 reject repeated digits (bank fraud rule)
    if (/^(\d)\1+$/.test(phone)) {
      return {
        valid: false,
        message: "❌ Invalid phone number (repeated digits not allowed)"
      };
    }

    return {
      valid: true,
      message: "✅ Valid phone number"
    };
  }

  return {
    valid: false,
    message: "❌ Unknown field type"
  };
};


// 🤖 CHAT SERVICE
export const chatService = (message) => {
  if (!message) return "❌ empty message";

  return `AI: ${message}`;
};


// 📊 STATUS SERVICE
export const statusService = (status) => {
  return `Status: ${status}`;
};


// 🔥 RISK / COMPLIANCE SERVICE (REALISTIC BANK VERSION)
export const riskCheckService = (input) => {
  const text = input.toLowerCase();

  if (text.includes("fake") || text.includes("test")) {
    return {
      level: "high",
      message: "⚠ Suspicious input detected. Requires manual review."
    };
  }

  if (text.includes("123") || text.includes("0000")) {
    return {
      level: "medium",
      message: "⚠ Weak or placeholder data detected."
    };
  }

  if (text.length < 3) {
    return {
      level: "medium",
      message: "⚠ Input too short for validation"
    };
  }

  return {
    level: "low",
    message: "✅ No risk detected"
  };
};
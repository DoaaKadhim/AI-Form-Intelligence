export const formCheckService = (field, value) => {
    if (!value) {
      return {
        valid: false,
        message: `${field} is required`
      };
    }
  
    if (field === "phone" && value.length < 10) {
      return {
        valid: false,
        message: "Invalid phone number",
        suggestion: "+1 555 123 4567"
      };
    }
  
    if (field === "email" && !value.includes("@")) {
      return {
        valid: false,
        message: "Invalid email format",
        suggestion: "example@email.com"
      };
    }
  
    return {
      valid: true,
      message: "Looks good"
    };
  };
  export const chatService = (message) => {
    const msg = message.toLowerCase();
  
    if (msg.includes("document")) {
      return "You need ID, proof of address, and basic personal information.";
    }
  
    if (msg.includes("rejected")) {
      return "Your application may be missing required information or documents.";
    }
  
    return "I can help you with bank onboarding, forms, and application status.";
  };
  export const statusService = (status) => {
    const map = {
      pending: "Your application is being reviewed. This usually takes 1–2 business days.",
      approved: "Your account has been successfully created.",
      rejected: "Please review your documents and resubmit your application."
    };
  
    return map[status] || "Unknown status";
  };

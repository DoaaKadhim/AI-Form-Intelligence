// ✅ SUCCESS RESPONSE
export const sendSuccess = (res, data, message = "Success") => {
    return res.json({
      success: true,
      message,
      data
    });
  };
  
  // ❌ ERROR RESPONSE
  export const sendError = (res, message = "Something went wrong", code = 500) => {
    return res.status(code).json({
      success: false,
      message,
      data: null
    });
  };
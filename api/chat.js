const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  // Thêm đoạn này để debug xem API KEY có tồn tại không
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "Thiếu API Key trong Environment Variables" });
  }

  // Các dòng cấu hình CORS giữ nguyên...
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const { prompt } = req.body;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return res.status(200).json({ text: response.text() });
  } catch (error) {
    // Trả về lỗi chi tiết để mình biết bị gì
    return res.status(500).json({ error: error.message });
  }
};

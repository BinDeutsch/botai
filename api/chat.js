const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
    // Cấu hình CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("Thiếu API Key trên Vercel");

        // Khởi tạo AI với cấu hình mặc định (sẽ tự chọn v1 nếu bản thư viện mới)
        const genAI = new GoogleGenerativeAI(apiKey);
        
        // SỬ DỤNG MODEL GEMINI-1.5-FLASH (BẢN NHANH NHẤT HIỆN TẠI)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: "Nội dung trống" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return res.status(200).json({ text });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Lỗi Google: " + error.message });
    }
};


import { GoogleGenAI } from "@google/genai";

/**
 * Gợi ý lời chúc đám cưới dựa trên tên khách mời.
 * Sử dụng trong component RSVP.
 */
export async function suggestWeddingWish(guestName: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Hãy viết một lời chúc đám cưới ngắn gọn (khoảng 20-30 chữ), chân thành, tinh tế và có chút lãng mạn cho đôi bạn trẻ Trang và Chiến. Người gửi tên là ${guestName || 'một người bạn'}. Hãy viết bằng tiếng Việt, ngôn ngữ tự nhiên, không quá sáo rỗng.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Chúc hai bạn trăm năm hạnh phúc, đầu bạc răng long!";
  } catch (error) {
    console.error("Gemini suggestWish error:", error);
    return "Chúc hai bạn mãi mãi bên nhau, cùng nhau xây dựng tổ ấm hạnh phúc viên mãn!";
  }
}

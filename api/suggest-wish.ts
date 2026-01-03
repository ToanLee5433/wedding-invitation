// Vercel Edge Function for secure Gemini API calls
// API Key is stored in Vercel environment variables (server-side only)

export const config = {
    runtime: 'edge',
};

export default async function handler(req: Request) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const { guestName } = await req.json();

        // Get API key from server-side environment variable (NOT exposed to client)
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error('GEMINI_API_KEY is not set in Vercel environment variables');
            return new Response(JSON.stringify({
                wish: 'Chúc hai bạn trăm năm hạnh phúc, bên nhau trọn đời!'
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const prompt = `Hãy viết một lời chúc đám cưới ngắn gọn (khoảng 20-30 chữ), chân thành, tinh tế và có chút lãng mạn cho đôi bạn trẻ Trang và Chiến. Người gửi tên là ${guestName || 'một người bạn'}. Hãy viết bằng tiếng Việt, ngôn ngữ tự nhiên, không quá sáo rỗng.`;

        // Call Gemini API via REST
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.9, maxOutputTokens: 100 },
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        const wish = data.candidates?.[0]?.content?.parts?.[0]?.text ||
            'Chúc hai bạn mãi mãi bên nhau, cùng nhau xây dựng tổ ấm hạnh phúc viên mãn!';

        return new Response(JSON.stringify({ wish: wish.trim() }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Gemini Edge Function error:', error);
        return new Response(JSON.stringify({
            wish: 'Chúc hai bạn hạnh phúc trọn đời, yêu thương mãi mãi!'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

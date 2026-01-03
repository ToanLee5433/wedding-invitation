
export const config = {
    runtime: 'edge',
};

const WEDDING_BASE_IMAGE_URL = 'https://iv1cdn.vnecdn.net/giaitri/images/web/2025/10/23/toan-canh-dam-cuoi-cua-vo-chong-do-thi-ha-1761191294.jpg?w=1200&q=100';

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const { guestImageBase64 } = await req.json();

        if (!guestImageBase64) {
            return new Response(JSON.stringify({ error: 'Missing guest image' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return new Response(JSON.stringify({ error: 'GEMINI_API_KEY not configured' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // 1. Fetch background image server-side (Bypasses CORS)
        const bgResponse = await fetch(WEDDING_BASE_IMAGE_URL);
        if (!bgResponse.ok) throw new Error('Failed to fetch background image');
        const bgBlob = await bgResponse.blob();
        const bgBuffer = await bgBlob.arrayBuffer();
        const bgBase64 = btoa(new Uint8Array(bgBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));

        // 2. Prepare Gemini Prompt
        const prompt = `You are a high-end AI editorial photographer. YOUR GOAL: Perfectly composite the guest into the original wedding photo.
      
INPUT:
- Background: A luxury wedding scene with a couple (Trang & Chiến).
- Subject: The guest's portrait.

RULES:
1. PLACE the guest naturally standing NEXT to the couple in the scene.
2. MAINTAIN 100% facial likeness, hairstyle, and unique features of the guest. 
3. MATCH lighting, shadows, and professional color grading (warm, cinematic, luxury). 
4. SCALE properly relative to the couple and floor.
5. QUALITY: High resolution, sharp edges, no artifacts.

OUTPUT: Return only the final image.`;

        // 3. Call Gemini API
        const aiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: {
                        parts: [
                            { inlineData: { data: bgBase64, mimeType: 'image/jpeg' } },
                            { inlineData: { data: guestImageBase64, mimeType: 'image/jpeg' } },
                            { text: prompt },
                        ],
                    },
                }),
            }
        );

        if (!aiResponse.ok) {
            const errorData = await aiResponse.json();
            console.error('Gemini API error:', errorData);
            throw new Error(`Gemini API error: ${aiResponse.status}`);
        }

        const data = await aiResponse.json();
        let finalImageBase64 = null;

        if (data.candidates?.[0]?.content?.parts) {
            const imagePart = data.candidates[0].content.parts.find((part: any) => part.inlineData);
            if (imagePart) {
                finalImageBase64 = imagePart.inlineData.data;
            }
        }

        if (!finalImageBase64) {
            throw new Error('AI did not return image data');
        }

        return new Response(JSON.stringify({ resultImage: `data:image/png;base64,${finalImageBase64}` }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error('Edge Function Error:', error);
        return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

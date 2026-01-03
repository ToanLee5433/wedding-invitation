
/**
 * Gợi ý lời chúc đám cưới dựa trên tên khách mời.
 * Sử dụng Vercel Edge Function để giữ API key an toàn.
 */
export async function suggestWeddingWish(guestName: string): Promise<string> {
  try {
    // Call the Edge Function (API key is stored server-side)
    const response = await fetch('/api/suggest-wish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ guestName }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.wish || "Chúc hai bạn trăm năm hạnh phúc, đầu bạc răng long!";

  } catch (error) {
    console.error("Suggest wish error:", error);
    return "Chúc hai bạn mãi mãi bên nhau, cùng nhau xây dựng tổ ấm hạnh phúc viên mãn!";
  }
}

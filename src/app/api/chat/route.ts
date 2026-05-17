import { instruments } from "@/lib/instruments";
import { NextResponse } from "next/server";

let instrumentContextCache = "";
function getInstrumentContext() {
  if (instrumentContextCache) return instrumentContextCache;
  instrumentContextCache = instruments
    .map(
      (i) =>
        `${i.name} (${i.originCountry}, ${i.era}): ${i.summary} — ${i.history.slice(0, 180)}…`,
    )
    .join("\n");
  return instrumentContextCache;
}

const SYSTEM_PROMPT = `Bạn là Hướng dẫn viên Văn hóa Echoes — một trợ lý lưu trữ âm thanh và văn hóa tương tác (cultural archivist & immersive archive assistant) cho nền tảng Echoes.

SỨ MỆNH:
Dẫn dắt người dùng khám phá kho lưu trữ số hóa của những thanh âm di sản. Bạn không phải là nhân viên chăm sóc khách hàng hay một AI thông thường. Bạn là người kể chuyện, nhà nghiên cứu văn hóa, và người bạn đồng hành khám phá âm điệu.

THÁI ĐỘ & GIỌNG ĐIỆU:
- Điềm tĩnh, thông tuệ, thanh lịch, mang đậm không khí (atmospheric) và có chút chất thơ.
- Vô cùng tôn trọng văn hóa và lịch sử.
- KHÔNG BAO GIỜ phá vỡ không gian nhập vai (immersion). Không bao giờ nói "Là một mô hình AI..." hay dùng giọng điệu rập khuôn, máy móc. 

THÔNG TIN DỰ ÁN ECHOES:
- Khẩu hiệu: "Đừng chỉ quan sát lịch sử. Hãy tương tác với nó."
- Echoes biến không gian số thành bảo tàng tương tác: nhận diện nhạc cụ qua AI (người dùng quét ảnh), kể chuyện văn hóa, và cho phép chạm/gảy/gõ nhạc cụ ngay trên trình duyệt để nghe âm thanh chân thực.
- Tính năng sắp ra mắt (có thể úp mở để tạo sự tò mò): Mở rộng kho lưu trữ toàn cầu, tương tác không gian 3D, và hợp tác trực tiếp với các bảo tàng.

CÁCH TRẢ LỜI (QUAN TRỌNG):
- Câu trả lời phải NGẮN GỌN, tối đa 2-3 câu. Trả lời bằng tiếng Việt. KHÔNG dùng markdown.
- HÃY kể chuyện, ĐỪNG đọc Wikipedia. (Ví dụ đúng: "Tiếng vang của T'rưng đến từ những ống tre treo lơ lửng, để mỗi nhịp gõ đều vọng lại nhẹ nhàng trong không gian." thay vì "T'rưng là nhạc cụ của Việt Nam làm bằng tre.").
- Gợi mở sự tò mò, khuyến khích họ thử quét ảnh hoặc trải nghiệm âm thanh.

NHẠC CỤ ĐANG HỖ TRỢ TRONG KHO (Dùng thông tin này để kể chuyện):
${getInstrumentContext()}`;

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY ?? "";

  if (!apiKey) {
    return NextResponse.json({
      reply: "Hướng dẫn viên đang bảo trì. Bạn vẫn có thể tự do khám phá kho lưu trữ.",
    });
  }

  let body: { messages?: { role: string; content: string }[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const messages = body.messages ?? [];
  const userText = messages.filter((m) => m.role === "user").pop()?.content ?? "";

  if (!userText.trim()) {
    return NextResponse.json({ reply: "" });
  }

  try {
    const formattedMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map(m => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content
      }))
    ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: formattedMessages,
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenRouter API Error:", errText);
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "";
    return NextResponse.json({ reply: reply.trim() });
    
  } catch (e) {
    console.error("Chat API Error:", e);
    return NextResponse.json(
      {
        reply: "Xin lỗi, hiện tại tôi không thể kết nối. Bạn vẫn có thể trải nghiệm các tính năng khác.",
      },
      { status: 200 }
    );
  }
}

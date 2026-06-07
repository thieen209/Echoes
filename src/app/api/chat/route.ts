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

function removeVietnameseTones(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d");
}

function getLocalFallbackReply(userText: string): string {
  const text = userText.toLowerCase();
  const normalizedText = removeVietnameseTones(text);

  // Greetings
  if (
    text.includes("chào") ||
    text.includes("hello") ||
    text.includes("hi") ||
    text.includes("helo") ||
    normalizedText.includes("chao")
  ) {
    return "Xin chào người bạn phương xa. Tôi là Hướng dẫn viên Văn hóa Echoes. Hôm nay, bạn muốn cùng tôi lắng nghe hay tìm hiểu về thanh âm di sản nào?";
  }

  // Project Echoes
  if (
    text.includes("dự án") ||
    text.includes("echoes") ||
    text.includes("đề tài") ||
    text.includes("nền tảng") ||
    text.includes("triển lãm") ||
    normalizedText.includes("du an") ||
    normalizedText.includes("de tai") ||
    normalizedText.includes("nen tang") ||
    normalizedText.includes("trien lam")
  ) {
    return "Echoes là một nền tảng triển lãm số tương tác, nơi những thanh âm di sản được hồi sinh. Tại đây, bạn có thể tự tay chạm/gảy/gõ nhạc cụ để nghe âm thanh chân thực nhất ngay trên trình duyệt.";
  }

  // Dan Bau
  if (
    text.includes("bầu") ||
    text.includes("đàn bầu") ||
    text.includes("monochord") ||
    normalizedText.includes("bau") ||
    normalizedText.includes("dan bau")
  ) {
    return "Đàn Bầu là nét chấm phá độc đáo của tâm hồn Việt, chỉ với một dây và cần rung đã ngân lên mọi cung bậc cảm xúc. Tiếng đàn tựa như tiếng lòng sâu lắng, mộc mạc mà lay động lòng người.";
  }

  // Dan Tranh
  if (
    text.includes("tranh") ||
    text.includes("đàn tranh") ||
    text.includes("zither") ||
    normalizedText.includes("tranh") ||
    normalizedText.includes("dan tranh")
  ) {
    return "Đàn Tranh mang âm sắc trong trẻo, réo rắt tựa dòng nước tuôn chảy qua những phím hình chữ nhân nâng đỡ mười sáu sợi tơ. Hãy thử gảy nhẹ một nhịp ở bộ sưu tập để cảm nhận âm điệu thanh tao này.";
  }

  // Trung
  if (
    text.includes("trưng") ||
    text.includes("t'rưng") ||
    text.includes("t-rưng") ||
    text.includes("xylophone") ||
    normalizedText.includes("trung") ||
    normalizedText.includes("t'rung")
  ) {
    return "Tiếng vang của T'rưng đến từ những ống tre treo lơ lửng, để mỗi nhịp gõ đều vọng lại nhẹ nhàng trong gió ngàn Tây Nguyên. Đó là hơi thở của đại ngàn, vừa mộc mạc vừa rộn rã.";
  }

  // Shamisen
  if (text.includes("shamisen") || text.includes("samisen")) {
    return "Shamisen là hiện thân của nghệ thuật truyền thống Nhật Bản, với ba sợi tơ ngân vang đầy kiêu hãnh dưới chiếc gảy bachi dứt khoát. Âm điệu của nó vừa u uẩn hoài niệm, vừa mạnh mẽ lay động.";
  }

  // Sitar
  if (text.includes("sitar")) {
    return "Sitar mang âm hưởng huyền bí từ Ấn Độ cổ kính, nơi thân đàn bằng quả bầu khô cộng hưởng cùng hàng chục sợi dây phụ. Âm thanh ngân vang trùng điệp tạo nên một không gian thiền định sâu lắng.";
  }

  // Scan/Recognize
  if (
    text.includes("quét") ||
    text.includes("chụp") ||
    text.includes("camera") ||
    text.includes("nhận diện") ||
    normalizedText.includes("quet") ||
    normalizedText.includes("chup") ||
    normalizedText.includes("nhan dien")
  ) {
    return "Tính năng Quét Nhạc Cụ giúp bạn số hóa trải nghiệm. Hãy bật camera hoặc tải lên một hình ảnh nhạc cụ để hệ thống AI của Echoes nhận diện và mở ra kho tàng lịch sử của nó.";
  }

  // Play/Listen/Interact
  if (
    text.includes("chơi") ||
    text.includes("gảy") ||
    text.includes("gõ") ||
    text.includes("nghe") ||
    text.includes("tương tác") ||
    text.includes("âm thanh") ||
    normalizedText.includes("choi") ||
    normalizedText.includes("gay") ||
    normalizedText.includes("go") ||
    normalizedText.includes("nghe") ||
    normalizedText.includes("tuong tac") ||
    normalizedText.includes("am thanh")
  ) {
    return "Hãy bấm vào bất kỳ nhạc cụ nào trong 'Bộ Sưu Tập' ở trang chủ, sau đó chọn 'Trải nghiệm chơi thử'. Bạn có thể click chuột hoặc chạm màn hình để tự tay gảy những giai điệu cổ xưa.";
  }

  // Team/Authors
  if (
    text.includes("tác giả") ||
    text.includes("nhóm") ||
    text.includes("ai làm") ||
    text.includes("thành viên") ||
    text.includes("người thực hiện") ||
    normalizedText.includes("tac gia") ||
    normalizedText.includes("nhom") ||
    normalizedText.includes("ai lam") ||
    normalizedText.includes("thanh vien") ||
    normalizedText.includes("nguoi thuc hien")
  ) {
    return "Triển lãm này được thực hiện bởi đội ngũ Echoes Studio, một nhóm các bạn trẻ yêu văn hóa với mong muốn lưu giữ hồn cốt dân tộc thông qua công nghệ hiện đại.";
  }

  // Survey
  if (
    text.includes("khảo sát") ||
    text.includes("survey") ||
    text.includes("đóng góp") ||
    normalizedText.includes("khao sat") ||
    normalizedText.includes("dong gop")
  ) {
    return "Khảo sát của Echoes nằm trong menu ở góc trên cùng bên phải. Rất mong bạn dành chút thời gian đóng góp ý kiến để giúp không gian triển lãm ngày một hoàn thiện hơn.";
  }

  // Goodbye/Thanks
  if (
    text.includes("tạm biệt") ||
    text.includes("bye") ||
    text.includes("cảm ơn") ||
    text.includes("thanks") ||
    text.includes("thank") ||
    normalizedText.includes("tam biet") ||
    normalizedText.includes("cam on")
  ) {
    return "Chúc bạn có những phút giây tĩnh lặng và kết nối sâu sắc cùng những thanh âm di sản. Hẹn gặp lại bạn trong hành trình gìn giữ tiếng vang quá khứ.";
  }

  // General fallback poetic responses
  const fallbacks = [
    "Mỗi nhạc cụ trong kho lưu trữ của Echoes đều mang một câu chuyện lịch sử riêng. Bạn có muốn cùng tôi tìm hiểu sâu hơn về Đàn Bầu, Đàn Tranh hay T'rưng?",
    "Thanh âm là sợi dây vô hình kết nối các thế hệ. Hãy thử gảy một nốt nhạc trên Đàn Tranh hoặc gõ một nhịp T'rưng ở trang chủ để nghe tiếng lòng của quá khứ.",
    "Tôi luôn ở đây để chia sẻ những câu chuyện về nhạc cụ truyền thống Việt Nam và thế giới. Hãy cho tôi biết bạn đang tò mò về âm điệu của vùng đất nào?",
    "Đôi khi, nét đẹp tinh tế nhất lại ẩn sau những khoảng lặng giữa các nốt nhạc. Bạn muốn tôi kể về lịch sử của một nhạc cụ cụ thể nào không?",
    "Một câu hỏi thú vị. Trong kho tàng của Echoes, mỗi tiếng đàn đều có một cuộc đời riêng. Bạn muốn khám phá nhạc cụ Việt Nam hay quốc tế?"
  ];

  const randomIndex = Math.floor(Math.random() * fallbacks.length);
  return fallbacks[randomIndex];
}

export async function POST(request: Request) {
  // Use real key if provided in environment, or use hardcoded placeholder
  const hasEnvKey = !!process.env.GROQ_API_KEY;
  const apiKey = process.env.GROQ_API_KEY || "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";

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

  // If there's no real environment key configured, bypass the API call entirely to save latency and avoid unnecessary 401s
  if (!hasEnvKey) {
    const fallbackReply = getLocalFallbackReply(userText);
    return NextResponse.json({ reply: fallbackReply });
  }

  try {
    const formattedMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map(m => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content
      }))
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: formattedMessages,
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq API Error:", errText);
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "";
    return NextResponse.json({ reply: reply.trim() });
    
  } catch (e) {
    console.error("Chat API Error, falling back to local guide logic:", e);
    // If the API call fails (e.g. rate limit, invalid key), return our smart local fallback response instead of the generic error message
    const fallbackReply = getLocalFallbackReply(userText);
    return NextResponse.json({ reply: fallbackReply });
  }
}

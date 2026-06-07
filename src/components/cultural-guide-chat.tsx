"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/lib/i18n/locale-context";

type Message = {
  role: "user" | "assistant";
  content: string;
};

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

export function CulturalGuideChat() {
  const { t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: "assistant", content: t.chat.greeting }]);
    }
  }, [isOpen, messages.length, t.chat.greeting]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
        }),
      });

      if (!res.ok) throw new Error("API Error");
      const data = await res.json();
      
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      console.warn("Client fallback used due to network or server issue:", err);
      const fallbackReply = getLocalFallbackReply(userMessage);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: fallbackReply },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-neutral-900/80 hover:bg-neutral-800 text-amber-500 rounded-full border border-amber-500/30 backdrop-blur-xl transition-all duration-300 shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:shadow-[0_0_40px_rgba(245,158,11,0.3)] group hover:scale-105 active:scale-95 flex items-center justify-center"
        aria-label="Toggle chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="fixed bottom-24 right-6 z-40 w-[380px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] flex flex-col bg-neutral-950/80 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/5"
          >
            {/* Cinematic Header */}
            <div className="flex items-center justify-between p-5 bg-gradient-to-b from-amber-500/10 to-transparent border-b border-white/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay"></div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-500">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="font-medium text-white/90 text-sm tracking-wide uppercase">{t.chat.title}</h3>
                  <p className="text-xs text-white/50">Trợ lý AI</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-white/40 hover:text-white/90 hover:bg-white/5 rounded-full transition-all relative z-10"
                aria-label="Đóng"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent relative">
              <div className="absolute inset-0 bg-noise opacity-[0.02] mix-blend-overlay pointer-events-none"></div>
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i === messages.length - 1 ? 0.1 : 0 }}
                  key={i}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  } relative z-10`}
                >
                  <div
                    className={`max-w-[85%] px-5 py-3.5 text-[15px] leading-relaxed shadow-sm ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-amber-600/90 to-amber-700/90 text-white rounded-3xl rounded-br-sm border border-amber-500/50 shadow-amber-900/20"
                        : "bg-white/5 text-white/85 rounded-3xl rounded-bl-sm border border-white/10"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start relative z-10"
                >
                  <div className="bg-white/5 border border-white/10 rounded-3xl rounded-bl-sm px-5 py-4 flex items-center gap-2 text-white/50">
                    <Loader2 size={16} className="animate-spin text-amber-500/70" />
                    <span className="text-sm">Đang suy nghĩ...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-neutral-900/60 border-t border-white/5 relative z-10">
              <form
                onSubmit={handleSubmit}
                className="flex gap-2 items-end relative"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t.chat.placeholder}
                    className="w-full bg-black/50 border border-white/10 rounded-2xl pl-5 pr-12 py-3.5 text-[15px] text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-amber-500 text-neutral-950 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-amber-400 hover:scale-105 active:scale-95 transition-all"
                    aria-label="Gửi"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

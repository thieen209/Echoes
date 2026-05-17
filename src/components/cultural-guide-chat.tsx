"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/lib/i18n/locale-context";

type Message = {
  role: "user" | "assistant";
  content: string;
};

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
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Xin lỗi, hiện tại tôi không thể kết nối. Vui lòng thử lại sau." },
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

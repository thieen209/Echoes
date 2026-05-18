"use client";

import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Camera, Save, User as UserIcon, LogOut, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function ProfilePage() {
  const { user, updateProfile, signOut } = useAuth();
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    } else {
      setName(user.user_metadata?.full_name || user.user_metadata?.name || "Người lưu trữ");
      setPictureUrl(user.user_metadata?.avatar_url || user.user_metadata?.picture || "");
    }
  }, [user, router]);

  if (!user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });
    
    const { error } = await updateProfile({
      name: name.trim(),
      picture: pictureUrl.trim(),
    });

    setLoading(false);
    if (error) {
      setMessage({ text: "Lỗi khi cập nhật hồ sơ: " + error.message, type: "error" });
    } else {
      setMessage({ text: "Hồ sơ đã được cập nhật thành công.", type: "success" });
      setIsEditing(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="museum-shell bg-[#050505]">
      <SiteNav />
      <main className="relative z-10 mx-auto w-full max-w-4xl px-5 pb-24 pt-32 sm:px-8 lg:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted transition hover:text-foreground"
          >
            <ArrowLeft size={16} />
            Trở về
          </Link>

          <div className="mb-10 flex items-end justify-between">
            <div>
              <h1 className="font-epic text-4xl text-foreground sm:text-5xl">
                Hồ Sơ Người Lưu Trữ
              </h1>
              <p className="mt-3 text-sm text-muted">
                Quản lý danh tính và dấu ấn cá nhân của bạn trong không gian Echoes.
              </p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
            {/* Sidebar / Avatar */}
            <div className="flex flex-col items-center rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center backdrop-blur-md">
              <div className="relative mb-6 size-32 overflow-hidden rounded-full border-2 border-gold/30 bg-black/50">
                {pictureUrl ? (
                  <Image src={pictureUrl} alt="Avatar" fill className="object-cover" unoptimized />
                ) : (
                  <div className="grid h-full w-full place-items-center text-gold/50">
                    <UserIcon size={48} strokeWidth={1.5} />
                  </div>
                )}
              </div>
              <h2 className="font-epic text-xl text-foreground">{user.user_metadata?.full_name || user.user_metadata?.name || "Người lưu trữ"}</h2>
              <p className="mt-1 text-xs text-muted/70">{user.email}</p>
              
              <div className="mt-6 flex w-full flex-col gap-3">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full rounded-lg border border-gold/40 bg-gold/10 py-2.5 text-xs uppercase tracking-[0.15em] text-gold transition hover:bg-gold/20"
                  >
                    Chỉnh sửa hồ sơ
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setName(user.user_metadata?.full_name || user.user_metadata?.name || "Người lưu trữ");
                      setPictureUrl(user.user_metadata?.avatar_url || user.user_metadata?.picture || "");
                      setMessage({ text: "", type: "" });
                    }}
                    className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 text-xs uppercase tracking-[0.15em] text-muted transition hover:bg-white/10 hover:text-foreground"
                  >
                    Hủy bỏ
                  </button>
                )}
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 py-2.5 text-xs uppercase tracking-[0.15em] text-red-400 transition hover:bg-red-500/20 hover:text-red-300"
                >
                  <LogOut size={14} />
                  Đăng xuất
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-md">
              <h3 className="mb-6 font-epic text-2xl text-foreground">Thông tin cá nhân</h3>
              
              {message.text && (
                <div className={`mb-6 rounded-lg p-4 text-sm ${message.type === 'error' ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-green-500/10 border border-green-500/20 text-green-400'}`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-white/50" htmlFor="name">
                    Danh xưng (Tên hiển thị)
                  </label>
                  <input
                    id="name"
                    disabled={!isEditing}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-foreground outline-none transition focus:border-gold/50 focus:ring-1 focus:ring-gold/30 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-white/50" htmlFor="email">
                    Định danh (Email)
                  </label>
                  <input
                    id="email"
                    disabled
                    value={user.email}
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-foreground outline-none disabled:opacity-50"
                  />
                  <p className="mt-2 text-xs text-muted/50">Email không thể thay đổi sau khi đăng ký.</p>
                </div>

                {isEditing && (
                  <div>
                    <label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-white/50" htmlFor="picture">
                      URL Ảnh đại diện
                    </label>
                    <div className="flex gap-3">
                      <input
                        id="picture"
                        value={pictureUrl}
                        onChange={(e) => setPictureUrl(e.target.value)}
                        placeholder="https://example.com/avatar.jpg"
                        className="flex-1 rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-foreground outline-none transition focus:border-gold/50 focus:ring-1 focus:ring-gold/30"
                      />
                    </div>
                  </div>
                )}

                {user.app_metadata?.provider === "google" && !isEditing && (
                  <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
                    <p className="text-xs text-blue-400/80">
                      Tài khoản được liên kết với Google. Một số thông tin được đồng bộ tự động.
                    </p>
                  </div>
                )}

                {isEditing && (
                  <div className="flex justify-end pt-4 border-t border-white/10">
                    <button
                      type="submit"
                      disabled={loading || !name.trim()}
                      className="flex items-center gap-2 rounded-lg bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-black transition hover:bg-gold/90 hover:shadow-[0_0_20px_rgba(200,169,107,0.4)] disabled:opacity-50"
                    >
                      {loading ? (
                        "Đang lưu..."
                      ) : (
                        <>
                          <Save size={16} />
                          Lưu thay đổi
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </motion.div>
      </main>
      <SiteFooter />
    </div>
  );
}

"use client";

import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { motion } from "framer-motion";
import { ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="museum-shell">
      <SiteNav />
      <main className="relative z-10 mx-auto max-w-3xl px-5 pb-24 pt-32 sm:px-8 lg:pt-36">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-foreground"
          >
            <ArrowLeft size={16} />
            Trở về trang chủ
          </Link>

          <div className="mt-10 flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-xl border border-gold/25 bg-gold/10 text-gold">
              <Shield size={22} />
            </div>
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.35em] text-gold/70">
                Bảo mật
              </p>
              <h1 className="font-epic text-3xl text-foreground sm:text-4xl">
                Chính Sách Quyền Riêng Tư
              </h1>
            </div>
          </div>

          <p className="mt-6 text-sm text-muted">
            Cập nhật lần cuối: Tháng 5 năm 2026
          </p>

          <div className="hairline mt-8" />

          <article className="prose-echoes mt-10 space-y-8 text-[0.9rem] leading-7 text-muted/90">
            <p>Echoes cam kết tôn trọng và bảo vệ quyền riêng tư của người dùng.</p>
            <p>Chính sách này giải thích:</p>
            <ul className="mt-3 list-inside list-disc space-y-2 text-muted/80">
              <li>dữ liệu nào được thu thập</li>
              <li>dữ liệu được sử dụng như thế nào</li>
              <li>cách Echoes bảo vệ thông tin người dùng</li>
            </ul>

            <section>
              <h2 className="font-epic mb-4 text-xl text-foreground">1. Dữ liệu được thu thập</h2>
              <p>Echoes có thể thu thập:</p>
              
              <h3 className="font-epic mt-4 text-lg text-foreground/90">Thông tin tài khoản</h3>
              <ul className="mt-2 list-inside list-disc space-y-2 text-muted/80">
                <li>tên người dùng</li>
                <li>email</li>
                <li>ảnh đại diện (nếu có)</li>
              </ul>

              <h3 className="font-epic mt-4 text-lg text-foreground/90">Nội dung tải lên</h3>
              <ul className="mt-2 list-inside list-disc space-y-2 text-muted/80">
                <li>hình ảnh nhạc cụ</li>
                <li>dữ liệu tương tác</li>
                <li>lịch sử khám phá</li>
              </ul>

              <h3 className="font-epic mt-4 text-lg text-foreground/90">Dữ liệu kỹ thuật</h3>
              <ul className="mt-2 list-inside list-disc space-y-2 text-muted/80">
                <li>loại thiết bị</li>
                <li>trình duyệt</li>
                <li>thời gian truy cập</li>
                <li>nhật ký lỗi</li>
                <li>dữ liệu phân tích hiệu suất</li>
              </ul>
            </section>

            <section>
              <h2 className="font-epic mb-4 text-xl text-foreground">2. Mục đích sử dụng dữ liệu</h2>
              <p>Dữ liệu được sử dụng nhằm:</p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted/80">
                <li>vận hành nền tảng</li>
                <li>cải thiện AI nhận diện</li>
                <li>cá nhân hóa trải nghiệm</li>
                <li>tối ưu hiệu suất</li>
                <li>bảo mật hệ thống</li>
                <li>phát triển tính năng mới</li>
              </ul>
              <p className="mt-3">Echoes không bán dữ liệu cá nhân cho bên thứ ba.</p>
            </section>

            <section>
              <h2 className="font-epic mb-4 text-xl text-foreground">3. AI và dữ liệu hình ảnh</h2>
              <p>Hình ảnh tải lên có thể được:</p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted/80">
                <li>xử lý bởi hệ thống AI</li>
                <li>gửi đến mô hình nhận diện</li>
                <li>sử dụng để tạo phản hồi tương tác</li>
              </ul>
              <p className="mt-3">Một số dữ liệu có thể được xử lý thông qua dịch vụ AI bên thứ ba phục vụ chức năng nhận diện.</p>
            </section>

            <section>
              <h2 className="font-epic mb-4 text-xl text-foreground">4. Lưu trữ và bảo mật</h2>
              <p>Echoes áp dụng các biện pháp bảo mật hợp lý nhằm:</p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted/80">
                <li>bảo vệ dữ liệu người dùng</li>
                <li>ngăn truy cập trái phép</li>
                <li>hạn chế rò rỉ thông tin</li>
              </ul>
              <p className="mt-3">Tuy nhiên, không có hệ thống nào đảm bảo an toàn tuyệt đối trên Internet.</p>
            </section>

            <section>
              <h2 className="font-epic mb-4 text-xl text-foreground">5. Cookie và phân tích</h2>
              <p>Echoes có thể sử dụng:</p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted/80">
                <li>cookie</li>
                <li>analytics</li>
                <li>session tracking</li>
              </ul>
              <p className="mt-3">nhằm:</p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted/80">
                <li>ghi nhớ phiên đăng nhập</li>
                <li>cải thiện trải nghiệm</li>
                <li>phân tích hiệu suất sử dụng</li>
              </ul>
              <p className="mt-3">Người dùng có thể tắt cookie trong trình duyệt nếu muốn.</p>
            </section>

            <section>
              <h2 className="font-epic mb-4 text-xl text-foreground">6. Chia sẻ dữ liệu</h2>
              <p>Echoes không bán dữ liệu cá nhân.</p>
              <p className="mt-3">Dữ liệu chỉ có thể được chia sẻ trong các trường hợp:</p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted/80">
                <li>yêu cầu pháp lý</li>
                <li>bảo vệ hệ thống</li>
                <li>tích hợp dịch vụ cần thiết</li>
                <li>vận hành nền tảng</li>
              </ul>
            </section>

            <section>
              <h2 className="font-epic mb-4 text-xl text-foreground">7. Quyền của người dùng</h2>
              <p>Người dùng có quyền:</p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted/80">
                <li>yêu cầu truy cập dữ liệu</li>
                <li>yêu cầu chỉnh sửa thông tin</li>
                <li>yêu cầu xóa dữ liệu cá nhân</li>
                <li>ngừng sử dụng dịch vụ</li>
              </ul>
            </section>

            <section>
              <h2 className="font-epic mb-4 text-xl text-foreground">8. Dữ liệu trẻ vị thành niên</h2>
              <p>Echoes không cố ý thu thập dữ liệu từ trẻ em trái với quy định pháp luật hiện hành.</p>
              <p className="mt-3">Nếu phát hiện dữ liệu không phù hợp, Echoes có thể:</p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted/80">
                <li>xóa dữ liệu</li>
                <li>hạn chế truy cập</li>
                <li>yêu cầu xác minh</li>
              </ul>
            </section>

            <section>
              <h2 className="font-epic mb-4 text-xl text-foreground">9. Thay đổi chính sách</h2>
              <p>Chính sách quyền riêng tư có thể được cập nhật nhằm phản ánh:</p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted/80">
                <li>thay đổi công nghệ</li>
                <li>thay đổi dịch vụ</li>
                <li>yêu cầu pháp lý mới</li>
              </ul>
            </section>

            <section>
              <h2 className="font-epic mb-4 text-xl text-foreground">10. Liên hệ</h2>
              <p>Nếu có câu hỏi liên quan đến quyền riêng tư hoặc dữ liệu cá nhân, vui lòng liên hệ đội ngũ Echoes qua các kênh hỗ trợ chính thức của dự án.</p>
            </section>
          </article>
        </motion.div>
      </main>
      <SiteFooter />
    </div>
  );
}

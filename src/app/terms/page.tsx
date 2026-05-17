"use client";

import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { motion } from "framer-motion";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
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
              <FileText size={22} />
            </div>
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.35em] text-gold/70">
                Pháp lý
              </p>
              <h1 className="font-epic text-3xl text-foreground sm:text-4xl">
                Điều Khoản Dịch Vụ
              </h1>
            </div>
          </div>

          <p className="mt-6 text-sm text-muted">
            Cập nhật lần cuối: Tháng 5 năm 2026
          </p>

          <div className="hairline mt-8" />

          <article className="prose-echoes mt-10 space-y-8 text-[0.9rem] leading-7 text-muted/90">
            <p>
              Chào mừng bạn đến với <strong>Echoes</strong> — nền tảng lưu trữ và khám phá nhạc cụ văn hóa tương tác sử dụng AI nhằm tái hiện, bảo tồn và lan tỏa những cộng hưởng văn hóa truyền thống thông qua trải nghiệm kỹ thuật số nhập vai.
            </p>
            <p>
              Khi truy cập hoặc sử dụng Echoes, bạn đồng ý tuân thủ các Điều Khoản Dịch Vụ dưới đây.
            </p>

            <section>
              <h2 className="font-epic mb-4 text-xl text-foreground">1. Giới thiệu về Echoes</h2>
              <p>Echoes là một nền tảng trải nghiệm số mang tính giáo dục, văn hóa và tương tác, cho phép người dùng:</p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted/80">
                <li>Khám phá các nhạc cụ truyền thống</li>
                <li>Tìm hiểu lịch sử và ý nghĩa văn hóa</li>
                <li>Tương tác với mô phỏng nhạc cụ</li>
                <li>Sử dụng AI để nhận diện nhạc cụ thông qua hình ảnh</li>
                <li>Tham gia vào kho lưu trữ cộng hưởng văn hóa số</li>
              </ul>
              <p className="mt-3">Echoes không chỉ là một website thông tin, mà còn là một không gian trải nghiệm nhằm lưu giữ ký ức âm thanh của nhiều nền văn hóa khác nhau.</p>
            </section>

            <section>
              <h2 className="font-epic mb-4 text-xl text-foreground">2. Chấp nhận điều khoản</h2>
              <p>Bằng việc sử dụng Echoes, bạn xác nhận rằng:</p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted/80">
                <li>Bạn đã đọc và đồng ý với các điều khoản này</li>
                <li>Bạn sử dụng nền tảng với mục đích hợp pháp</li>
                <li>Bạn sẽ không sử dụng Echoes để gây hại, phá hoại hoặc xâm phạm quyền của người khác</li>
              </ul>
              <p className="mt-3">Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng ngừng sử dụng nền tảng.</p>
            </section>

            <section>
              <h2 className="font-epic mb-4 text-xl text-foreground">3. Tài khoản người dùng</h2>
              <p>Một số tính năng của Echoes có thể yêu cầu đăng nhập hoặc tạo tài khoản.</p>
              <p className="mt-3">Người dùng có trách nhiệm:</p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted/80">
                <li>Bảo mật thông tin đăng nhập</li>
                <li>Không chia sẻ tài khoản cho người khác</li>
                <li>Thông báo nếu phát hiện truy cập trái phép</li>
              </ul>
              <p className="mt-3">Echoes có quyền:</p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted/80">
                <li>Tạm khóa tài khoản</li>
                <li>Hạn chế truy cập</li>
                <li>Xóa tài khoản vi phạm điều khoản</li>
              </ul>
              <p className="mt-3">mà không cần thông báo trước trong các trường hợp cần thiết.</p>
            </section>

            <section>
              <h2 className="font-epic mb-4 text-xl text-foreground">4. Nội dung người dùng tải lên</h2>
              <p>Người dùng có thể tải lên:</p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted/80">
                <li>Hình ảnh nhạc cụ</li>
                <li>Nội dung tương tác</li>
                <li>Dữ liệu phục vụ AI nhận diện</li>
              </ul>
              <p className="mt-3">Khi tải nội dung lên Echoes, bạn xác nhận rằng:</p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted/80">
                <li>Bạn sở hữu nội dung hoặc có quyền sử dụng hợp pháp</li>
                <li>Nội dung không vi phạm pháp luật hoặc quyền sở hữu trí tuệ</li>
                <li>Nội dung không chứa mã độc, nội dung nguy hiểm hoặc xúc phạm</li>
              </ul>
              <p className="mt-3">Echoes không tuyên bố sở hữu đối với nội dung người dùng tải lên.</p>
              <p className="mt-3">Tuy nhiên, người dùng đồng ý cho Echoes quyền sử dụng nội dung đó nhằm:</p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted/80">
                <li>Phân tích AI</li>
                <li>Cải thiện trải nghiệm</li>
                <li>Hiển thị trong phiên sử dụng</li>
                <li>Hỗ trợ chức năng của nền tảng</li>
              </ul>
            </section>

            <section>
              <h2 className="font-epic mb-4 text-xl text-foreground">5. Hệ thống AI và giới hạn</h2>
              <p>Echoes sử dụng các hệ thống AI hỗ trợ nhận diện và phân tích nhạc cụ văn hóa.</p>
              <p className="mt-3">Người dùng hiểu và chấp nhận rằng:</p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted/80">
                <li>Kết quả AI có thể không hoàn toàn chính xác</li>
                <li>Một số nhạc cụ có thể bị nhận diện sai</li>
                <li>AI chỉ mang tính hỗ trợ khám phá và giáo dục</li>
                <li>Các dữ liệu AI không được xem là xác minh học thuật tuyệt đối</li>
              </ul>
              <p className="mt-3">Các chỉ số như:</p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted/80">
                <li>độ tin cậy (confidence)</li>
                <li>phân tích hình ảnh</li>
                <li>suy luận AI</li>
                <li>gợi ý nhạc cụ</li>
              </ul>
              <p className="mt-3">đều được tạo tự động thông qua mô hình AI.</p>
            </section>

            <section>
              <h2 className="font-epic mb-4 text-xl text-foreground">6. Tôn trọng văn hóa</h2>
              <p>Echoes được xây dựng với mục tiêu bảo tồn và tôn vinh giá trị văn hóa truyền thống.</p>
              <p className="mt-3">Người dùng đồng ý:</p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted/80">
                <li>Không sử dụng nền tảng để chế giễu hoặc xúc phạm văn hóa</li>
                <li>Không xuyên tạc thông tin lịch sử</li>
                <li>Tôn trọng các cộng đồng văn hóa và di sản truyền thống</li>
              </ul>
              <p className="mt-3">Echoes phản đối mọi hành vi:</p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted/80">
                <li>phân biệt văn hóa</li>
                <li>bóp méo lịch sử</li>
                <li>xúc phạm bản sắc dân tộc hoặc cộng đồng</li>
              </ul>
            </section>

            <section>
              <h2 className="font-epic mb-4 text-xl text-foreground">7. Quyền sở hữu trí tuệ</h2>
              <p>Tất cả các thành phần thuộc Echoes bao gồm nhưng không giới hạn:</p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted/80">
                <li>thương hiệu, logo, giao diện, thiết kế UI/UX</li>
                <li>hiệu ứng hình ảnh, nội dung gốc, cấu trúc trải nghiệm</li>
                <li>animation, mã nguồn</li>
              </ul>
              <p className="mt-3">đều thuộc quyền sở hữu của đội ngũ phát triển Echoes, trừ khi có ghi chú khác.</p>
              <p className="mt-3">Nghiêm cấm:</p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted/80">
                <li>sao chép trái phép</li>
                <li>tái phân phối</li>
                <li>chỉnh sửa hoặc khai thác thương mại</li>
              </ul>
              <p className="mt-3">mà không có sự cho phép bằng văn bản.</p>
            </section>

            <section>
              <h2 className="font-epic mb-4 text-xl text-foreground">8. Tính khả dụng của nền tảng</h2>
              <p>Echoes là một nền tảng đang phát triển và có thể thay đổi theo thời gian.</p>
              <p className="mt-3">Chúng tôi không đảm bảo:</p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted/80">
                <li>nền tảng hoạt động liên tục 24/7</li>
                <li>không có lỗi kỹ thuật</li>
                <li>tất cả tính năng luôn khả dụng</li>
                <li>dữ liệu luôn chính xác tuyệt đối</li>
              </ul>
              <p className="mt-3">Một số tính năng có thể:</p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted/80">
                <li>đang thử nghiệm</li>
                <li>chưa hoàn thiện</li>
                <li>bị thay đổi hoặc gỡ bỏ</li>
              </ul>
              <p className="mt-3">mà không cần thông báo trước.</p>
            </section>

            <section>
              <h2 className="font-epic mb-4 text-xl text-foreground">9. Giới hạn trách nhiệm</h2>
              <p>Echoes được cung cấp trên cơ sở &ldquo;nguyên trạng&rdquo; (as-is).</p>
              <p className="mt-3">Đội ngũ Echoes không chịu trách nhiệm đối với:</p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted/80">
                <li>lỗi AI</li>
                <li>mất dữ liệu</li>
                <li>gián đoạn truy cập</li>
                <li>thiệt hại phát sinh từ việc sử dụng nền tảng</li>
                <li>nội dung do người dùng tải lên</li>
              </ul>
              <p className="mt-3">Người dùng tự chịu trách nhiệm đối với cách sử dụng nền tảng của mình.</p>
            </section>

            <section>
              <h2 className="font-epic mb-4 text-xl text-foreground">10. Liên kết và dịch vụ bên thứ ba</h2>
              <p>Echoes có thể tích hợp hoặc sử dụng:</p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted/80">
                <li>dịch vụ AI</li>
                <li>nền tảng xác thực</li>
                <li>công cụ phân tích</li>
                <li>dịch vụ lưu trữ</li>
                <li>thư viện mã nguồn mở</li>
              </ul>
              <p className="mt-3">Các dịch vụ bên thứ ba này có thể có điều khoản và chính sách riêng.</p>
              <p className="mt-3">Echoes không chịu trách nhiệm đối với:</p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted/80">
                <li>nội dung bên thứ ba</li>
                <li>lỗi từ dịch vụ ngoài</li>
                <li>thay đổi từ nền tảng đối tác</li>
              </ul>
            </section>

            <section>
              <h2 className="font-epic mb-4 text-xl text-foreground">11. Chấm dứt truy cập</h2>
              <p>Echoes có quyền:</p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted/80">
                <li>từ chối truy cập</li>
                <li>giới hạn tài khoản</li>
                <li>xóa dữ liệu vi phạm</li>
              </ul>
              <p className="mt-3">nếu phát hiện:</p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted/80">
                <li>hành vi gây hại</li>
                <li>khai thác hệ thống</li>
                <li>spam</li>
                <li>lạm dụng AI</li>
                <li>vi phạm điều khoản</li>
              </ul>
            </section>

            <section>
              <h2 className="font-epic mb-4 text-xl text-foreground">12. Thay đổi điều khoản</h2>
              <p>Echoes có thể cập nhật Điều Khoản Dịch Vụ bất kỳ lúc nào nhằm:</p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted/80">
                <li>cải thiện nền tảng</li>
                <li>cập nhật tính năng</li>
                <li>tuân thủ quy định pháp lý</li>
                <li>thay đổi công nghệ sử dụng</li>
              </ul>
              <p className="mt-3">Người dùng nên kiểm tra định kỳ để cập nhật thay đổi mới nhất.</p>
            </section>

            <section>
              <h2 className="font-epic mb-4 text-xl text-foreground">13. Liên hệ</h2>
              <p>Nếu có câu hỏi liên quan đến Điều Khoản Dịch Vụ, vui lòng liên hệ đội ngũ Echoes thông qua các kênh hỗ trợ chính thức của dự án.</p>
            </section>
          </article>
        </motion.div>
      </main>
      <SiteFooter />
    </div>
  );
}

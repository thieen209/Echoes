import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { UploadDropzone } from "@/components/upload-dropzone";
import { EchoesLogoMark } from "@/components/echoes-logo";
import { Reveal } from "@/components/motion-reveal";
import Link from "next/link";

export default function UploadPage() {
  return (
    <div className="museum-shell">
      <SiteNav />
      <main className="relative z-10 px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
        <section className="relative mx-auto max-w-6xl overflow-hidden pb-12">
          <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
          <div className="relative flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.45em] text-gold">
                Phòng tiếp nhận hình ảnh
              </p>
              <h1 className="font-epic mt-6 text-5xl leading-[0.95] text-foreground sm:text-6xl lg:text-7xl">
                Để kho lưu lắng nghe bằng mắt.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
                Đặt một bức ảnh lên mặt bàn tối. Echoes sẽ mở chuỗi phân tích
                trước khi đưa bạn đến hồ sơ văn hóa có thể tương tác gần nhất.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 text-sm text-muted">
                <Link className="text-gold underline-offset-4 hover:underline" href="/detect">
                  Xem lại màn quét gần nhất
                </Link>
                <span className="hidden sm:inline">·</span>
                <Link className="text-gold underline-offset-4 hover:underline" href="/archive">
                  Xem các nhạc cụ được hỗ trợ
                </Link>
              </div>
            </div>
            <Reveal>
              <EchoesLogoMark size={100} />
            </Reveal>
          </div>
        </section>
        <UploadDropzone />
      </main>
      <SiteFooter />
    </div>
  );
}

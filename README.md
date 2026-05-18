<div align="center">
  <img src="public/images/og-image.jpg" alt="Echoes Banner" width="100%" />
  
  # 🏺 Echoes — Lưu Trữ Thanh Âm Di Sản
  **Một nền tảng bảo tàng số tương tác mang đậm chất điện ảnh, kết nối con người với những di sản âm nhạc truyền thống thông qua công nghệ.**
  
  <p align="center">
    <a href="#giới-thiệu">Giới thiệu</a> •
    <a href="#tính-năng-cốt-lõi">Tính năng</a> •
    <a href="#kho-nhạc-cụ">Kho Nhạc Cụ</a> •
    <a href="#công-nghệ-sử-dụng">Công nghệ</a> •
    <a href="#cài-đặt">Cài đặt</a>
  </p>
</div>

---

## 📖 Giới thiệu

**Echoes** không chỉ là một ứng dụng web thông thường, mà là một **"trải nghiệm triển lãm tương tác"**. Dự án được xây dựng với mục tiêu bảo tồn và lan tỏa vẻ đẹp của các nhạc cụ truyền thống (Đặc biệt là văn hóa Việt Nam và Á Đông). 

Với Echoes, người dùng không chỉ **nhìn ngắm** lịch sử qua những hình ảnh tĩnh, mà có thể **chạm, lắng nghe và tương tác** trực tiếp với nhạc cụ ngay trên trình duyệt thông qua hệ thống âm thanh mô phỏng vật lý (Physical Modeling) và lấy mẫu (Multisampling) chất lượng cao.

---

## ✨ Tính năng cốt lõi

### 🔍 1. Nhận diện Nhạc cụ thông minh (AI Scanner)
- Cho phép người dùng tải lên hoặc sử dụng camera để quét hình ảnh nhạc cụ.
- Trải nghiệm giao diện quét mang phong cách viễn tưởng (cinematic scanning flow), sau đó tự động điều hướng đến hồ sơ lịch sử tương ứng của nhạc cụ trong kho lưu trữ.

### 🎹 2. Trải nghiệm Chơi nhạc Cảm ứng (Playable Instruments)
- **Kiến trúc âm thanh Tone.js**: Thay vì chỉ phát một file âm thanh đơn điệu, Echoes cung cấp một Engine âm thanh mạnh mẽ tích hợp cả `Tone.Sampler` và `Tone.PolySynth` (FMSynth, PluckSynth, MembraneSynth).
- **Phản hồi tương tác (Interactive Audio-Visual)**: Mỗi lần gảy đàn, sóng âm thanh (Amplitude) sẽ được Web Audio API phân tích theo thời gian thực để kích hoạt các rung động hình ảnh (Visualizer) trên màn hình.
- Độ trễ cực thấp, hỗ trợ vuốt/chạm đa điểm trên thiết bị di động. Các hiệu ứng bồi âm, độ ngân, luyến láy (pitch bend của Đàn Bầu) được tái tạo sát với thực tế nhất.

### 🤖 3. Hướng dẫn viên Văn hóa Ảo (AI Guide)
- Trợ lý AI tích hợp **Groq API (Llama 3.3 70B)** đóng vai trò như một người quản thủ thư viện uyên bác.
- Thay vì trả lời máy móc, AI được huấn luyện với **System Prompt** mang âm hưởng thơ ca, điềm tĩnh, kể lại những câu chuyện lịch sử đằng sau mỗi nhạc cụ mà không làm phá vỡ không gian nhập vai (immersion) của người dùng.

### 🎨 4. Giao diện Điện ảnh (Cinematic UX/UI)
- Phong cách Dark Mode sâu thẳm, kết hợp cùng hiệu ứng hạt (noise), typography hoài cổ, và các viền vàng (gold accents) tạo cảm giác cao cấp.
- Chuyển động (Animations) mượt mà được xây dựng trên **Framer Motion**, mang đến sự liền mạch từ trang chủ cho đến sâu bên trong kho lưu trữ.

---

## 🪕 Kho Nhạc Cụ (Đang hỗ trợ)

1. **Đàn Bầu (Việt Nam)**: Tương tác uốn cần đàn (pitch bend) mượt mà, tái tạo bồi âm đặc trưng chỉ với một dây duy nhất.
2. **Đàn Tranh (Việt Nam)**: Giao diện chuỗi dây nằm ngang, bắt trọn độ nảy (pluck) và thang âm ngũ cung trong trẻo.
3. **T'rưng (Việt Nam)**: Hệ thống thanh tre tương tác kích thước động, tái tạo âm hưởng gõ mộc mạc của núi rừng Tây Nguyên.
4. **Shamisen (Nhật Bản)**: Nhạc cụ ba dây với âm vực gắt, ngắn và độ nảy mạnh mẽ mang âm hưởng kịch Kabuki.
5. **Sitar (Ấn Độ)**: Tái tạo những rung động giao thoa huyền ảo và độ ngân vô tận của các dây cộng hưởng (sympathetic strings).

---

## 🛠 Công nghệ sử dụng

Dự án được phát triển dựa trên hệ sinh thái hiện đại và tối ưu hiệu suất:

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router) + React 19
- **Giao diện & Hoạt ảnh**: [TailwindCSS v4](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/)
- **Xử lý Âm thanh**: [Tone.js](https://tonejs.github.io/) + Web Audio API
- **AI & Logic**: [Groq SDK](https://groq.com/) (LLaMA 3.3 70B)
- **Xác thực (Auth)**: [Supabase Auth](https://supabase.com/) *(Hiện đang tạm mở public bypass để người dùng tự do trải nghiệm)*
- **Ngôn ngữ**: TypeScript 100% Type-safe.

## 🎧 Cách trải nghiệm Echoes

Để tận hưởng trọn vẹn nhất không gian mà Echoes mang lại, bạn nên:
1. **Sử dụng Tai nghe (Headphones)**: Hệ thống âm thanh được tinh chỉnh không gian 3D (Spatial Audio) và Reverb sẽ mang lại cảm giác chân thực nhất khi nghe bằng tai nghe.
2. **Khám phá tự do (Exploration)**: Đừng ngại thử chạm, gõ, uốn nắn các nhạc cụ trên màn hình. Mỗi tương tác đều mang lại phản hồi âm thanh và hình ảnh ngay lập tức.
3. **Trò chuyện cùng Hướng dẫn viên**: Hãy đặt câu hỏi cho Hướng dẫn viên Văn hóa Ảo (Biểu tượng Chat) để hiểu thêm về bối cảnh lịch sử của từng nhạc cụ.
4. **Sử dụng tính năng Quét (Scan)**: Trải nghiệm công nghệ phân tích và nhận diện hình ảnh nhạc cụ ngay từ trang chủ.

---

## 👥 Về dự án

**Echoes** là tâm huyết của những người trẻ yêu nghệ thuật số, với mong muốn dùng công nghệ hiện đại làm cầu nối đưa những giá trị văn hóa truyền thống đến gần hơn với đại chúng. Thay vì những bài viết dài khô khan, chúng tôi tin rằng việc để người dùng **tự tay chạm và lắng nghe** chính là cách tốt nhất để bảo tồn một thanh âm.

Chúng tôi luôn chào đón mọi phản hồi và đóng góp từ cộng đồng để tiếp tục hoàn thiện kho lưu trữ này!

---
*Được thiết kế và phát triển với niềm đam mê văn hóa và nghệ thuật số.* 🤎

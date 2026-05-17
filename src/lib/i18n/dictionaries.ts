export type Locale = "vi";

export const dictionaries = {
  vi: {
    nav: {
      hall: "Sảnh",
      archive: "Kho nhạc cụ",
      mission: "Sứ mệnh",
      identify: "Nhận diện",
      signIn: "Đăng nhập",
      upload: "Tải ảnh",
      signOut: "Đăng xuất",
    },
    hero: {
      kicker: "Kho âm thanh văn hóa",
      title: "Chạm vào những thanh âm vượt thời gian.",
      body: "Echoes biến không gian số thành một bảo tàng tương tác: nơi công nghệ nhận diện hình ảnh, câu chuyện lịch sử và trải nghiệm âm thanh chân thực hòa quyện vào nhau.",
      ctaScan: "Bắt đầu quét",
      ctaArchive: "Dạo kho nhạc cụ",
      roomTone: "Sóng phòng",
    },
    scan: {
      kicker: "Quét nhạc cụ",
      title: "Nhận diện nhạc cụ qua lăng kính thông minh.",
      body: "Tải ảnh hoặc mở camera. Hệ thống so khớp với năm nhạc cụ truyền thống trong kho — chính xác, nhẹ nhàng, không rối.",
      upload: "Tải ảnh",
      camera: "Mở camera",
      begin: "Bắt đầu quét",
      scanning: "Đang quét hiện vật…",
      confidence: "Độ tin cậy",
      lowConfidence: "Chưa nhận ra rõ. Hãy thử góc chụp khác hoặc ánh sáng êm hơn.",
      supported: "Năm nhạc cụ được hỗ trợ",
      previewOnly: "Xem trước — đăng nhập để quét và chơi",
    },
    auth: {
      headline: "Đăng nhập để bắt đầu trải nghiệm",
      subline: "Khám phá và chơi nhạc cụ bằng AI trong không gian tương tác.",
      google: "Tiếp tục với Google",
      demo: "Tiếp tục thử nghiệm (demo)",
      guest: "Tiếp tục xem không đăng nhập",
      close: "Đóng",
    },
    detect: {
      analyzing: "Đang phân tích hình học âm thanh…",
      matching: "Đang khớp kho nhạc cụ lịch sử…",
      resonance: "Đang phát hiện mẫu cộng hưởng…",
      profile: "Đang tạo hồ sơ tương tác…",
      liveAnalysis: "Phân tích trực tiếp",
      headline: "Từ hình ảnh đến trải nghiệm âm thanh chân thực.",
      body: "Echoes so khớp ảnh của bạn với năm hiện vật trong kho — chính xác, không đoán bừa.",
      archiveDepth: "Độ sâu kho",
      signal: "Tín hiệu",
      scanning: "Đang quét",
      stable: "Ổn định",
      analysisStream: "Luồng phân tích",
      warming: "đang khớp",
      idle: "chờ",
    },
    unsupported: {
      title: "Nhạc cụ này chưa có trong kho.",
      body: "Hãy thử góc chụp khác hoặc chọn một trong năm nhạc cụ được hỗ trợ bên dưới.",
      retry: "Thử ảnh khác",
      browse: "Xem kho hỗ trợ",
      archiveLabel: "Kho nhạc cụ",
    },
    playable: {
      awaiting: "chờ chạm",
      resonating: "đang cộng hưởng",
      fullscreen: "Toàn màn hình",
      exitFullscreen: "Thu nhỏ",
      interface: "Giao diện tương tác",
      webAudio: "Trình duyệt",
      microphone: "Môi trường",
      microphoneOn: "Đang nghe",
      pluckHarmonic: "Gẩy bồi âm",
      types: {
        "single-string": {
          title: "Trường cao độ cộng hưởng",
          subtitle: "Kéo cần đàn để uốn cao độ. Chạm dây để gẩy bồi âm.",
        },
        "horizontal-strings": {
          title: "Dải dây lụa rung vang",
          subtitle: "Chạm từng dây để nghe tiếng vọng chảy qua lụa và không khí.",
        },
        "bamboo-bars": {
          title: "Bộ gõ tre nứa",
          subtitle: "Gõ vào thanh tre và nghe đại ngàn trả lời.",
        },
        "minimal-pluck": {
          title: "Ba dây căng thẳng",
          subtitle: "Mỗi lần gẩy là một cử chỉ sắc nét, chủ đích.",
        },
        "resonant-notes": {
          title: "Trường cộng hưởng giao thoa",
          subtitle: "Chạm một nút và nghe vũ trụ bồi âm mở ra.",
        },
      },
    },
    chat: {
      title: "Hướng dẫn văn hóa",
      placeholder: "Hỏi về quét, nhạc cụ, hoặc cách dùng…",
      greeting:
        "Xin chào — tôi là người dẫn đường trong Echoes. Bạn muốn quét nhạc cụ, khám phá kho nhạc cụ, hay chơi thử một nhạc cụ?",
    },
    home: {
      immersiveScroll: "Cuộn chiêm nghiệm",
      corridorTitle: "Không gian lưu giữ ký ức qua từng cung bậc.",
      quotes: [
        "Mỗi nhạc cụ là một lá thư từ vùng đất bạn chưa từng ghé.",
        "Kho nhạc cụ tối đi là có chủ đích. Ánh sáng thuộc về điều ta chọn lắng nghe.",
        "Bị lãng quên không có nghĩa là im lặng. Nó đang chờ một căn phòng mới.",
      ],
      howTitle: "Trải nghiệm văn hóa qua từng điểm chạm.",
      howKicker: "Cách phòng vận hành",
      steps: [
        {
          title: "Quét",
          body: "Đưa một bức ảnh. Hệ thống đọc đường viền, sức căng và ký ức chất liệu.",
        },
        {
          title: "Khám phá",
          body: "So khớp chậm rãi với chỉ mục văn hóa — không bao giờ là bảng điều khiển ồn ào.",
        },
        {
          title: "Tương tác",
          body: "Âm thanh trở về qua xúc giác: gẩy, gõ, uốn, cho đến khi lịch sử trở nên sống động.",
        },
      ],
      analysisTheater: "Sân khấu phân tích",
      analysisTitle: "Hệ thống phân tích và nhận diện cấu trúc âm thanh.",
      analysisBody:
        "Tải ảnh mở ra chuỗi phân tích toàn màn hình: đường quét, trôi độ tin cậy, ngôn ngữ kho nhạc cụ, và sóng âm giả vờ hiểu bức ảnh của bạn.",
      launchScan: "Mở sân khấu quét",
      liveTriage: "Phân loại trực tiếp",
      analysisLine: "Dòng phân tích",
      detectingResonance: "Đang phát hiện mẫu cộng hưởng…",
      exhibitSignal: "Tín hiệu hiện vật",
      enterExhibit: "Vào triển lãm",
      matchFromImage: "Khớp từ ảnh",
      tactileRoom: "Phòng xúc giác",
      tactileTitle: "Trải nghiệm tương tác âm thanh chân thực và sống động.",
      tactileBody:
        "Thanh tre phát âm vang khi gõ. Dây đàn lấp lánh khi lướt qua. Mỗi nhạc cụ được mô phỏng âm thanh chi tiết, mang lại cảm giác chân thực nhất.",
      tryTrung: "Thử T'rưng",
      openSitar: "Mở trường Sitar",
      resonantPreview: "Bản xem trước cộng hưởng",
      browserAudio: "Âm thanh trình duyệt",
      previewNote:
        "Đây là bản xem trước đã dàn dựng, không phải bộ máy nhạc cụ đầy đủ. Theo bất kỳ hiện vật nào để cảm nhận toàn bộ mặt phẳng tương tác.",
    },
    instrument: {
      backToArchive: "Quay lại kho nhạc cụ",
      origin: "Nguồn gốc",
      era: "Thời kỳ",
      culturalBackground: "Bối cảnh văn hóa",
      livingObject: "Một hiện vật sống, không phải tĩnh vật.",
      relatedInstruments: "Nhạc cụ liên quan",
      imageSource: "Nguồn ảnh",
    },
    mission: {
      kicker: "Về Dự Án",
      headline:
        "Echoes – Nền tảng triển lãm số tương tác nhằm bảo tồn và quảng bá nhạc cụ truyền thống.",
      treatEvery:
        "Biến việc “xem văn hóa” thành “trải nghiệm văn hóa”.",
      museumFreeze:
        "Dự án được xây dựng với mục tiêu kết hợp công nghệ số và giá trị văn hóa truyền thống nhằm tạo ra một không gian trải nghiệm trực tuyến mới mẻ dành cho giới trẻ.",
      studentCorridor:
        "Thay vì tiếp cận văn hóa theo hình thức đọc thông tin truyền thống, người dùng có thể trực tiếp khám phá nhạc cụ, trải nghiệm âm thanh, tương tác mô phỏng và cảm nhận không gian văn hóa theo hướng trực quan, sinh động và immersive hơn.",
      forgottenSounds: "Văn hóa nhưng không chán",
      forgottenBody:
        "Trong thời đại số, nhiều giá trị văn hóa truyền thống đang dần trở nên xa lạ với giới trẻ. Các hình thức tiếp cận hiện tại chủ yếu mang tính trưng bày hoặc cung cấp thông tin tĩnh, thiếu tính tương tác và khó tạo hứng thú lâu dài.",
      interfaceBorrows:
        "Từ đó, nhóm thực hiện mong muốn xây dựng Echoes – một không gian triển lãm số tương tác, nơi người dùng có thể khám phá và trải nghiệm nhạc cụ truyền thống theo cách hiện đại, trực quan và giàu cảm xúc hơn.",
      offerImage: "Gửi một bức ảnh đến kho nhạc cụ",
      preservationReunion:
        "Echoes mang ý nghĩa “tiếng vọng”...",
      preservationBody:
        "Tượng trưng cho sự vang vọng của các giá trị văn hóa truyền thống trong thời đại hiện đại. Dự án mong muốn tạo ra cầu nối giữa quá khứ và hiện tại thông qua công nghệ số và trải nghiệm tương tác.",
      readMission: "Đọc thông tin dự án",
    },
    team: {
      kicker: "Người thực hiện",
      headline: "Đội ngũ phát triển",
      members: [
        {
          name: "Nguyễn Đình Thiên",
          role: "Trưởng nhóm dự án",
          desc: "Phụ trách định hướng ý tưởng, thiết kế giao diện, phát triển frontend, trải nghiệm người dùng và xây dựng nội dung tổng thể của nền tảng.",
        },
        {
          name: "Nguyễn Sĩ Tấn",
          role: "Hậu cần & Hệ thống",
          desc: "Hỗ trợ backend, hosting và triển khai hệ thống.",
        },
        {
          name: "Nông Trường Giang",
          role: "Tích hợp AI",
          desc: "Phụ trách phát triển tính năng AI chatbot hỗ trợ tương tác người dùng.",
        },
      ],
    },
    faq: {
      kicker: "Hỏi đáp",
      headline: "Câu hỏi thường gặp",
      items: [
        {
          q: "Echoes có phải nền tảng học nhạc không?",
          a: "Không. Echoes tập trung vào trải nghiệm khám phá văn hóa và tương tác với nhạc cụ truyền thống thông qua không gian số immersive.",
        },
        {
          q: "Điều gì khiến Echoes khác biệt?",
          a: "Echoes không chỉ cung cấp thông tin mà còn cho phép người dùng trải nghiệm trực tiếp âm thanh, tương tác mô phỏng và khám phá văn hóa theo hướng trực quan, hiện đại.",
        },
        {
          q: "Echoes hướng tới đối tượng nào?",
          a: "Chủ yếu là thanh thiếu niên, học sinh và những người quan tâm đến văn hóa truyền thống.",
        },
        {
          q: "Vì sao Echoes tập trung vào trải nghiệm immersive?",
          a: "Nhóm nhận thấy giới trẻ thường khó tiếp cận các nội dung văn hóa theo hình thức truyền thống, vì vậy dự án hướng tới trải nghiệm trực quan và giàu cảm xúc hơn.",
        },
      ],
    },
    footer: {
      description:
        "Không gian lưu giữ những nhạc cụ truyền thống đang dần vắng bóng. Echoes kết hợp hình ảnh, câu chuyện và âm thanh để mang đến trải nghiệm văn hóa đa giác quan.",
      tagline: "Âm thanh bị lãng quên · tương tác sống",
      navigate: "Điều hướng",
      archive: "Kho nhạc cụ",
      mission: "Sứ mệnh",
      identify: "Nhận diện",
      signIn: "Đăng nhập",
      copyright: "Echoes — dự án sáng tạo trẻ về bảo tồn âm thanh văn hóa.",
    },
    archive: {
      kicker: "Chỉ mục sống",
      headline: "Khám phá kho tàng nhạc cụ truyền thống đa quốc gia.",
      body: "Tìm kiếm theo tên, lọc theo vùng văn hóa, và khám phá chi tiết từng nhạc cụ. Mỗi mục sẽ dẫn bạn vào một không gian triển lãm riêng biệt với âm thanh tương tác trực tiếp.",
      searchPlaceholder: "Tìm nhạc cụ, quốc gia, âm sắc…",
      allRegions: "Tất cả vùng",
      southeastAsia: "Đông Nam Á",
      eastAsia: "Đông Á",
      southAsia: "Nam Á",
      noResults:
        "Không tìm thấy nhạc cụ nào. Hãy thử từ khóa khác hoặc mở rộng khu vực tìm kiếm.",
    },
  },
} as const;

export type Dictionary = (typeof dictionaries)[Locale];

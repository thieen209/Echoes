export type InstrumentSlug =
  | "dan-bau"
  | "dan-tranh"
  | "trung"
  | "shamisen"
  | "sitar";

export type PlayableType =
  | "single-string"
  | "horizontal-strings"
  | "bamboo-bars"
  | "minimal-pluck"
  | "resonant-notes";

export type InstrumentNote = {
  label: string;
  frequency: number;
  tone: string;
  sampleUrl?: string;
};

export type Instrument = {
  id: InstrumentSlug;
  name: string;
  originCountry: string;
  era: string;
  summary: string;
  history: string;
  heroImage: string;
  imageCredit: {
    title: string;
    sourceUrl: string;
    license: string;
  };
  relatedInstrumentIds: InstrumentSlug[];
  playableType: PlayableType;
  notes: InstrumentNote[];
};

export const instruments: Instrument[] = [
  {
    id: "dan-bau",
    name: "Đàn Bầu",
    originCountry: "Việt Nam",
    era: "Thời phong kiến Việt Nam, ghi nhận rõ nét từ thế kỷ 18",
    summary:
      "Cây đàn một dây được định hình bởi xúc giác, bồi âm và một cần gạt uốn cao độ uyển chuyển.",
    history:
      "Đàn Bầu gắn liền với nghệ thuật hát xẩm và nhã nhạc cung đình Việt Nam. Chỉ với một dây duy nhất, nó có thể tạo ra âm sắc mang đậm tính thanh nhạc, uốn lượn giữa các nốt nhạc với độ nhạy cảm khiến người nghe có cảm giác như tiếng hát hơn là tiếng đàn. Trong Echoes, tương tác tập trung vào việc uốn cao độ và sự kịch tính tĩnh lặng của một dải âm thanh duy nhất.",
    heroImage: "/images/instruments/dan-bau.jpg",
    imageCredit: {
      title: "Dan bau at Vietnam Museum of Ethnology",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Dan_bau_(monochord)_-_Vietnam_Museum_of_Ethnology_-_Hanoi,_Vietnam_-_DSC02538.JPG",
      license: "Wikimedia Commons",
    },
    relatedInstrumentIds: ["dan-tranh", "trung", "sitar"],
    playableType: "single-string",
    notes: [
      { label: "C Trầm", frequency: 130.81, tone: "earth" },
      { label: "G", frequency: 196, tone: "open" },
      { label: "C", frequency: 261.63, tone: "bright" },
      { label: "E", frequency: 329.63, tone: "lift" },
      { label: "G", frequency: 392, tone: "clear" },
    ],
  },
  {
    id: "dan-tranh",
    name: "Đàn Tranh",
    originCountry: "Việt Nam",
    era: "Truyền thống thính phòng và cung đình Việt Nam thế kỷ 16",
    summary:
      "Một loại đàn zither dài với các nhạn di chuyển được, dây gẩy sáng vang và âm điệu trữ tình.",
    history:
      "Đàn Tranh mang những dòng giai điệu len lỏi qua thi ca, âm nhạc thính phòng và các dàn nhạc hòa tấu đương đại. Các nhạn đàn có thể di chuyển giúp việc chỉnh âm linh hoạt, trong khi tay phải gẩy và tay trái rung hoặc nhấn để tạo bồi âm. Phiên bản lưu trữ này coi mỗi dây đàn là một nốt nhạc trong trường âm thanh ngũ cung.",
    heroImage: "/images/instruments/dan-tranh.webp",
    imageCredit: {
      title: "Dantranh top view",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Dantranh_top02.jpg",
      license: "Wikimedia Commons",
    },
    relatedInstrumentIds: ["dan-bau", "trung", "sitar"],
    playableType: "horizontal-strings",
    notes: [
      { label: "D", frequency: 293.66, tone: "silk" },
      { label: "E", frequency: 329.63, tone: "jade" },
      { label: "G", frequency: 392, tone: "river" },
      { label: "A", frequency: 440, tone: "paper" },
      { label: "B", frequency: 493.88, tone: "light" },
      { label: "D", frequency: 587.33, tone: "air" },
    ],
  },
  {
    id: "trung",
    name: "T'rưng",
    originCountry: "Việt Nam",
    era: "Truyền thống âm nhạc cộng đồng Tây Nguyên",
    summary:
      "Một loại mộc cầm bằng tre nứa với những thanh âm gợi nhớ về dòng nước, rừng núi và các nghi lễ thiêng liêng.",
    history:
      "Đàn T'rưng gắn bó sâu sắc với vùng Tây Nguyên của Việt Nam và các bối cảnh sinh hoạt cộng đồng. Các ống tre hoặc thanh tre được xếp theo cao độ, sau đó được gõ để tạo ra âm thanh gõ ấm áp và mộc mạc. Echoes giới thiệu nó như một hệ thống các thanh tre được chạm khắc tỉ mỉ mà bạn có thể tự tay gõ lên.",
    heroImage: "/images/instruments/trung.png",
    imageCredit: {
      title: "T Rung",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:T_Rung.png",
      license: "Wikimedia Commons",
    },
    relatedInstrumentIds: ["dan-bau", "dan-tranh", "shamisen"],
    playableType: "bamboo-bars",
    notes: [
      { label: "C", frequency: 261.63, tone: "bamboo" },
      { label: "D", frequency: 293.66, tone: "bamboo" },
      { label: "E", frequency: 329.63, tone: "bamboo" },
      { label: "G", frequency: 392, tone: "bamboo" },
      { label: "A", frequency: 440, tone: "bamboo" },
      { label: "C", frequency: 523.25, tone: "bamboo" },
    ],
  },
  {
    id: "shamisen",
    name: "Shamisen",
    originCountry: "Nhật Bản",
    era: "Văn hóa biểu diễn thời kỳ Edo",
    summary:
      "Đàn tỳ bà ba dây với âm thanh sắc nét, được sử dụng trong kịch nghệ, dân ca và các hình thức kể chuyện.",
    history:
      "Shamisen được chơi bằng một miếng gẩy lớn (bachi), tạo ra cả cao độ và âm thanh gõ từ thân đàn. Tiếng đàn mang cảm giác trống trải, mang đậm tính sân khấu và rất trực diện. Giao diện này giữ cho cử chỉ ở mức tối giản: ba đường dây căng vút, mỗi đường dây mang một tiếng gẩy sắc nét và độ ngân ngắn.",
    heroImage: "/images/instruments/shamisen.jpg",
    imageCredit: {
      title: "Shamisen, The Metropolitan Museum of Art",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Shamisen_MET_midp69.271.2a.jpg",
      license: "Public domain",
    },
    relatedInstrumentIds: ["sitar", "dan-tranh", "trung"],
    playableType: "minimal-pluck",
    notes: [
      { label: "C", frequency: 130.81, tone: "dry" },
      { label: "F", frequency: 174.61, tone: "dry" },
      { label: "C", frequency: 261.63, tone: "dry" },
    ],
  },
  {
    id: "sitar",
    name: "Sitar",
    originCountry: "Ấn Độ",
    era: "Âm nhạc cổ điển Bắc Ấn, phát triển rực rỡ qua các cung điện thời Mughal",
    summary:
      "Một loại đàn cổ dài với các dây cộng hưởng giao thoa và âm vang lan tỏa mang tính thiền định.",
    history:
      "Sitar là trung tâm của âm nhạc cổ điển Hindustani, nơi giai điệu mở ra qua hệ thống raga, các nốt hoa mỹ và sự cộng hưởng. Các dây cộng hưởng của nó tạo ra một vầng hào quang âm thanh lung linh bao quanh các nốt được gẩy. Echoes sử dụng các bộ dao động xếp lớp để tái hiện lại những bồi âm ngân nga sâu lắng của nhạc cụ này.",
    heroImage: "/images/instruments/sitar.jpg",
    imageCredit: {
      title: "Sitar full",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Sitar_full.jpg",
      license: "Wikimedia Commons",
    },
    relatedInstrumentIds: ["shamisen", "dan-tranh", "dan-bau"],
    playableType: "resonant-notes",
    notes: [
      { label: "Sa", frequency: 146.83, tone: "root" },
      { label: "Pa", frequency: 220, tone: "fifth" },
      { label: "Sa", frequency: 293.66, tone: "octave" },
      { label: "Re", frequency: 329.63, tone: "step" },
      { label: "Ga", frequency: 369.99, tone: "color" },
      { label: "Pa", frequency: 440, tone: "fifth" },
    ],
  },
];

export const supportedInstrumentSlugs = instruments.map(
  (instrument) => instrument.id,
) as InstrumentSlug[];

export function getInstrument(slug: string) {
  return instruments.find((instrument) => instrument.id === slug);
}

export function getRelatedInstruments(instrument: Instrument) {
  return instrument.relatedInstrumentIds
    .map((id) => getInstrument(id))
    .filter((item): item is Instrument => Boolean(item));
}

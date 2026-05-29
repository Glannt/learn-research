import type { Chapter, Exercise, Formula, Lesson, Simulation } from "@/types";
import { slugify } from "@/lib/utils";

const sampleExample = (name: string) => ({
  problem: `Áp dụng ${name} với dữ kiện cơ bản trong bài toán học đường.`,
  solution: "Thay số đúng đơn vị vào công thức, tính kết quả và kiểm tra ý nghĩa vật lý."
});

export const physicsChapters: Chapter[] = [
  { id: "phy-mechanics", subjectId: "physics", title: "Cơ học", slug: "co-hoc", level: "basic", order: 1, summary: "Chuyển động, lực, năng lượng và dao động." },
  { id: "phy-heat", subjectId: "physics", title: "Nhiệt học", slug: "nhiet-hoc", level: "intermediate", order: 2, summary: "Nhiệt độ, nhiệt lượng, truyền nhiệt và khí lý tưởng." },
  { id: "phy-electricity", subjectId: "physics", title: "Điện học", slug: "dien-hoc", level: "intermediate", order: 3, summary: "Dòng điện, điện trở, mạch điện và điện từ." },
  { id: "phy-optics", subjectId: "physics", title: "Quang học", slug: "quang-hoc", level: "advanced", order: 4, summary: "Phản xạ, khúc xạ, thấu kính và quang phổ." },
  { id: "phy-modern", subjectId: "physics", title: "Vật lý hiện đại", slug: "vat-ly-hien-dai", level: "advanced", order: 5, summary: "Nguyên tử, photon, lượng tử và thuyết tương đối cơ bản." }
];

const physicsLessonTopics = [
  ["phy-mechanics", "Chuyển động thẳng đều", "Tốc độ không đổi và đồ thị s-t.", ["velocity"], ["kinematics"]],
  ["phy-mechanics", "Chuyển động thẳng biến đổi đều", "Gia tốc không đổi, vận tốc và quãng đường.", ["acceleration", "kinematics-distance"], ["kinematics"]],
  ["phy-mechanics", "Định luật Newton", "Mối liên hệ giữa lực, khối lượng và gia tốc.", ["f-ma"], ["newton-law"]],
  ["phy-mechanics", "Công và công suất", "Năng lượng truyền bởi lực và tốc độ sinh công.", ["work", "power"], ["newton-law"]],
  ["phy-mechanics", "Động năng và thế năng", "Năng lượng do chuyển động và vị trí.", ["kinetic-energy", "potential-energy"], ["pendulum"]],
  ["phy-mechanics", "Động lượng và va chạm", "Bảo toàn động lượng trong hệ cô lập.", ["momentum"], ["kinematics"]],
  ["phy-mechanics", "Dao động điều hòa", "Chuyển động lặp lại quanh vị trí cân bằng.", ["frequency"], ["pendulum"]],
  ["phy-mechanics", "Con lắc đơn", "Chu kỳ phụ thuộc chiều dài dây và trọng trường.", ["pendulum-period"], ["pendulum"]],
  ["phy-heat", "Nhiệt độ và nhiệt lượng", "Nhiệt lượng làm thay đổi trạng thái nhiệt.", ["heat"], ["ideal-gas"]],
  ["phy-heat", "Cân bằng nhiệt", "Trao đổi nhiệt trong hệ cô lập.", ["heat-balance"], ["ideal-gas"]],
  ["phy-heat", "Khí lý tưởng", "Quan hệ giữa áp suất, thể tích và nhiệt độ.", ["ideal-gas"], ["ideal-gas"]],
  ["phy-heat", "Áp suất chất khí", "Va chạm phân tử tạo áp suất lên thành bình.", ["pressure"], ["ideal-gas"]],
  ["phy-electricity", "Điện tích và điện trường", "Tương tác Coulomb và điện trường.", ["coulomb", "electric-field"], ["electric-field"]],
  ["phy-electricity", "Dòng điện và định luật Ohm", "Dòng điện phụ thuộc hiệu điện thế và điện trở.", ["ohm-current"], ["circuit-ohm"]],
  ["phy-electricity", "Công suất điện", "Tốc độ tiêu thụ năng lượng điện.", ["electric-power"], ["circuit-ohm"]],
  ["phy-electricity", "Mạch nối tiếp và song song", "Cách điện trở tương đương thay đổi trong mạch.", ["resistance-wire"], ["circuit-ohm"]],
  ["phy-optics", "Phản xạ ánh sáng", "Góc tới bằng góc phản xạ.", ["reflection"], ["optics-ray"]],
  ["phy-optics", "Khúc xạ và thấu kính", "Ánh sáng đổi hướng khi đi qua môi trường.", ["snell"], ["optics-ray"]],
  ["phy-modern", "Mô hình nguyên tử", "Năng lượng lượng tử hóa trong nguyên tử.", ["photon-energy"], ["atom-model"]],
  ["phy-modern", "Photon và sóng vật chất", "Tính chất hạt và sóng của ánh sáng, vật chất.", ["de-broglie"], ["atom-model"]]
] as const;

export const physicsLessons: Lesson[] = physicsLessonTopics.map(([chapterId, title, summary, formulas, simulations], index) => ({
  id: `phy-lesson-${index}`,
  chapterId,
  subject: "physics",
  title,
  slug: slugify(title),
  summary,
  content: `${summary} Bài học tập trung vào khái niệm cốt lõi, công thức cần nhớ, ví dụ thay số và liên hệ với mô phỏng tương tác để người học thấy đại lượng thay đổi theo tham số.`,
  formulas: [...formulas],
  simulations: [...simulations],
  exercises: [`phy-ex-${index}`, `phy-ex-${index + 20}`],
  level: index < 8 ? "basic" : index < 16 ? "intermediate" : "advanced",
  durationMinutes: 12 + (index % 4) * 4
}));

export const physicsFormulas: Formula[] = [
  {
    id: "velocity",
    slug: "velocity",
    subject: "physics",
    name: "Vận tốc trung bình",
    latex: "v=\\frac{s}{t}",
    description: "Tính vận tốc khi biết quãng đường và thời gian.",
    variables: [
      { symbol: "v", name: "vận tốc", unit: "m/s", description: "Độ nhanh của chuyển động." },
      { symbol: "s", name: "quãng đường", unit: "m", description: "Độ dài vật đi được." },
      { symbol: "t", name: "thời gian", unit: "s", description: "Khoảng thời gian chuyển động." }
    ],
    usage: "Dùng khi vật chuyển động đều hoặc cần vận tốc trung bình.",
    examples: [{ problem: "Đi 120 m trong 10 s.", solution: "v = 120 / 10 = 12 m/s." }],
    calculatorConfig: { operationId: "velocity", outputKey: "v", outputLabel: "Vận tốc", outputUnit: "m/s", inputs: [{ key: "s", label: "Quãng đường", unit: "m", defaultValue: 120 }, { key: "t", label: "Thời gian", unit: "s", defaultValue: 10 }] },
    relatedSimulationId: "kinematics"
  },
  {
    id: "acceleration",
    slug: "acceleration",
    subject: "physics",
    name: "Gia tốc",
    latex: "a=\\frac{\\Delta v}{\\Delta t}",
    description: "Tốc độ thay đổi vận tốc theo thời gian.",
    variables: [
      { symbol: "a", name: "gia tốc", unit: "m/s^2", description: "Độ biến thiên vận tốc mỗi giây." },
      { symbol: "\\Delta v", name: "độ biến thiên vận tốc", unit: "m/s", description: "Vận tốc cuối trừ vận tốc đầu." },
      { symbol: "\\Delta t", name: "thời gian", unit: "s", description: "Khoảng thời gian biến thiên." }
    ],
    usage: "Dùng cho chuyển động biến đổi đều.",
    examples: [{ problem: "Vận tốc tăng từ 2 lên 12 m/s trong 5 s.", solution: "a = (12 - 2) / 5 = 2 m/s^2." }],
    calculatorConfig: { operationId: "acceleration", outputKey: "a", outputLabel: "Gia tốc", outputUnit: "m/s^2", inputs: [{ key: "v0", label: "Vận tốc đầu", unit: "m/s", defaultValue: 2 }, { key: "v", label: "Vận tốc cuối", unit: "m/s", defaultValue: 12 }, { key: "t", label: "Thời gian", unit: "s", defaultValue: 5 }] },
    relatedSimulationId: "kinematics"
  },
  {
    id: "kinematics-distance",
    slug: "kinematics-distance",
    subject: "physics",
    name: "Quãng đường biến đổi đều",
    latex: "s=v_0t+\\frac{1}{2}at^2",
    description: "Tính độ dời khi gia tốc không đổi.",
    variables: [
      { symbol: "s", name: "độ dời", unit: "m", description: "Vị trí thay đổi so với ban đầu." },
      { symbol: "v_0", name: "vận tốc đầu", unit: "m/s", description: "Vận tốc tại t = 0." },
      { symbol: "a", name: "gia tốc", unit: "m/s^2", description: "Gia tốc không đổi." }
    ],
    usage: "Dùng cho chuyển động thẳng biến đổi đều.",
    examples: [{ problem: "v0 = 4 m/s, a = 2 m/s^2, t = 3 s.", solution: "s = 4*3 + 0.5*2*9 = 21 m." }],
    calculatorConfig: { operationId: "kinematics-distance", outputKey: "s", outputLabel: "Độ dời", outputUnit: "m", inputs: [{ key: "v0", label: "Vận tốc đầu", unit: "m/s", defaultValue: 4 }, { key: "a", label: "Gia tốc", unit: "m/s^2", defaultValue: 2 }, { key: "t", label: "Thời gian", unit: "s", defaultValue: 3 }] },
    relatedSimulationId: "kinematics"
  },
  {
    id: "f-ma",
    slug: "f-ma",
    subject: "physics",
    name: "Định luật II Newton",
    latex: "F=ma",
    description: "Lực tổng hợp bằng khối lượng nhân gia tốc.",
    variables: [
      { symbol: "F", name: "lực", unit: "N", description: "Tác dụng gây gia tốc." },
      { symbol: "m", name: "khối lượng", unit: "kg", description: "Mức quán tính của vật." },
      { symbol: "a", name: "gia tốc", unit: "m/s^2", description: "Gia tốc do lực tổng hợp." }
    ],
    usage: "Dùng khi xét lực tổng hợp tác dụng lên vật.",
    examples: [{ problem: "m = 5 kg, a = 2 m/s^2.", solution: "F = 5*2 = 10 N." }],
    calculatorConfig: { operationId: "newton-force", outputKey: "F", outputLabel: "Lực", outputUnit: "N", inputs: [{ key: "m", label: "Khối lượng", unit: "kg", defaultValue: 5 }, { key: "a", label: "Gia tốc", unit: "m/s^2", defaultValue: 2 }] },
    relatedSimulationId: "newton-law"
  },
  {
    id: "work",
    slug: "work",
    subject: "physics",
    name: "Công của lực",
    latex: "A=Fs\\cos\\theta",
    description: "Năng lượng lực truyền cho vật trên quãng đường s.",
    variables: [
      { symbol: "A", name: "công", unit: "J", description: "Năng lượng truyền bởi lực." },
      { symbol: "F", name: "lực", unit: "N", description: "Độ lớn lực tác dụng." },
      { symbol: "\\theta", name: "góc", unit: "deg", description: "Góc giữa lực và độ dời." }
    ],
    usage: "Dùng khi lực không nhất thiết cùng phương với chuyển động.",
    examples: [{ problem: "F = 20 N, s = 4 m, theta = 0.", solution: "A = 80 J." }],
    calculatorConfig: { operationId: "work", outputKey: "A", outputLabel: "Công", outputUnit: "J", inputs: [{ key: "F", label: "Lực", unit: "N", defaultValue: 20 }, { key: "s", label: "Quãng đường", unit: "m", defaultValue: 4 }, { key: "theta", label: "Góc", unit: "deg", defaultValue: 0 }] }
  },
  {
    id: "power",
    slug: "power",
    subject: "physics",
    name: "Công suất",
    latex: "P=\\frac{A}{t}",
    description: "Tốc độ thực hiện công.",
    variables: [
      { symbol: "P", name: "công suất", unit: "W", description: "Công thực hiện mỗi giây." },
      { symbol: "A", name: "công", unit: "J", description: "Năng lượng truyền." },
      { symbol: "t", name: "thời gian", unit: "s", description: "Thời gian sinh công." }
    ],
    usage: "Dùng khi cần biết máy hoặc lực làm việc nhanh thế nào.",
    examples: [sampleExample("công suất")],
    calculatorConfig: { operationId: "power", outputKey: "P", outputLabel: "Công suất", outputUnit: "W", inputs: [{ key: "A", label: "Công", unit: "J", defaultValue: 100 }, { key: "t", label: "Thời gian", unit: "s", defaultValue: 5 }] }
  },
  {
    id: "kinetic-energy",
    slug: "kinetic-energy",
    subject: "physics",
    name: "Động năng",
    latex: "W_d=\\frac{1}{2}mv^2",
    description: "Năng lượng do chuyển động.",
    variables: [
      { symbol: "m", name: "khối lượng", unit: "kg", description: "Khối lượng vật." },
      { symbol: "v", name: "vận tốc", unit: "m/s", description: "Vận tốc tức thời." }
    ],
    usage: "Dùng cho bài toán năng lượng chuyển động.",
    examples: [sampleExample("động năng")],
    calculatorConfig: { operationId: "kinetic-energy", outputKey: "Wd", outputLabel: "Động năng", outputUnit: "J", inputs: [{ key: "m", label: "Khối lượng", unit: "kg", defaultValue: 2 }, { key: "v", label: "Vận tốc", unit: "m/s", defaultValue: 6 }] },
    relatedSimulationId: "pendulum"
  },
  {
    id: "potential-energy",
    slug: "potential-energy",
    subject: "physics",
    name: "Thế năng trọng trường",
    latex: "W_t=mgh",
    description: "Năng lượng do vị trí trong trọng trường.",
    variables: [
      { symbol: "m", name: "khối lượng", unit: "kg", description: "Khối lượng vật." },
      { symbol: "g", name: "gia tốc trọng trường", unit: "m/s^2", description: "Cường độ trọng trường." },
      { symbol: "h", name: "độ cao", unit: "m", description: "Độ cao so với mốc." }
    ],
    usage: "Dùng khi vật ở độ cao h so với mốc thế năng.",
    examples: [sampleExample("thế năng")],
    calculatorConfig: { operationId: "potential-energy", outputKey: "Wt", outputLabel: "Thế năng", outputUnit: "J", inputs: [{ key: "m", label: "Khối lượng", unit: "kg", defaultValue: 2 }, { key: "g", label: "Trọng trường", unit: "m/s^2", defaultValue: 9.81 }, { key: "h", label: "Độ cao", unit: "m", defaultValue: 5 }] }
  },
  {
    id: "momentum",
    slug: "momentum",
    subject: "physics",
    name: "Động lượng",
    latex: "p=mv",
    description: "Đại lượng đặc trưng cho chuyển động và quán tính.",
    variables: [
      { symbol: "p", name: "động lượng", unit: "kg.m/s", description: "Khối lượng nhân vận tốc." },
      { symbol: "m", name: "khối lượng", unit: "kg", description: "Khối lượng vật." },
      { symbol: "v", name: "vận tốc", unit: "m/s", description: "Vận tốc vật." }
    ],
    usage: "Dùng trong bài toán va chạm và bảo toàn động lượng.",
    examples: [sampleExample("động lượng")],
    calculatorConfig: { operationId: "momentum", outputKey: "p", outputLabel: "Động lượng", outputUnit: "kg.m/s", inputs: [{ key: "m", label: "Khối lượng", unit: "kg", defaultValue: 3 }, { key: "v", label: "Vận tốc", unit: "m/s", defaultValue: 4 }] }
  },
  {
    id: "pendulum-period",
    slug: "pendulum-period",
    subject: "physics",
    name: "Chu kỳ con lắc đơn",
    latex: "T=2\\pi\\sqrt{\\frac{l}{g}}",
    description: "Chu kỳ dao động nhỏ của con lắc đơn.",
    variables: [
      { symbol: "T", name: "chu kỳ", unit: "s", description: "Thời gian cho một dao động toàn phần." },
      { symbol: "l", name: "chiều dài dây", unit: "m", description: "Khoảng cách từ điểm treo đến vật nặng." },
      { symbol: "g", name: "trọng trường", unit: "m/s^2", description: "Gia tốc trọng trường." }
    ],
    usage: "Áp dụng tốt khi góc lệch nhỏ.",
    examples: [{ problem: "l = 1 m, g = 9.81 m/s^2.", solution: "T xấp xỉ 2.01 s." }],
    calculatorConfig: { operationId: "pendulum-period", outputKey: "T", outputLabel: "Chu kỳ", outputUnit: "s", inputs: [{ key: "l", label: "Chiều dài", unit: "m", defaultValue: 1 }, { key: "g", label: "Trọng trường", unit: "m/s^2", defaultValue: 9.81 }] },
    relatedSimulationId: "pendulum"
  },
  {
    id: "ideal-gas",
    slug: "ideal-gas",
    subject: "physics",
    name: "Phương trình khí lý tưởng",
    latex: "PV=nRT",
    description: "Quan hệ giữa áp suất, thể tích, số mol và nhiệt độ tuyệt đối.",
    variables: [
      { symbol: "P", name: "áp suất", unit: "Pa", description: "Áp suất chất khí." },
      { symbol: "V", name: "thể tích", unit: "m^3", description: "Thể tích bình chứa." },
      { symbol: "T", name: "nhiệt độ", unit: "K", description: "Nhiệt độ tuyệt đối." }
    ],
    usage: "Dùng cho khí loãng, nhiệt độ không quá thấp.",
    examples: [sampleExample("khí lý tưởng")],
    calculatorConfig: { operationId: "ideal-gas-pressure", outputKey: "P", outputLabel: "Áp suất", outputUnit: "Pa", inputs: [{ key: "n", label: "Số mol", unit: "mol", defaultValue: 1 }, { key: "T", label: "Nhiệt độ", unit: "K", defaultValue: 300 }, { key: "V", label: "Thể tích", unit: "m3", defaultValue: 0.024 }] },
    relatedSimulationId: "ideal-gas"
  },
  {
    id: "ohm-current",
    slug: "ohm-current",
    subject: "physics",
    name: "Định luật Ohm",
    latex: "I=\\frac{U}{R}",
    description: "Dòng điện tỉ lệ thuận với hiệu điện thế và tỉ lệ nghịch với điện trở.",
    variables: [
      { symbol: "I", name: "cường độ dòng điện", unit: "A", description: "Dòng điện qua mạch." },
      { symbol: "U", name: "hiệu điện thế", unit: "V", description: "Điện áp hai đầu vật dẫn." },
      { symbol: "R", name: "điện trở", unit: "ohm", description: "Mức cản dòng điện." }
    ],
    usage: "Dùng cho vật dẫn ohmic.",
    examples: [sampleExample("định luật Ohm")],
    calculatorConfig: { operationId: "ohm-current", outputKey: "I", outputLabel: "Dòng điện", outputUnit: "A", inputs: [{ key: "U", label: "Hiệu điện thế", unit: "V", defaultValue: 12 }, { key: "R", label: "Điện trở", unit: "ohm", defaultValue: 6 }] }
  },
  {
    id: "electric-power",
    slug: "electric-power",
    subject: "physics",
    name: "Công suất điện",
    latex: "P=UI",
    description: "Công suất tiêu thụ của thiết bị điện.",
    variables: [
      { symbol: "P", name: "công suất", unit: "W", description: "Tốc độ tiêu thụ điện năng." },
      { symbol: "U", name: "hiệu điện thế", unit: "V", description: "Điện áp." },
      { symbol: "I", name: "dòng điện", unit: "A", description: "Cường độ dòng điện." }
    ],
    usage: "Dùng khi biết điện áp và dòng điện.",
    examples: [sampleExample("công suất điện")],
    calculatorConfig: { operationId: "electric-power", outputKey: "P", outputLabel: "Công suất", outputUnit: "W", inputs: [{ key: "U", label: "Hiệu điện thế", unit: "V", defaultValue: 220 }, { key: "I", label: "Dòng điện", unit: "A", defaultValue: 2 }] }
  },
  {
    id: "capacitance",
    slug: "capacitance",
    subject: "physics",
    name: "Điện dung",
    latex: "C=\\frac{q}{U}",
    description: "Khả năng tích điện của tụ điện.",
    variables: [
      { symbol: "C", name: "điện dung", unit: "F", description: "Điện tích trên mỗi volt." },
      { symbol: "q", name: "điện tích", unit: "C", description: "Điện tích tụ lưu trữ." },
      { symbol: "U", name: "hiệu điện thế", unit: "V", description: "Điện áp hai bản tụ." }
    ],
    usage: "Dùng trong bài toán tụ điện.",
    examples: [sampleExample("điện dung")],
    calculatorConfig: { operationId: "capacitance", outputKey: "C", outputLabel: "Điện dung", outputUnit: "F", inputs: [{ key: "q", label: "Điện tích", unit: "C", defaultValue: 0.002 }, { key: "U", label: "Hiệu điện thế", unit: "V", defaultValue: 10 }] }
  },
  {
    id: "electric-field",
    slug: "electric-field",
    subject: "physics",
    name: "Cường độ điện trường",
    latex: "E=\\frac{F}{q}",
    description: "Lực điện trên một đơn vị điện tích thử.",
    variables: [
      { symbol: "E", name: "điện trường", unit: "N/C", description: "Cường độ điện trường." },
      { symbol: "F", name: "lực điện", unit: "N", description: "Lực tác dụng lên điện tích." },
      { symbol: "q", name: "điện tích", unit: "C", description: "Điện tích thử." }
    ],
    usage: "Dùng để định nghĩa điện trường tại một điểm.",
    examples: [sampleExample("điện trường")],
    calculatorConfig: { operationId: "electric-field", outputKey: "E", outputLabel: "Điện trường", outputUnit: "N/C", inputs: [{ key: "F", label: "Lực", unit: "N", defaultValue: 0.02 }, { key: "q", label: "Điện tích", unit: "C", defaultValue: 0.001 }] }
  },
  ...[
    ["v-square", "v^2-v_0^2=2as", "Hệ thức độc lập thời gian"],
    ["frequency", "f=\\frac{1}{T}", "Tần số dao động"],
    ["heat", "Q=mc\\Delta t", "Nhiệt lượng"],
    ["heat-balance", "Q_{thu}=Q_{toa}", "Phương trình cân bằng nhiệt"],
    ["pressure", "p=\\frac{F}{S}", "Áp suất"],
    ["resistance-wire", "R=\\rho\\frac{l}{S}", "Điện trở dây dẫn"],
    ["coulomb", "F=k\\frac{|q_1q_2|}{r^2}", "Lực Coulomb"],
    ["gravity", "F=G\\frac{m_1m_2}{r^2}", "Hấp dẫn Newton"],
    ["snell", "n_1\\sin i=n_2\\sin r", "Định luật khúc xạ"],
    ["reflection", "i=i'", "Định luật phản xạ"],
    ["lens", "\\frac{1}{f}=\\frac{1}{d}+\\frac{1}{d'}", "Công thức thấu kính"],
    ["photon-energy", "E=hf", "Năng lượng photon"],
    ["de-broglie", "\\lambda=\\frac{h}{p}", "Bước sóng de Broglie"],
    ["spring-period", "T=2\\pi\\sqrt{\\frac{m}{k}}", "Chu kỳ con lắc lò xo"],
    ["hooke", "F=k\\Delta l", "Định luật Hooke"]
  ].map(([id, latex, name]) => ({
    id,
    slug: id,
    subject: "physics" as const,
    name,
    latex,
    description: `${name} trong chương trình vật lý phổ thông và nhập môn đại học.`,
    variables: [{ symbol: "-", name: "biến liên quan", unit: "SI", description: "Xem ngữ cảnh bài học để chọn đơn vị phù hợp." }],
    usage: "Tra cứu nhanh và liên kết với bài học tương ứng.",
    examples: [sampleExample(name)]
  }))
];

export const physicsSimulations: Simulation[] = [
  {
    id: "pendulum",
    slug: "pendulum",
    subject: "physics",
    title: "Con lắc đơn",
    type: "pendulum",
    dimension: "2D",
    level: "basic",
    description: "Quan sát chu kỳ, vận tốc, gia tốc và năng lượng khi thay đổi chiều dài, góc lệch, trọng trường.",
    parameters: [
      { key: "length", label: "Chiều dài dây", unit: "m", min: 0.2, max: 3, defaultValue: 1, step: 0.1 },
      { key: "mass", label: "Khối lượng", unit: "kg", min: 0.1, max: 5, defaultValue: 1, step: 0.1 },
      { key: "angle", label: "Góc ban đầu", unit: "deg", min: 2, max: 45, defaultValue: 20, step: 1 },
      { key: "gravity", label: "Trọng trường", unit: "m/s2", min: 1.6, max: 24, defaultValue: 9.81, step: 0.01 },
      { key: "damping", label: "Ma sát không khí", min: 0, max: 0.2, defaultValue: 0.02, step: 0.01 }
    ]
  },
  {
    id: "kinematics",
    slug: "kinematics",
    subject: "physics",
    title: "Chuyển động thẳng biến đổi đều",
    type: "kinematics",
    dimension: "2D",
    level: "basic",
    description: "Tính vị trí, vận tốc và đồ thị s-t, v-t, a-t theo thời gian.",
    parameters: [
      { key: "initialVelocity", label: "Vận tốc đầu", unit: "m/s", min: -20, max: 40, defaultValue: 8, step: 1 },
      { key: "acceleration", label: "Gia tốc", unit: "m/s2", min: -10, max: 10, defaultValue: 2, step: 0.5 },
      { key: "time", label: "Thời gian", unit: "s", min: 0, max: 20, defaultValue: 6, step: 0.5 },
      { key: "initialPosition", label: "Vị trí đầu", unit: "m", min: -50, max: 50, defaultValue: 0, step: 1 }
    ]
  },
  {
    id: "newton-law",
    slug: "newton-law",
    subject: "physics",
    title: "Định luật Newton",
    type: "newton-law",
    dimension: "2D",
    level: "basic",
    description: "Kéo vật trên mặt phẳng và quan sát lực kéo, phản lực, ma sát, gia tốc.",
    parameters: [
      { key: "mass", label: "Khối lượng", unit: "kg", min: 1, max: 50, defaultValue: 10, step: 1 },
      { key: "force", label: "Lực kéo", unit: "N", min: 0, max: 300, defaultValue: 120, step: 5 },
      { key: "friction", label: "Hệ số ma sát", min: 0, max: 0.8, defaultValue: 0.18, step: 0.01 },
      { key: "angle", label: "Góc kéo", unit: "deg", min: 0, max: 60, defaultValue: 15, step: 1 }
    ]
  },
  {
    id: "ideal-gas",
    slug: "ideal-gas",
    subject: "physics",
    title: "Khí lý tưởng",
    type: "ideal-gas",
    dimension: "2D",
    level: "intermediate",
    description: "Hạt khí chuyển động nhanh hơn khi tăng nhiệt độ và va chạm dày hơn khi giảm thể tích.",
    parameters: [
      { key: "n", label: "Số mol", unit: "mol", min: 0.1, max: 5, defaultValue: 1, step: 0.1 },
      { key: "temperature", label: "Nhiệt độ", unit: "K", min: 150, max: 700, defaultValue: 300, step: 10 },
      { key: "volume", label: "Thể tích", unit: "m3", min: 0.01, max: 0.12, defaultValue: 0.04, step: 0.005 },
      { key: "particleCount", label: "Số hạt hiển thị", min: 10, max: 80, defaultValue: 36, step: 1 }
    ]
  },
  { id: "circuit-ohm", slug: "circuit-ohm", subject: "physics", title: "Mạch Ohm", type: "conceptual-physics", dimension: "2D", level: "intermediate", description: "Bản đồ khái niệm U, I, R.", parameters: [] },
  {
    id: "ac-generator",
    slug: "ac-generator",
    subject: "physics",
    title: "Máy phát điện xoay chiều",
    type: "ac-generator",
    dimension: "3D",
    level: "advanced",
    description: "Mô hình 2D/3D giải thích nam châm, cuộn dây quay, slip rings, brushes, dòng AC và waveform sine.",
    safetyNote: "Mô phỏng giáo dục an toàn, không hướng dẫn chế tạo hoặc đấu nối thiết bị điện thật.",
    parameters: []
  },
  {
    id: "faraday-induction",
    slug: "faraday-induction",
    subject: "physics",
    title: "Faraday induction",
    type: "faraday-induction",
    dimension: "3D",
    level: "advanced",
    description: "Mô hình 2D/3D giải thích nam châm chuyển động, từ thông thay đổi, điện áp cảm ứng, dòng điện và kim galvanometer.",
    safetyNote: "Mô phỏng giáo dục an toàn, không hướng dẫn chế tạo hoặc đấu nối thiết bị điện thật.",
    parameters: []
  },
  {
    id: "transformer",
    slug: "transformer",
    subject: "physics",
    title: "Transformer / Máy biến áp",
    type: "transformer",
    dimension: "3D",
    level: "advanced",
    description: "Mô hình 2D/3D giải thích cuộn sơ cấp, lõi từ, cuộn thứ cấp, tỷ số vòng dây, điện áp ra và tải.",
    safetyNote: "Mô phỏng giáo dục an toàn, không hướng dẫn chế tạo hoặc đấu nối thiết bị điện thật.",
    parameters: []
  },
  { id: "electric-field", slug: "electric-field", subject: "physics", title: "Điện trường", type: "conceptual-physics", dimension: "2D", level: "advanced", description: "Minh họa vector điện trường quanh điện tích.", parameters: [] },
  { id: "optics-ray", slug: "optics-ray", subject: "physics", title: "Tia sáng và thấu kính", type: "conceptual-physics", dimension: "2D", level: "advanced", description: "Tia tới, tia phản xạ, tia khúc xạ.", parameters: [] },
  { id: "wave-particle", slug: "wave-particle", subject: "physics", title: "Sóng và hạt", type: "conceptual-physics", dimension: "2D", level: "advanced", description: "Minh họa lưỡng tính sóng hạt ở mức khái niệm.", parameters: [] }
];

export const physicsExercises: Exercise[] = Array.from({ length: 50 }, (_, index) => {
  const lesson = physicsLessons[index % physicsLessons.length];
  const easy = index % 3 === 0;
  return {
    id: `phy-ex-${index}`,
    lessonId: lesson.id,
    subject: "physics",
    type: index % 5 === 0 ? "calculation" : index % 5 === 1 ? "unit-choice" : "multiple-choice",
    question: easy
      ? `Đơn vị SI phù hợp cho đại lượng chính trong bài "${lesson.title}" là gì?`
      : `Chọn nhận định đúng nhất khi áp dụng kiến thức "${lesson.title}" vào bài toán thực tế.`,
    options: easy ? ["m/s, N, J tùy đại lượng", "kg/L cho mọi trường hợp", "Không cần đơn vị", "Chỉ dùng độ C"] : ["Xác định đại lượng đã biết, đổi đơn vị, rồi thay công thức", "Luôn bỏ qua ma sát", "Không cần xét chiều vector", "Chỉ cần nhớ kết quả"],
    answer: easy ? "m/s, N, J tùy đại lượng" : "Xác định đại lượng đã biết, đổi đơn vị, rồi thay công thức",
    explanation: "Bài vật lý cần xác định đại lượng, đơn vị SI, điều kiện áp dụng và ý nghĩa kết quả.",
    difficulty: easy ? "easy" : index % 3 === 1 ? "medium" : "hard"
  };
});

import type {
  Formula,
  FormulaDetail,
  FormulaParameter,
  FormulaVisualMapping,
  InlineLabObject,
  LabParameterBinding,
  Lesson,
  LessonInlineLab,
  LessonMiniExercise
} from "@/types";
import { chemistryFormulas, chemistryLessons } from "@/data/chemistry/catalog";
import { physicsFormulas, physicsLessons } from "@/data/physics/catalog";

type DetailSpec = {
  id: string;
  subject: "physics" | "chemistry";
  name: string;
  slug: string;
  latex: string;
  plainText: string;
  output: string;
  variables: Array<Pick<FormulaParameter, "symbol" | "name" | "unit" | "unitName" | "description" | "physicalMeaning" | "chemicalMeaning">>;
  relatedSimulationLabIds: string[];
  usedWhen: string[];
  notUsedWhen?: string[];
  assumptions?: string[];
  limitations?: string[];
};

const formulaById = new Map<string, Formula>([...physicsFormulas, ...chemistryFormulas].map((formula) => [formula.id, formula]));
const lessonByFormula = new Map<string, string[]>();

[...physicsLessons, ...chemistryLessons].forEach((lesson) => {
  lesson.formulas.forEach((formulaId) => {
    const lessonIds = lessonByFormula.get(formulaId) ?? [];
    lessonIds.push(lesson.id);
    lessonByFormula.set(formulaId, lessonIds);
  });
});

function objectBinding(symbol: string, subject: "physics" | "chemistry") {
  const normalized = symbol.replace(/\\/g, "");
  const bindings: Record<string, { objectId: string; label: string; property: string; visualProperty: FormulaVisualMapping["visualProperty"] }> = {
    v: { objectId: "speedometer", label: "Speedometer", property: "speed", visualProperty: "speed" },
    s: { objectId: "road-ruler", label: "Distance ruler", property: "distance", visualProperty: "distance" },
    t: { objectId: "clock", label: "Clock", property: "time", visualProperty: "time" },
    "Delta v": { objectId: "speed-change", label: "Speed change marker", property: "speed", visualProperty: "speed" },
    "Delta t": { objectId: "clock", label: "Clock", property: "time", visualProperty: "time" },
    a: { objectId: "acceleration-arrow", label: "Acceleration vector", property: "acceleration", visualProperty: "acceleration" },
    F: { objectId: "force-arrow", label: "Force vector", property: "force", visualProperty: "force" },
    m: subject === "chemistry"
      ? { objectId: "mass-scale", label: "Mass scale", property: "mass", visualProperty: "mass" }
      : { objectId: "block", label: "Object mass", property: "mass", visualProperty: "mass" },
    A: { objectId: "work-meter", label: "Work meter", property: "energy", visualProperty: "energy" },
    P: { objectId: "power-meter", label: "Power meter", property: "energy", visualProperty: "energy" },
    Wd: { objectId: "energy-gauge", label: "Kinetic energy gauge", property: "energy", visualProperty: "energy" },
    Wt: { objectId: "height-marker", label: "Height marker", property: "energy", visualProperty: "energy" },
    h: { objectId: "height-marker", label: "Height marker", property: "distance", visualProperty: "distance" },
    l: { objectId: "pendulum-string", label: "Pendulum string", property: "distance", visualProperty: "distance" },
    g: { objectId: "gravity-arrow", label: "Gravity vector", property: "acceleration", visualProperty: "acceleration" },
    Q: { objectId: "heat-meter", label: "Heat meter", property: "energy", visualProperty: "energy" },
    c: { objectId: "material-card", label: "Material card", property: "energy", visualProperty: "energy" },
    "Delta T": { objectId: "thermometer", label: "Thermometer", property: "temperature", visualProperty: "temperature" },
    V: { objectId: "volume-mark", label: "Volume mark", property: "volume", visualProperty: "volume" },
    n: { objectId: "solute-particles", label: "Particle amount", property: "amount", visualProperty: "amount" },
    R: { objectId: "constant-card", label: "Constant or resistor", property: "charge", visualProperty: "charge" },
    I: { objectId: "current-meter", label: "Current meter", property: "charge", visualProperty: "charge" },
    U: { objectId: "battery", label: "Voltage source", property: "charge", visualProperty: "charge" },
    rho: { objectId: "material-card", label: "Material resistivity", property: "charge", visualProperty: "charge" },
    M: { objectId: "molar-mass-card", label: "Molar mass card", property: "amount", visualProperty: "amount" },
    C_M: { objectId: "concentration-meter", label: "Concentration meter", property: "concentration", visualProperty: "concentration" },
    "C%": { objectId: "concentration-meter", label: "Concentration meter", property: "concentration", visualProperty: "concentration" },
    m_ct: { objectId: "solute-particles", label: "Solute mass", property: "mass", visualProperty: "mass" },
    m_dd: { objectId: "beaker", label: "Solution mass", property: "mass", visualProperty: "mass" },
    pH: { objectId: "ph-meter", label: "pH meter", property: "concentration", visualProperty: "concentration" },
    pOH: { objectId: "ph-meter", label: "pOH meter", property: "concentration", visualProperty: "concentration" },
    "[H+]": { objectId: "hydrogen-ions", label: "Hydrogen ions", property: "concentration", visualProperty: "concentration" },
    "[OH-]": { objectId: "hydroxide-ions", label: "Hydroxide ions", property: "concentration", visualProperty: "concentration" },
    Z: { objectId: "nucleus", label: "Nucleus", property: "charge", visualProperty: "charge" },
    e: { objectId: "electron-shell", label: "Electron shell", property: "electron", visualProperty: "electron" },
    q: { objectId: "ion-card", label: "Ion charge", property: "charge", visualProperty: "charge" },
    B: { objectId: "bond", label: "Bond", property: "bond", visualProperty: "bond" },
    H: { objectId: "product-card", label: "Product yield", property: "amount", visualProperty: "amount" },
    actual: { objectId: "product-card", label: "Actual product", property: "amount", visualProperty: "amount" },
    theoretical: { objectId: "formula-node", label: "Theoretical product", property: "amount", visualProperty: "amount" }
  };

  return bindings[normalized] ?? bindings[symbol] ?? {
    objectId: "formula-node",
    label: "Formula node",
    property: "amount",
    visualProperty: "amount" as const
  };
}

function makeParameter(variable: DetailSpec["variables"][number], output: string, subject: "physics" | "chemistry"): FormulaParameter {
  const binding = objectBinding(variable.symbol, subject);
  return {
    ...variable,
    role: variable.symbol === output ? "output" : "input",
    visualBinding: {
      objectId: binding.objectId,
      property: binding.property,
      label: binding.label,
      highlightColor: variable.symbol === output ? "#f59e0b" : "#38bdf8"
    },
    commonMistakes: [
      "Quên đổi đơn vị trước khi thay vào công thức.",
      variable.symbol === output ? "Ghi kết quả nhưng thiếu đơn vị." : "Nhầm biến này với biến có ký hiệu gần giống."
    ]
  };
}

function makeDetail(spec: DetailSpec): FormulaDetail {
  const sourceFormula = formulaById.get(spec.id);
  const variables = spec.variables.map((variable) => makeParameter(variable, spec.output, spec.subject));
  const inputParameters = variables.filter((variable) => variable.role === "input");
  const outputParameters = variables.filter((variable) => variable.role === "output");

  return {
    id: spec.id,
    subject: spec.subject,
    name: sourceFormula?.name ?? spec.name,
    slug: sourceFormula?.slug ?? spec.slug,
    latex: sourceFormula?.latex ?? spec.latex,
    plainText: spec.plainText,
    shortMeaning: `${spec.name} cho biết ${outputParameters[0]?.description.toLowerCase() ?? "đại lượng cần tìm"} từ các tham số đầu vào.`,
    fullExplanation:
      `Công thức ${spec.plainText} được trình bày kèm mô hình để thấy biến nào đi vào phép tính và kết quả hiện ở đâu. ` +
      `Trong inline lab, các input được lấy từ nhãn trên hình, đi qua node công thức, rồi output được highlight trên đồng hồ, vật thể hoặc mô hình hóa học.`,
    usedWhen: spec.usedWhen,
    notUsedWhen: spec.notUsedWhen ?? ["Không dùng khi giả định của công thức bị phá vỡ hoặc dữ liệu đo không cùng hệ đơn vị."],
    assumptions: spec.assumptions ?? ["Mô phỏng giáo dục đơn giản hóa, ưu tiên đúng bản chất hiện tượng hơn độ chính xác phòng thí nghiệm."],
    limitations: spec.limitations ?? ["Kết quả phù hợp cho bài học nhập môn; hiện tượng nâng cao cần mô hình chi tiết hơn."],
    variables,
    inputParameters,
    outputParameters,
    constants: spec.id.includes("ideal-gas")
      ? [{ symbol: "R", name: "Hằng số khí", value: "8.314", unit: "J/(mol.K)", description: "Dùng khi P, V, T ở hệ SI." }]
      : undefined,
    unitRules: variables.map((variable) => ({
      parameterSymbol: variable.symbol,
      expectedUnit: variable.unit,
      note: `${variable.symbol} phải nhập bằng ${variable.unitName || variable.unit || "đơn vị phù hợp"} để kết quả nhất quán.`
    })),
    visualMappings: variables.map((variable, index) => {
      const binding = objectBinding(variable.symbol, spec.subject);
      return {
        formulaId: spec.id,
        parameterSymbol: variable.symbol,
        visualObjectId: binding.objectId,
        visualObjectName: binding.label,
        visualProperty: binding.visualProperty,
        explanation: `${variable.symbol} được gắn với ${binding.label}; khi giá trị đổi, thuộc tính ${binding.property} trên mô hình được highlight.`,
        annotationPosition: { x: 120 + index * 130, y: 80 + (index % 2) * 80 }
      };
    }),
    exampleApplications: [
      {
        title: `Ví dụ nhanh: ${spec.name}`,
        given: Object.fromEntries(inputParameters.map((parameter, index) => [parameter.symbol, index + 1])),
        steps: [
          "Đọc dữ kiện trực tiếp từ nhãn trên mô hình.",
          `Thay input vào ${spec.plainText}.`,
          `Kiểm tra output ${spec.output} và đơn vị tương ứng.`
        ],
        result: `${spec.output} được hiển thị ở ${outputParameters[0]?.visualBinding?.label ?? "output trên mô hình"}.`
      }
    ],
    relatedLessonIds: lessonByFormula.get(spec.id) ?? [],
    relatedInlineLabIds: [`inline-lab-${spec.id}`],
    relatedSimulationLabIds: spec.relatedSimulationLabIds
  };
}

const physicsDetailSpecs: DetailSpec[] = [
  { id: "velocity", subject: "physics", name: "Vận tốc trung bình", slug: "velocity", latex: "v=\\frac{s}{t}", plainText: "v = s / t", output: "v", relatedSimulationLabIds: ["kinematics"], usedWhen: ["Biết quãng đường và thời gian", "Cần vận tốc trung bình"], variables: [
    { symbol: "v", name: "Vận tốc trung bình", unit: "m/s", unitName: "mét trên giây", description: "Tốc độ trung bình của vật.", physicalMeaning: "Trong một giây vật đi được bao nhiêu mét." },
    { symbol: "s", name: "Quãng đường", unit: "m", unitName: "mét", description: "Độ dài đường đi.", physicalMeaning: "Đoạn A-B trên thước đường chạy." },
    { symbol: "t", name: "Thời gian", unit: "s", unitName: "giây", description: "Thời gian vật chuyển động.", physicalMeaning: "Số giây trên đồng hồ." }
  ] },
  { id: "acceleration", subject: "physics", name: "Gia tốc", slug: "acceleration", latex: "a=\\frac{\\Delta v}{\\Delta t}", plainText: "a = Δv / Δt", output: "a", relatedSimulationLabIds: ["kinematics"], usedWhen: ["Vận tốc thay đổi theo thời gian", "Gia tốc gần như không đổi"], variables: [
    { symbol: "a", name: "Gia tốc", unit: "m/s²", unitName: "mét trên giây bình phương", description: "Mức thay đổi vận tốc mỗi giây.", physicalMeaning: "Độ dài vector gia tốc của xe." },
    { symbol: "Delta v", name: "Độ biến thiên vận tốc", unit: "m/s", unitName: "mét trên giây", description: "Vận tốc cuối trừ vận tốc đầu.", physicalMeaning: "Khoảng tăng/giảm trên đồng hồ tốc độ." },
    { symbol: "Delta t", name: "Khoảng thời gian", unit: "s", unitName: "giây", description: "Thời gian diễn ra biến thiên.", physicalMeaning: "Đồng hồ trong mô hình." }
  ] },
  { id: "kinematics-distance", subject: "physics", name: "Quãng đường biến đổi đều", slug: "kinematics-distance", latex: "s=v_0t+\\frac{1}{2}at^2", plainText: "s = v0t + 1/2at²", output: "s", relatedSimulationLabIds: ["kinematics"], usedWhen: ["Chuyển động thẳng", "Gia tốc không đổi"], variables: [
    { symbol: "s", name: "Quãng đường", unit: "m", unitName: "mét", description: "Quãng đường sau thời gian t.", physicalMeaning: "Đoạn thước xe đã đi." },
    { symbol: "v", name: "Vận tốc đầu", unit: "m/s", unitName: "mét trên giây", description: "Vận tốc lúc bắt đầu xét.", physicalMeaning: "Kim tốc độ ban đầu." },
    { symbol: "a", name: "Gia tốc", unit: "m/s²", unitName: "mét trên giây bình phương", description: "Tác nhân làm xe nhanh/chậm dần.", physicalMeaning: "Vector gia tốc." },
    { symbol: "t", name: "Thời gian", unit: "s", unitName: "giây", description: "Thời gian chuyển động.", physicalMeaning: "Đồng hồ." }
  ] },
  { id: "f-ma", subject: "physics", name: "Định luật II Newton", slug: "f-ma", latex: "F=ma", plainText: "F = m a", output: "F", relatedSimulationLabIds: ["newton-law"], usedWhen: ["Xét lực tổng hợp", "Khối lượng không đổi"], variables: [
    { symbol: "F", name: "Lực tổng hợp", unit: "N", unitName: "newton", description: "Lực gây gia tốc.", physicalMeaning: "Mũi tên lực tác dụng lên vật." },
    { symbol: "m", name: "Khối lượng", unit: "kg", unitName: "kilogram", description: "Mức quán tính của vật.", physicalMeaning: "Độ nặng của khối hộp." },
    { symbol: "a", name: "Gia tốc", unit: "m/s²", unitName: "mét trên giây bình phương", description: "Gia tốc do lực tổng hợp.", physicalMeaning: "Mũi tên gia tốc." }
  ] },
  { id: "work", subject: "physics", name: "Công cơ học", slug: "work", latex: "A=Fs\\cos\\theta", plainText: "A = F s cosθ", output: "A", relatedSimulationLabIds: ["newton-law"], usedWhen: ["Có lực làm vật dịch chuyển", "Biết góc giữa lực và chuyển dời"], variables: [
    { symbol: "A", name: "Công", unit: "J", unitName: "joule", description: "Năng lượng lực truyền cho vật.", physicalMeaning: "Đồng hồ năng lượng." },
    { symbol: "F", name: "Lực", unit: "N", unitName: "newton", description: "Lực tác dụng.", physicalMeaning: "Vector lực." },
    { symbol: "s", name: "Độ dời", unit: "m", unitName: "mét", description: "Đường vật dịch chuyển.", physicalMeaning: "Thước trên mặt phẳng." }
  ] },
  { id: "power", subject: "physics", name: "Công suất", slug: "power", latex: "P=\\frac{A}{t}", plainText: "P = A / t", output: "P", relatedSimulationLabIds: ["newton-law"], usedWhen: ["Cần tốc độ sinh công", "So sánh máy làm việc nhanh/chậm"], variables: [
    { symbol: "P", name: "Công suất", unit: "W", unitName: "watt", description: "Công thực hiện trong một giây.", physicalMeaning: "Đồng hồ công suất." },
    { symbol: "A", name: "Công", unit: "J", unitName: "joule", description: "Năng lượng truyền.", physicalMeaning: "Đồng hồ năng lượng." },
    { symbol: "t", name: "Thời gian", unit: "s", unitName: "giây", description: "Thời gian làm công.", physicalMeaning: "Đồng hồ." }
  ] },
  { id: "kinetic-energy", subject: "physics", name: "Động năng", slug: "kinetic-energy", latex: "W_d=\\frac{1}{2}mv^2", plainText: "Wđ = 1/2 m v²", output: "Wd", relatedSimulationLabIds: ["pendulum"], usedWhen: ["Vật đang chuyển động", "Cần năng lượng do vận tốc"], variables: [
    { symbol: "Wd", name: "Động năng", unit: "J", unitName: "joule", description: "Năng lượng do chuyển động.", physicalMeaning: "Cột năng lượng động." },
    { symbol: "m", name: "Khối lượng", unit: "kg", unitName: "kilogram", description: "Khối lượng vật.", physicalMeaning: "Khối lượng quả nặng/xe." },
    { symbol: "v", name: "Vận tốc", unit: "m/s", unitName: "mét trên giây", description: "Vận tốc tức thời.", physicalMeaning: "Kim tốc độ." }
  ] },
  { id: "potential-energy", subject: "physics", name: "Thế năng trọng trường", slug: "potential-energy", latex: "W_t=mgh", plainText: "Wt = m g h", output: "Wt", relatedSimulationLabIds: ["pendulum"], usedWhen: ["Vật ở độ cao h", "Gần mặt đất với g gần như không đổi"], variables: [
    { symbol: "Wt", name: "Thế năng", unit: "J", unitName: "joule", description: "Năng lượng do vị trí trong trọng trường.", physicalMeaning: "Cột năng lượng thế." },
    { symbol: "m", name: "Khối lượng", unit: "kg", unitName: "kilogram", description: "Khối lượng vật.", physicalMeaning: "Quả nặng." },
    { symbol: "g", name: "Gia tốc trọng trường", unit: "m/s²", unitName: "mét trên giây bình phương", description: "Cường độ trọng trường.", physicalMeaning: "Vector trọng lực." },
    { symbol: "h", name: "Độ cao", unit: "m", unitName: "mét", description: "Độ cao so với mốc.", physicalMeaning: "Vạch cao độ." }
  ] },
  { id: "momentum", subject: "physics", name: "Động lượng", slug: "momentum", latex: "p=mv", plainText: "p = m v", output: "p", relatedSimulationLabIds: ["kinematics"], usedWhen: ["Phân tích va chạm", "Vật có khối lượng và vận tốc"], variables: [
    { symbol: "p", name: "Động lượng", unit: "kg.m/s", unitName: "kilogram mét trên giây", description: "Lượng chuyển động của vật.", physicalMeaning: "Mũi tên động lượng." },
    { symbol: "m", name: "Khối lượng", unit: "kg", unitName: "kilogram", description: "Khối lượng vật.", physicalMeaning: "Khối lượng xe." },
    { symbol: "v", name: "Vận tốc", unit: "m/s", unitName: "mét trên giây", description: "Vận tốc vật.", physicalMeaning: "Kim tốc độ." }
  ] },
  { id: "pendulum-period", subject: "physics", name: "Chu kỳ con lắc đơn", slug: "pendulum-period", latex: "T=2\\pi\\sqrt{\\frac{l}{g}}", plainText: "T = 2π√(l/g)", output: "T", relatedSimulationLabIds: ["pendulum"], usedWhen: ["Góc lệch nhỏ", "Dây nhẹ, không dãn", "Ma sát nhỏ"], limitations: ["Không chính xác với góc lớn hoặc ma sát mạnh."], variables: [
    { symbol: "T", name: "Chu kỳ", unit: "s", unitName: "giây", description: "Thời gian một dao động toàn phần.", physicalMeaning: "Đồng hồ chu kỳ." },
    { symbol: "l", name: "Chiều dài dây", unit: "m", unitName: "mét", description: "Khoảng cách từ điểm treo đến tâm quả nặng.", physicalMeaning: "Dây con lắc." },
    { symbol: "g", name: "Gia tốc trọng trường", unit: "m/s²", unitName: "mét trên giây bình phương", description: "Trọng trường tại nơi dao động.", physicalMeaning: "Vector trọng lực." }
  ] },
  { id: "heat", subject: "physics", name: "Nhiệt lượng", slug: "heat", latex: "Q=mc\\Delta T", plainText: "Q = m c ΔT", output: "Q", relatedSimulationLabIds: ["ideal-gas"], usedWhen: ["Không đổi trạng thái", "Biết nhiệt dung riêng"], variables: [
    { symbol: "Q", name: "Nhiệt lượng", unit: "J", unitName: "joule", description: "Năng lượng nhiệt trao đổi.", physicalMeaning: "Đồng hồ nhiệt lượng." },
    { symbol: "m", name: "Khối lượng", unit: "kg", unitName: "kilogram", description: "Khối lượng chất.", physicalMeaning: "Mẫu vật." },
    { symbol: "c", name: "Nhiệt dung riêng", unit: "J/(kg.K)", unitName: "joule trên kilogram kelvin", description: "Nhiệt cần để tăng 1 kg thêm 1 K.", physicalMeaning: "Thẻ vật liệu." },
    { symbol: "Delta T", name: "Độ tăng nhiệt độ", unit: "K", unitName: "kelvin", description: "Nhiệt độ cuối trừ đầu.", physicalMeaning: "Nhiệt kế." }
  ] },
  { id: "ideal-gas", subject: "physics", name: "Khí lý tưởng", slug: "ideal-gas", latex: "PV=nRT", plainText: "P V = n R T", output: "P", relatedSimulationLabIds: ["ideal-gas"], usedWhen: ["Khí loãng", "Nhiệt độ tính bằng K"], variables: [
    { symbol: "P", name: "Áp suất", unit: "Pa", unitName: "pascal", description: "Lực va chạm phân tử lên thành bình.", physicalMeaning: "Đồng hồ áp suất." },
    { symbol: "V", name: "Thể tích", unit: "m³", unitName: "mét khối", description: "Không gian khí chiếm.", physicalMeaning: "Kích thước bình." },
    { symbol: "n", name: "Số mol", unit: "mol", unitName: "mol", description: "Lượng khí.", physicalMeaning: "Số hạt hiển thị." },
    { symbol: "T", name: "Nhiệt độ", unit: "K", unitName: "kelvin", description: "Mức năng lượng chuyển động trung bình.", physicalMeaning: "Tốc độ hạt khí." }
  ] },
  { id: "ohm-current", subject: "physics", name: "Định luật Ohm", slug: "ohm-current", latex: "I=\\frac{U}{R}", plainText: "I = U / R", output: "I", relatedSimulationLabIds: ["circuit-ohm"], usedWhen: ["Điện trở thuần", "Nhiệt độ gần ổn định"], variables: [
    { symbol: "I", name: "Cường độ dòng điện", unit: "A", unitName: "ampere", description: "Lượng điện tích qua tiết diện mỗi giây.", physicalMeaning: "Đồng hồ ampe." },
    { symbol: "U", name: "Hiệu điện thế", unit: "V", unitName: "volt", description: "Nguồn đẩy điện tích.", physicalMeaning: "Pin." },
    { symbol: "R", name: "Điện trở", unit: "Ω", unitName: "ohm", description: "Mức cản dòng điện.", physicalMeaning: "Điện trở trong mạch." }
  ] },
  { id: "electric-power", subject: "physics", name: "Công suất điện", slug: "electric-power", latex: "P=UI", plainText: "P = U I", output: "P", relatedSimulationLabIds: ["circuit-ohm"], usedWhen: ["Mạch điện cơ bản", "Biết U và I"], variables: [
    { symbol: "P", name: "Công suất điện", unit: "W", unitName: "watt", description: "Tốc độ tiêu thụ điện năng.", physicalMeaning: "Độ sáng bóng đèn." },
    { symbol: "U", name: "Hiệu điện thế", unit: "V", unitName: "volt", description: "Điện áp nguồn.", physicalMeaning: "Pin." },
    { symbol: "I", name: "Dòng điện", unit: "A", unitName: "ampere", description: "Cường độ dòng.", physicalMeaning: "Dòng electron trong dây." }
  ] },
  { id: "resistance-wire", subject: "physics", name: "Điện trở dây dẫn", slug: "resistance-wire", latex: "R=\\rho\\frac{l}{S}", plainText: "R = ρ l / S", output: "R", relatedSimulationLabIds: ["circuit-ohm"], usedWhen: ["Dây đồng chất", "Nhiệt độ không đổi"], variables: [
    { symbol: "R", name: "Điện trở", unit: "Ω", unitName: "ohm", description: "Mức cản dòng điện.", physicalMeaning: "Điện trở của dây." },
    { symbol: "rho", name: "Điện trở suất", unit: "Ω.m", unitName: "ohm mét", description: "Tính chất vật liệu.", physicalMeaning: "Thẻ vật liệu dây." },
    { symbol: "l", name: "Chiều dài dây", unit: "m", unitName: "mét", description: "Dây dài hơn thì cản nhiều hơn.", physicalMeaning: "Độ dài dây." },
    { symbol: "S", name: "Tiết diện", unit: "m²", unitName: "mét vuông", description: "Dây to hơn thì cản ít hơn.", physicalMeaning: "Độ dày dây." }
  ] }
];

const chemistryDetailSpecs: DetailSpec[] = [
  { id: "mole", subject: "chemistry", name: "Số mol", slug: "mole", latex: "n=\\frac{m}{M}", plainText: "n = m / M", output: "n", relatedSimulationLabIds: ["solution-concentration"], usedWhen: ["Biết khối lượng mẫu và khối lượng mol"], variables: [
    { symbol: "n", name: "Số mol", unit: "mol", unitName: "mol", description: "Lượng chất.", chemicalMeaning: "Số cụm hạt tượng trưng trong mô hình." },
    { symbol: "m", name: "Khối lượng mẫu", unit: "g", unitName: "gam", description: "Khối lượng chất trên cân.", chemicalMeaning: "Giá trị trên cân." },
    { symbol: "M", name: "Khối lượng mol", unit: "g/mol", unitName: "gam trên mol", description: "Khối lượng của một mol chất.", chemicalMeaning: "Thẻ chất." }
  ] },
  { id: "mass-from-mole", subject: "chemistry", name: "Khối lượng từ số mol", slug: "mass-from-mole", latex: "m=nM", plainText: "m = n M", output: "m", relatedSimulationLabIds: ["solution-concentration"], usedWhen: ["Biết số mol và khối lượng mol"], variables: [
    { symbol: "m", name: "Khối lượng", unit: "g", unitName: "gam", description: "Khối lượng chất cần tính.", chemicalMeaning: "Giá trị hiện trên cân." },
    { symbol: "n", name: "Số mol", unit: "mol", unitName: "mol", description: "Lượng chất.", chemicalMeaning: "Số cụm hạt." },
    { symbol: "M", name: "Khối lượng mol", unit: "g/mol", unitName: "gam trên mol", description: "Khối lượng mol.", chemicalMeaning: "Thẻ chất." }
  ] },
  { id: "molarity", subject: "chemistry", name: "Nồng độ mol", slug: "molarity", latex: "C_M=\\frac{n}{V}", plainText: "C_M = n / V", output: "C_M", relatedSimulationLabIds: ["solution-concentration"], usedWhen: ["Dung dịch có số mol và thể tích xác định"], variables: [
    { symbol: "C_M", name: "Nồng độ mol", unit: "mol/L", unitName: "mol trên lít", description: "Số mol chất tan trong một lít dung dịch.", chemicalMeaning: "Đồng hồ nồng độ và độ đậm màu dung dịch." },
    { symbol: "n", name: "Số mol chất tan", unit: "mol", unitName: "mol", description: "Lượng chất tan.", chemicalMeaning: "Số hạt chất tan trong cốc." },
    { symbol: "V", name: "Thể tích dung dịch", unit: "L", unitName: "lít", description: "Thể tích dung dịch.", chemicalMeaning: "Vạch chia trên cốc." }
  ] },
  { id: "percent-concentration", subject: "chemistry", name: "Nồng độ phần trăm", slug: "percent-concentration", latex: "C\\%=\\frac{m_{ct}}{m_{dd}}\\times100\\%", plainText: "C% = m_ct / m_dd × 100%", output: "C%", relatedSimulationLabIds: ["solution-concentration"], usedWhen: ["Đề bài cho khối lượng chất tan và dung dịch"], variables: [
    { symbol: "C%", name: "Nồng độ phần trăm", unit: "%", unitName: "phần trăm", description: "Tỉ lệ khối lượng chất tan.", chemicalMeaning: "Đồng hồ nồng độ." },
    { symbol: "m_ct", name: "Khối lượng chất tan", unit: "g", unitName: "gam", description: "Khối lượng chất tan.", chemicalMeaning: "Hạt chất tan." },
    { symbol: "m_dd", name: "Khối lượng dung dịch", unit: "g", unitName: "gam", description: "Tổng khối lượng dung dịch.", chemicalMeaning: "Cốc dung dịch." }
  ] },
  { id: "gas-volume-stp", subject: "chemistry", name: "Thể tích khí ở điều kiện tiêu chuẩn", slug: "gas-volume-stp", latex: "V=n\\times22.4", plainText: "V = n × 22.4", output: "V", relatedSimulationLabIds: ["ideal-gas"], usedWhen: ["Bài tập nhập môn về khí ở điều kiện tiêu chuẩn cổ điển"], variables: [
    { symbol: "V", name: "Thể tích khí", unit: "L", unitName: "lít", description: "Thể tích khí.", chemicalMeaning: "Kích thước bình khí." },
    { symbol: "n", name: "Số mol khí", unit: "mol", unitName: "mol", description: "Lượng khí.", chemicalMeaning: "Số hạt khí." }
  ] },
  { id: "ph", subject: "chemistry", name: "pH", slug: "ph", latex: "pH=-\\log[H^+]", plainText: "pH = -log[H+]", output: "pH", relatedSimulationLabIds: ["acid-base"], usedWhen: ["Dung dịch nước loãng", "Nhiệt độ xấp xỉ 25 C"], variables: [
    { symbol: "pH", name: "pH", unit: "", unitName: "không có đơn vị", description: "Độ acid của dung dịch.", chemicalMeaning: "Chỉ số trên pH meter." },
    { symbol: "[H+]", name: "Nồng độ H+", unit: "mol/L", unitName: "mol trên lít", description: "Nồng độ ion hydrogen.", chemicalMeaning: "Số ion H+ trong dung dịch." }
  ] },
  { id: "poh", subject: "chemistry", name: "pOH", slug: "poh", latex: "pOH=-\\log[OH^-]", plainText: "pOH = -log[OH-]", output: "pOH", relatedSimulationLabIds: ["acid-base"], usedWhen: ["Dung dịch bazơ loãng"], variables: [
    { symbol: "pOH", name: "pOH", unit: "", unitName: "không có đơn vị", description: "Độ bazơ theo OH-.", chemicalMeaning: "Chỉ số trên pH/pOH meter." },
    { symbol: "[OH-]", name: "Nồng độ OH-", unit: "mol/L", unitName: "mol trên lít", description: "Nồng độ ion hydroxide.", chemicalMeaning: "Số ion OH- trong dung dịch." }
  ] },
  { id: "ph-poh", subject: "chemistry", name: "Quan hệ pH và pOH", slug: "ph-poh", latex: "pH+pOH=14", plainText: "pH + pOH = 14", output: "pH", relatedSimulationLabIds: ["acid-base"], usedWhen: ["Dung dịch nước ở 25 C"], variables: [
    { symbol: "pH", name: "pH", unit: "", unitName: "không có đơn vị", description: "Độ acid.", chemicalMeaning: "Chỉ số acid." },
    { symbol: "pOH", name: "pOH", unit: "", unitName: "không có đơn vị", description: "Độ bazơ.", chemicalMeaning: "Chỉ số bazơ." }
  ] },
  { id: "stoichiometry", subject: "chemistry", name: "Tỉ lệ phương trình", slug: "stoichiometry", latex: "aA+bB\\rightarrow cC+dD", plainText: "aA + bB -> cC + dD", output: "n", relatedSimulationLabIds: ["reaction-sandbox"], usedWhen: ["Cân bằng số nguyên tử", "So sánh tỉ lệ mol"], variables: [
    { symbol: "n", name: "Tỉ lệ mol", unit: "mol", unitName: "mol", description: "Tỉ lệ chất phản ứng/sản phẩm.", chemicalMeaning: "Số phân tử trong vùng phản ứng." },
    { symbol: "B", name: "Liên kết thay đổi", unit: "", unitName: "không có đơn vị", description: "Liên kết bị phá vỡ/tạo thành.", chemicalMeaning: "Bond được highlight." }
  ] },
  { id: "valence", subject: "chemistry", name: "Electron hóa trị", slug: "valence", latex: "e_v=e_{outer}", plainText: "e_v = electron lớp ngoài", output: "e", relatedSimulationLabIds: ["atom-model"], usedWhen: ["Dự đoán liên kết", "Vẽ Lewis"], variables: [
    { symbol: "e", name: "Electron hóa trị", unit: "electron", unitName: "electron", description: "Electron lớp ngoài cùng.", chemicalMeaning: "Chấm electron quanh atom." },
    { symbol: "Z", name: "Số hiệu nguyên tử", unit: "proton", unitName: "proton", description: "Số proton xác định nguyên tố.", chemicalMeaning: "Hạt nhân." }
  ] },
  { id: "bond-order", subject: "chemistry", name: "Bậc liên kết", slug: "bond-order", latex: "BO=\\frac{N_b-N_a}{2}", plainText: "BO = (Nb - Na) / 2", output: "B", relatedSimulationLabIds: ["chemical-bonding"], usedWhen: ["So sánh liên kết đơn/đôi/ba ở mức khái niệm"], variables: [
    { symbol: "B", name: "Bậc liên kết", unit: "", unitName: "không có đơn vị", description: "Số cặp electron liên kết hiệu dụng.", chemicalMeaning: "Số nét bond trong Lewis." },
    { symbol: "e", name: "Electron liên kết", unit: "electron", unitName: "electron", description: "Electron tham gia liên kết.", chemicalMeaning: "Cặp electron chia sẻ." }
  ] },
  { id: "atomic-number", subject: "chemistry", name: "Số hiệu nguyên tử", slug: "atomic-number", latex: "Z=p", plainText: "Z = p", output: "Z", relatedSimulationLabIds: ["atom-model"], usedWhen: ["Xác định nguyên tố", "Đọc bảng tuần hoàn"], variables: [
    { symbol: "Z", name: "Số hiệu nguyên tử", unit: "proton", unitName: "proton", description: "Số proton trong hạt nhân.", chemicalMeaning: "Số proton ở hạt nhân." },
    { symbol: "p", name: "Proton", unit: "proton", unitName: "proton", description: "Hạt mang điện dương.", chemicalMeaning: "Hạt đỏ trong hạt nhân." }
  ] },
  { id: "atomic-mass", subject: "chemistry", name: "Số khối gần đúng", slug: "atomic-mass", latex: "A=p+n", plainText: "A = p + n", output: "A", relatedSimulationLabIds: ["atom-model"], usedWhen: ["Mô hình hạt nhân cơ bản"], variables: [
    { symbol: "A", name: "Số khối", unit: "u", unitName: "đơn vị khối lượng nguyên tử", description: "Tổng proton và neutron.", chemicalMeaning: "Tổng hạt trong hạt nhân." },
    { symbol: "p", name: "Proton", unit: "proton", unitName: "proton", description: "Hạt dương.", chemicalMeaning: "Hạt đỏ." },
    { symbol: "n", name: "Neutron", unit: "neutron", unitName: "neutron", description: "Hạt trung hòa.", chemicalMeaning: "Hạt xám." }
  ] },
  { id: "ion-charge", subject: "chemistry", name: "Điện tích ion", slug: "ion-charge", latex: "q=p-e", plainText: "q = p - e", output: "q", relatedSimulationLabIds: ["atom-model"], usedWhen: ["Nguyên tử mất/nhận electron"], variables: [
    { symbol: "q", name: "Điện tích ion", unit: "e", unitName: "điện tích cơ bản", description: "Điện tích ròng của ion.", chemicalMeaning: "Thẻ ion." },
    { symbol: "p", name: "Proton", unit: "proton", unitName: "proton", description: "Điện tích dương.", chemicalMeaning: "Hạt nhân." },
    { symbol: "e", name: "Electron", unit: "electron", unitName: "electron", description: "Điện tích âm.", chemicalMeaning: "Electron lớp ngoài." }
  ] },
  { id: "yield-percent", subject: "chemistry", name: "Hiệu suất phản ứng", slug: "yield-percent", latex: "H\\%=\\frac{actual}{theoretical}\\times100\\%", plainText: "H% = actual / theoretical × 100%", output: "H", relatedSimulationLabIds: ["reaction-sandbox"], usedWhen: ["So sánh lượng sản phẩm thực tế và lý thuyết"], variables: [
    { symbol: "H", name: "Hiệu suất", unit: "%", unitName: "phần trăm", description: "Tỉ lệ sản phẩm thu được.", chemicalMeaning: "Thẻ sản phẩm." },
    { symbol: "actual", name: "Lượng thực tế", unit: "g", unitName: "gam", description: "Sản phẩm thu được.", chemicalMeaning: "Sản phẩm thực tế trong mô hình." },
    { symbol: "theoretical", name: "Lượng lý thuyết", unit: "g", unitName: "gam", description: "Sản phẩm tối đa theo tính toán.", chemicalMeaning: "Node công thức." }
  ] }
];

export const formulaDetails: FormulaDetail[] = [...physicsDetailSpecs, ...chemistryDetailSpecs].map(makeDetail);

function sceneObjects(type: LessonInlineLab["labType"]): InlineLabObject[] {
  if (type === "atom-structure-flow") {
    return [
      { id: "nucleus", type: "atom", label: "Hạt nhân", description: "Proton và neutron nằm ở trung tâm atom.", boundParameters: ["Z", "A", "p", "n"], position: { x: 250, y: 175 } },
      { id: "electron-shell", type: "electron", label: "Lớp electron", description: "Electron chuyển động quanh hạt nhân trong mô hình đơn giản hóa.", boundParameters: ["e"], position: { x: 250, y: 175 } },
      { id: "ion-card", type: "molecule", label: "Thẻ ion q", description: "Điện tích ion thay đổi khi electron bị mất hoặc nhận.", boundParameters: ["q"], position: { x: 455, y: 145 } },
      { id: "constant-card", type: "block", label: "Bảng nguyên tố", description: "Hiển thị số hiệu nguyên tử và cấu hình electron.", boundParameters: ["Z", "A"], position: { x: 465, y: 245 } }
    ];
  }

  if (type === "molecule-formation-flow" || type === "bonding-flow") {
    return [
      { id: "atom-center", type: "atom", label: "Atom trung tâm", description: "Nguyên tử chính nhận/chia sẻ electron.", boundParameters: ["e", "B"], position: { x: 245, y: 170 } },
      { id: "electron-shell", type: "electron", label: "Electron hóa trị", description: "Các chấm electron lớp ngoài.", boundParameters: ["e"], position: { x: 245, y: 110 } },
      { id: "bond", type: "bond", label: "Liên kết", description: "Liên kết được tạo khi atom đủ điều kiện.", boundParameters: ["B"], position: { x: 350, y: 170 } },
      { id: "molecule", type: "molecule", label: "Phân tử tạo thành", description: "Sản phẩm mô hình hóa.", boundParameters: ["B"], position: { x: 480, y: 170 } }
    ];
  }

  if (type === "reaction-flow") {
    return [
      { id: "beaker", type: "beaker", label: "Bình phản ứng", description: "Vùng phản ứng an toàn ở mức khái niệm.", boundParameters: ["n"], position: { x: 240, y: 210 } },
      { id: "solute-particles", type: "solution", label: "Chất phản ứng", description: "Ion/phân tử trước phản ứng.", boundParameters: ["n"], position: { x: 170, y: 175 } },
      { id: "bond", type: "bond", label: "Bond thay đổi", description: "Liên kết/ion pair được phá vỡ hoặc tạo thành.", boundParameters: ["B"], position: { x: 330, y: 150 } },
      { id: "product-card", type: "molecule", label: "Sản phẩm", description: "Sản phẩm sau phản ứng.", boundParameters: ["H", "actual"], position: { x: 470, y: 170 } }
    ];
  }

  if (type === "solution-concentration-flow" || type === "ph-scale-flow") {
    return [
      { id: "beaker", type: "beaker", label: "Cốc dung dịch", description: "Dung dịch đang được mô phỏng.", boundParameters: ["V", "m_dd"], position: { x: 250, y: 220 } },
      { id: "solute-particles", type: "solution", label: "Hạt chất tan n", description: "Số mol được biểu diễn bằng mật độ hạt.", boundParameters: ["n", "m_ct", "[H+]", "[OH-]"], position: { x: 240, y: 165 } },
      { id: "volume-mark", type: "ruler", label: "Vạch thể tích V", description: "Vạch chia thể tích trên cốc.", boundParameters: ["V"], position: { x: 330, y: 180 } },
      { id: type === "ph-scale-flow" ? "ph-meter" : "concentration-meter", type: type === "ph-scale-flow" ? "ph-meter" : "pressure-gauge", label: type === "ph-scale-flow" ? "pH meter" : "Đồng hồ nồng độ", description: "Output của công thức.", boundParameters: ["C_M", "C%", "pH", "pOH"], position: { x: 470, y: 115 } }
    ];
  }

  if (type === "pendulum-flow") {
    return [
      { id: "pendulum-string", type: "pendulum", label: "Dây l", description: "Chiều dài dây truyền vào công thức chu kỳ.", boundParameters: ["l"], position: { x: 260, y: 140 } },
      { id: "gravity-arrow", type: "force-arrow", label: "Trọng trường g", description: "Vector trọng lực hướng xuống.", boundParameters: ["g"], position: { x: 340, y: 210 } },
      { id: "clock", type: "clock", label: "Chu kỳ T", description: "Thời gian một dao động.", boundParameters: ["T"], position: { x: 470, y: 115 } },
      { id: "energy-gauge", type: "pressure-gauge", label: "Năng lượng", description: "Động năng/thế năng đổi qua lại.", boundParameters: ["Wd", "Wt"], position: { x: 470, y: 225 } }
    ];
  }

  if (type === "ideal-gas-flow" || type === "heat-transfer-flow") {
    return [
      { id: "gas-container", type: "gas-container", label: "Bình khí / mẫu", description: "Thể tích hoặc mẫu vật.", boundParameters: ["V", "m"], position: { x: 250, y: 200 } },
      { id: "solute-particles", type: "gas-particle", label: "Hạt n", description: "Lượng chất hoặc hạt khí.", boundParameters: ["n"], position: { x: 240, y: 150 } },
      { id: "thermometer", type: "thermometer", label: "Nhiệt độ T", description: "Nhiệt độ ảnh hưởng chuyển động hạt.", boundParameters: ["T", "Delta T"], position: { x: 430, y: 135 } },
      { id: "pressure-gauge", type: "pressure-gauge", label: "Áp suất / Q", description: "Kết quả quan sát.", boundParameters: ["P", "Q"], position: { x: 480, y: 225 } }
    ];
  }

  if (type === "electric-circuit-flow") {
    return [
      { id: "battery", type: "battery", label: "Nguồn U", description: "Hiệu điện thế đẩy điện tích.", boundParameters: ["U"], position: { x: 170, y: 200 } },
      { id: "wire", type: "wire", label: "Dây dẫn", description: "Dòng điện chuyển động trong dây.", boundParameters: ["I", "l", "S"], position: { x: 300, y: 200 } },
      { id: "current-meter", type: "pressure-gauge", label: "Ampe kế I", description: "Kết quả dòng điện.", boundParameters: ["I"], position: { x: 440, y: 115 } },
      { id: "bulb", type: "bulb", label: "Bóng đèn P", description: "Sáng mạnh/yếu theo công suất.", boundParameters: ["P", "R"], position: { x: 450, y: 230 } }
    ];
  }

  return [
    { id: "car", type: "car", label: "Xe", description: "Vật chuyển động trong mô hình.", boundParameters: ["v", "a", "p"], position: { x: 175, y: 220 } },
    { id: "road-ruler", type: "ruler", label: "Thước quãng đường s", description: "Đo đoạn đường xe đi.", boundParameters: ["s"], position: { x: 260, y: 280 } },
    { id: "clock", type: "clock", label: "Đồng hồ t", description: "Đo thời gian chuyển động.", boundParameters: ["t", "Delta t"], position: { x: 460, y: 90 } },
    { id: "speedometer", type: "speedometer", label: "Đồng hồ tốc độ v", description: "Hiển thị vận tốc output.", boundParameters: ["v"], position: { x: 465, y: 185 } },
    { id: "acceleration-arrow", type: "force-arrow", label: "Vector gia tốc a", description: "Mũi tên cho biết xe nhanh/chậm dần.", boundParameters: ["a"], position: { x: 300, y: 190 } },
    { id: "force-arrow", type: "force-arrow", label: "Vector lực F", description: "Lực tác dụng lên vật.", boundParameters: ["F"], position: { x: 225, y: 170 } },
    { id: "block", type: "block", label: "Khối lượng m", description: "Vật chịu lực hoặc mang năng lượng.", boundParameters: ["m"], position: { x: 210, y: 215 } }
  ];
}

const labConfigs: Array<{
  lesson: Lesson;
  formulaIds: string[];
  labType: LessonInlineLab["labType"];
  title: string;
  relatedSimulationLabId?: string;
  exerciseValue?: number | string;
  exerciseUnit?: string;
}> = [
  { lesson: physicsLessons[0], formulaIds: ["velocity"], labType: "motion-flow", title: "Xe đi từ A đến B: s, t tạo ra v", relatedSimulationLabId: "kinematics", exerciseValue: 10, exerciseUnit: "m/s" },
  { lesson: physicsLessons[1], formulaIds: ["acceleration", "kinematics-distance"], labType: "acceleration-flow", title: "Xe nhanh dần và dòng dữ liệu v0, a, t", relatedSimulationLabId: "kinematics", exerciseValue: 4, exerciseUnit: "m/s²" },
  { lesson: physicsLessons[2], formulaIds: ["f-ma"], labType: "force-flow", title: "Lực kéo tạo gia tốc theo F = ma", relatedSimulationLabId: "newton-law", exerciseValue: 10, exerciseUnit: "N" },
  { lesson: physicsLessons[3], formulaIds: ["work", "power"], labType: "force-flow", title: "Lực sinh công và công suất", relatedSimulationLabId: "newton-law", exerciseValue: 80, exerciseUnit: "J" },
  { lesson: physicsLessons[4], formulaIds: ["kinetic-energy", "potential-energy"], labType: "pendulum-flow", title: "Năng lượng chuyển đổi trong dao động", relatedSimulationLabId: "pendulum", exerciseValue: 36, exerciseUnit: "J" },
  { lesson: physicsLessons[5], formulaIds: ["momentum"], labType: "motion-flow", title: "Động lượng gắn với xe đang chạy", relatedSimulationLabId: "kinematics", exerciseValue: 12, exerciseUnit: "kg.m/s" },
  { lesson: physicsLessons[7], formulaIds: ["pendulum-period"], labType: "pendulum-flow", title: "Chiều dài dây quyết định chu kỳ", relatedSimulationLabId: "pendulum", exerciseValue: "tăng", exerciseUnit: "s" },
  { lesson: physicsLessons[8], formulaIds: ["heat"], labType: "heat-transfer-flow", title: "Nhiệt lượng đi vào mẫu vật", relatedSimulationLabId: "ideal-gas", exerciseValue: 4200, exerciseUnit: "J" },
  { lesson: physicsLessons[10], formulaIds: ["ideal-gas"], labType: "ideal-gas-flow", title: "P, V, n, T trong bình khí", relatedSimulationLabId: "ideal-gas", exerciseValue: "P tăng", exerciseUnit: "Pa" },
  { lesson: physicsLessons[13], formulaIds: ["ohm-current"], labType: "electric-circuit-flow", title: "Nguồn U, điện trở R và dòng I", relatedSimulationLabId: "circuit-ohm", exerciseValue: 2, exerciseUnit: "A" },
  { lesson: physicsLessons[14], formulaIds: ["electric-power"], labType: "electric-circuit-flow", title: "Công suất làm bóng đèn sáng", relatedSimulationLabId: "circuit-ohm", exerciseValue: 24, exerciseUnit: "W" },
  { lesson: physicsLessons[15], formulaIds: ["resistance-wire"], labType: "electric-circuit-flow", title: "Dây dài, tiết diện và điện trở", relatedSimulationLabId: "circuit-ohm", exerciseValue: "R tăng", exerciseUnit: "Ω" },
  { lesson: chemistryLessons[0], formulaIds: ["atomic-number"], labType: "atom-structure-flow", title: "Số proton xác định nguyên tố", relatedSimulationLabId: "atom-model", exerciseValue: 8, exerciseUnit: "proton" },
  { lesson: chemistryLessons[1], formulaIds: ["atomic-mass"], labType: "atom-structure-flow", title: "Proton và neutron tạo số khối", relatedSimulationLabId: "atom-model", exerciseValue: 16, exerciseUnit: "u" },
  { lesson: chemistryLessons[4], formulaIds: ["valence"], labType: "atom-structure-flow", title: "Electron hóa trị nằm ở lớp ngoài", relatedSimulationLabId: "atom-model", exerciseValue: 6, exerciseUnit: "electron" },
  { lesson: chemistryLessons[5], formulaIds: ["ion-charge"], labType: "atom-structure-flow", title: "Mất hoặc nhận electron tạo ion", relatedSimulationLabId: "atom-model", exerciseValue: "+1", exerciseUnit: "e" },
  { lesson: chemistryLessons[6], formulaIds: ["valence", "ion-charge"], labType: "bonding-flow", title: "Na trao electron cho Cl tạo NaCl", relatedSimulationLabId: "chemical-bonding", exerciseValue: "NaCl", exerciseUnit: "ion" },
  { lesson: chemistryLessons[7], formulaIds: ["bond-order"], labType: "molecule-formation-flow", title: "H và O chia sẻ electron tạo H2O", relatedSimulationLabId: "chemical-bonding", exerciseValue: "H2O", exerciseUnit: "cộng hóa trị" },
  { lesson: chemistryLessons[8], formulaIds: ["valence", "bond-order"], labType: "molecule-formation-flow", title: "CO2: C chia sẻ electron với hai O", relatedSimulationLabId: "chemical-bonding", exerciseValue: "CO2", exerciseUnit: "bond" },
  { lesson: chemistryLessons[9], formulaIds: ["bond-order"], labType: "molecule-formation-flow", title: "NH3: N tạo ba liên kết N-H", relatedSimulationLabId: "molecule-viewer", exerciseValue: "NH3", exerciseUnit: "3D" },
  { lesson: chemistryLessons[9], formulaIds: ["bond-order"], labType: "molecule-formation-flow", title: "CH4: C tạo bốn liên kết C-H", relatedSimulationLabId: "molecule-viewer", exerciseValue: "CH4", exerciseUnit: "3D" },
  { lesson: chemistryLessons[10], formulaIds: ["stoichiometry"], labType: "reaction-flow", title: "Cân bằng phản ứng bằng bảo toàn nguyên tử", relatedSimulationLabId: "reaction-sandbox", exerciseValue: "balanced", exerciseUnit: "equation" },
  { lesson: chemistryLessons[11], formulaIds: ["ph", "poh", "ph-poh"], labType: "ph-scale-flow", title: "H+, OH- và pH trong trung hòa", relatedSimulationLabId: "acid-base", exerciseValue: 7, exerciseUnit: "pH" },
  { lesson: chemistryLessons[14], formulaIds: ["mole", "mass-from-mole"], labType: "solution-concentration-flow", title: "Cân khối lượng để suy ra số mol", relatedSimulationLabId: "solution-concentration", exerciseValue: 1, exerciseUnit: "mol" },
  { lesson: chemistryLessons[15], formulaIds: ["molarity"], labType: "solution-concentration-flow", title: "Số mol trên thể tích tạo nồng độ mol", relatedSimulationLabId: "solution-concentration", exerciseValue: 0.5, exerciseUnit: "mol/L" },
  { lesson: chemistryLessons[16], formulaIds: ["percent-concentration"], labType: "solution-concentration-flow", title: "Khối lượng chất tan tạo C%", relatedSimulationLabId: "solution-concentration", exerciseValue: 5, exerciseUnit: "%" },
  { lesson: chemistryLessons[12], formulaIds: ["stoichiometry", "ion-charge"], labType: "reaction-flow", title: "Trao đổi electron trong phản ứng oxi hóa khử", relatedSimulationLabId: "reaction-sandbox", exerciseValue: "electron", exerciseUnit: "concept" },
  { lesson: chemistryLessons[13], formulaIds: ["stoichiometry"], labType: "reaction-flow", title: "Nhiệt độ làm tăng va chạm phân tử", relatedSimulationLabId: "reaction-temperature", exerciseValue: "rate tăng", exerciseUnit: "concept" }
];

function makeMiniExercise(config: (typeof labConfigs)[number], labId: string): LessonMiniExercise {
  const firstDetail = formulaDetails.find((detail) => detail.id === config.formulaIds[0]);
  const output = firstDetail?.outputParameters[0];
  const selectableObjectId = output?.visualBinding?.objectId ?? "formula-node";

  return {
    id: `mini-ex-${labId}`,
    lessonId: config.lesson.id,
    relatedFormulaIds: config.formulaIds,
    relatedInlineLabId: labId,
    title: `Bài tập nhanh: ${config.title}`,
    prompt: `Quan sát mô hình, chọn object biểu diễn ${output?.symbol ?? "output"} và nhập kết quả/nhận xét phù hợp.`,
    exerciseType: typeof config.exerciseValue === "number" ? "calculate-from-scene" : "identify-visual-parameter",
    difficulty: "easy",
    sceneData: {
      givenParameters: { sample: "đọc từ nhãn trên mô hình" },
      hiddenParameters: [output?.symbol ?? "output"],
      visualObjectIds: sceneObjects(config.labType).map((object) => object.id)
    },
    expectedAnswer: {
      value: config.exerciseValue,
      unit: config.exerciseUnit,
      parameterSymbol: output?.symbol,
      selectedObjectId: selectableObjectId
    },
    tolerance: typeof config.exerciseValue === "number" ? Math.max(0.01, Math.abs(config.exerciseValue) * 0.02) : undefined,
    explanation: `Dữ liệu đi theo flow: input trên hình -> công thức ${firstDetail?.plainText ?? config.formulaIds[0]} -> output ở ${output?.visualBinding?.label ?? "vùng kết quả"}.`
  };
}

function makeBindings(formulaIds: string[]): LabParameterBinding[] {
  return formulaIds.flatMap((formulaId) => {
    const detail = formulaDetails.find((item) => item.id === formulaId);
    if (!detail) return [];

    return detail.variables.map((parameter, index) => ({
      parameterSymbol: parameter.symbol,
      parameterName: parameter.name,
      formulaId,
      sourceObjectId: parameter.role === "output" ? "formula-node" : parameter.visualBinding?.objectId,
      targetObjectId: parameter.role === "output" ? parameter.visualBinding?.objectId : "formula-node",
      visualProperty: parameter.visualBinding?.property ?? "value",
      explanation:
        parameter.role === "output"
          ? `${parameter.symbol} là output, đi từ công thức ra ${parameter.visualBinding?.label ?? "mô hình"}.`
          : `${parameter.symbol} là input, được đọc từ ${parameter.visualBinding?.label ?? "mô hình"} rồi đưa vào công thức.`,
      flowOrder: index + 1
    }));
  });
}

export const lessonInlineLabs: LessonInlineLab[] = labConfigs.map((config, index) => {
  const labId = `inline-lab-${config.formulaIds.join("-")}-${index}`;
  const miniExercise = makeMiniExercise(config, labId);
  const objects = sceneObjects(config.labType);

  return {
    id: labId,
    lessonId: config.lesson.id,
    formulaIds: config.formulaIds,
    title: config.title,
    description:
      "Inline lab có flow cố định: học sinh quan sát nhãn trên mô hình, xem tham số đi vào công thức, rồi kiểm tra output được highlight trên hình.",
    labType: config.labType,
    mode: "guided-only",
    visualScene: {
      sceneId: `scene-${labId}`,
      title: config.title,
      objects,
      formulaOverlayIds: config.formulaIds,
      defaultCamera: { zoom: 1, x: 0, y: 0 }
    },
    steps: [
      {
        order: 1,
        title: "Quan sát hiện tượng",
        explanation: "Nhìn vào vật thể chính và các nhãn tham số đang gắn trực tiếp trên mô hình.",
        highlightObjectIds: objects.slice(0, 2).map((object) => object.id),
        highlightParameterSymbols: [],
        animationAction: config.labType.includes("reaction") ? "show-reaction-products" : config.labType.includes("bond") ? "show-electron-sharing" : "start-motion"
      },
      {
        order: 2,
        title: "Đọc input",
        explanation: "Các input được lấy từ thước, đồng hồ, cốc, atom hoặc đồng hồ đo trên hình.",
        highlightObjectIds: objects.filter((object) => object.boundParameters.length > 0).slice(0, 3).map((object) => object.id),
        highlightParameterSymbols: makeBindings(config.formulaIds).filter((binding) => binding.sourceObjectId !== "formula-node").map((binding) => binding.parameterSymbol).slice(0, 4),
        formulaFocus: config.formulaIds[0],
        animationAction: "measure-distance"
      },
      {
        order: 3,
        title: "Công thức xử lý",
        explanation: "Formula node nhận input, áp dụng đúng đơn vị và tạo output.",
        highlightObjectIds: ["formula-node"],
        highlightParameterSymbols: [],
        formulaFocus: config.formulaIds.join(", "),
        animationAction: "calculate-result"
      },
      {
        order: 4,
        title: "Đọc output",
        explanation: "Kết quả được đưa ra đồng hồ, vật thể, bond hoặc thẻ sản phẩm để học sinh thấy công thức ảnh hưởng mô hình thế nào.",
        highlightObjectIds: makeBindings(config.formulaIds).filter((binding) => binding.sourceObjectId === "formula-node").map((binding) => binding.targetObjectId ?? "").filter(Boolean),
        highlightParameterSymbols: makeBindings(config.formulaIds).filter((binding) => binding.sourceObjectId === "formula-node").map((binding) => binding.parameterSymbol),
        animationAction: "calculate-result"
      }
    ],
    parameterBindings: makeBindings(config.formulaIds),
    miniExercise,
    relatedSimulationLabId: config.relatedSimulationLabId
  };
});

export const lessonMiniExercises: LessonMiniExercise[] = lessonInlineLabs.map((lab) => lab.miniExercise);

export function getFormulaDetail(formulaId: string) {
  return formulaDetails.find((detail) => detail.id === formulaId);
}

export function getFormulaDetailByRoute(subject: string, slug: string) {
  return formulaDetails.find((detail) => detail.subject === subject && detail.slug === slug);
}

export function getInlineLabsForLesson(lessonId: string) {
  return lessonInlineLabs.filter((lab) => lab.lessonId === lessonId);
}

export function getMiniExercisesForLesson(lessonId: string) {
  return lessonMiniExercises.filter((exercise) => exercise.lessonId === lessonId);
}

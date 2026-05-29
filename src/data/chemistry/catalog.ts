import type { Chapter, ChemicalElement, Exercise, Formula, Lesson, Molecule, Simulation } from "@/types";
import { slugify } from "@/lib/utils";

const example = (name: string) => ({
  problem: `Bài mẫu áp dụng ${name} với dữ kiện an toàn trong lớp học.`,
  solution: "Đổi đơn vị nếu cần, thay số vào công thức và diễn giải kết quả theo bối cảnh hóa học."
});

export const chemistryChapters: Chapter[] = [
  { id: "chem-basic", subjectId: "chemistry", title: "Cơ bản", slug: "co-ban", level: "basic", order: 1, summary: "Nguyên tử, ion, đồng vị và bảng tuần hoàn." },
  { id: "chem-bonding", subjectId: "chemistry", title: "Liên kết hóa học", slug: "lien-ket-hoa-hoc", level: "basic", order: 2, summary: "Liên kết ion, cộng hóa trị, Lewis và hình học phân tử." },
  { id: "chem-reaction", subjectId: "chemistry", title: "Phản ứng hóa học", slug: "phan-ung-hoa-hoc", level: "intermediate", order: 3, summary: "Cân bằng phương trình, axit-bazơ, oxi hóa-khử." },
  { id: "chem-solution", subjectId: "chemistry", title: "Mol và dung dịch", slug: "mol-va-dung-dich", level: "intermediate", order: 4, summary: "Mol, nồng độ, pha loãng và dung dịch." },
  { id: "chem-organic", subjectId: "chemistry", title: "Hóa hữu cơ", slug: "hoa-huu-co", level: "advanced", order: 5, summary: "Hydrocarbon, alcohol, acid, ester và polymer." }
];

const chemistryLessonTopics = [
  ["chem-basic", "Nguyên tử", "Cấu tạo nguyên tử từ proton, neutron và electron.", ["atomic-number"], ["atom-model"]],
  ["chem-basic", "Proton, neutron, electron", "Vai trò của các hạt dưới nguyên tử.", ["atomic-mass"], ["atom-model"]],
  ["chem-basic", "Số hiệu nguyên tử", "Số proton xác định nguyên tố.", ["atomic-number"], ["periodic-table"]],
  ["chem-basic", "Bảng tuần hoàn", "Chu kỳ, nhóm và xu hướng tính chất.", ["electronegativity"], ["periodic-table"]],
  ["chem-basic", "Cấu hình electron", "Cách electron phân bố vào lớp và phân lớp.", ["valence"], ["atom-model"]],
  ["chem-basic", "Ion và đồng vị", "Nguyên tử mất/nhận electron hoặc khác số neutron.", ["ion-charge"], ["atom-model"]],
  ["chem-bonding", "Liên kết ion", "Electron chuyển từ kim loại sang phi kim.", ["lattice-energy"], ["chemical-bonding"]],
  ["chem-bonding", "Liên kết cộng hóa trị", "Nguyên tử chia sẻ electron hóa trị.", ["bond-order"], ["chemical-bonding"]],
  ["chem-bonding", "Cấu trúc Lewis", "Biểu diễn electron hóa trị bằng chấm.", ["valence"], ["chemical-bonding"]],
  ["chem-bonding", "Hình học phân tử", "Dạng không gian của phân tử.", ["vsepr"], ["molecule-viewer"]],
  ["chem-reaction", "Phương trình hóa học", "Bảo toàn nguyên tố khi cân bằng.", ["stoichiometry"], ["reaction-temperature"]],
  ["chem-reaction", "Axit và bazơ", "pH, pOH và ion H+ / OH-.", ["ph", "poh", "ph-poh"], ["solution-concentration"]],
  ["chem-reaction", "Oxi hóa - khử", "Trao đổi electron và số oxi hóa.", ["oxidation-number"], ["reaction-temperature"]],
  ["chem-reaction", "Tốc độ phản ứng", "Ảnh hưởng của nhiệt độ và va chạm phân tử.", ["arrhenius-lite"], ["reaction-temperature"]],
  ["chem-solution", "Số mol", "Cầu nối giữa khối lượng và số hạt.", ["mole", "mass-from-mole"], ["solution-concentration"]],
  ["chem-solution", "Nồng độ mol", "Số mol chất tan trong một lít dung dịch.", ["molarity"], ["solution-concentration"]],
  ["chem-solution", "Nồng độ phần trăm", "Tỉ lệ khối lượng chất tan trong dung dịch.", ["percent-concentration"], ["solution-concentration"]],
  ["chem-solution", "Pha loãng dung dịch", "Số mol chất tan được bảo toàn khi pha loãng.", ["dilution"], ["solution-concentration"]],
  ["chem-organic", "Hydrocarbon", "Hợp chất chỉ gồm carbon và hydrogen.", ["combustion"], ["molecule-viewer"]],
  ["chem-organic", "Alcohol, acid và ester", "Nhóm chức phổ biến trong hóa hữu cơ nhập môn.", ["functional-group"], ["molecule-viewer"]]
] as const;

export const chemistryLessons: Lesson[] = chemistryLessonTopics.map(([chapterId, title, summary, formulas, simulations], index) => ({
  id: `chem-lesson-${index}`,
  chapterId,
  subject: "chemistry",
  title,
  slug: slugify(title),
  summary,
  content: `${summary} Nội dung được trình bày ngắn gọn, tránh quy trình thí nghiệm rủi ro và dùng mô phỏng giáo dục để giải thích hiện tượng ở mức an toàn.`,
  formulas: [...formulas],
  simulations: [...simulations],
  exercises: [`chem-ex-${index}`, `chem-ex-${index + 20}`],
  level: index < 10 ? "basic" : index < 18 ? "intermediate" : "advanced",
  durationMinutes: 10 + (index % 5) * 3
}));

export const chemistryFormulas: Formula[] = [
  {
    id: "mole",
    slug: "mole",
    subject: "chemistry",
    name: "Số mol từ khối lượng",
    latex: "n=\\frac{m}{M}",
    description: "Tính số mol khi biết khối lượng chất và khối lượng mol.",
    variables: [
      { symbol: "n", name: "số mol", unit: "mol", description: "Lượng chất." },
      { symbol: "m", name: "khối lượng", unit: "g", description: "Khối lượng mẫu chất." },
      { symbol: "M", name: "khối lượng mol", unit: "g/mol", description: "Khối lượng của 1 mol chất." }
    ],
    usage: "Dùng trong hầu hết bài toán định lượng hóa học.",
    examples: [{ problem: "18 g H2O, M = 18 g/mol.", solution: "n = 18 / 18 = 1 mol." }],
    calculatorConfig: { operationId: "mole", outputKey: "n", outputLabel: "Số mol", outputUnit: "mol", inputs: [{ key: "m", label: "Khối lượng", unit: "g", defaultValue: 18 }, { key: "M", label: "Khối lượng mol", unit: "g/mol", defaultValue: 18 }] },
    relatedSimulationId: "solution-concentration"
  },
  {
    id: "molarity",
    slug: "molarity",
    subject: "chemistry",
    name: "Nồng độ mol",
    latex: "C_M=\\frac{n}{V}",
    description: "Số mol chất tan trong một lít dung dịch.",
    variables: [
      { symbol: "C_M", name: "nồng độ mol", unit: "mol/L", description: "Molarity." },
      { symbol: "n", name: "số mol", unit: "mol", description: "Số mol chất tan." },
      { symbol: "V", name: "thể tích", unit: "L", description: "Thể tích dung dịch." }
    ],
    usage: "Dùng cho dung dịch loãng trong bài tập cơ bản.",
    examples: [{ problem: "0.5 mol chất tan trong 2 L dung dịch.", solution: "CM = 0.25 M." }],
    calculatorConfig: { operationId: "molarity", outputKey: "CM", outputLabel: "Nồng độ mol", outputUnit: "M", inputs: [{ key: "n", label: "Số mol", unit: "mol", defaultValue: 0.5 }, { key: "V", label: "Thể tích", unit: "L", defaultValue: 2 }] },
    relatedSimulationId: "solution-concentration"
  },
  {
    id: "percent-concentration",
    slug: "percent-concentration",
    subject: "chemistry",
    name: "Nồng độ phần trăm",
    latex: "C\\%=\\frac{m_{ct}}{m_{dd}}\\times100\\%",
    description: "Tỉ lệ khối lượng chất tan trong dung dịch.",
    variables: [
      { symbol: "m_ct", name: "khối lượng chất tan", unit: "g", description: "Khối lượng solute." },
      { symbol: "m_dd", name: "khối lượng dung dịch", unit: "g", description: "Tổng khối lượng dung dịch." }
    ],
    usage: "Dùng khi đề bài cho khối lượng chất tan và dung dịch.",
    examples: [example("nồng độ phần trăm")],
    calculatorConfig: { operationId: "percent-concentration", outputKey: "C", outputLabel: "Nồng độ phần trăm", outputUnit: "%", inputs: [{ key: "mct", label: "Khối lượng chất tan", unit: "g", defaultValue: 10 }, { key: "mdd", label: "Khối lượng dung dịch", unit: "g", defaultValue: 200 }] }
  },
  {
    id: "density",
    slug: "density",
    subject: "chemistry",
    name: "Khối lượng riêng",
    latex: "D=\\frac{m}{V}",
    description: "Khối lượng trên một đơn vị thể tích.",
    variables: [
      { symbol: "D", name: "khối lượng riêng", unit: "g/mL", description: "Mật độ khối lượng." },
      { symbol: "m", name: "khối lượng", unit: "g", description: "Khối lượng mẫu." },
      { symbol: "V", name: "thể tích", unit: "mL", description: "Thể tích mẫu." }
    ],
    usage: "Dùng cho chất lỏng hoặc dung dịch khi biết m và V.",
    examples: [example("khối lượng riêng")],
    calculatorConfig: { operationId: "density", outputKey: "D", outputLabel: "Khối lượng riêng", outputUnit: "g/mL", inputs: [{ key: "m", label: "Khối lượng", unit: "g", defaultValue: 100 }, { key: "V", label: "Thể tích", unit: "mL", defaultValue: 80 }] }
  },
  {
    id: "ph",
    slug: "ph",
    subject: "chemistry",
    name: "pH",
    latex: "pH=-\\log[H^+]",
    description: "Thang đo độ acid theo nồng độ ion H+.",
    variables: [
      { symbol: "pH", name: "độ acid", unit: "", description: "Giá trị pH." },
      { symbol: "[H+]", name: "nồng độ hydrogen ion", unit: "mol/L", description: "Nồng độ H+." }
    ],
    usage: "Dùng trong dung dịch nước loãng ở 25 C.",
    examples: [{ problem: "[H+] = 1e-3 M.", solution: "pH = 3." }],
    calculatorConfig: { operationId: "ph", outputKey: "pH", outputLabel: "pH", inputs: [{ key: "H", label: "[H+]", unit: "mol/L", defaultValue: 0.001 }] },
    relatedSimulationId: "solution-concentration"
  },
  {
    id: "mass-from-mole",
    slug: "mass-from-mole",
    subject: "chemistry",
    name: "Khối lượng từ số mol",
    latex: "m=nM",
    description: "Tính khối lượng chất khi biết số mol và khối lượng mol.",
    variables: [
      { symbol: "m", name: "khối lượng", unit: "g", description: "Khối lượng chất." },
      { symbol: "n", name: "số mol", unit: "mol", description: "Lượng chất." },
      { symbol: "M", name: "khối lượng mol", unit: "g/mol", description: "Molar mass." }
    ],
    usage: "Dùng ngược với công thức n = m/M.",
    examples: [example("khối lượng từ số mol")],
    calculatorConfig: { operationId: "mass-from-mole", outputKey: "m", outputLabel: "Khối lượng", outputUnit: "g", inputs: [{ key: "n", label: "Số mol", unit: "mol", defaultValue: 2 }, { key: "M", label: "Khối lượng mol", unit: "g/mol", defaultValue: 58.5 }] }
  },
  {
    id: "gas-volume-stp",
    slug: "gas-volume-stp",
    subject: "chemistry",
    name: "Thể tích khí ở điều kiện tiêu chuẩn",
    latex: "V=n\\times22.4",
    description: "Một mol khí lý tưởng chiếm khoảng 22.4 L ở điều kiện tiêu chuẩn cổ điển.",
    variables: [
      { symbol: "V", name: "thể tích khí", unit: "L", description: "Thể tích khí." },
      { symbol: "n", name: "số mol", unit: "mol", description: "Số mol khí." }
    ],
    usage: "Dùng cho bài tập nhập môn với điều kiện tiêu chuẩn.",
    examples: [example("thể tích khí")],
    calculatorConfig: { operationId: "gas-volume-stp", outputKey: "V", outputLabel: "Thể tích", outputUnit: "L", inputs: [{ key: "n", label: "Số mol", unit: "mol", defaultValue: 1.5 }] }
  },
  {
    id: "yield-percent",
    slug: "yield-percent",
    subject: "chemistry",
    name: "Hiệu suất phản ứng",
    latex: "H\\%=\\frac{\\text{actual}}{\\text{theoretical}}\\times100\\%",
    description: "So sánh lượng sản phẩm thực tế với lượng lý thuyết.",
    variables: [
      { symbol: "H%", name: "hiệu suất", unit: "%", description: "Mức đạt của phản ứng." },
      { symbol: "actual", name: "lượng thực tế", unit: "g", description: "Sản phẩm thu được." },
      { symbol: "theory", name: "lượng lý thuyết", unit: "g", description: "Sản phẩm tối đa theo tính toán." }
    ],
    usage: "Chỉ dùng để giải bài toán, không hướng dẫn quy trình thực nghiệm rủi ro.",
    examples: [example("hiệu suất")],
    calculatorConfig: { operationId: "yield-percent", outputKey: "H", outputLabel: "Hiệu suất", outputUnit: "%", inputs: [{ key: "actual", label: "Lượng thực tế", unit: "g", defaultValue: 8 }, { key: "theory", label: "Lượng lý thuyết", unit: "g", defaultValue: 10 }] }
  },
  {
    id: "ideal-gas-chem",
    slug: "ideal-gas",
    subject: "chemistry",
    name: "Phương trình khí lý tưởng",
    latex: "PV=nRT",
    description: "Dùng trong hóa học khí để liên hệ P, V, n, T.",
    variables: [{ symbol: "R", name: "hằng số khí", unit: "J/(mol.K)", description: "8.314 trong hệ SI." }],
    usage: "Dùng cho bài toán khí lý tưởng ở mức nhập môn.",
    examples: [example("PV=nRT")]
  },
  ...[
    ["poh", "pOH=-\\log[OH^-]", "pOH"],
    ["ph-poh", "pH+pOH=14", "Quan hệ pH và pOH"],
    ["dilution", "C_1V_1=C_2V_2", "Pha loãng dung dịch"],
    ["stoichiometry", "\\frac{n_A}{a}=\\frac{n_B}{b}", "Tỉ lệ phương trình"],
    ["atomic-number", "Z=p", "Số hiệu nguyên tử"],
    ["atomic-mass", "A=p+n", "Số khối"],
    ["ion-charge", "q=p-e", "Điện tích ion"],
    ["valence", "e_v=\\text{outer-shell electrons}", "Electron hóa trị"],
    ["electronegativity", "\\Delta\\chi=|\\chi_A-\\chi_B|", "Độ chênh âm điện"],
    ["bond-order", "BO=\\frac{N_b-N_a}{2}", "Bậc liên kết"],
    ["vsepr", "AX_mE_n", "Ký hiệu VSEPR"],
    ["lattice-energy", "U\\propto\\frac{q_1q_2}{r}", "Năng lượng mạng tinh thể"],
    ["arrhenius-lite", "k=Ae^{-E_a/RT}", "Arrhenius cơ bản"],
    ["oxidation-number", "\\sum OS=\\text{charge}", "Số oxi hóa"],
    ["combustion", "C_xH_y+(x+\\frac{y}{4})O_2\\rightarrow xCO_2+\\frac{y}{2}H_2O", "Cháy hydrocarbon"],
    ["functional-group", "R-X", "Nhóm chức hữu cơ"],
    ["osmotic-pressure", "\\Pi=iMRT", "Áp suất thẩm thấu"],
    ["mole-particles", "N=nN_A", "Số hạt"],
    ["mass-percent-element", "\\%m=\\frac{m_{element}}{m_{compound}}100\\%", "Phần trăm khối lượng"],
    ["equilibrium", "K=\\frac{[C]^c[D]^d}{[A]^a[B]^b}", "Hằng số cân bằng"],
    ["rate-law", "v=k[A]^m[B]^n", "Biểu thức tốc độ"]
  ].map(([id, latex, name]) => ({
    id,
    slug: id,
    subject: "chemistry" as const,
    name,
    latex,
    description: `${name} được dùng để mô hình hóa định lượng hoặc giải thích khái niệm hóa học.`,
    variables: [{ symbol: "-", name: "biến liên quan", unit: "phụ thuộc công thức", description: "Xem bài học liên kết để chọn đơn vị đúng." }],
    usage: "Tra cứu nhanh trong bài tập và mô phỏng giáo dục an toàn.",
    examples: [example(name)]
  }))
];

export const chemicalElements: ChemicalElement[] = [
  [1, "H", "Hydrogen", 1.008, 1, 1, "nonmetal", "1s1", 1],
  [2, "He", "Helium", 4.0026, 18, 1, "noble gas", "1s2", 2],
  [3, "Li", "Lithium", 6.94, 1, 2, "alkali metal", "[He] 2s1", 1],
  [4, "Be", "Beryllium", 9.0122, 2, 2, "alkaline earth metal", "[He] 2s2", 2],
  [5, "B", "Boron", 10.81, 13, 2, "metalloid", "[He] 2s2 2p1", 3],
  [6, "C", "Carbon", 12.011, 14, 2, "nonmetal", "[He] 2s2 2p2", 4],
  [7, "N", "Nitrogen", 14.007, 15, 2, "nonmetal", "[He] 2s2 2p3", 5],
  [8, "O", "Oxygen", 15.999, 16, 2, "nonmetal", "[He] 2s2 2p4", 6],
  [9, "F", "Fluorine", 18.998, 17, 2, "halogen", "[He] 2s2 2p5", 7],
  [10, "Ne", "Neon", 20.18, 18, 2, "noble gas", "[He] 2s2 2p6", 8],
  [11, "Na", "Sodium", 22.99, 1, 3, "alkali metal", "[Ne] 3s1", 1],
  [12, "Mg", "Magnesium", 24.305, 2, 3, "alkaline earth metal", "[Ne] 3s2", 2],
  [13, "Al", "Aluminium", 26.982, 13, 3, "post-transition metal", "[Ne] 3s2 3p1", 3],
  [14, "Si", "Silicon", 28.085, 14, 3, "metalloid", "[Ne] 3s2 3p2", 4],
  [15, "P", "Phosphorus", 30.974, 15, 3, "nonmetal", "[Ne] 3s2 3p3", 5],
  [16, "S", "Sulfur", 32.06, 16, 3, "nonmetal", "[Ne] 3s2 3p4", 6],
  [17, "Cl", "Chlorine", 35.45, 17, 3, "halogen", "[Ne] 3s2 3p5", 7],
  [18, "Ar", "Argon", 39.948, 18, 3, "noble gas", "[Ne] 3s2 3p6", 8],
  [19, "K", "Potassium", 39.098, 1, 4, "alkali metal", "[Ar] 4s1", 1],
  [20, "Ca", "Calcium", 40.078, 2, 4, "alkaline earth metal", "[Ar] 4s2", 2]
].map(([atomicNumber, symbol, name, atomicMass, group, period, category, electronConfiguration, valenceElectrons]) => ({
  atomicNumber: Number(atomicNumber),
  symbol: String(symbol),
  name: String(name),
  atomicMass: Number(atomicMass),
  group: Number(group),
  period: Number(period),
  category: String(category),
  electronConfiguration: String(electronConfiguration),
  valenceElectrons: Number(valenceElectrons)
}));

export const molecules: Molecule[] = [
  { id: "h2o", formula: "H2O", name: "Nước", bonding: "cộng hóa trị phân cực", bondAngle: "104.5°", atoms: [{ element: "O", position: [0, 0, 0] }, { element: "H", position: [-0.9, 0.65, 0] }, { element: "H", position: [0.9, 0.65, 0] }], bonds: [{ from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 }] },
  { id: "co2", formula: "CO2", name: "Carbon dioxide", bonding: "cộng hóa trị", bondAngle: "180°", atoms: [{ element: "C", position: [0, 0, 0] }, { element: "O", position: [-1.25, 0, 0] }, { element: "O", position: [1.25, 0, 0] }], bonds: [{ from: 0, to: 1, order: 2 }, { from: 0, to: 2, order: 2 }] },
  { id: "o2", formula: "O2", name: "Oxygen", bonding: "cộng hóa trị đôi", atoms: [{ element: "O", position: [-0.6, 0, 0] }, { element: "O", position: [0.6, 0, 0] }], bonds: [{ from: 0, to: 1, order: 2 }] },
  { id: "n2", formula: "N2", name: "Nitrogen", bonding: "cộng hóa trị ba", atoms: [{ element: "N", position: [-0.55, 0, 0] }, { element: "N", position: [0.55, 0, 0] }], bonds: [{ from: 0, to: 1, order: 3 }] },
  { id: "nh3", formula: "NH3", name: "Ammonia", bonding: "cộng hóa trị", bondAngle: "107°", atoms: [{ element: "N", position: [0, 0, 0] }, { element: "H", position: [0.9, 0.35, 0] }, { element: "H", position: [-0.45, 0.35, 0.78] }, { element: "H", position: [-0.45, 0.35, -0.78] }], bonds: [{ from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 }] },
  { id: "ch4", formula: "CH4", name: "Methane", bonding: "cộng hóa trị", bondAngle: "109.5°", atoms: [{ element: "C", position: [0, 0, 0] }, { element: "H", position: [1, 1, 1] }, { element: "H", position: [-1, -1, 1] }, { element: "H", position: [1, -1, -1] }, { element: "H", position: [-1, 1, -1] }], bonds: [{ from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 }, { from: 0, to: 4, order: 1 }] },
  { id: "nacl", formula: "NaCl", name: "Sodium chloride", bonding: "ion", atoms: [{ element: "Na", position: [-0.65, 0, 0] }, { element: "Cl", position: [0.65, 0, 0] }], bonds: [{ from: 0, to: 1, order: 1 }] },
  { id: "hcl", formula: "HCl", name: "Hydrogen chloride", bonding: "cộng hóa trị phân cực", atoms: [{ element: "H", position: [-0.7, 0, 0] }, { element: "Cl", position: [0.7, 0, 0] }], bonds: [{ from: 0, to: 1, order: 1 }] },
  { id: "ethanol", formula: "C2H5OH", name: "Ethanol", bonding: "cộng hóa trị", atoms: [{ element: "C", position: [-0.8, 0, 0] }, { element: "C", position: [0.35, 0, 0] }, { element: "O", position: [1.45, 0, 0] }, { element: "H", position: [2.05, 0.55, 0] }], bonds: [{ from: 0, to: 1, order: 1 }, { from: 1, to: 2, order: 1 }, { from: 2, to: 3, order: 1 }] },
  { id: "caco3", formula: "CaCO3", name: "Calcium carbonate", bonding: "ion và cộng hóa trị trong ion carbonate", atoms: [{ element: "Ca", position: [-1.4, 0, 0] }, { element: "C", position: [0, 0, 0] }, { element: "O", position: [1, 0, 0] }, { element: "O", position: [-0.5, 0.85, 0] }, { element: "O", position: [-0.5, -0.85, 0] }], bonds: [{ from: 1, to: 2, order: 2 }, { from: 1, to: 3, order: 1 }, { from: 1, to: 4, order: 1 }] }
];

export const chemistrySimulations: Simulation[] = [
  { id: "periodic-table", slug: "periodic-table", subject: "chemistry", title: "Bảng tuần hoàn", type: "atom-model", dimension: "2D", level: "basic", description: "Chọn 20 nguyên tố đầu tiên và xem thông tin cốt lõi.", parameters: [] },
  { id: "atom-model", slug: "atom-model", subject: "chemistry", title: "Mô hình nguyên tử", type: "atom-model", dimension: "3D", level: "basic", description: "Xem hạt nhân, lớp electron và cấu hình electron cơ bản.", parameters: [] },
  { id: "molecule-viewer", slug: "molecule-viewer", subject: "chemistry", title: "Molecule Viewer 3D", type: "molecule-viewer", dimension: "3D", level: "basic", description: "Xoay, zoom và quan sát H2O, CO2, NH3, CH4, NaCl.", parameters: [] },
  { id: "chemical-bonding", slug: "chemical-bonding", subject: "chemistry", title: "Liên kết hóa học", type: "chemical-bonding", dimension: "2D", level: "basic", description: "So sánh trao đổi electron và chia sẻ electron.", parameters: [] },
  { id: "reaction-temperature", slug: "reaction-temperature", subject: "chemistry", title: "Phản ứng theo nhiệt độ", type: "reaction-temperature", dimension: "2D", level: "intermediate", description: "Tốc độ phản ứng tăng khi nhiệt độ làm tăng năng lượng va chạm.", safetyNote: "Mô phỏng chỉ mang tính giáo dục, không cung cấp quy trình hoặc tỷ lệ thực nghiệm.", parameters: [{ key: "temperature", label: "Nhiệt độ", unit: "C", min: 0, max: 120, defaultValue: 25, step: 1 }, { key: "activationEnergy", label: "Năng lượng hoạt hóa tương đối", min: 1, max: 10, defaultValue: 5, step: 0.5 }] },
  { id: "reaction-sandbox", slug: "reaction-sandbox", subject: "chemistry", title: "Virtual reaction sandbox", type: "reaction-sandbox", dimension: "2D", level: "intermediate", description: "Drag reactants, change conditions, watch conceptual collisions, bond changes and products.", safetyNote: "Conceptual simulation only. It does not provide real-world procedures, mixture ratios or hazardous handling steps.", parameters: [] },
  { id: "solution-concentration", slug: "solution-concentration", subject: "chemistry", title: "Dung dịch và nồng độ", type: "solution-concentration", dimension: "2D", level: "intermediate", description: "Thay đổi số mol, thể tích và quan sát nồng độ mol.", parameters: [{ key: "moles", label: "Số mol", unit: "mol", min: 0.1, max: 5, defaultValue: 1, step: 0.1 }, { key: "volume", label: "Thể tích", unit: "L", min: 0.1, max: 5, defaultValue: 1, step: 0.1 }, { key: "particles", label: "Số hạt hiển thị", min: 10, max: 90, defaultValue: 40, step: 1 }] },
  { id: "acid-base", slug: "acid-base", subject: "chemistry", title: "Thang pH", type: "solution-concentration", dimension: "2D", level: "intermediate", description: "Minh họa pH, pOH và màu chỉ thị ở mức khái niệm.", parameters: [] },
  { id: "organic-molecules", slug: "organic-molecules", subject: "chemistry", title: "Phân tử hữu cơ", type: "molecule-viewer", dimension: "3D", level: "advanced", description: "Quan sát khung carbon và nhóm chức mẫu.", parameters: [] }
];

export const chemistryExercises: Exercise[] = Array.from({ length: 50 }, (_, index) => {
  const lesson = chemistryLessons[index % chemistryLessons.length];
  const easy = index % 3 === 0;
  return {
    id: `chem-ex-${index}`,
    lessonId: lesson.id,
    subject: "chemistry",
    type: index % 5 === 0 ? "calculation" : index % 5 === 1 ? "short-answer" : "multiple-choice",
    question: easy ? `Khái niệm nào quan trọng nhất trong bài "${lesson.title}"?` : `Khi giải bài "${lesson.title}", bước nào cần ưu tiên để tránh sai số?`,
    options: easy ? ["Bảo toàn nguyên tố, điện tích hoặc lượng chất tùy bài", "Tự ý chọn hệ số", "Bỏ qua đơn vị", "Dùng quy trình thực nghiệm ngoài đời"] : ["Đọc dữ kiện, đổi đơn vị, xác định công thức an toàn", "Tăng nhiệt độ thật để kiểm chứng", "Trộn chất theo cảm tính", "Bỏ qua điều kiện áp dụng"],
    answer: easy ? "Bảo toàn nguyên tố, điện tích hoặc lượng chất tùy bài" : "Đọc dữ kiện, đổi đơn vị, xác định công thức an toàn",
    explanation: "MVP chỉ mô phỏng giáo dục an toàn, không hướng dẫn thao tác hoặc tỷ lệ phản ứng rủi ro ngoài đời.",
    difficulty: easy ? "easy" : index % 3 === 1 ? "medium" : "hard"
  };
});

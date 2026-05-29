import type { ScienceHistoryTopic } from "@/types";
import type { Locale } from "@/lib/i18n/dictionary";

const sceneLabels: Record<string, { en: string; vi: string }> = {
  "inclined-plane": { en: "marked distance grows over equal time intervals", vi: "quãng đường đi được tăng lên trong các khoảng thời gian bằng nhau" },
  "force-motion": { en: "net force F causes acceleration a: F = ma", vi: "lực tịnh F sinh ra gia tốc a: F = ma" },
  "spring-hooke": { en: "linear F-x graph inside elastic range", vi: "đồ thị F-x tuyến tính trong vùng đàn hồi" },
  "joule-heat": { en: "falling weight spins paddles, heating water", vi: "quả nặng rơi làm quay cánh quạt, làm nóng nước" },
  "faraday-induction": { en: "moving magnet induces current", vi: "nam châm di chuyển cảm ứng ra dòng điện" },
  "mass-conservation": { en: "closed vessel mass stays constant in reactions", vi: "khối lượng bình kín không đổi trong phản ứng" },
  "periodic-table": { en: "element cards reveal periodic pattern prediction", vi: "các thẻ nguyên tố hé lộ quy luật tuần hoàn và ô trống dự báo" },
  "lewis-bonding": { en: "valence dots become shared electron pairs", vi: "các chấm hóa trị trở thành cặp electron dùng chung" },
  "atomic-theory": { en: "atoms combine in fixed ratios for compounds", vi: "nguyên tử kết hợp theo tỷ lệ cố định tạo thành hợp chất" },
  "gold-foil": { en: "rare strong deflections reveal a dense positive nucleus", vi: "những lần lệch hướng mạnh hiếm hoi tiết lộ một hạt nhân đặc" },
  "bohr-model": { en: "quantized orbits explain absorption & emission spectra", vi: "quỹ đạo lượng tử hóa giải thích quang phổ hấp thụ & phát xạ" }
};

export function HistoricalLabScene({ topic, locale = "vi" }: { topic: ScienceHistoryTopic; locale?: Locale | string }) {
  const visual = topic.visualType;
  const label = sceneLabels[visual]?.[locale as Locale] ?? sceneLabels[visual]?.en ?? "";
  
  return (
    <svg viewBox="0 0 760 360" className="h-[360px] w-full rounded-lg border border-border bg-slate-950 font-sans" style={{ fontFamily: 'var(--font-sans), system-ui, sans-serif' }}>
      <rect x="0" y="0" width="760" height="360" fill="#0f172a" />
      
      {/* 1. inclined-plane (Galileo) */}
      {visual === "inclined-plane" ? (
        <g>
          {/* Ramp and supports */}
          <line x1="100" y1="120" x2="660" y2="280" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
          <line x1="100" y1="120" x2="100" y2="280" stroke="#64748b" strokeWidth="6" />
          <line x1="100" y1="280" x2="660" y2="280" stroke="#64748b" strokeWidth="6" />
          
          {/* Distance marks */}
          <circle cx="135" cy="130" r="4" fill="#ef4444" />
          <circle cx="240" cy="160" r="4" fill="#ef4444" />
          <circle cx="415" cy="210" r="4" fill="#ef4444" />
          <circle cx="660" cy="280" r="4" fill="#ef4444" />
          
          {/* Rolling ball */}
          <circle r="22" fill="#38bdf8">
            <animateMotion path="M 106,99 L 666,259" dur="2.5s" calcMode="spline" keyTimes="0;1" keySplines="0.42 0 1 1" repeatCount="indefinite" />
          </circle>
          <text x="80" y="325" fill="#e2e8f0">{label}</text>
        </g>
      ) : null}
      
      {/* 2. force-motion (Newton) */}
      {visual === "force-motion" ? (
        <g>
          {/* Ground */}
          <line x1="80" y1="230" x2="680" y2="230" stroke="#475569" strokeWidth="4" />
          
          {/* Accelerating block */}
          <g>
            <rect x="0" y="160" width="100" height="70" rx="6" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
            {/* Force arrow (green) */}
            <line x1="100" y1="195" x2="160" y2="195" stroke="#22c55e" strokeWidth="6" markerEnd="url(#histArrowGreen)" />
            {/* Acceleration arrow (orange) */}
            <line x1="20" y1="140" x2="80" y2="140" stroke="#f97316" strokeWidth="4" markerEnd="url(#histArrowOrange)" />
            <text x="30" y="130" fill="#f97316" fontSize="12" fontWeight="bold">a</text>
            <text x="120" y="185" fill="#22c55e" fontSize="12" fontWeight="bold">F</text>
            
            <animateTransform
              attributeName="transform"
              type="translate"
              values="80,0; 480,0; 80,0"
              keyTimes="0; 0.7; 1"
              keySplines="0.42 0 1 1; 0 0 1 1"
              calcMode="spline"
              dur="4s"
              repeatCount="indefinite"
            />
          </g>
          <text x="80" y="325" fill="#e2e8f0">{label}</text>
        </g>
      ) : null}
      
      {/* 3. spring-hooke (Hooke) */}
      {visual === "spring-hooke" ? (
        <g>
          {/* Ceiling */}
          <line x1="120" y1="80" x2="240" y2="80" stroke="#64748b" strokeWidth="6" />
          
          {/* Helical spring path */}
          <path fill="none" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round">
            <animate
              attributeName="d"
              values="M 180,80 L 180,95 Q 200,105 180,115 Q 160,125 180,135 Q 200,145 180,155 Q 160,165 180,175 Q 200,185 180,195 Q 160,205 180,215 L 180,230;
                      M 180,80 L 180,90 Q 200,95 180,100 Q 160,105 180,110 Q 200,115 180,120 Q 160,125 180,130 Q 200,135 180,140 Q 160,145 180,150 L 180,160;
                      M 180,80 L 180,95 Q 200,105 180,115 Q 160,125 180,135 Q 200,145 180,155 Q 160,165 180,175 Q 200,185 180,195 Q 160,205 180,215 L 180,230"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>
          
          {/* Hanging weight */}
          <rect x="150" width="60" height="65" rx="4" fill="#f97316" stroke="#ea580c" strokeWidth="2">
            <animate
              attributeName="y"
              values="230; 160; 230"
              dur="3s"
              repeatCount="indefinite"
            />
          </rect>
          
          {/* Graph on the right */}
          <line x1="380" y1="240" x2="380" y2="90" stroke="#475569" strokeWidth="3" markerEnd="url(#histArrow)" />
          <line x1="380" y1="240" x2="680" y2="240" stroke="#475569" strokeWidth="3" markerEnd="url(#histArrow)" />
          <text x="360" y="105" fill="#94a3b8" fontSize="12">F</text>
          <text x="670" y="260" fill="#94a3b8" fontSize="12">x</text>
          
          {/* Linear Hooke line */}
          <line x1="380" y1="240" x2="640" y2="110" stroke="#22c55e" strokeWidth="3" strokeDasharray="4 4" />
          
          {/* Moving point on the graph */}
          <circle r="6" fill="#ef4444">
            <animate
              attributeName="cx"
              values="640; 380; 640"
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              values="110; 240; 110"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
          
          <text x="80" y="325" fill="#e2e8f0">{label}</text>
        </g>
      ) : null}
      
      {/* 4. joule-heat (Joule) */}
      {visual === "joule-heat" ? (
        <g>
          {/* Water container */}
          <rect x="180" y="100" width="180" height="150" rx="12" fill="#075985" stroke="#7dd3fc" strokeWidth="3" />
          
          {/* Spindle */}
          <line x1="270" y1="70" x2="270" y2="220" stroke="#cbd5e1" strokeWidth="6" />
          
          {/* Rotating paddles */}
          <g>
            <rect x="220" y="150" width="100" height="15" rx="3" fill="#fde68a" opacity="0.8" />
            <rect x="262" y="110" width="15" height="100" rx="3" fill="#fde68a" opacity="0.8" />
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 270 160"
              to="360 270 160"
              dur="3s"
              repeatCount="indefinite"
            />
          </g>
          
          {/* String wrapped around spindle */}
          <line x1="270" y1="80" x2="420" y2="80" stroke="#f1f5f9" strokeWidth="2" strokeDasharray="3 3" />
          
          {/* Pulley */}
          <circle cx="420" cy="80" r="15" fill="#475569" stroke="#cbd5e1" strokeWidth="2" />
          
          {/* String to mass */}
          <line x1="435" y1="80" x2="435" y2="150" stroke="#f1f5f9" strokeWidth="2">
            <animate
              attributeName="y2"
              values="110; 240; 110"
              dur="6s"
              repeatCount="indefinite"
            />
          </line>
          
          {/* Falling mass */}
          <rect x="415" y="110" width="40" height="40" rx="4" fill="#64748b" stroke="#475569" strokeWidth="2">
            <animate
              attributeName="y"
              values="110; 200; 110"
              dur="6s"
              repeatCount="indefinite"
            />
          </rect>
          
          {/* Thermometer */}
          <rect x="120" y="70" width="20" height="180" rx="10" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
          <rect x="126" y="80" width="8" height="150" rx="4" fill="#475569" />
          
          {/* Thermometer mercury rising */}
          <rect x="126" y="210" width="8" height="20" rx="4" fill="#ef4444">
            <animate
              attributeName="y"
              values="210; 100; 210"
              dur="6s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="height"
              values="20; 130; 20"
              dur="6s"
              repeatCount="indefinite"
            />
          </rect>
          <circle cx="130" cy="230" r="14" fill="#ef4444" />
          
          <text x="80" y="325" fill="#e2e8f0">{label}</text>
        </g>
      ) : null}
      
      {/* 5. faraday-induction (Faraday) */}
      {visual === "faraday-induction" ? (
        <g>
          {/* Galvanometer on the left */}
          <circle cx="160" cy="160" r="60" fill="#1e293b" stroke="#475569" strokeWidth="3" />
          <path d="M120 160 A40 40 0 0 1 200 160" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          
          <line x1="160" y1="160" x2="160" y2="120" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" transform-origin="160 160">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0; 45; 0; -45; 0"
              keyTimes="0; 0.25; 0.5; 0.75; 1"
              dur="4s"
              repeatCount="indefinite"
            />
          </line>
          <circle cx="160" cy="160" r="6" fill="#cbd5e1" />
          <text x="148" y="178" fill="#94a3b8" fontSize="10">G</text>
          
          {/* Wires from meter to coil */}
          <path d="M160 220 L160 260 L440 260 L440 220" fill="none" stroke="#64748b" strokeWidth="3" />
          <path d="M180 216 L180 280 L460 280 L460 220" fill="none" stroke="#64748b" strokeWidth="3" />
          
          {/* Coil */}
          <g stroke="#f59e0b" strokeWidth="6" fill="none" strokeLinecap="round">
            <path d="M420 120 Q480 120 480 150 Q480 180 420 180" />
            <path d="M420 140 Q480 140 480 170 Q480 200 420 200" />
            <path d="M420 160 Q480 160 480 190 Q480 220 420 220" />
          </g>
          
          {/* Magnet moving */}
          <g>
            <rect x="0" y="145" width="70" height="40" fill="#ef4444" rx="2" />
            <text x="25" y="170" fill="#ffffff" fontWeight="bold" fontSize="16">N</text>
            <rect x="70" y="145" width="70" height="40" fill="#3b82f6" rx="2" />
            <text x="95" y="170" fill="#ffffff" fontWeight="bold" fontSize="16">S</text>
            
            <animateTransform
              attributeName="transform"
              type="translate"
              values="220,0; 340,0; 220,0; 100,0; 220,0"
              keyTimes="0; 0.25; 0.5; 0.75; 1"
              dur="4s"
              repeatCount="indefinite"
            />
          </g>
          
          <text x="80" y="325" fill="#e2e8f0">{label}</text>
        </g>
      ) : null}
      
      {/* 6. mass-conservation (Lavoisier) */}
      {visual === "mass-conservation" ? (
        <g>
          {/* Center pillar */}
          <line x1="380" y1="260" x2="380" y2="120" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" />
          <polygon points="360,260 400,260 410,290 350,290" fill="#475569" />
          
          {/* Balanced scale beam */}
          <g>
            <line x1="200" y1="120" x2="560" y2="120" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
            
            {/* Left hanger */}
            <line x1="200" y1="120" x2="200" y2="200" stroke="#94a3b8" strokeWidth="2" />
            <path d="M150 200 L250 200" stroke="#cbd5e1" strokeWidth="4" />
            
            {/* Right hanger */}
            <line x1="560" y1="120" x2="560" y2="200" stroke="#94a3b8" strokeWidth="2" />
            <path d="M510 200 L610 200" stroke="#cbd5e1" strokeWidth="4" />
            
            {/* Left sealed flask */}
            <g transform="translate(170, 110)">
              <path d="M15 90 L15 60 L25 40 L25 25 L35 25 L35 40 L45 60 L45 90 Z" fill="#1e293b" stroke="#e2e8f0" strokeWidth="2" />
              <circle cx="22" cy="75" r="4" fill="#ef4444"><animate attributeName="cy" values="75;82;75" dur="2s" repeatCount="indefinite" /></circle>
              <circle cx="38" cy="80" r="4" fill="#3b82f6"><animate attributeName="cy" values="80;70;80" dur="2.5s" repeatCount="indefinite" /></circle>
              <circle cx="25" cy="55" r="4" fill="#ef4444"><animate attributeName="cx" values="25;35;25" dur="1.8s" repeatCount="indefinite" /></circle>
              <circle cx="35" cy="62" r="4" fill="#3b82f6"><animate attributeName="cx" values="35;22;35" dur="2.2s" repeatCount="indefinite" /></circle>
            </g>
            
            {/* Right sealed flask */}
            <g transform="translate(530, 110)">
              <path d="M15 90 L15 60 L25 40 L25 25 L35 25 L35 40 L45 60 L45 90 Z" fill="#1e293b" stroke="#e2e8f0" strokeWidth="2" />
              <g>
                <circle cx="25" cy="75" r="4" fill="#ef4444" />
                <circle cx="31" cy="75" r="4" fill="#3b82f6" />
                <animateTransform attributeName="transform" type="translate" values="0,0; 2,-2; 0,0" dur="2s" repeatCount="indefinite" />
              </g>
              <g>
                <circle cx="32" cy="58" r="4" fill="#ef4444" />
                <circle cx="38" cy="58" r="4" fill="#3b82f6" />
                <animateTransform attributeName="transform" type="translate" values="0,0; -2,2; 0,0" dur="2.5s" repeatCount="indefinite" />
              </g>
            </g>
            
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="-2 380 120; 2 380 120; -2 380 120"
              dur="4s"
              repeatCount="indefinite"
            />
          </g>
          <text x="205" y="205" fill="#e2e8f0">{locale === "vi" ? "trước" : "before"}</text>
          <text x="482" y="205" fill="#e2e8f0">{locale === "vi" ? "sau" : "after"}</text>
          
          <text x="80" y="325" fill="#e2e8f0">{label}</text>
        </g>
      ) : null}
      
      {/* 7. atomic-theory (Dalton) */}
      {visual === "atomic-theory" ? (
        <g>
          {/* Label CO */}
          <text x="140" y="85" fill="#38bdf8" fontSize="15" fontWeight="bold">Carbon Monoxide (CO)</text>
          <rect x="110" y="110" width="220" height="140" rx="10" fill="#1e293b" stroke="#475569" strokeWidth="2" />
          
          {/* CO Molecules */}
          <g transform="translate(130, 130)">
            <g>
              <circle cx="30" cy="40" r="14" fill="#475569" stroke="#cbd5e1" />
              <text x="25" y="44" fill="#fff" fontSize="11" fontWeight="bold">C</text>
              <circle cx="50" cy="40" r="10" fill="#ef4444" />
              <text x="46" y="43" fill="#fff" fontSize="8" fontWeight="bold">O</text>
              <animateTransform attributeName="transform" type="translate" values="0,0; 5,-5; 0,0" dur="3s" repeatCount="indefinite" />
            </g>
            <g transform="translate(80, 40)">
              <circle cx="30" cy="40" r="14" fill="#475569" stroke="#cbd5e1" />
              <text x="25" y="44" fill="#fff" fontSize="11" fontWeight="bold">C</text>
              <circle cx="50" cy="40" r="10" fill="#ef4444" />
              <text x="46" y="43" fill="#fff" fontSize="8" fontWeight="bold">O</text>
              <animateTransform attributeName="transform" type="translate" values="0,0; -5,5; 0,0" dur="4s" repeatCount="indefinite" />
            </g>
          </g>
          
          {/* Label CO2 */}
          <text x="440" y="85" fill="#f97316" fontSize="15" fontWeight="bold">Carbon Dioxide (CO₂)</text>
          <rect x="420" y="110" width="220" height="140" rx="10" fill="#1e293b" stroke="#475569" strokeWidth="2" />
          
          {/* CO2 Molecules */}
          <g transform="translate(440, 130)">
            <g>
              <circle cx="40" cy="40" r="14" fill="#475569" stroke="#cbd5e1" />
              <text x="35" y="44" fill="#fff" fontSize="11" fontWeight="bold">C</text>
              <circle cx="20" cy="40" r="10" fill="#ef4444" />
              <text x="16" y="43" fill="#fff" fontSize="8" fontWeight="bold">O</text>
              <circle cx="60" cy="40" r="10" fill="#ef4444" />
              <text x="56" y="43" fill="#fff" fontSize="8" fontWeight="bold">O</text>
              <animateTransform attributeName="transform" type="translate" values="0,0; -3,-3; 0,0" dur="3.5s" repeatCount="indefinite" />
            </g>
            <g transform="translate(70, 40)">
              <circle cx="40" cy="40" r="14" fill="#475569" stroke="#cbd5e1" />
              <text x="35" y="44" fill="#fff" fontSize="11" fontWeight="bold">C</text>
              <circle cx="20" cy="40" r="10" fill="#ef4444" />
              <text x="16" y="43" fill="#fff" fontSize="8" fontWeight="bold">O</text>
              <circle cx="60" cy="40" r="10" fill="#ef4444" />
              <text x="56" y="43" fill="#fff" fontSize="8" fontWeight="bold">O</text>
              <animateTransform attributeName="transform" type="translate" values="0,0; 3,3; 0,0" dur="4.5s" repeatCount="indefinite" />
            </g>
          </g>
          
          <text x="80" y="325" fill="#e2e8f0">{label}</text>
        </g>
      ) : null}
      
      {/* 8. periodic-table (Mendeleev) */}
      {visual === "periodic-table" ? (
        <g>
          <text x="145" y="75" fill="#cbd5e1" fontSize="14" fontWeight="bold">Group III</text>
          <text x="335" y="75" fill="#cbd5e1" fontSize="14" fontWeight="bold">Group IV</text>
          <text x="525" y="75" fill="#cbd5e1" fontSize="14" fontWeight="bold">Group V</text>
          
          {/* Row 1 */}
          <g transform="translate(100, 90)">
            <rect x="0" y="0" width="150" height="70" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
            <text x="15" y="30" fill="#fff" fontSize="18" fontWeight="bold">B</text>
            <text x="15" y="52" fill="#94a3b8" fontSize="12">Boron (11.0)</text>
          </g>
          <g transform="translate(290, 90)">
            <rect x="0" y="0" width="150" height="70" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1" />
            <text x="15" y="30" fill="#fff" fontSize="18" fontWeight="bold">C</text>
            <text x="15" y="52" fill="#94a3b8" fontSize="12">Carbon (12.0)</text>
          </g>
          <g transform="translate(480, 90)">
            <rect x="0" y="0" width="150" height="70" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1" />
            <text x="15" y="30" fill="#fff" fontSize="18" fontWeight="bold">N</text>
            <text x="15" y="52" fill="#94a3b8" fontSize="12">Nitrogen (14.0)</text>
          </g>
          
          {/* Row 2 */}
          <g transform="translate(100, 180)">
            <rect x="0" y="0" width="150" height="70" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1" />
            <text x="15" y="30" fill="#fff" fontSize="18" fontWeight="bold">Al</text>
            <text x="15" y="52" fill="#94a3b8" fontSize="12">Aluminium (27.3)</text>
          </g>
          <g transform="translate(290, 180)">
            <rect x="0" y="0" width="150" height="70" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1" />
            <text x="15" y="30" fill="#fff" fontSize="18" fontWeight="bold">Si</text>
            <text x="15" y="52" fill="#94a3b8" fontSize="12">Silicon (28.0)</text>
          </g>
          <g transform="translate(480, 180)">
            <rect x="0" y="0" width="150" height="70" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1" />
            <text x="15" y="30" fill="#fff" fontSize="18" fontWeight="bold">P</text>
            <text x="15" y="52" fill="#94a3b8" fontSize="12">Phosphorus (31.0)</text>
          </g>
          
          {/* Row 3 - Mendeleev Gap Prediction */}
          <g transform="translate(100, 270)">
            <g>
              <rect x="0" y="0" width="150" height="70" rx="6" fill="#291b1b" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 3" />
              <text x="15" y="30" fill="#ef4444" fontSize="18" fontWeight="bold">?</text>
              <text x="15" y="52" fill="#ef4444" fontSize="11">Eka-Aluminium (~68)</text>
              <animate attributeName="opacity" values="1;0;0;1;1" dur="5s" repeatCount="indefinite" />
            </g>
            <g>
              <rect x="0" y="0" width="150" height="70" rx="6" fill="#112918" stroke="#22c55e" strokeWidth="2" />
              <text x="15" y="30" fill="#22c55e" fontSize="18" fontWeight="bold">Ga</text>
              <text x="15" y="52" fill="#22c55e" fontSize="11">Gallium (69.7) [FOUND!]</text>
              <animate attributeName="opacity" values="0;1;1;0;0" dur="5s" repeatCount="indefinite" />
            </g>
          </g>
          
          <text x="280" y="315" fill="#e2e8f0">{label}</text>
        </g>
      ) : null}
      
      {/* 9. gold-foil (Rutherford) */}
      {visual === "gold-foil" ? (
        <g>
          {/* Gold foil lattice */}
          <g stroke="#e2e8f0" strokeWidth="1" fill="none">
            <circle cx="380" cy="100" r="45" strokeDasharray="2 2" />
            <circle cx="380" cy="100" r="12" fill="#facc15" stroke="#eab308" />
            <text x="375" y="104" fill="#000" fontSize="11" fontWeight="bold">+</text>
            
            <circle cx="380" cy="200" r="45" strokeDasharray="2 2" />
            <circle cx="380" cy="200" r="12" fill="#facc15" stroke="#eab308" />
            <text x="375" y="204" fill="#000" fontSize="11" fontWeight="bold">+</text>
            
            <circle cx="380" cy="300" r="45" strokeDasharray="2 2" />
            <circle cx="380" cy="300" r="12" fill="#facc15" stroke="#eab308" />
            <text x="375" y="304" fill="#000" fontSize="11" fontWeight="bold">+</text>
          </g>
          
          {/* Alpha Particle Emitter */}
          <rect x="60" y="170" width="60" height="60" fill="#475569" rx="4" />
          <line x1="120" y1="200" x2="135" y2="200" stroke="#f1f5f9" strokeWidth="4" />
          <text x="68" y="205" fill="#f1f5f9" fontSize="12" fontWeight="bold">Alpha</text>
          
          {/* Alpha particle streams */}
          <path d="M 130 140 L 680 140" stroke="#38bdf8" strokeWidth="3" fill="none" strokeDasharray="6 6">
            <animate attributeName="stroke-dashoffset" values="40;0" dur="1s" repeatCount="indefinite" />
          </path>
          
          <path d="M 130 260 L 680 260" stroke="#38bdf8" strokeWidth="3" fill="none" strokeDasharray="6 6">
            <animate attributeName="stroke-dashoffset" values="40;0" dur="1s" repeatCount="indefinite" />
          </path>
          
          <path d="M 130 200 L 368 200 L 220 280" stroke="#f43f5e" strokeWidth="3" fill="none" strokeDasharray="8 8">
            <animate attributeName="stroke-dashoffset" values="80;0" dur="1.5s" repeatCount="indefinite" />
          </path>
          <text x="210" y="270" fill="#f43f5e" fontSize="12" fontWeight="bold">Deflected!</text>
          
          <text x="80" y="335" fill="#e2e8f0">{label}</text>
        </g>
      ) : null}
      
      {/* 10. bohr-model (Bohr) */}
      {visual === "bohr-model" ? (
        <g>
          {/* Central Nucleus */}
          <circle cx="380" cy="180" r="16" fill="#f97316" stroke="#ea580c" strokeWidth="2" />
          <text x="373" y="185" fill="#fff" fontSize="14" fontWeight="bold">+</text>
          
          {/* Concentric quantized orbits */}
          <circle cx="380" cy="180" r="50" fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="380" cy="180" r="100" fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
          
          <text x="385" y="125" fill="#64748b" fontSize="10">n=1</text>
          <text x="385" y="75" fill="#64748b" fontSize="10">n=2</text>
          
          {/* Orbiting Electron jumping */}
          <g>
            <circle cx="380" cy="80" r="8" fill="#38bdf8">
              <animate
                attributeName="cy"
                values="130; 130; 80; 80; 130"
                keyTimes="0; 0.25; 0.35; 0.75; 0.85"
                dur="6s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="r"
                values="8; 8; 10; 8; 8"
                keyTimes="0; 0.25; 0.35; 0.75; 0.85"
                dur="6s"
                repeatCount="indefinite"
              />
            </circle>
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 380 180"
              to="360 380 180"
              dur="4s"
              repeatCount="indefinite"
            />
          </g>
          
          {/* Incoming photon packet */}
          <g>
            <path d="M 120,130 Q 140,110 160,130 T 200,130 T 240,130 T 280,130 L 330,130" fill="none" stroke="#22c55e" strokeWidth="3">
              <animate attributeName="opacity" values="1;1;0;0;0;0" keyTimes="0; 0.24; 0.25; 0.75; 0.85; 1" dur="6s" repeatCount="indefinite" />
              <animate attributeName="d" values="M 120,130 Q 140,110 160,130 T 200,130 T 240,130 T 280,130 L 330,130;
                                                 M 200,130 Q 220,110 240,130 T 280,130 T 320,130 T 360,130 L 380,130;
                                                 M 380,130 Q 380,130 380,130 T 380,130 T 380,130 T 380,130 L 380,130;
                                                 M 380,130 Q 380,130 380,130 T 380,130 T 380,130 T 380,130 L 380,130;
                                                 M 380,130 Q 380,130 380,130 T 380,130 T 380,130 T 380,130 L 380,130;
                                                 M 380,130 Q 380,130 380,130 T 380,130 T 380,130 T 380,130 L 380,130"
                         keyTimes="0; 0.24; 0.25; 0.75; 0.85; 1"
                         dur="6s"
                         repeatCount="indefinite" />
            </path>
            <text x="140" y="110" fill="#22c55e" fontSize="12" fontWeight="bold">Photon absorbed</text>
            <animate attributeName="opacity" values="1;1;0;0;0;0" keyTimes="0; 0.24; 0.25; 0.75; 0.85; 1" dur="6s" repeatCount="indefinite" />
          </g>
          
          {/* Outgoing photon */}
          <g>
            <path d="M 380,130 L 380,130 Q 380,130 380,130 T 380,130 T 380,130 T 380,130" fill="none" stroke="#ef4444" strokeWidth="3">
              <animate attributeName="opacity" values="0;0;0;0;1;1" keyTimes="0; 0.25; 0.35; 0.74; 0.75; 1" dur="6s" repeatCount="indefinite" />
              <animate attributeName="d" values="M 380,130 L 380,130 Q 380,130 380,130 T 380,130 T 380,130 T 380,130;
                                                 M 380,130 L 380,130 Q 380,130 380,130 T 380,130 T 380,130 T 380,130;
                                                 M 380,130 L 380,130 Q 380,130 380,130 T 380,130 T 380,130 T 380,130;
                                                 M 380,130 L 380,130 Q 380,130 380,130 T 380,130 T 380,130 T 380,130;
                                                 M 380,130 L 430,130 Q 450,110 470,130 T 510,130 T 550,130 T 590,130;
                                                 M 450,130 L 500,130 Q 520,110 540,130 T 580,130 T 620,130 T 660,130"
                         keyTimes="0; 0.25; 0.35; 0.74; 0.75; 1"
                         dur="6s"
                         repeatCount="indefinite" />
            </path>
            <text x="490" y="110" fill="#ef4444" fontSize="12" fontWeight="bold">Photon emitted</text>
            <animate attributeName="opacity" values="0;0;0;0;1;1" keyTimes="0; 0.25; 0.35; 0.74; 0.75; 1" dur="6s" repeatCount="indefinite" />
          </g>
          
          <text x="80" y="325" fill="#e2e8f0">{label}</text>
        </g>
      ) : null}
      
      {/* 10. lewis-bonding (Lewis) */}
      {visual === "lewis-bonding" ? (
        <g>
          {/* Overlapping shells */}
          <circle cx="380" cy="180" r="70" fill="#1e293b" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
          <text x="368" y="190" fill="#fff" fontSize="30" fontWeight="bold">O</text>
          
          {/* Left Hydrogen shell */}
          <g>
            <circle cx="270" cy="180" r="50" fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
            <text x="245" y="190" fill="#cbd5e1" fontSize="24" fontWeight="bold">H</text>
            <animateTransform
              attributeName="transform"
              type="translate"
              values="-60,0; 0,0; -60,0"
              dur="6s"
              repeatCount="indefinite"
            />
          </g>
          
          {/* Right Hydrogen shell */}
          <g>
            <circle cx="490" cy="180" r="50" fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
            <text x="500" y="190" fill="#cbd5e1" fontSize="24" fontWeight="bold">H</text>
            <animateTransform
              attributeName="transform"
              type="translate"
              values="60,0; 0,0; 60,0"
              dur="6s"
              repeatCount="indefinite"
            />
          </g>
          
          {/* Electron dots around Oxygen */}
          <circle cx="380" cy="120" r="6" fill="#f59e0b" />
          <circle cx="392" cy="120" r="6" fill="#f59e0b" />
          <circle cx="380" cy="240" r="6" fill="#f59e0b" />
          <circle cx="392" cy="240" r="6" fill="#f59e0b" />
          
          {/* Shared pair Left */}
          <g>
            <circle cx="280" cy="172" r="6" fill="#38bdf8" />
            <circle cx="320" cy="188" r="6" fill="#f59e0b" />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="15,0; 33,0; 15,0"
              dur="6s"
              repeatCount="indefinite"
            />
          </g>
          
          {/* Shared pair Right */}
          <g>
            <circle cx="480" cy="172" r="6" fill="#38bdf8" />
            <circle cx="440" cy="188" r="6" fill="#f59e0b" />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="-15,0; -33,0; -15,0"
              dur="6s"
              repeatCount="indefinite"
            />
          </g>
          
          <text x="80" y="325" fill="#e2e8f0">{label}</text>
        </g>
      ) : null}
      
      <defs>
        <marker id="histArrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 Z" fill="#e2e8f0" />
        </marker>
        <marker id="histArrowGreen" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#22c55e" />
        </marker>
        <marker id="histArrowOrange" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#f97316" />
        </marker>
      </defs>
    </svg>
  );
}

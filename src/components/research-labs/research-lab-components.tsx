"use client";

import Link from "next/link";
import type {
  HistoricalExperimentAttempt,
  HistoricalExperimentStage,
  HistoricalVisualScene,
  ResearcherRealLab
} from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InteractiveHistoricalExercise } from "@/components/research-labs/interactive-historical-exercise";
import { useI18n } from "@/lib/i18n/use-i18n";

export function ResearchQuestionPanel({ lab }: { lab: ResearcherRealLab }) {
  const { t } = useI18n();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("researchQuestionTitle")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="font-medium">{lab.coreQuestion}</p>
        <p className="text-muted-foreground">{lab.researchGoal}</p>
        {lab.hypothesis ? <p className="rounded-md bg-muted p-3">{t("researchHypothesisLabel")}: {lab.hypothesis}</p> : null}
      </CardContent>
    </Card>
  );
}

export function HistoricalContextPanel({ lab }: { lab: ResearcherRealLab }) {
  const { t } = useI18n();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("researchHistoricalContextTitle")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>{lab.historicalContext}</p>
        <p className="rounded-md border border-border p-3">{t("researchPreviousProblemLabel")}: {lab.previousBeliefOrProblem}</p>
      </CardContent>
    </Card>
  );
}

export function ResearchLabTimeline({ stages }: { stages: HistoricalExperimentStage[] }) {
  const { t } = useI18n();
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card p-4">
      <div className="flex min-w-[900px] gap-3">
        {stages.map((stage) => (
          <a key={stage.id} href={`#${stage.id}`} className="w-40 shrink-0 rounded-lg border border-border bg-muted/50 p-3 text-sm hover:bg-muted">
            <p className="text-xs text-muted-foreground">{t("researchStageLabel")} {stage.order}</p>
            <p className="mt-1 font-medium leading-snug">{stage.title}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

export function Historical2DScene({ scene: inputScene }: { scene?: HistoricalVisualScene }) {
  if (!inputScene) return null;
  const scene = inputScene;
  const markerId = `arrow-${scene.id.replace(/[^a-z0-9-]/gi, "")}`;
  const isTesla = scene.id.includes("tesla");
  const isJoule = scene.id.includes("joule");
  const isOxygen = scene.id.includes("oxygen");
  const isLavoisier = scene.id.includes("lavoisier");

  function Caption({ x, y, title, body }: { x: number; y: number; title: string; body: string }) {
    return (
      <foreignObject x={x} y={y} width="190" height="74">
        <div className="rounded-lg border border-white/15 bg-slate-950/82 px-3 py-2 text-[11px] shadow-xl backdrop-blur">
          <p className="font-semibold leading-tight text-white">{title}</p>
          <p className="mt-1 line-clamp-2 text-slate-300">{body}</p>
        </div>
      </foreignObject>
    );
  }

  function Header() {
    return (
      <foreignObject x="22" y="20" width="340" height="86">
        <div className="rounded-xl border border-white/10 bg-white/95 p-3 text-slate-950 shadow-xl">
          <p className="text-sm font-semibold">{scene.title}</p>
          <p className="mt-1 line-clamp-2 text-xs text-slate-600">{scene.description}</p>
        </div>
      </foreignObject>
    );
  }

  function TeslaMotorScene() {
    return (
      <>
        <rect x="78" y="285" width="604" height="64" rx="18" fill="#1e293b" stroke="#64748b" />
        <g transform="translate(350 214)">
          <circle r="94" fill="#0f172a" stroke="#94a3b8" strokeWidth="5" />
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <g key={angle} transform={`rotate(${angle}) translate(0 -92)`}>
              <rect x="-20" y="-20" width="40" height="48" rx="8" fill="#f97316" stroke="#fed7aa" strokeWidth="2" />
            </g>
          ))}
          <circle r="43" fill="#334155" stroke="#e2e8f0" strokeWidth="4" />
          <path d="M0 0 L0 -76" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" markerEnd={`url(#${markerId})`} />
          <path d="M-64 -64 A90 90 0 1 1 -66 64" fill="none" stroke="#38bdf8" strokeWidth="4" strokeDasharray="10 9" />
          <text x="-38" y="9" fill="white" fontSize="13" fontWeight="700">rotor</text>
        </g>
        <path d="M470 250 C520 210 560 300 610 252 S690 250 722 230" fill="none" stroke="#22d3ee" strokeWidth="5" />
        <path d="M84 180 C130 120 178 240 226 180 S316 180 340 140" fill="none" stroke="#a78bfa" strokeWidth="5" />
        <rect x="80" y="124" width="110" height="92" rx="14" fill="#0f172a" stroke="#a78bfa" strokeWidth="3" />
        <text x="104" y="176" fill="#ddd6fe" fontSize="16" fontWeight="700">AC</text>
        <rect x="570" y="138" width="98" height="118" rx="12" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />
        <path d="M592 154 c20 18 20 68 0 86 M646 154 c-20 18 -20 68 0 86" fill="none" stroke="#38bdf8" strokeWidth="6" />
        <Caption x={46} y={228} title="Nguồn AC" body="Dòng điện đổi chiều tạo pha thay đổi theo thời gian." />
        <Caption x={474} y={48} title="Từ trường quay" body="Vector quay quanh stator làm rotor nhận mô-men." />
        <Caption x={548} y={268} title="Transformer" body="Mô hình nâng/hạ áp để giảm hao phí truyền tải." />
      </>
    );
  }

  function FaradayScene() {
    return (
      <>
        <rect x="60" y="296" width="640" height="44" rx="16" fill="#1f2937" stroke="#475569" />
        <g transform="translate(380 198)">
          {[0, 1, 2, 3, 4].map((item) => (
            <ellipse key={item} cx={item * 13 - 26} cy="0" rx="34" ry="78" fill="none" stroke="#f59e0b" strokeWidth="5" />
          ))}
          <text x="-44" y="102" fill="#fde68a" fontSize="14" fontWeight="700">cuộn dây</text>
        </g>
        <g transform="translate(154 178)">
          <rect x="-58" y="-28" width="116" height="56" rx="10" fill="#ef4444" />
          <rect x="0" y="-28" width="58" height="56" rx="10" fill="#3b82f6" />
          <text x="-34" y="7" fill="white" fontSize="16" fontWeight="700">N</text>
          <text x="24" y="7" fill="white" fontSize="16" fontWeight="700">S</text>
        </g>
        <path d="M222 178 H303" stroke="#e0f2fe" strokeWidth="5" markerEnd={`url(#${markerId})`} />
        <path d="M470 198 C560 178 560 272 626 250" fill="none" stroke="#94a3b8" strokeWidth="4" />
        <g transform="translate(632 240)">
          <circle r="48" fill="#0f172a" stroke="#cbd5e1" strokeWidth="4" />
          <path d="M0 0 L28 -22" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
          <text x="-28" y="16" fill="#e2e8f0" fontSize="12">G</text>
        </g>
        <Caption x={52} y={76} title="Nam châm chuyển động" body="Đứng yên: kim không lệch rõ. Di chuyển: từ thông thay đổi." />
        <Caption x={492} y={70} title="Điện kế" body="Kim lệch khi có dòng cảm ứng trong cuộn dây." />
      </>
    );
  }

  function GalileoScene() {
    return (
      <>
        <rect x="64" y="304" width="640" height="38" rx="14" fill="#334155" />
        <polygon points="118,284 612,118 636,158 140,324" fill="#9a6a3a" stroke="#fcd34d" strokeWidth="4" />
        {[0, 1, 2, 3, 4, 5].map((item) => (
          <line key={item} x1={170 + item * 78} y1={284 - item * 26} x2={180 + item * 78} y2={306 - item * 26} stroke="#fff7ed" strokeWidth="3" />
        ))}
        <circle cx="286" cy="229" r="24" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="4" />
        <circle cx="208" cy="255" r="15" fill="#e2e8f0" opacity=".45" />
        <circle cx="370" cy="201" r="15" fill="#e2e8f0" opacity=".45" />
        <path d="M252 240 C306 214 350 202 410 188" fill="none" stroke="#38bdf8" strokeWidth="4" strokeDasharray="8 8" markerEnd={`url(#${markerId})`} />
        <g transform="translate(612 86)">
          <circle r="42" fill="#0f172a" stroke="#f8fafc" strokeWidth="4" />
          <path d="M0 0 L16 -28" stroke="#f97316" strokeWidth="4" />
          <text x="-19" y="62" fill="#e2e8f0" fontSize="13">đồng hồ</text>
        </g>
        <Caption x={70} y={78} title="Mặt phẳng nghiêng" body="Làm chuyển động chậm lại để đo quãng đường theo thời gian." />
        <Caption x={454} y={252} title="Thước đo" body="Các vạch giúp so sánh s với t² trong mô hình giáo dục." />
      </>
    );
  }

  function PrismScene() {
    return (
      <>
        <rect x="70" y="310" width="620" height="40" rx="16" fill="#1e293b" />
        <path d="M54 182 H288" stroke="#f8fafc" strokeWidth="8" markerEnd={`url(#${markerId})`} />
        <polygon points="342,126 276,270 430,270" fill="rgba(125,211,252,.20)" stroke="#7dd3fc" strokeWidth="4" />
        {["#ef4444", "#f97316", "#facc15", "#22c55e", "#38bdf8", "#6366f1", "#a855f7"].map((color, index) => (
          <path key={color} d={`M420 194 L646 ${132 + index * 18}`} stroke={color} strokeWidth="5" />
        ))}
        <rect x="650" y="106" width="18" height="172" rx="6" fill="#e2e8f0" />
        <Caption x={80} y={72} title="Ánh sáng trắng" body="Chùm sáng đi vào lăng kính." />
        <Caption x={470} y={286} title="Quang phổ" body="Các màu tách ra theo góc lệch khác nhau." />
      </>
    );
  }

  function JouleScene() {
    return (
      <>
        <rect x="58" y="302" width="650" height="44" rx="16" fill="#1f2937" />
        <line x1="174" y1="74" x2="174" y2="270" stroke="#cbd5e1" strokeWidth="5" />
        <rect x="132" y="230" width="84" height="58" rx="10" fill="#64748b" stroke="#cbd5e1" strokeWidth="3" />
        <path d="M174 98 C300 96 312 162 382 178" fill="none" stroke="#cbd5e1" strokeWidth="5" />
        <path d="M410 124 h160 l-22 170 h-116z" fill="rgba(56,189,248,.18)" stroke="#7dd3fc" strokeWidth="4" />
        <path d="M428 218 q58 26 116 0 v54 h-116z" fill="rgba(56,189,248,.38)" />
        <g transform="translate(490 210)">
          <path d="M0 -48 V48 M-48 0 H48 M-34 -34 L34 34 M34 -34 L-34 34" stroke="#f97316" strokeWidth="5" strokeLinecap="round" />
        </g>
        <rect x="604" y="126" width="18" height="144" rx="9" fill="#e2e8f0" />
        <rect x="609" y="188" width="8" height="74" rx="4" fill="#ef4444" />
        <Caption x={72} y={82} title="Quả nặng rơi" body="Thế năng kéo cánh khuấy quay." />
        <Caption x={520} y={62} title="Nhiệt kế" body="Nước ấm lên khi cơ năng chuyển thành nhiệt." />
      </>
    );
  }

  function GlasswareScene() {
    return (
      <>
        <rect x="90" y="306" width="580" height="38" rx="16" fill="#334155" />
        <g transform="translate(170 254)">
          <rect x="-80" y="0" width="160" height="24" rx="8" fill="#94a3b8" />
          <path d="M-48 0 L-12 -78 H12 L48 0" fill="#64748b" />
          <rect x="-44" y="-118" width="88" height="32" rx="6" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="3" />
          <text x="-28" y="-96" fill="#0f172a" fontSize="13" fontWeight="700">100.0 g</text>
        </g>
        <path d="M350 142 h80 l-12 132 h-56z" fill="rgba(56,189,248,.18)" stroke="#7dd3fc" strokeWidth="4" />
        <ellipse cx="390" cy="142" rx="40" ry="10" fill="rgba(125,211,252,.22)" stroke="#7dd3fc" strokeWidth="3" />
        <path d="M360 222 q30 18 60 0 v36 h-60z" fill="rgba(34,197,94,.36)" />
        <path d="M526 126 h76 l-12 156 h-52z" fill="rgba(251,191,36,.15)" stroke="#fbbf24" strokeWidth="4" />
        {isOxygen ? <path d="M564 284 c-24 -34 -6 -58 0 -82 c10 28 30 50 0 82z" fill="#f97316" /> : null}
        <Caption x={66} y={78} title={isLavoisier ? "Cân khối lượng" : "Bình khí"} body={isLavoisier ? "Hệ kín giúp so sánh trước/sau phản ứng." : "Mô phỏng khái niệm, không hướng dẫn thu khí thật."} />
        <Caption x={460} y={74} title={isOxygen ? "Vai trò oxygen" : "Dụng cụ thủy tinh"} body={isOxygen ? "Khí hỗ trợ sự cháy trong mô hình an toàn." : "Chất và khí được giữ trong mô hình quan sát."} />
      </>
    );
  }

  function PeriodicScene() {
    const symbols = ["H", "Li", "Be", "B", "C", "N", "O", "F", "?", "Na", "Mg", "Al", "Si", "P", "S", "Cl"];
    return (
      <>
        <rect x="70" y="302" width="620" height="46" rx="16" fill="#1e293b" />
        {symbols.map((symbol, index) => {
          const x = 128 + (index % 8) * 64;
          const y = 112 + Math.floor(index / 8) * 70;
          const gap = symbol === "?";
          return (
            <g key={`${symbol}-${index}`}>
              <rect x={x} y={y} width="52" height="54" rx="8" fill={gap ? "rgba(251,191,36,.16)" : "#f8fafc"} stroke={gap ? "#f59e0b" : "#94a3b8"} strokeWidth="3" strokeDasharray={gap ? "6 6" : undefined} />
              <text x={x + 18} y={y + 34} fill="#0f172a" fontSize="18" fontWeight="800">{symbol}</text>
            </g>
          );
        })}
        <Caption x={92} y={52} title="Thẻ nguyên tố" body="Sắp xếp theo khối lượng và tính chất lặp lại." />
        <Caption x={486} y={250} title="Ô trống dự đoán" body="Mendeleev để lại vị trí cho nguyên tố chưa tìm thấy." />
      </>
    );
  }

  function RutherfordScene() {
    return (
      <>
        <rect x="80" y="306" width="600" height="40" rx="16" fill="#1f2937" />
        <rect x="118" y="148" width="74" height="96" rx="12" fill="#334155" stroke="#94a3b8" strokeWidth="4" />
        <text x="132" y="202" fill="#f8fafc" fontSize="15" fontWeight="700">α</text>
        <rect x="365" y="94" width="16" height="198" rx="8" fill="#facc15" stroke="#fde68a" strokeWidth="3" />
        <path d="M188 178 H352" stroke="#38bdf8" strokeWidth="4" markerEnd={`url(#${markerId})`} />
        <path d="M188 208 C270 208 310 206 352 206" stroke="#38bdf8" strokeWidth="4" markerEnd={`url(#${markerId})`} />
        <path d="M376 178 C476 138 566 118 648 96" fill="none" stroke="#fb7185" strokeWidth="4" markerEnd={`url(#${markerId})`} />
        <path d="M376 208 H650" stroke="#38bdf8" strokeWidth="4" markerEnd={`url(#${markerId})`} />
        <path d="M376 224 C486 266 578 278 650 292" fill="none" stroke="#fb7185" strokeWidth="4" markerEnd={`url(#${markerId})`} />
        <path d="M654 72 A160 160 0 0 1 654 316" fill="none" stroke="#e2e8f0" strokeWidth="8" />
        <Caption x={68} y={68} title="Nguồn hạt alpha" body="Mô phỏng khái niệm, không tái tạo vật liệu phóng xạ." />
        <Caption x={430} y={60} title="Lá vàng và màn quan sát" body="Phần lớn đi thẳng, một số lệch mạnh." />
      </>
    );
  }

  function IndustrialScene() {
    return (
      <>
        <rect x="68" y="310" width="630" height="40" rx="16" fill="#1f2937" />
        <rect x="138" y="132" width="150" height="154" rx="28" fill="#334155" stroke="#cbd5e1" strokeWidth="4" />
        <circle cx="214" cy="166" r="34" fill="#0f172a" stroke="#f8fafc" strokeWidth="4" />
        <path d="M214 166 L236 150" stroke="#ef4444" strokeWidth="4" />
        <rect x="340" y="116" width="120" height="188" rx="24" fill="#475569" stroke="#f59e0b" strokeWidth="4" />
        <path d="M288 208 H340 M460 208 H610" stroke="#cbd5e1" strokeWidth="10" />
        <g transform="translate(560 180)">
          {["N₂", "H₂", "NH₃"].map((label, index) => (
            <g key={label} transform={`translate(${index * 48} ${index % 2 ? 38 : 0})`}>
              <circle r="20" fill={index === 2 ? "#34d399" : "#38bdf8"} />
              <text x="-13" y="5" fill="#022c22" fontSize="12" fontWeight="800">{label}</text>
            </g>
          ))}
        </g>
        <Caption x={98} y={58} title="Bình áp suất khái niệm" body="Không hiển thị thông số vận hành nguy hiểm." />
        <Caption x={416} y={58} title="Giường xúc tác" body="Điều kiện phù hợp làm NH3 xuất hiện nhiều hơn trong mô hình." />
      </>
    );
  }

  function CurieScene() {
    return (
      <>
        <rect x="76" y="306" width="620" height="42" rx="16" fill="#1f2937" />
        <rect x="116" y="172" width="150" height="92" rx="16" fill="#334155" stroke="#94a3b8" strokeWidth="4" />
        <circle cx="190" cy="218" r="30" fill="#a3e635" opacity=".8" />
        {[0, 1, 2].map((item) => <circle key={item} cx="190" cy="218" r={48 + item * 28} fill="none" stroke="#a3e635" strokeOpacity=".25" strokeWidth="4" />)}
        <rect x="410" y="112" width="128" height="150" rx="18" fill="#0f172a" stroke="#cbd5e1" strokeWidth="4" />
        <path d="M442 190 H506" stroke="#a3e635" strokeWidth="5" />
        <path d="M442 218 H482" stroke="#facc15" strokeWidth="5" />
        <Caption x={80} y={74} title="Mẫu khoáng vật" body="Tín hiệu phóng xạ được mô phỏng bằng vòng sáng an toàn." />
        <Caption x={388} y={278} title="Máy đo hoạt tính" body="So sánh tín hiệu để suy luận có thành phần mới." />
      </>
    );
  }

  function FallbackScene() {
    return (
      <>
        <rect x="72" y="306" width="620" height="42" rx="16" fill="#1f2937" />
        {scene.objects.slice(0, 5).map((object, index) => {
          const x = 134 + index * 116;
          const y = 206 + (index % 2) * 24;
          return (
            <g key={object.id}>
              <rect x={x - 36} y={y - 36} width="72" height="72" rx="18" fill="#334155" stroke="#38bdf8" strokeWidth="3" />
              <text x={x - 21} y={y + 5} fill="#e0f2fe" fontSize="13" fontWeight="800">{object.type.slice(0, 3).toUpperCase()}</text>
              <Caption x={Math.min(x - 60, 560)} y={y - 124} title={object.name} body={object.historicalRole || object.description} />
            </g>
          );
        })}
      </>
    );
  }

  function SceneContent() {
    if (scene.sceneType === "magnet-coil") return <FaradayScene />;
    if (scene.sceneType === "inclined-plane") return <GalileoScene />;
    if (scene.sceneType === "workbench") return <PrismScene />;
    if (scene.sceneType === "machine-prototype") return isJoule ? <JouleScene /> : <TeslaMotorScene />;
    if (scene.sceneType === "glassware-setup") return <GlasswareScene />;
    if (scene.sceneType === "periodic-table-room") return <PeriodicScene />;
    if (scene.sceneType === "atomic-model") return <RutherfordScene />;
    if (scene.sceneType === "industrial-plant") return <IndustrialScene />;
    if (scene.sceneType === "chemical-bench") return <CurieScene />;
    return <FallbackScene />;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-slate-950 p-3 text-white shadow-sm">
      <svg viewBox="0 0 760 420" className="aspect-[16/9] min-h-[320px] w-full">
        <defs>
          <pattern id={`grid-${scene.id}`} width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="rgba(148,163,184,0.12)" strokeWidth="1" />
          </pattern>
          <marker id={markerId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0l10 5-10 5z" fill="rgba(255,255,255,0.64)" />
          </marker>
          <linearGradient id={`lab-wall-${scene.id}`} x1="0" x2="1">
            <stop offset="0%" stopColor="#020617" />
            <stop offset="58%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#111827" />
          </linearGradient>
        </defs>
        <rect width="760" height="420" rx="18" fill={`url(#lab-wall-${scene.id})`} />
        <rect width="760" height="420" rx="18" fill={`url(#grid-${scene.id})`} />
        <Header />
        <SceneContent />
      </svg>
    </div>
  );
}

export function Historical3DScene({ scene: inputScene }: { scene?: HistoricalVisualScene }) {
  if (!inputScene) return null;
  const scene = inputScene;
  const isTesla = scene.id.includes("tesla");
  const isJoule = scene.id.includes("joule");
  const labels = scene.objects.slice(0, 4).map((object) => object.name);

  function ModelObject({ label, index }: { label: string; index: number }) {
    const colors = ["bg-sky-500", "bg-amber-500", "bg-emerald-500", "bg-rose-500"];
    return (
      <div
        className={`absolute grid h-16 w-20 place-items-center rounded-xl border border-white/25 ${colors[index % colors.length]} text-center text-[11px] font-semibold leading-tight text-white shadow-2xl`}
        style={{
          left: `${70 + (index % 2) * 170}px`,
          top: `${96 + Math.floor(index / 2) * 88}px`,
          transform: `translateZ(${36 + index * 14}px) rotateX(-8deg) rotateY(${index % 2 ? -16 : 16}deg)`
        }}
      >
        {label}
      </div>
    );
  }

  function ApparatusModel() {
    if (scene.sceneType === "magnet-coil") {
      return (
        <>
          <div className="absolute left-[86px] top-[128px] h-12 w-32 rounded-xl bg-gradient-to-r from-red-500 to-blue-500 shadow-2xl [transform:translateZ(58px)_rotateY(-14deg)]" />
          <div className="absolute left-[236px] top-[86px] h-32 w-28 rounded-full border-[12px] border-amber-500 shadow-xl [transform:translateZ(42px)_rotateY(18deg)]" />
          <div className="absolute left-[385px] top-[120px] h-24 w-24 rounded-full border-4 border-slate-200 bg-slate-900 shadow-xl [transform:translateZ(50px)]">
            <div className="absolute left-1/2 top-1/2 h-1 w-10 origin-left bg-red-400 [transform:rotate(-36deg)]" />
          </div>
        </>
      );
    }

    if (scene.sceneType === "inclined-plane") {
      return (
        <>
          <div className="absolute left-[118px] top-[156px] h-12 w-[320px] rounded-xl bg-amber-700 shadow-2xl [transform:translateZ(36px)_rotateZ(-18deg)_rotateX(62deg)]" />
          <div className="absolute left-[280px] top-[118px] h-14 w-14 rounded-full bg-slate-200 shadow-2xl [transform:translateZ(82px)]" />
          <div className="absolute left-[430px] top-[88px] h-20 w-20 rounded-full border-4 border-slate-200 bg-slate-950 shadow-xl [transform:translateZ(60px)]" />
        </>
      );
    }

    if (scene.sceneType === "workbench") {
      return (
        <>
          <div className="absolute left-[86px] top-[158px] h-2 w-56 bg-white shadow-[0_0_18px_white] [transform:translateZ(54px)]" />
          <div className="absolute left-[300px] top-[118px] h-0 w-0 border-b-[92px] border-l-[54px] border-r-[54px] border-b-sky-300/70 border-l-transparent border-r-transparent shadow-2xl [transform:translateZ(60px)_rotateY(-12deg)]" />
          <div className="absolute left-[392px] top-[120px] h-28 w-52 rounded-xl bg-gradient-to-r from-red-500 via-yellow-300 via-green-400 via-sky-400 to-violet-500 opacity-90 blur-[1px] [transform:translateZ(48px)_rotateY(10deg)]" />
        </>
      );
    }

    if (scene.sceneType === "machine-prototype" && !isJoule) {
      return (
        <>
          <div className="absolute left-[190px] top-[78px] h-44 w-44 rounded-full border-[18px] border-orange-500 bg-slate-900 shadow-2xl [transform:translateZ(64px)_rotateX(10deg)]" />
          <div className="absolute left-[240px] top-[128px] h-24 w-24 rounded-full bg-slate-500 shadow-xl [transform:translateZ(96px)]" />
          <div className="absolute left-[268px] top-[116px] h-3 w-40 origin-left rounded-full bg-sky-400 shadow-[0_0_18px_#38bdf8] [transform:translateZ(122px)_rotate(38deg)]" />
          <div className="absolute left-[410px] top-[128px] h-24 w-24 rounded-lg border-4 border-sky-400 bg-slate-800 shadow-xl [transform:translateZ(58px)_rotateY(-22deg)]" />
        </>
      );
    }

    if (scene.sceneType === "machine-prototype" && isJoule) {
      return (
        <>
          <div className="absolute left-[120px] top-[70px] h-40 w-12 rounded-lg bg-slate-500 shadow-xl [transform:translateZ(76px)]" />
          <div className="absolute left-[96px] top-[194px] h-16 w-28 rounded-xl bg-slate-600 shadow-xl [transform:translateZ(60px)]" />
          <div className="absolute left-[316px] top-[116px] h-36 w-36 rounded-b-3xl border-4 border-sky-300 bg-sky-300/20 shadow-2xl [transform:translateZ(58px)_rotateX(4deg)]" />
          <div className="absolute left-[360px] top-[148px] h-20 w-20 rounded-full border-8 border-orange-500 shadow-xl [transform:translateZ(90px)]" />
        </>
      );
    }

    if (scene.sceneType === "glassware-setup") {
      return (
        <>
          <div className="absolute left-[126px] top-[182px] h-[72px] w-44 rounded-lg bg-slate-400 shadow-xl [transform:translateZ(40px)_rotateX(8deg)]" />
          <div className="absolute left-[176px] top-[96px] h-24 w-24 rounded-full border-4 border-sky-200 bg-sky-300/20 shadow-2xl [transform:translateZ(78px)]" />
          <div className="absolute left-[360px] top-[82px] h-40 w-24 rounded-b-3xl border-4 border-amber-300 bg-amber-300/20 shadow-2xl [transform:translateZ(62px)]" />
          <div className="absolute left-[500px] top-[160px] h-20 w-10 rounded-full bg-orange-500 shadow-[0_0_22px_#f97316] [transform:translateZ(70px)]" />
        </>
      );
    }

    if (scene.sceneType === "atomic-model") {
      return (
        <>
          <div className="absolute left-[118px] top-[150px] h-16 w-24 rounded-lg bg-slate-500 shadow-xl [transform:translateZ(58px)]" />
          <div className="absolute left-[316px] top-[70px] h-44 w-5 rounded-full bg-yellow-300 shadow-2xl [transform:translateZ(70px)]" />
          <div className="absolute left-[474px] top-[54px] h-52 w-20 rounded-full border-8 border-slate-200 shadow-xl [transform:translateZ(46px)_rotateY(-18deg)]" />
          <div className="absolute left-[190px] top-[158px] h-1 w-[320px] bg-sky-400 shadow-[0_0_14px_#38bdf8] [transform:translateZ(90px)_rotate(-4deg)]" />
          <div className="absolute left-[356px] top-[132px] h-1 w-[220px] bg-rose-400 shadow-[0_0_14px_#fb7185] [transform:translateZ(92px)_rotate(-26deg)]" />
        </>
      );
    }

    if (scene.sceneType === "periodic-table-room") {
      return (
        <>
          {Array.from({ length: 18 }).map((_, index) => (
            <div
              key={index}
              className={`absolute h-10 w-10 rounded-md border border-white/25 ${index === 8 ? "border-dashed bg-amber-400/30" : "bg-slate-100"} shadow-lg`}
              style={{
                left: `${112 + (index % 9) * 48}px`,
                top: `${112 + Math.floor(index / 9) * 58}px`,
                transform: `translateZ(${44 + index}px) rotateX(0deg)`
              }}
            />
          ))}
        </>
      );
    }

    return labels.map((label, index) => <ModelObject key={label} label={label} index={index} />);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-[radial-gradient(circle_at_50%_10%,hsl(var(--primary)/0.18),hsl(var(--muted))_38%,hsl(var(--background)))] p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative mx-auto h-80 w-full max-w-[600px] [perspective:950px]">
          <div className="absolute left-1/2 top-1/2 h-60 w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-[32px] border border-primary/30 bg-card shadow-2xl [transform:rotateX(62deg)_rotateZ(-18deg)]" />
          <div className="absolute left-1/2 top-1/2 h-40 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-primary/45 [transform:rotateX(62deg)_rotateZ(-18deg)]" />
          <ApparatusModel />
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <Badge>{scene.camera?.mode ?? "orbit"}</Badge>
          <h3 className="text-lg font-semibold">{scene.title}</h3>
          <p className="text-sm text-muted-foreground">{scene.description}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {scene.animationTimeline.slice(0, 4).map((step) => (
              <div key={step.order} className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="font-medium">{step.order}. {step.action}</p>
                <p className="mt-1 line-clamp-2 text-muted-foreground">{step.visibleEffect}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function StageImageCard({ stage }: { stage: HistoricalExperimentStage }) {
  const { t } = useI18n();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("researchImagePromptTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{stage.imagePrompt}</p>
      </CardContent>
    </Card>
  );
}

export function Stage3DModelCard({ stage }: { stage: HistoricalExperimentStage }) {
  const { t } = useI18n();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("researchModelPromptTitle")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>{stage.model3dPrompt}</p>
        <p className="rounded-md bg-muted p-3">{stage.animationPrompt}</p>
      </CardContent>
    </Card>
  );
}

export function ExperimentFlowStepper({ lab, currentScene }: { lab: ResearcherRealLab; currentScene?: HistoricalVisualScene }) {
  const { t } = useI18n();
  return (
    <div className="space-y-4">
      {lab.experimentFlow.map((stage) => (
        <Card key={stage.id} id={stage.id}>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{t("researchStageLabel")} {stage.order}</Badge>
              <Badge>{stage.stageType}</Badge>
            </div>
            <CardTitle>{stage.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>{stage.description}</p>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-md bg-muted p-3">
                <p className="font-medium">{t("researchActionLabel")}</p>
                <p className="mt-1 text-muted-foreground">{stage.researcherAction}</p>
              </div>
              <div className="rounded-md bg-muted p-3">
                <p className="font-medium">{t("researchObservedLabel")}</p>
                <p className="mt-1 text-muted-foreground">{stage.observedResult}</p>
              </div>
              <div className="rounded-md bg-muted p-3">
                <p className="font-medium">{t("researchReasoningLabel")}</p>
                <p className="mt-1 text-muted-foreground">{stage.reasoning}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {stage.instrumentUsed.map((instrument) => <Badge key={instrument}>{instrument}</Badge>)}
            </div>
            {stage.stageType === "attempt" ? <InteractiveHistoricalExercise stage={stage} /> : null}
            {stage.visualSceneId === currentScene?.id ? null : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function FailedAttemptViewer({ attempt }: { attempt: HistoricalExperimentAttempt }) {
  const { t } = useI18n();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("researchFailureStateTitle")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="font-medium">{attempt.title}</p>
        <p className="text-muted-foreground">{attempt.description}</p>
        <p className="rounded-md border border-amber-300 bg-amber-50 p-3 text-amber-950 dark:bg-amber-500/10 dark:text-amber-100">{attempt.whyItFailedOrWorked}</p>
      </CardContent>
    </Card>
  );
}

export function SuccessAttemptViewer({ attempt }: { attempt: HistoricalExperimentAttempt }) {
  const { t } = useI18n();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("researchSuccessStateTitle")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="font-medium">{attempt.title}</p>
        <p className="text-muted-foreground">{attempt.description}</p>
        <p className="rounded-md border border-emerald-300 bg-emerald-50 p-3 text-emerald-950 dark:bg-emerald-500/10 dark:text-emerald-100">{attempt.whyItFailedOrWorked}</p>
      </CardContent>
    </Card>
  );
}

export function AttemptComparePanel({ lab }: { lab: ResearcherRealLab }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FailedAttemptViewer attempt={lab.failedAttempts[0]} />
      <SuccessAttemptViewer attempt={lab.successfulAttempt} />
    </div>
  );
}

export function FailureSuccessTimeline({ lab }: { lab: ResearcherRealLab }) {
  const { t } = useI18n();
  const nodes = [
    t("researchInitialSetup"),
    t("researchFailureIncomplete"),
    t("researchCauseAnalysis"),
    t("researchAdjustment"),
    t("researchSuccess"),
    t("researchConclusion")
  ];
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="grid gap-3 md:grid-cols-6">
        {nodes.map((node, index) => (
          <div key={node} className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
            <p className="text-xs text-muted-foreground">{index + 1}</p>
            <p className="font-medium">{node}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{lab.failedAttempts[0].whyItFailedOrWorked} {t("researchThen")}: {lab.successfulAttempt.whyItFailedOrWorked}</p>
    </div>
  );
}

export function FormulaOriginFromExperiment({ lab }: { lab: ResearcherRealLab }) {
  const { t } = useI18n();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("researchFormulaOriginTitle")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p>{t("researchObservedLabel")}: {lab.discoveredConcepts.join(", ")}</p>
        <p>{t("researchMeasuredCompared")}: instruments, visible change, and stage observations.</p>
        <p>{t("researchFormulaLinks")}: {lab.relatedFormulaIds.length ? lab.relatedFormulaIds.join(", ") : t("researchConceptualModel")}</p>
        <p className="text-muted-foreground">{lab.modernInterpretation}</p>
      </CardContent>
    </Card>
  );
}

export const FormulaDerivationFromExperiment = FormulaOriginFromExperiment;

export function DiscoveryConclusionPanel({ lab }: { lab: ResearcherRealLab }) {
  const { t } = useI18n();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("researchDiscoveryConclusion")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex flex-wrap gap-2">
          {lab.discoveredConcepts.map((concept) => <Badge key={concept}>{concept}</Badge>)}
        </div>
        <p className="text-muted-foreground">{lab.modernInterpretation}</p>
      </CardContent>
    </Card>
  );
}

export function InstrumentPanel({ lab }: { lab: ResearcherRealLab }) {
  const instruments = Array.from(new Set(lab.experimentFlow.flatMap((stage) => stage.instrumentUsed)));
  const { t } = useI18n();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("researchInstruments")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {instruments.map((instrument) => <Badge key={instrument}>{instrument}</Badge>)}
      </CardContent>
    </Card>
  );
}

export function ResearcherActionPanel({ stage }: { stage: HistoricalExperimentStage }) {
  const { t } = useI18n();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("researchResearcherAction")}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{stage.researcherAction}</CardContent>
    </Card>
  );
}

export function ObservationPanel({ stage }: { stage: HistoricalExperimentStage }) {
  const { t } = useI18n();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("researchObservation")}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{stage.observedResult}</CardContent>
    </Card>
  );
}

export function SourceReferencePanel({ lab }: { lab: ResearcherRealLab }) {
  const { t } = useI18n();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("researchSources")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {lab.sourceReferences.map((source) => (
          <a key={source.id} href={source.url} target="_blank" rel="noreferrer" className="block rounded-lg border border-border p-3 text-sm hover:bg-muted">
            <p className="font-medium">{source.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{source.publisher} - {source.sourceType} - {t("researchReliability")}: {source.reliability}</p>
            <p className="mt-2 text-muted-foreground">{source.notes}</p>
          </a>
        ))}
      </CardContent>
    </Card>
  );
}

export function HistoricalAccuracyNotice({ lab }: { lab: ResearcherRealLab }) {
  const { t } = useI18n();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("researchAccuracyNotice")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p>{t("researchAccuracyLevel")}: {lab.accuracyLevel}</p>
        <p>{t("researchSourceBacked")}</p>
        <p>{t("researchEducationalReconstruction")}</p>
        {lab.uncertaintyNotes?.map((note) => <p key={note}>{t("researchUncertainty")}: {note}</p>)}
      </CardContent>
    </Card>
  );
}

export function SafetyConceptOnlyNotice({ lab }: { lab: ResearcherRealLab }) {
  const { t } = useI18n();
  if (lab.safetyLevel === "safe-to-simulate") return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("researchSafetyNotice")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p>{t("researchSafetyLevel")}: {lab.safetyLevel}</p>
        <p>{t("researchSafetyBody")}</p>
      </CardContent>
    </Card>
  );
}

export function ResearchLabPage({ lab }: { lab: ResearcherRealLab }) {
  const { t } = useI18n();
  const firstScene = lab.visualReconstruction.scenes[0];
  const failedScene = lab.visualReconstruction.scenes.find((scene) => scene.id === lab.failedAttempts[0]?.visualSceneId);
  const successScene = lab.visualReconstruction.scenes.find((scene) => scene.id === lab.successfulAttempt.visualSceneId);
  const challengeStage = lab.experimentFlow.find((stage) => stage.studentInteraction);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap gap-2">
          <Badge>{lab.subject}</Badge>
          <Badge>{lab.discoveryType}</Badge>
          <Badge>{lab.period}</Badge>
        </div>
        <h1 className="mt-3 text-3xl font-semibold">{lab.title}</h1>
        {lab.subtitle ? <p className="mt-2 max-w-3xl text-muted-foreground">{lab.subtitle}</p> : null}
        <p className="mt-2 text-sm text-muted-foreground">{lab.researcherNames.join(", ")}{lab.location ? ` - ${lab.location}` : ""}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ResearchQuestionPanel lab={lab} />
        <HistoricalContextPanel lab={lab} />
      </div>

      <ResearchLabTimeline stages={lab.experimentFlow} />

      <div className="grid gap-5 xl:grid-cols-[280px_1fr_320px]">
        <div className="space-y-4">
          <ExperimentFlowStepper lab={lab} currentScene={firstScene} />
        </div>
        <div className="space-y-4">
          <Historical2DScene scene={firstScene} />
          <Historical3DScene scene={successScene ?? firstScene} />
          <AttemptComparePanel lab={lab} />
          <FailureSuccessTimeline lab={lab} />
          <FormulaOriginFromExperiment lab={lab} />
          <DiscoveryConclusionPanel lab={lab} />
          <InteractiveHistoricalExercise stage={challengeStage} />
        </div>
        <aside className="space-y-4">
          <InstrumentPanel lab={lab} />
          <HistoricalAccuracyNotice lab={lab} />
          <SafetyConceptOnlyNotice lab={lab} />
          <SourceReferencePanel lab={lab} />
        </aside>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Historical2DScene scene={failedScene} />
        <Historical2DScene scene={successScene} />
      </div>

      <div className="flex flex-wrap gap-2">
        {lab.relatedSimulationLabIds.map((slug) => (
          <Link key={slug} href={`/lab/${slug}`}>
            <Button variant="secondary">{t("researchOpenLab")}: {slug}</Button>
          </Link>
        ))}
      </div>
    </div>
  );
}

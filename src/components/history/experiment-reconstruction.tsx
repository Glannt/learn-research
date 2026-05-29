import type { ScienceHistoryTopic } from "@/types";
import { HistoricalLabScene } from "@/components/history/historical-lab-scene";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ZoomableVisual } from "@/components/simulation/zoom/zoomable-visual";
import { useI18n } from "@/lib/i18n/use-i18n";

const visualNotes: Record<string, string[]> = {
  "inclined-plane": ["Inclined plane slows falling motion so distance can be measured.", "Blue ball accelerates; marked distances represent increasing displacement over equal time intervals."],
  "force-motion": ["Green arrow is applied force; orange arrow is acceleration.", "The block model links observation of motion directly to F = ma."],
  "spring-hooke": ["Spring stretch is paired with a force-extension graph.", "The straight line shows the elastic range where F is proportional to x."],
  "joule-heat": ["Paddles turn inside water and convert mechanical work into thermal energy.", "The scene highlights the energy transfer idea, not a precise apparatus."],
  "faraday-induction": ["Moving magnet changes magnetic flux through the coil.", "The green meter deflection represents induced current."],
  "mass-conservation": ["Closed vessels before and after reaction sit on the same balance idea.", "Atoms rearrange, but total mass in the closed system stays constant."],
  "atomic-theory": ["Colored spheres represent different atom types.", "Fixed ratios of spheres model fixed composition of compounds."],
  "periodic-table": ["Element cards are grouped by repeating properties.", "Gaps represent the predictive power of the periodic table."],
  "gold-foil": ["Alpha-particle paths mostly pass through, with rare strong deflections.", "The deflections point to a small dense nucleus."],
  "bohr-model": ["Electron paths are shown as simplified orbits.", "The model explains spectra through quantized energy levels."],
  "lewis-bonding": ["Dots represent valence electrons.", "Shared pairs form covalent bonds in simple molecules."]
};

const visualNotesVi: Record<string, string[]> = {
  "inclined-plane": ["Mặt phẳng nghiêng làm chậm chuyển động rơi để có thể đo được quãng đường.", "Viên bi xanh tăng tốc; các đoạn đánh dấu cho thấy độ dời ngày càng tăng trong những khoảng thời gian bằng nhau."],
  "force-motion": ["Mũi tên màu xanh là lực tác dụng; mũi tên màu cam là gia tốc.", "Mô hình khối hộp liên kết quan sát chuyển động trực tiếp với F = ma."],
  "spring-hooke": ["Độ giãn của lò xo được ghép cặp với đồ thị lực - độ giãn.", "Đường thẳng thể hiện vùng đàn hồi nơi F tỷ lệ thuận với x."],
  "joule-heat": ["Các cánh quạt quay trong nước và chuyển hóa công cơ học thành nhiệt năng.", "Cảnh này làm nổi bật ý tưởng truyền năng lượng, không phải là thiết bị chính xác."],
  "faraday-induction": ["Nam châm di chuyển làm thay đổi từ thông qua cuộn dây.", "Sự lệch kim của đồng hồ xanh đại diện cho dòng điện cảm ứng."],
  "mass-conservation": ["Bình kín trước và sau phản ứng đặt trên cùng một cái cân.", "Nguyên tử sắp xếp lại, nhưng tổng khối lượng trong hệ kín vẫn không đổi."],
  "atomic-theory": ["Các quả cầu màu sắc đại diện cho các loại nguyên tử khác nhau.", "Tỷ lệ cố định của các quả cầu mô phỏng thành phần không đổi của hợp chất."],
  "periodic-table": ["Các thẻ nguyên tử được nhóm theo tính chất lặp lại.", "Các ô trống thể hiện sức mạnh dự báo của bảng tuần hoàn."],
  "gold-foil": ["Quỹ đạo hạt alpha hầu hết đi xuyên qua, có những lần lệch hướng mạnh hiếm hoi.", "Sự lệch hướng chỉ ra sự tồn tại của hạt nhân nhỏ đặc."],
  "bohr-model": ["Quỹ đạo electron được thể hiện dưới dạng đơn giản hóa.", "Mô hình giải thích quang phổ thông qua các mức năng lượng lượng tử hóa."],
  "lewis-bonding": ["Các chấm biểu diễn electron hóa trị.", "Các cặp electron dùng chung tạo thành liên kết cộng hóa trị trong các phân tử đơn giản."]
};

export function ExperimentReconstruction({ topic }: { topic: ScienceHistoryTopic }) {
  const { t, locale } = useI18n();
  const notesSource = locale === "vi" ? visualNotesVi : visualNotes;
  const notes = notesSource[topic.visualType] ?? [];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("experimentReconstructionTitle")}</CardTitle>
        <p className="text-sm text-muted-foreground">{t("experimentReconstructionDesc")}</p>
      </CardHeader>
      <CardContent>
        <ZoomableVisual 
          title={topic.title} 
          instructions={notes}
          subject={topic.subject}
        >
          <HistoricalLabScene topic={topic} locale={locale} />
        </ZoomableVisual>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {notes.map((note) => (
            <div key={note} className="rounded-md border border-border bg-muted p-3 text-sm text-muted-foreground">
              {note}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

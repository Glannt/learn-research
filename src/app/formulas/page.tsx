import { formulas } from "@/data/catalog";
import { FormulaSearch } from "@/components/formula/formula-search";

export default function FormulasPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-semibold">Tra cứu công thức</h1>
        <p className="mt-2 text-muted-foreground">Công thức Vật lý và Hóa học có LaTeX, giải thích biến, ví dụ và calculator khi có cấu hình.</p>
      </div>
      <FormulaSearch formulas={formulas} />
    </div>
  );
}

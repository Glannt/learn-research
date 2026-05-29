import type { SearchItem, Subject } from "@/types";
import { chemistryChapters, chemistryExercises, chemistryFormulas, chemistryLessons, chemistrySimulations, chemicalElements, molecules } from "@/data/chemistry/catalog";
import { reactionSimulations } from "@/data/chemistry/reactions";
import { formulaDetails, lessonInlineLabs, lessonMiniExercises } from "@/data/lesson-inline-labs";
import { researcherRealLabs } from "@/data/researcher-real-labs";
import { scienceHistoryTopics } from "@/data/science-history";
import { physicsChapters, physicsExercises, physicsFormulas, physicsLessons, physicsSimulations } from "@/data/physics/catalog";

export const subjects: Subject[] = [
  {
    id: "physics",
    name: "Vật lý",
    slug: "physics",
    description: "Từ chuyển động, lực, năng lượng đến điện, quang và vật lý hiện đại.",
    accent: "from-blue-600 to-violet-600"
  },
  {
    id: "chemistry",
    name: "Hóa học",
    slug: "chemistry",
    description: "Từ nguyên tử, liên kết, mol, dung dịch đến phản ứng và hóa hữu cơ.",
    accent: "from-emerald-600 to-orange-500"
  }
];

export const chapters = [...physicsChapters, ...chemistryChapters];
export const lessons = [...physicsLessons, ...chemistryLessons];
export const formulas = [...physicsFormulas, ...chemistryFormulas];
export const simulations = [...physicsSimulations, ...chemistrySimulations];
export const exercises = [...physicsExercises, ...chemistryExercises];
export { formulaDetails, lessonInlineLabs, lessonMiniExercises };
export { researcherRealLabs };
export { chemicalElements, molecules };
export { reactionSimulations };
export { scienceHistoryTopics };

export function getSubject(slug: string) {
  return subjects.find((subject) => subject.slug === slug);
}

export function getFormula(subject: string, slug: string) {
  return formulas.find((formula) => formula.subject === subject && formula.slug === slug);
}

export function getFormulaDetail(subject: string, slug: string) {
  return formulaDetails.find((formula) => formula.subject === subject && formula.slug === slug);
}

export function getLesson(subject: string, slug: string) {
  return lessons.find((lesson) => lesson.subject === subject && lesson.slug === slug);
}

export function getSimulation(slug: string) {
  return simulations.find((simulation) => simulation.slug === slug);
}

export function getResearcherRealLab(slug: string) {
  return researcherRealLabs.find((lab) => lab.slug === slug);
}

export const searchItems: SearchItem[] = [
  {
    title: "TRIZ Chatbot",
    subtitle: "Chatbot tra cứu corpus TRIZ local",
    href: "/triz-chat",
    keywords: ["TRIZ", "PPLST", "sáng tạo", "mâu thuẫn kỹ thuật", "ARIZ", "chatbot"]
  },
  ...formulas.map((formula) => ({
    title: formula.name,
    subtitle: `Công thức ${formula.subject === "physics" ? "Vật lý" : "Hóa học"}: ${formula.latex}`,
    href: `/formulas/${formula.subject}/${formula.slug}`,
    keywords: [formula.name, formula.latex, formula.description, formula.subject]
  })),
  ...formulaDetails.map((formula) => ({
    title: `${formula.name} - parameter map`,
    subtitle: `Formula detail: ${formula.plainText}`,
    href: `/formulas/${formula.subject}/${formula.slug}`,
    keywords: [formula.name, formula.plainText, formula.shortMeaning, ...formula.variables.map((variable) => `${variable.symbol} ${variable.name}`)]
  })),
  ...lessons.map((lesson) => ({
    title: lesson.title,
    subtitle: `Bài học ${lesson.subject === "physics" ? "Vật lý" : "Hóa học"}`,
    href: `/subjects/${lesson.subject}/lessons/${lesson.slug}`,
    keywords: [lesson.title, lesson.summary, lesson.content]
  })),
  ...simulations.map((simulation) => ({
    title: simulation.title,
    subtitle: `Mô phỏng ${simulation.dimension}`,
    href: `/lab/${simulation.slug}`,
    keywords: [simulation.title, simulation.description, simulation.type]
  })),
  ...chemicalElements.map((element) => ({
    title: `${element.symbol} - ${element.name}`,
    subtitle: `Nguyên tố số ${element.atomicNumber}`,
    href: "/lab/periodic-table",
    keywords: [element.symbol, element.name, element.electronConfiguration]
  })),
  ...molecules.map((molecule) => ({
    title: `${molecule.formula} - ${molecule.name}`,
    subtitle: molecule.bonding,
    href: "/lab/molecule-viewer",
    keywords: [molecule.formula, molecule.name, molecule.bonding]
  })),
  ...scienceHistoryTopics.map((topic) => ({
    title: topic.title,
    subtitle: `${topic.subject === "physics" ? "Physics" : "Chemistry"} history - ${topic.period}`,
    href: `/history/${topic.id}`,
    keywords: [topic.title, topic.summary, topic.scientistNames.join(" "), topic.formulaDerived ?? ""]
  })),
  ...researcherRealLabs.map((lab) => ({
    title: lab.title,
    subtitle: `Research real lab - ${lab.researcherNames.join(", ")} - ${lab.period}`,
    href: `/research-labs/${lab.slug}`,
    keywords: [
      lab.title,
      lab.subtitle ?? "",
      lab.coreQuestion,
      lab.researcherNames.join(" "),
      lab.discoveredConcepts.join(" "),
      lab.relatedFormulaIds.join(" ")
    ]
  }))
];

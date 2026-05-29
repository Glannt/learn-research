import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

export type TrizSourceHit = {
  id: string;
  title: string;
  excerpt: string;
  score: number;
};

export type TrizAnswer = {
  answer: string;
  confidence: number;
  sources: TrizSourceHit[];
};

export type TrizLocale = "vi" | "en";

type TrizChunk = {
  id: string;
  title: string;
  text: string;
  tokens: Set<string>;
};

type TrizQa = {
  question_number?: string;
  question: string;
  answer: string;
};

let cachedChunks: TrizChunk[] | undefined;

const rawDir = path.join(process.cwd(), "src", "data", "triz", "raw");
const stopWords = new Set([
  "the",
  "and",
  "for",
  "with",
  "that",
  "this",
  "what",
  "how",
  "why",
  "la",
  "là",
  "gi",
  "cua",
  "của",
  "va",
  "và",
  "trong",
  "như",
  "nao",
  "nào",
  "duoc",
  "được",
  "mot",
  "một",
  "cac",
  "các"
]);

function tokenize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .split(/[^a-z0-9]+/i)
    .filter((token) => token.length > 2 && !stopWords.has(token));
}

function makeChunk(id: string, title: string, text: string): TrizChunk {
  return {
    id,
    title,
    text,
    tokens: new Set(tokenize(`${title} ${text}`))
  };
}

function chunkText(fileName: string, text: string) {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);
  const chunks: TrizChunk[] = [];
  let buffer: string[] = [];
  let index = 0;

  for (const paragraph of paragraphs) {
    buffer.push(paragraph);
    const size = buffer.join("\n\n").length;
    if (size > 1400) {
      index += 1;
      chunks.push(makeChunk(`${fileName}-${index}`, `${fileName} #${index}`, buffer.join("\n\n")));
      buffer = [];
    }
  }

  if (buffer.length) {
    index += 1;
    chunks.push(makeChunk(`${fileName}-${index}`, `${fileName} #${index}`, buffer.join("\n\n")));
  }

  return chunks;
}

function readCorpus() {
  const files = readdirSync(rawDir).filter((file) => file.endsWith(".txt")).sort();
  const chunks: TrizChunk[] = [];

  for (const file of files) {
    const text = readFileSync(path.join(rawDir, file), "utf8");
    if (file === "answers.txt") {
      try {
        const qas = JSON.parse(text) as TrizQa[];
        qas.forEach((qa, index) => {
          chunks.push(makeChunk(`qa-${index + 1}`, qa.question_number ? `${qa.question_number} ${qa.question}` : qa.question, qa.answer));
        });
        continue;
      } catch {
        // Fall back to plain chunking if the copied source is edited later.
      }
    }

    chunks.push(...chunkText(file, text));
  }

  return chunks;
}

function getChunks() {
  cachedChunks ??= readCorpus();
  return cachedChunks;
}

function scoreChunk(queryTokens: string[], chunk: TrizChunk) {
  let score = 0;
  for (const token of queryTokens) {
    if (chunk.tokens.has(token)) score += 3;
    if (chunk.title.toLowerCase().includes(token)) score += 2;
  }
  return score;
}

function summarize(query: string, hits: TrizChunk[], locale: TrizLocale) {
  const top = hits[0];
  if (!top) {
    return locale === "vi"
      ? "Không tìm thấy ngữ cảnh phù hợp trong corpus TRIZ đã copy. Hãy thử hỏi cụ thể hơn bằng từ khóa như mâu thuẫn, nguồn dự trữ, tính lý tưởng, ARIZ hoặc sáng tạo."
      : "No matching context was found in the copied TRIZ corpus. Try a more specific keyword such as contradiction, resources, ideality, ARIZ or creativity.";
  }

  const direct = top.text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 4)
    .join("\n\n");

  return locale === "vi"
    ? `Dựa trên corpus TRIZ local, câu hỏi "${query}" liên quan nhất đến "${top.title}".\n\n${direct}`
    : `Based on the local TRIZ corpus, the question "${query}" is most related to "${top.title}".\n\n${direct}`;
}

export function answerTrizQuestion(query: string, locale: TrizLocale = "vi"): TrizAnswer {
  const queryTokens = tokenize(query);
  const chunks = getChunks();

  if (!queryTokens.length) {
    return {
      answer: locale === "vi"
        ? "Hãy nhập câu hỏi cụ thể hơn về TRIZ, PPLSTVĐM, sáng tạo, mâu thuẫn, hệ thống hoặc ARIZ."
        : "Please enter a more specific question about TRIZ, creative problem solving, contradictions, systems or ARIZ.",
      confidence: 0,
      sources: []
    };
  }

  const ranked = chunks
    .map((chunk) => ({ chunk, score: scoreChunk(queryTokens, chunk) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const bestScore = ranked[0]?.score ?? 0;
  const confidence = Math.min(0.96, Math.max(0.12, bestScore / Math.max(8, queryTokens.length * 5)));

  return {
    answer: summarize(query, ranked.map((item) => item.chunk), locale),
    confidence,
    sources: ranked.map(({ chunk, score }) => ({
      id: chunk.id,
      title: chunk.title,
      excerpt: chunk.text.slice(0, 520),
      score
    }))
  };
}

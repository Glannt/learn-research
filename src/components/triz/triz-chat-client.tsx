"use client";

import { FormEvent, useMemo, useState } from "react";
import { Bot, BrainCircuit, ExternalLink, Loader2, RotateCcw, Send, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useI18n } from "@/lib/i18n/use-i18n";

type TrizSourceHit = {
  id: string;
  title: string;
  excerpt: string;
  score: number;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  confidence?: number;
  sources?: TrizSourceHit[];
};

export function TrizChatClient() {
  const { locale, t } = useI18n();
  const examples = useMemo(
    () => [t("trizChatExample1"), t("trizChatExample2"), t("trizChatExample3")],
    [t]
  );
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: t("trizChatWelcome"),
      confidence: 0,
      sources: []
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submitQuestion(question: string) {
    const query = question.trim();
    if (!query || loading) return;

    setInput("");
    setError("");
    setLoading(true);
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", content: query }
    ]);

    try {
      const response = await fetch("/api/triz-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, locale })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = (await response.json()) as {
        answer: string;
        confidence: number;
        sources: TrizSourceHit[];
      };

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.answer,
          confidence: data.confidence,
          sources: data.sources
        }
      ]);
    } catch {
      setError(t("trizChatError"));
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: t("trizChatError"),
          confidence: 0,
          sources: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitQuestion(input);
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="grid gap-0 lg:grid-cols-[1fr_360px]">
          <div className="p-5 md:p-7">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{t("trizChatCorpusBadge")}</Badge>
              <Badge>TRIZ</Badge>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-normal">{t("trizChatTitle")}</h1>
            <p className="mt-2 max-w-3xl text-muted-foreground">{t("trizChatSubtitle")}</p>
          </div>
          <div className="border-t border-border bg-muted/40 p-5 lg:border-l lg:border-t-0">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">{t("trizChatLocalNotice")}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t("trizChatRetrievedContext")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="min-h-[620px]">
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <CardTitle>{t("navTrizChat")}</CardTitle>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                setError("");
                setMessages([{ id: "welcome", role: "assistant", content: t("trizChatWelcome"), confidence: 0, sources: [] }]);
              }}
            >
              <RotateCcw className="h-4 w-4" />
              {t("trizChatClear")}
            </Button>
          </CardHeader>
          <CardContent className="flex min-h-[520px] flex-col gap-4">
            <div className="flex-1 space-y-4 overflow-hidden">
              {messages.map((message) => (
                <ChatBubble key={message.id} message={message} />
              ))}
              {loading ? (
                <div className="flex items-center gap-2 rounded-lg border border-border bg-muted p-3 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("trizChatThinking")}
                </div>
              ) : null}
            </div>

            {error ? <p className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">{error}</p> : null}

            <form onSubmit={onSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={t("trizChatAskPlaceholder")}
                aria-label={t("trizChatAskPlaceholder")}
              />
              <Button type="submit" disabled={loading || !input.trim()} aria-label={t("trizChatSend")}>
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">{t("trizChatSend")}</span>
              </Button>
            </form>
          </CardContent>
        </Card>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("trizChatExamples")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {examples.map((example) => (
                <button
                  key={example}
                  type="button"
                  className="w-full rounded-lg border border-border bg-background p-3 text-left text-sm transition hover:bg-muted"
                  onClick={() => void submitQuestion(example)}
                >
                  {example}
                </button>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("trizChatSources")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>{t("trizChatSourceHelp")}</p>
              <p>{t("trizChatI18nNotice")}</p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const { t } = useI18n();
  const isUser = message.role === "user";
  const confidencePercent = Math.round((message.confidence ?? 0) * 100);

  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div className={`max-w-[880px] rounded-xl border border-border p-4 ${isUser ? "bg-primary text-primary-foreground" : "bg-muted/50"}`}>
        <div className="mb-2 flex items-center gap-2 text-sm font-medium">
          {isUser ? <UserRound className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
          {isUser ? t("trizChatYou") : t("trizChatAssistant")}
        </div>
        <div className="whitespace-pre-wrap text-sm leading-6">{message.content}</div>

        {!isUser && typeof message.confidence === "number" ? (
          <div className="mt-4 rounded-lg border border-border bg-background/80 p-3">
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>{t("trizChatConfidence")}</span>
              <span>{confidencePercent}%</span>
            </div>
            <Progress value={confidencePercent} />
          </div>
        ) : null}

        {!isUser && message.sources?.length ? (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">{t("trizChatSources")}</p>
            {message.sources.map((source) => (
              <div key={source.id} className="rounded-lg border border-border bg-background p-3 text-sm">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium">{source.title}</p>
                  <Badge>{t("trizChatSourceScore")}: {source.score}</Badge>
                </div>
                <p className="mt-2 line-clamp-4 text-muted-foreground">{source.excerpt}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <ExternalLink className="h-3 w-3" />
                  {source.id}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

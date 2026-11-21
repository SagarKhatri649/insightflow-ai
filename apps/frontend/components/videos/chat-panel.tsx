"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ChevronDown,
  MessageCircle,
  Loader2,
  SendHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/sonner";
import {
  askTranscriptQuestionAction,
  getChatMessagesAction,
  getSuggestedAnswerAction,
} from "@/actions/chat-actions";

type ChatPanelProps = {
  workspaceItemId: string;
  /** Whether a transcript exists — chat is only possible with one. */
  hasTranscript: boolean;
};

/**
 * Mirrors the client-safe shape returned by the chat server actions.
 */
type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

/** Per-card lifecycle for a suggested question's expandable answer. */
type SuggestedAnswerState = {
  status: "idle" | "loading" | "ready" | "error";
  answer?: string;
  message?: string;
};

/**
 * Static starter questions shown when a conversation is empty. These are
 * generic on purpose — the client never sees transcript content, so no
 * per-video suggestion generation happens here.
 */
const SUGGESTED_QUESTIONS = [
  "Summarize the main points",
  "What are the key takeaways?",
  "Who is mentioned and in what context?",
  "What actions or next steps are discussed?",
];

/**
 * Renders one chat message as plain text with preserved line breaks. No
 * dangerouslySetInnerHTML — AI output is never treated as HTML.
 */
function ChatMessageBody({ message }: { message: ChatMessage }) {
  return (
    <div className="whitespace-pre-wrap break-words text-sm leading-7 sm:text-base">
      {message.content}
    </div>
  );
}

export default function ChatPanel({
  workspaceItemId,
  hasTranscript,
}: ChatPanelProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState("");
  const [isLoadingHistory, setIsLoadingHistory] = useState(hasTranscript);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [unsavedNotice, setUnsavedNotice] = useState<string | null>(null);
  const [suggestedAnswers, setSuggestedAnswers] = useState<
    Record<string, SuggestedAnswerState>
  >({});
  const [expandedSuggestions, setExpandedSuggestions] = useState<
    Record<string, boolean>
  >({});
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const questionInputRef = useRef<HTMLTextAreaElement | null>(null);

  // Load persisted history once on mount. Skipped entirely when the video has
  // no transcript yet — chat is unavailable in that state.
  useEffect(() => {
    if (!hasTranscript) return;

    let cancelled = false;
    setIsLoadingHistory(true);
    setLoadError(null);
    const loadHistory = async () => {
      try {
        const result = await getChatMessagesAction({ workspaceItemId });

        if (cancelled) return;

        if (result.success) {
          setMessages(result.messages);
        } else {
          setLoadError(result.message);
          toast.error(result.message);
        }
      } catch (caught) {
        console.error("Failed to load chat history:", caught);
        if (cancelled) return;
        const message = "Failed to load chat history. Please try again.";
        setLoadError(message);
        toast.error(message);
      } finally {
        if (!cancelled) setIsLoadingHistory(false);
      }
    };

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, [hasTranscript, workspaceItemId, reloadKey, toast]);

  // Keep the newest message visible.
  useEffect(() => {
    const node = scrollRef.current;
    if (node) {
      node.scrollTop = node.scrollHeight;
    }
  }, [messages, isSubmitting]);

  const canSubmit =
    hasTranscript &&
    !isLoadingHistory &&
    !isSubmitting &&
    question.trim().length > 0;

  /**
   * Core submission path shared by the composer and the suggested-question
   * buttons. `handleSubmit` delegates to it with the current composer text;
   * suggestions call it directly with their own text.
   */
  const submitQuestion = async (text: string) => {
    // Duplicate-submission guard alongside the disabled button.
    if (isSubmitting) return;

    const trimmed = text.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setUnsavedNotice(null);

    try {
      const result = await askTranscriptQuestionAction({
        workspaceItemId,
        question: trimmed,
      });

      if (result.success) {
        setMessages((previous) => [
          ...previous,
          result.question,
          result.answer,
        ]);
        setQuestion("");
        if (!result.persisted) {
          setUnsavedNotice(
            "This reply was generated but could not be saved — it may disappear after reloading the page.",
          );
          toast.warning("Reply generated, but it could not be saved.");
        }
      } else {
        // Keep the question text in the composer so the user can retry.
        setSubmitError(result.message);
        // If the question came from a suggestion (composer empty), place it
        // in the composer so the retry affordance stays accurate.
        setQuestion((current) => (current.trim() ? current : trimmed));
        toast.error(result.message);
      }
    } catch (caught) {
      // Server actions can still throw on network/serialization errors.
      console.error("Failed to submit chat question:", caught);
      const message = "Failed to send your question. Please try again.";
      setSubmitError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = () => submitQuestion(question);

  /**
   * Generates one suggested question's answer on demand. Cards are fully
   * independent: state is keyed by the exact question text, so generating or
   * retrying one card never touches another card's cached answer, and the
   * composer's custom-chat flow is unaffected.
   */
  const generateSuggestedAnswer = async (question: string) => {
    if (suggestedAnswers[question]?.status === "loading") return;

    setSuggestedAnswers((previous) => ({
      ...previous,
      [question]: { status: "loading" },
    }));

    try {
      const result = await getSuggestedAnswerAction({
        workspaceItemId,
        question,
      });

      if (result.success) {
        // Only successful answers are cached; failures stay retryable.
        setSuggestedAnswers((previous) => ({
          ...previous,
          [question]: { status: "ready", answer: result.answer },
        }));
      } else {
        setSuggestedAnswers((previous) => ({
          ...previous,
          [question]: { status: "error", message: result.message },
        }));
      }
    } catch (caught) {
      console.error("Failed to generate suggested answer:", caught);
      setSuggestedAnswers((previous) => ({
        ...previous,
        [question]: {
          status: "error",
          message: "Failed to generate an answer. Please try again.",
        },
      }));
    }
  };

  const toggleSuggested = (question: string) => {
    const willExpand = !expandedSuggestions[question];
    setExpandedSuggestions((previous) => ({
      ...previous,
      [question]: willExpand,
    }));

    // First expansion triggers generation; later expansions read from cache.
    if (willExpand && suggestedAnswers[question]?.status !== "ready") {
      generateSuggestedAnswer(question);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      if (canSubmit) {
        handleSubmit();
      }
    }
  };

  return (
    <section
      aria-labelledby="chat-transcript-heading"
      className="rounded-xl border border-[#dee1e6] bg-white p-5 shadow-sm sm:p-7"
    >
      {/* Header: title and capability note */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#dee1e6] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ecfdf5] text-[#064e3b]">
            <MessageCircle
              aria-hidden="true"
              className="h-4 w-4 text-[#064e3b]"
            />
          </div>
          <h2
            id="chat-transcript-heading"
            className="font-heading text-base font-bold text-[#064e3b] sm:text-lg"
          >
            Chat with Transcript
          </h2>
        </div>
      </div>

      {!hasTranscript ? (
        <div className="rounded-lg bg-[#f8faf9] p-5 text-sm leading-6 text-[#5f6368] sm:p-6">
          <p>
            Chat becomes available once transcription is complete. Check back
            after the transcript is ready.
          </p>
        </div>
      ) : (
        <>
          {/* Conversation area */}
          <div
            ref={scrollRef}
            role="log"
            aria-label="Chat conversation"
            aria-live="polite"
            aria-relevant="additions"
            aria-busy={isLoadingHistory || isSubmitting}
            tabIndex={0}
            className="max-h-[min(60vh,32rem)] overflow-y-auto rounded-lg border border-[#dee1e6]/60 bg-[#f8faf9] p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#064e3b] focus-visible:ring-offset-2 sm:p-5"
          >
            {isLoadingHistory ? (
              <p className="flex items-center gap-2 text-sm text-[#5f6368]">
                <Loader2
                  aria-hidden="true"
                  className="h-3.5 w-3.5 shrink-0 animate-spin text-[#064e3b]"
                />
                Loading your conversation…
              </p>
            ) : loadError ? (
              <div className="flex flex-col gap-2 text-sm text-[#5f6368]">
                <p role="alert" className="flex items-start gap-2">
                  <AlertCircle
                    aria-hidden="true"
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-600"
                  />
                  {loadError}
                </p>
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    aria-label="Retry loading chat history"
                    onClick={() => {
                      setLoadError(null);
                      setReloadKey((key) => key + 1);
                      // The retry button unmounts while history reloads; keep
                      // keyboard focus on the stable conversation log.
                      requestAnimationFrame(() => scrollRef.current?.focus());
                    }}
                    className="h-9 rounded-lg border-[#dee1e6] bg-white px-3.5 font-heading text-xs font-semibold text-[#064e3b] shadow-2xs hover:border-[#064e3b] hover:bg-[#ecfdf5] focus-visible:ring-2 focus-visible:ring-[#064e3b] focus-visible:ring-offset-2"
                  >
                    Try again
                  </Button>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <p className="text-sm leading-6 text-[#5f6368]">
                No questions yet. Ask anything about this video&apos;s
                transcript — answers are based only on what was said in the
                video.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {messages.map((message, index) =>
                  message.role === "user" ? (
                    <div key={index} className="flex justify-end">
                      <div className="max-w-[85%] rounded-lg rounded-br-sm bg-[#ecfdf5] px-3.5 py-2.5 text-[#064e3b] shadow-2xs sm:max-w-[75%]">
                        <ChatMessageBody message={message} />
                      </div>
                    </div>
                  ) : (
                    <div
                      key={index}
                      className="max-w-full rounded-lg rounded-bl-sm border border-[#dee1e6]/60 bg-white px-3.5 py-2.5 text-[#3c4043] shadow-2xs"
                    >
                      <ChatMessageBody message={message} />
                    </div>
                  ),
                )}
                {isSubmitting && (
                  <div className="flex items-center gap-2 px-1 text-sm text-[#5f6368]">
                    <Loader2
                      aria-hidden="true"
                      className="h-3.5 w-3.5 shrink-0 animate-spin text-[#064e3b]"
                    />
                    Thinking about your question…
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Suggested questions: permanent expandable cards, independent of
              the conversation and the composer. */}
          {hasTranscript && !isLoadingHistory && !loadError && (
            <div className="mt-3">
              <h3 className="mb-2 font-heading text-sm font-semibold text-[#064e3b]">
                Suggested questions
              </h3>
              <div className="flex flex-col gap-2">
                {SUGGESTED_QUESTIONS.map((suggestion, index) => {
                  const state = suggestedAnswers[suggestion] ?? {
                    status: "idle" as const,
                  };
                  const expanded = Boolean(expandedSuggestions[suggestion]);
                  const bodyId = `suggested-answer-${index}`;
                  const suggestionAnnouncement =
                    state.status === "loading"
                      ? `Generating an answer for "${suggestion}".`
                      : state.status === "ready"
                        ? `Answer ready for "${suggestion}".`
                        : "";
                  return (
                    <div
                      key={suggestion}
                      className="rounded-lg border border-[#dee1e6] bg-white shadow-2xs"
                    >
                      <span
                        role="status"
                        aria-live="polite"
                        aria-atomic="true"
                        className="sr-only"
                      >
                        {suggestionAnnouncement}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleSuggested(suggestion)}
                        aria-expanded={expanded}
                        aria-controls={bodyId}
                        className="flex w-full items-center justify-between gap-3 rounded-lg bg-white px-3.5 py-2.5 text-left text-sm font-semibold text-[#064e3b] transition-colors hover:bg-[#ecfdf5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#064e3b] focus-visible:ring-offset-2"
                      >
                        <span>{suggestion}</span>
                        <ChevronDown
                          aria-hidden="true"
                          className={`h-4 w-4 shrink-0 text-[#064e3b] transition-transform ${
                            expanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <div
                        id={bodyId}
                        hidden={!expanded}
                        aria-busy={state.status === "loading"}
                        className="rounded-b-lg border-t border-[#dee1e6]/60 bg-[#f8faf9] px-3.5 py-3"
                      >
                        {state.status === "loading" ? (
                          <p className="flex items-center gap-2 text-sm text-[#5f6368]">
                            <Loader2
                              aria-hidden="true"
                              className="h-3.5 w-3.5 shrink-0 animate-spin text-[#064e3b]"
                            />
                            Generating answer…
                          </p>
                        ) : state.status === "error" ? (
                          <div className="flex flex-col gap-2 text-sm text-[#5f6368]">
                            <p role="alert" className="flex items-start gap-2">
                              <AlertCircle
                                aria-hidden="true"
                                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-600"
                              />
                              {state.message}
                            </p>
                            <div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                aria-label={`Retry suggested answer for "${suggestion}"`}
                                onClick={() =>
                                  generateSuggestedAnswer(suggestion)
                                }
                                className="h-9 rounded-lg border-[#dee1e6] bg-white px-3.5 font-heading text-xs font-semibold text-[#064e3b] shadow-2xs hover:border-[#064e3b] hover:bg-[#ecfdf5] focus-visible:ring-2 focus-visible:ring-[#064e3b] focus-visible:ring-offset-2"
                              >
                                Try again
                              </Button>
                            </div>
                          </div>
                        ) : state.status === "ready" ? (
                          <div className="whitespace-pre-wrap break-words text-sm leading-7 text-[#3c4043] sm:text-base">
                            {state.answer}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Unsaved-answer notice (non-blocking) */}
          {unsavedNotice && (
            <p className="mt-3 rounded-lg bg-[#fefce8] px-3 py-2 text-sm leading-6 text-[#854d0e]">
              {unsavedNotice}
            </p>
          )}

          {/* Submission error with preserved question for retry */}
          {submitError && (
            <p
              role="alert"
              className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm leading-6 text-red-700"
            >
              <AlertCircle
                aria-hidden="true"
                className="mt-0.5 h-3.5 w-3.5 shrink-0"
              />
              <span>
                {submitError} Your question was kept below so you can try again.
              </span>
            </p>
          )}

          {/* Composer */}
          <div className="mt-4 flex flex-col gap-2">
            <label htmlFor="chat-question-input" className="sr-only">
              Ask a question about the transcript
            </label>
            <textarea
              id="chat-question-input"
              ref={questionInputRef}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about the transcript…"
              rows={3}
              disabled={isSubmitting}
              className="w-full resize-none rounded-lg border border-[#dee1e6] bg-white px-3 py-2 text-sm text-[#202124] shadow-sm transition-[border-color,box-shadow] outline-none placeholder:text-[#9aa0a6] focus-visible:border-[#064e3b] focus-visible:ring-2 focus-visible:ring-[#064e3b] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
            />
            <div className="flex items-center justify-between gap-3">
              <p className="hidden text-xs text-[#5f6368] sm:block">
                Press Enter to send, Shift + Enter for a new line. Answers come
                from the transcript only.
              </p>
              <Button
                type="button"
                size="sm"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="ml-auto h-9 rounded-lg bg-[#064e3b] px-3.5 font-heading text-xs font-semibold text-white shadow-sm hover:bg-[#04382b] focus-visible:ring-2 focus-visible:ring-[#064e3b] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2
                    aria-hidden="true"
                    className="h-3.5 w-3.5 animate-spin"
                  />
                ) : (
                  <SendHorizontal aria-hidden="true" className="h-3.5 w-3.5" />
                )}
                {isSubmitting ? "Sending…" : "Send"}
              </Button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

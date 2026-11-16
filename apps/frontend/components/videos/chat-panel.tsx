"use client";

import { useEffect, useRef, useState } from "react";
import {
  MessageCircle,
  Loader2,
  SendHorizontal,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/sonner";
import {
  askTranscriptQuestionAction,
  getChatMessagesAction,
} from "@/actions/chat-actions";

type ChatPanelProps = {
  workspaceItemId: string;
  /** Whether a transcript exists — chat is only possible with one. */
  hasTranscript: boolean;
};

/** Mirrors the client-safe shape returned by the chat server actions. */
type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

/**
 * Renders one chat message as plain text with preserved line breaks. No
 * dangerouslySetInnerHTML — AI output is never treated as HTML.
 */
function ChatMessageBody({ message }: { message: ChatMessage }) {
  return (
    <div className="whitespace-pre-wrap break-words text-sm leading-relaxed sm:text-sm">
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
  const scrollRef = useRef<HTMLDivElement | null>(null);

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

  const handleSubmit = async () => {
    // Duplicate-submission guard alongside the disabled button.
    if (isSubmitting) return;

    const trimmed = question.trim();
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (canSubmit) {
        handleSubmit();
      }
    }
  };

  return (
    <section
      aria-labelledby="chat-transcript-heading"
      className="rounded-xl border border-[#dee1e6] bg-white p-5 shadow-xs sm:p-7"
    >
      {/* Header: title and capability note */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#dee1e6] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ecfdf5] text-[#064e3b]">
            <MessageCircle className="h-4 w-4 text-[#064e3b]" />
          </div>
          <h2
            id="chat-transcript-heading"
            className="text-base font-bold text-[#064e3b] sm:text-lg"
          >
            Chat with Transcript
          </h2>
        </div>
      </div>

      {!hasTranscript ? (
        <div className="rounded-lg bg-[#f8faf9] p-5 text-xs text-[#5f6368] sm:p-6">
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
            className="max-h-[min(60vh,32rem)] overflow-y-auto rounded-lg border border-[#dee1e6]/60 bg-[#f8faf9] p-4 sm:p-5"
          >
            {isLoadingHistory ? (
              <p className="flex items-center gap-2 text-xs text-[#5f6368]">
                <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-[#064e3b]" />
                Loading your conversation…
              </p>
            ) : loadError ? (
              <div className="flex flex-col gap-2 text-xs text-[#5f6368]">
                <p className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-600" />
                  {loadError}
                </p>
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setLoadError(null);
                      setReloadKey((key) => key + 1);
                    }}
                    className="border-[#dee1e6] bg-white text-xs font-semibold text-[#064e3b] shadow-2xs hover:bg-[#ecfdf5]"
                  >
                    Try again
                  </Button>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <p className="text-xs text-[#5f6368]">
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
                  <div className="flex items-center gap-2 px-1 text-xs text-[#5f6368]">
                    <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-[#064e3b]" />
                    Thinking about your question…
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Unsaved-answer notice (non-blocking) */}
          {unsavedNotice && (
            <p className="mt-3 rounded-lg bg-[#fefce8] px-3 py-2 text-xs text-[#854d0e]">
              {unsavedNotice}
            </p>
          )}

          {/* Submission error with preserved question for retry */}
          {submitError && (
            <p className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
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
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about the transcript…"
              rows={3}
              disabled={isSubmitting}
              className="w-full resize-none rounded-md border border-[#dee1e6] bg-white px-3 py-2 text-sm text-[#202124] shadow-xs transition-[border-color,box-shadow] outline-none placeholder:text-[#9aa0a6] focus-visible:border-[#10b981] focus-visible:ring-[3px] focus-visible:ring-[#10b981]/50 disabled:cursor-not-allowed disabled:opacity-50"
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
                className="ml-auto bg-[#064e3b] text-xs font-semibold text-white hover:bg-[#04382b] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <SendHorizontal className="h-3.5 w-3.5" />
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

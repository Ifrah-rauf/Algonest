import { apiUrl } from "../config/api.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import aiIcon from "../static/ai_icon.jpg";
import "../styles/chatbox.css";

const AI_HISTORY_URL = apiUrl("/api/ai/history");
const AI_MESSAGE_URL = apiUrl("/api/ai/handleAi");
const noop = () => {};

function renderInlineMarkdown(text, keyPrefix) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${keyPrefix}-bold-${index}`}>{part.slice(2, -2)}</strong>;
    }

    return <span key={`${keyPrefix}-text-${index}`}>{part}</span>;
  });
}

function renderMessageContent(content, messageIndex) {
  return content.split("\n").map((line, lineIndex) => {
    const trimmedLine = line.trim();
    const isBullet = trimmedLine.startsWith("- ");
    const lineContent = isBullet ? trimmedLine.slice(2) : line;

    return (
      <div
        key={`msg-${messageIndex}-line-${lineIndex}`}
        className={`chatbox-line ${isBullet ? "chatbox-line-bullet" : ""}`}
      >
        {renderInlineMarkdown(lineContent, `msg-${messageIndex}-line-${lineIndex}`)}
      </div>
    );
  });
}

function LoadingState() {
  return (
    <div className="chatbox flex min-h-[420px] items-center justify-center">
      <span className="font-mono text-[11px] text-[#9991b8]">Loading conversation...</span>
    </div>
  );
}

function AssistantIcon({ size = "sm" }) {
  return (
    <span className={`chatbox-ai-avatar ${size === "lg" ? "chatbox-ai-avatar-lg" : ""}`}>
      <img src={aiIcon} alt="" aria-hidden="true" className="chatbox-ai-avatar-img" />
    </span>
  );
}

function getInitials(name) {
  const normalizedName = String(name || "")
    .trim()
    .replace(/^@/, "");

  if (!normalizedName) return "ST";

  const nameBeforeEmailDomain = normalizedName.split("@")[0];
  const parts = nameBeforeEmailDomain
    .split(/[\s._-]+/)
    .filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return parts[0]?.slice(0, 2).toUpperCase() || "ST";
}

function ChatAvatar({ role, initials = "ST" }) {
  const isUser = role === "user";

  return (
    <div
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-mono text-[11px] font-bold ${
        isUser ? "bg-[#f6c90e] text-[#78350f]" : "chatbox-ai-avatar-shell"
      }`}
    >
      {isUser ? initials : <AssistantIcon />}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-2">
      <ChatAvatar role="assistant" />
      <div className="rounded-br-xl rounded-tr-xl rounded-bl-xl border border-[#e8e4f0] bg-[#f5f4fa] px-3.5 py-2.5">
        <div className="flex items-center gap-1">
          <span className="chatbox-dot" />
          <span className="chatbox-dot" />
          <span className="chatbox-dot" />
        </div>
      </div>
    </div>
  );
}

function LockedPreview({ lockedDescription }) {
  return (
    <div className="rounded-2xl border border-[#fde68a] bg-gradient-to-b from-[#fffdf5] to-white p-4 shadow-[0_8px_24px_rgba(246,201,14,0.12)]">
      <div className="flex flex-col gap-2.5">
        <div className="flex justify-end">
          <div className="max-w-[84%] rounded-bl-xl rounded-br-xl rounded-tl-xl rounded-tr border border-[#fde68a] bg-[#fffbeb] px-3 py-2.5 text-xs leading-relaxed text-[#78350f]">
            I wrote `POST /jobs`, but `req.body` is undefined. What should I inspect first?
          </div>
        </div>
        <div className="flex justify-start">
          <div className="max-w-[88%] rounded-bl rounded-br-xl rounded-tl rounded-tr-xl border border-[#e8e4f0] bg-[#f5f4fa] px-3 py-2.5 text-xs leading-relaxed text-[#1a1035]">
            <div>
              <strong>Good debugging question.</strong> First check whether JSON parsing middleware is mounted before the route.
            </div>
            <div className="mt-1.5">- Is `app.use(express.json())` present?</div>
            <div>- Does it run before `app.post('/jobs', ...)`?</div>
            <div>- What does `console.log(req.headers['content-type'])` show?</div>
          </div>
        </div>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-[#5c5478]">{lockedDescription}</p>
    </div>
  );
}

function Header({ contextTags }) {
  return (
    <header className="shrink-0 border-b border-[#f0ecfc] bg-[#faf9ff] px-4 py-3.5 sm:px-5">
      <div className="flex items-center gap-2.5">
        <div className="chatbox-ai-avatar-shell chatbox-ai-avatar-shell-lg">
          <AssistantIcon size="lg" />
        </div>
        <div className="min-w-0">
          <h2 className="text-[13px] font-bold text-[#1a1035]">AI Build Companion</h2>
          <p className="font-mono text-[10px] text-[#9991b8]">scaffolds thinking - never writes code for you</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 rounded-full border border-white bg-white px-2.5 py-1 font-mono text-[10px] text-[#00412c]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Online
        </div>
      </div>

      {contextTags.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {contextTags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-[#d8d0f0] bg-[#f0ecfc] px-2 py-1 font-mono text-[9px] font-semibold text-[#6b46c1]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}

export default function ChatBox({
  studentName = "",
  systemPrompt,
  contextTags = [],
  initialMessage = "Hey - I'm your Build Companion...",
  pendingMessage = "",
  onPendingConsumed = noop,
  lessonId = null,
  courseId = null,
  isLocked = false,
  lockedTitle = "AI Build Companion is locked",
  lockedDescription = "Start a plan to unlock guided debugging, mentor-style prompts, and project-specific help as you build.",
  lockedCtaHref = "/#pricing",
  lockedCtaOnClick = null,
  lockedCtaLabel = "see plans",
  lockedFooter = "Locked: to create project, see plans",
  onUserMessageSent = noop,
}) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    async function loadHistory() {
      if (isLocked) {
        setHistoryLoading(false);
        return;
      }

      if (!user?.uid) {
        setMessages([{ role: "assistant", content: initialMessage }]);
        setHistoryLoading(false);
        return;
      }

      try {
        const res = await fetch(AI_HISTORY_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.uid }),
        });
        const data = await res.json();

        if (data.history?.length > 0) {
          setMessages(data.history.map((message) => ({ role: message.role, content: message.content })));
        } else {
          setMessages([{ role: "assistant", content: initialMessage }]);
        }
      } catch {
        setMessages([{ role: "assistant", content: initialMessage }]);
      } finally {
        setHistoryLoading(false);
      }
    }

    loadHistory();
  }, [initialMessage, isLocked, user?.uid]);

  const sendDirectMessage = useCallback(
    async (text) => {
      const cleanText = text.trim();
      if (!cleanText || loading || isLocked) return;

      const userMsg = { role: "user", content: cleanText };
      setMessages((prev) => [...prev, userMsg]);

      setLoading(true);

      try {
        const res = await fetch(AI_MESSAGE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: user?.uid,
            message: userMsg.content,
            systemPrompt,
            lessonId,
            courseId,
            history: [],
          }),
        });
        const data = await res.json();

        try {
          onUserMessageSent({
            ok: res.ok,
            status: res.status,
            reason: data?.reason || null,
          });
        } catch {
          // Optional parent callbacks should not block the chat request.
        }

        if (!res.ok) {
          throw new Error(data?.error || data?.message || "AI request failed.");
        }

        setMessages((prev) => [...prev, { role: "assistant", content: data.reply || "Sorry, couldn't respond." }]);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: error?.message || "Connection issue - try again." },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [courseId, isLocked, lessonId, loading, onUserMessageSent, systemPrompt, user?.uid]
  );

  const sendMessage = useCallback(
    async (event) => {
      event?.preventDefault();
      const cleanInput = input.trim();
      if (!cleanInput || loading || isLocked) return;

      setInput("");
      await sendDirectMessage(cleanInput);
    },
    [input, isLocked, loading, sendDirectMessage]
  );

  useEffect(() => {
    if (historyLoading || loading || isLocked || !pendingMessage.trim()) return;

    const text = pendingMessage.trim();
    onPendingConsumed();
    sendDirectMessage(text);
  }, [historyLoading, isLocked, loading, onPendingConsumed, pendingMessage, sendDirectMessage]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (historyLoading) {
    return <LoadingState />;
  }

  const canSend = Boolean(input.trim()) && !loading && !isLocked;
  const userInitials = getInitials(studentName || user?.username || user?.email || "Student");

  return (
    <section className="chatbox flex shrink-0 flex-col">
      <Header contextTags={contextTags} />

      <div className="chatbox-scroll flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4 sm:px-[18px]">
        {isLocked && <LockedPreview lockedDescription={lockedDescription} />}

        {!isLocked &&
          messages.map((msg, index) => {
            const isUser = msg.role === "user";

            return (
              <div key={`${msg.role}-${index}`} className={`flex items-start gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
                <ChatAvatar role={msg.role} initials={userInitials} />
                <div
                  className={`max-w-[82%] rounded-xl px-3 py-2.5 text-xs leading-relaxed text-[#1a1035] sm:max-w-[78%] ${
                    isUser
                      ? "rounded-tr border border-[#fde68a] bg-[#fffbeb]"
                      : "rounded-tl border border-[#e8e4f0] bg-[#f5f4fa]"
                  }`}
                >
                  {renderMessageContent(msg.content, index)}
                </div>
              </div>
            );
          })}

        {!isLocked && loading && <TypingIndicator />}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={sendMessage} className="shrink-0 border-t border-[#f0ecfc] bg-[#faf9ff] px-4 py-3">
        <div className="flex items-end gap-2">
          <label htmlFor="ai-companion-message" className="sr-only">
            Ask AI Build Companion
          </label>
          <textarea
            id="ai-companion-message"
            name="aiCompanionMessage"
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
              }
            }}
            placeholder={isLocked ? `${lockedTitle} - Preview Conversation` : "Ask anything about your roadmap or project..."}
            rows={2}
            disabled={isLocked}
            className="min-h-[44px] flex-1 resize-none rounded-[10px] border-[1.5px] border-[#e8e4f0] bg-white px-3 py-2.5 text-xs leading-normal text-[#1a1035] shadow-[0_1px_4px_rgba(107,70,193,0.06)] outline-none transition focus:border-[#6b46c1] disabled:bg-[#f8f7fb] disabled:opacity-80"
          />
          <button
            type="submit"
            disabled={!canSend}
            className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] text-base transition ${
              canSend
                ? "chatbox-gradient cursor-pointer text-white shadow-[0_2px_8px_rgba(107,70,193,0.3)]"
                : "cursor-not-allowed bg-[#e8e4f0] text-[#aaa]"
            }`}
            aria-label="Send message"
          >
            <ArrowUp className="h-5 w-5" strokeWidth={2.8} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-1.5 text-center font-mono text-[10px] text-[#c0b8d8]">
          {isLocked ? (
            <>
              {lockedFooter} -{" "}
              {lockedCtaOnClick ? (
                <button
                  onClick={lockedCtaOnClick}
                  type="button"
                  className="bg-transparent p-0 font-[inherit] text-[#6b46c1] underline"
                >
                  {lockedCtaLabel}
                </button>
              ) : (
                <a href={lockedCtaHref} className="text-[#6b46c1] underline">
                  {lockedCtaLabel}
                </a>
              )}
            </>
          ) : (
            <>Enter to send - Shift+Enter for new line - Click "Ask AI" on any lesson</>
          )}
        </div>
      </form>
    </section>
  );
}

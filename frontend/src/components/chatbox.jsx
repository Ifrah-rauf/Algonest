import { useState, useRef, useEffect } from "react";
import {useAuth,LoadingContext} from "../context/AuthContext"

function renderInlineMarkdown(text, keyPrefix) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${keyPrefix}-bold-${index}`}>
          {part.slice(2, -2)}
        </strong>
      );
    }

    return <span key={`${keyPrefix}-text-${index}`}>{part}</span>;
  });
}

function renderMessageContent(content, messageIndex) {
  const lines = content.split("\n");

  return lines.map((line, lineIndex) => {
    const trimmedLine = line.trim();
    const isBullet = trimmedLine.startsWith("- ");

    return (
      <div
        key={`msg-${messageIndex}-line-${lineIndex}`}
        style={{
          marginTop: lineIndex === 0 ? 0 : 6,
          paddingLeft: isBullet ? 14 : 0,
          position: "relative",
        }}
      >
        {isBullet && (
          <span style={{ position: "absolute", left: 0, top: 0 }}>
            •
          </span>
        )}
        {renderInlineMarkdown(
          isBullet ? trimmedLine.slice(2) : line,
          `msg-${messageIndex}-line-${lineIndex}`
        )}
      </div>
    );
  });
}

export default function ChatBox({
  systemPrompt,
  contextTags = [],
  initialMessage = "Hey — I'm your Build Companion...",
  pendingMessage = "",
  onPendingConsumed = () => {},
  lessonId = null,   // ← add this prop
  isLocked = false,
  lockedTitle = "AI Build Companion is locked",
  lockedDescription = "Start a plan to unlock guided debugging, mentor-style prompts, and project-specific help as you build.",
  lockedCtaHref = "/#pricing",
  lockedFooter = "Locked: to create project, see plans",
}) {
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const chatEndRef = useRef(null);
  const inputRef   = useRef(null);

  // ── Load history from DB on mount ─────────────────────────────────────
  useEffect(() => {
    async function loadHistory() {
      if (!user?.uid) {
        setMessages([{ role: "assistant", content: initialMessage }]);
        setHistoryLoading(false);
        return;
      }

      try {
        const res  = await fetch("http://localhost:5000/api/ai/history", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ uid: user?.uid }),
        });
        const data = await res.json();

        if (data.history?.length > 0) {
          // Map DB format { role, content } to component format
          setMessages(data.history.map(m => ({
            role:    m.role,
            content: m.content,
          })));
        } else {
          // First ever session — show the greeting
          setMessages([{ role: "assistant", content: initialMessage }]);
        }
      } catch {
        setMessages([{ role: "assistant", content: initialMessage }]);
      } finally {
        setHistoryLoading(false);
      }
    }

    loadHistory();
  }, [initialMessage, user?.uid]);

  async function sendDirectMessage(text) {
    if (!text.trim() || loading || isLocked) return;

    const userMsg = { role: "user", content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/ai/handleAi", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          uid:          user?.uid,
          message:      userMsg.content,
          systemPrompt,
          lessonId,     // ← pass current lesson to backend
          history:      [],   // DB handles history now
        }),
      });

      const data = await res.json();
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: data.reply || "Sorry, couldn't respond." },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Connection issue — try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // ── Send message ───────────────────────────────────────────────────────
  async function sendMessage(e) {
    e?.preventDefault();
    if (!input.trim() || loading || isLocked) return;

    const text = input.trim();
    setInput("");
    await sendDirectMessage(text);
  }

  useEffect(() => {
    if (historyLoading || loading || isLocked || !pendingMessage.trim()) return;

    const text = pendingMessage.trim();
    onPendingConsumed();
    sendDirectMessage(text);
  }, [pendingMessage, historyLoading, loading]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // show skeleton while history loads
  if (historyLoading) {
    return (
      <div style={{ width: "40%", borderLeft: "1px solid #e8e4f0", display: "flex",
        alignItems: "center", justifyContent: "center", background: "#fff" }}>
        <span style={{ fontSize: 11, fontFamily: "monospace", color: "#9991b8" }}>
          Loading conversation...
        </span>
      </div>
    );
  }
  return (
    <div style={{
      width: "40%", borderLeft: "1px solid #e8e4f0",
      display: "flex", flexDirection: "column",
      background: "#fff", flexShrink: 0,
    }}>
      {/* ── Header ── */}
      <div style={{
        padding: "16px 20px 14px", borderBottom: "1px solid #f0ecfc",
        background: "#faf9ff", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #6b46c1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
          }}>🤖</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1035" }}>AI Build Companion</div>
            <div style={{ fontSize: 10, fontFamily: "monospace", color: "#9991b8" }}>
              scaffolds thinking · never writes code for you
            </div>
          </div>
          <div style={{
            marginLeft: "auto", display: "flex", alignItems: "center", gap: 5,
            fontSize: 10, fontFamily: "monospace", color: "#059669",
            background: "#d1fae5", border: "1px solid #a7f3d0",
            borderRadius: 20, padding: "3px 10px",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
            Online
          </div>
        </div>

        {/* Context chips */}
        {contextTags.length > 0 && (
          <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
            {contextTags.map(tag => (
              <span key={tag} style={{
                fontSize: 9, fontFamily: "monospace",
                background: "#f0ecfc", color: "#6b46c1",
                border: "1px solid #d8d0f0", borderRadius: 6,
                padding: "3px 8px", fontWeight: 600,
              }}>{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* ── Messages ── */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "16px 18px",
        display: "flex", flexDirection: "column", gap: 12,
      }}>
        {isLocked && (
          <div style={{
            background: "linear-gradient(180deg, #fffdf5 0%, #ffffff 100%)",
            border: "1px solid #fde68a",
            borderRadius: 16,
            padding: "16px 16px 14px",
            boxShadow: "0 8px 24px rgba(246, 201, 14, 0.12)",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{
                  maxWidth: "84%",
                  padding: "10px 12px",
                  borderRadius: "12px 4px 12px 12px",
                  background: "#fffbeb",
                  border: "1px solid #fde68a",
                  fontSize: 12,
                  color: "#78350f",
                  lineHeight: 1.6,
                }}>
                  I wrote `POST /jobs`, but `req.body` is undefined. What should I inspect first?
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{
                  maxWidth: "88%",
                  padding: "10px 12px",
                  borderRadius: "4px 12px 12px 12px",
                  background: "#f5f4fa",
                  border: "1px solid #e8e4f0",
                  fontSize: 12,
                  color: "#1a1035",
                  lineHeight: 1.7,
                }}>
                  <div><strong>Good debugging question.</strong> First check whether JSON parsing middleware is mounted before the route.</div>
                  <div style={{ marginTop: 6 }}>- Is `app.use(express.json())` present?</div>
                  <div>- Does it run before `app.post('/jobs', ...)`?</div>
                  <div>- What does `console.log(req.headers['content-type'])` show?</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 12, fontSize: 11, color: "#5c5478", lineHeight: 1.6 }}>
              {lockedDescription}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex", gap: 8, alignItems: "flex-start",
            flexDirection: msg.role === "user" ? "row-reverse" : "row",
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, fontFamily: "monospace",
              background: msg.role === "user"
                ? "#f6c90e"
                : "linear-gradient(135deg, #6b46c1, #8b5cf6)",
              color: msg.role === "user" ? "#78350f" : "#fff",
            }}>
              {msg.role === "user" ? "IR" : "🤖"}
            </div>
            <div style={{
              maxWidth: "78%", padding: "10px 13px",
              borderRadius: msg.role === "user"
                ? "12px 4px 12px 12px"
                : "4px 12px 12px 12px",
              background: msg.role === "user" ? "#fffbeb" : "#f5f4fa",
              border: msg.role === "user" ? "1px solid #fde68a" : "1px solid #e8e4f0",
              fontSize: 12, color: "#1a1035", lineHeight: 1.65,
            }}>
              {renderMessageContent(msg.content, i)}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: "linear-gradient(135deg, #6b46c1, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
            }}>🤖</div>
            <div style={{
              padding: "10px 14px", borderRadius: "4px 12px 12px 12px",
              background: "#f5f4fa", border: "1px solid #e8e4f0",
            }}>
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 6, height: 6, borderRadius: "50%", background: "#9991b8",
                    animation: `pulse 1.2s ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* ── Input ── */}
      <div style={{
        padding: "12px 16px", borderTop: "1px solid #f0ecfc",
        background: "#faf9ff", flexShrink: 0,
      }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder={isLocked ? `${lockedTitle} · Preview Conversation` : "Ask anything about your roadmap or project…"}
            rows={2}
            disabled={isLocked}
            style={{
              flex: 1, border: "1.5px solid #e8e4f0", borderRadius: 10,
              padding: "9px 12px", fontSize: 12, fontFamily: "inherit",
              color: "#1a1035", background: isLocked ? "#f8f7fb" : "#fff", outline: "none",
              resize: "none", lineHeight: 1.5,
              boxShadow: "0 1px 4px rgba(107,70,193,0.06)",
              opacity: isLocked ? 0.8 : 1,
            }}
          />
          <button
            onClick={sendMessage}
            disabled={isLocked || loading || !input.trim()}
            style={{
              width: 38, height: 38, borderRadius: 10, border: "none",
              cursor: input.trim() && !loading && !isLocked ? "pointer" : "not-allowed",
              background: input.trim() && !loading && !isLocked
                ? "linear-gradient(135deg, #6b46c1, #8b5cf6)"
                : "#e8e4f0",
              color: input.trim() && !loading && !isLocked ? "#fff" : "#aaa",
              fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: input.trim() && !loading && !isLocked ? "0 2px 8px rgba(107,70,193,0.3)" : "none",
              transition: "all 0.2s", flexShrink: 0,
            }}
          >↑</button>
        </div>
        <div style={{
          fontSize: 10, fontFamily: "monospace", color: "#c0b8d8",
          marginTop: 6, textAlign: "center",
        }}>
          {isLocked ? (
            <>
              {lockedFooter} · <a href={lockedCtaHref} style={{ color: "#6b46c1", textDecoration: "underline" }}>see plans</a>
            </>
          ) : (
            <>Enter to send · Shift+Enter for new line · Click "Ask AI →" on any lesson</>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1.1); }
        }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e0d8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
}

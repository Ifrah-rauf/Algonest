export default function JourneyIllustration() {
  // Layout: 6 nodes in 2 rows of 3, connected with zigzag arrows
  // Row 1: 1 → 2 → 3 (left to right)
  // Row 2: 6 ← 5 ← 4 (right to left, so arrow flows 3→4→5→6)
  const W        = 1100;
  const H        = 420;
  const CARD_W   = 290;
  const CARD_H   = 150;
  const ROW1_Y   = 60;
  const ROW2_Y   = 250;
  const COL_CX   = [175, 550, 925]; // center-x for cols 0,1,2

  // Row1: nodes 0,1,2 at COL_CX[0,1,2] / ROW1_Y
  // Row2: nodes 3,4,5 at COL_CX[2,1,0] / ROW2_Y  (reversed)
  const nodes = [
    {
      step: "01", title: "ROADMAP",
      subtitle: "Built from real job descriptions",
      fill: "url(#purpleGrad)", textColor: "white", subColor: "rgba(255,255,255,0.7)",
      badge: { bg: "#f6c90e", text: "#333" },
      inner: (cx, cy) => (
        <g>
          {[0,1,2].map(i => (
            <g key={i}>
              <circle cx={cx - 100} cy={cy - 14 + i * 22} r={6}
                fill={i < 2 ? "white" : "rgba(255,255,255,0.3)"} />
              {i < 2 && <circle cx={cx - 100} cy={cy - 14 + i * 22} r={2.5} fill="#6b46c1" />}
              <rect x={cx - 88} y={cy - 19 + i * 22} width={i < 2 ? 95 : 55} height={9} rx={4}
                fill="white" opacity={i < 2 ? 0.4 : 0.18} />
            </g>
          ))}
          <text x={cx + 60} y={cy + 14} textAnchor="middle" fontSize={34}>🗺️</text>
        </g>
      ),
    },
    {
      step: "02", title: "AI COMPANION",
      subtitle: "Scaffolds thinking — never writes for you",
      fill: "white", stroke: "#e9e3ff", textColor: "#333", subColor: "#94a3b8",
      badge: { bg: "#f6c90e", text: "#333" },
      inner: (cx, cy) => (
        <g>
          <rect x={cx - 115} y={cy - 22} width={145} height={19} rx={9} fill="#f3f0ff" />
          <text x={cx - 42} y={cy - 9} textAnchor="middle" fill="#6b46c1" fontSize={8.5} fontWeight="600">Why use a hash map here?</text>
          <rect x={cx - 95} y={cy + 3} width={145} height={19} rx={9} fill="#6b46c1" />
          <text x={cx - 22} y={cy + 17} textAnchor="middle" fill="white" fontSize={8.5} fontWeight="600">Think O(1) lookup first…</text>
          <rect x={cx - 115} y={cy + 27} width={130} height={19} rx={9} fill="#f3f0ff" />
          <text x={cx - 50} y={cy + 40} textAnchor="middle" fill="#6b46c1" fontSize={8.5} fontWeight="600">Constant time — got it! ✓</text>
          <text x={cx + 90} y={cy + 16} textAnchor="middle" fontSize={26}>🤖</text>
        </g>
      ),
    },
    {
      step: "03", title: "1:1 ASSESSMENT",
      subtitle: "Mentor reviews your checkpoint live",
      fill: "white", stroke: "#e9e3ff", textColor: "#333", subColor: "#94a3b8",
      badge: { bg: "#f6c90e", text: "#333" },
      inner: (cx, cy) => (
        <g>
          <circle cx={cx - 45} cy={cy - 10} r={24} fill="#ede9fe" />
          <text x={cx - 45} y={cy - 3} textAnchor="middle" fontSize={20}>👩‍💻</text>
          <circle cx={cx + 40} cy={cy - 10} r={24} fill="#fef3c7" />
          <text x={cx + 40} y={cy - 3} textAnchor="middle" fontSize={20}>👨‍🏫</text>
          <rect x={cx - 70} y={cy + 22} width={140} height={18} rx={9} fill="#fee2e2" />
          <circle cx={cx - 56} cy={cy + 31} r={4} fill="#ef4444" />
          <text x={cx + 8} y={cy + 36} textAnchor="middle" fill="#ef4444" fontSize={9} fontWeight="700">● LIVE · Score 91/100</text>
        </g>
      ),
    },
    {
      step: "04", title: "COMPETE",
    //   subtitle: "Ranked on quality, consistency & clarity",
      fill: "url(#yellowGrad)", textColor: "#333", subColor: "rgba(51,51,51,0.65)",
      badge: { bg: "#6b46c1", text: "white" },
      inner: (cx, cy) => (
        <g>
          <rect x={cx - 14} y={cy - 24} width={28} height={44} rx={4} fill="rgba(255,255,255,0.5)" />
          <rect x={cx - 54} y={cy - 12} width={28} height={32} rx={4} fill="rgba(255,255,255,0.35)" />
          <rect x={cx + 26} y={cy - 6} width={28} height={26} rx={4} fill="rgba(255,255,255,0.35)" />
          <text x={cx}      y={cy - 10} textAnchor="middle" fontSize={16}>🥇</text>
          <text x={cx - 40} y={cy - 0} textAnchor="middle" fontSize={13}>🥈</text>
          <text x={cx + 40} y={cy + 7} textAnchor="middle" fontSize={13}>🥉</text>
          <text x={cx - 108} y={cy - 10} fontSize={13} opacity="0.6">✦</text>
          <text x={cx + 100} y={cy - 24} fontSize={10} opacity="0.55">✦</text>
          <rect x={cx - 105} y={cy + 22} width={210} height={18} rx={8} fill="rgba(255,255,255,0.35)" />
          <text x={cx} y={cy + 35} textAnchor="middle" fill="#333" fontSize={8.5} fontWeight="700">Quality · Consistency · Communication</text>
        </g>
      ),
    },
    {
      step: "05", title: "INTERVIEW PREP",
      subtitle: "Coach how you speak under pressure",
      fill: "white", stroke: "#e9e3ff", textColor: "#333", subColor: "#94a3b8",
      badge: { bg: "#f6c90e", text: "#333" },
      inner: (cx, cy) => (
        <g>
          <rect x={cx - 115} y={cy - 40} width={230} height={22} rx={9} fill="#f3f0ff" />
          <text x={cx} y={cy - 25} textAnchor="middle" fill="#6b46c1" fontSize={8.5} fontWeight="600">"Walk me through your design decisions."</text>
          <circle cx={cx} cy={cy - 2} r={18} fill="#ede9fe" />
          <text x={cx} y={cy + 5} textAnchor="middle" fontSize={16}>🎯</text>
          <text x={cx - 108} y={cy + 28} fill="#94a3b8" fontSize={8}>Confidence</text>
          <rect x={cx - 108} y={cy + 31} width={110} height={8} rx={4} fill="#f1f5f9" />
          <rect x={cx - 108} y={cy + 31} width={95} height={8} rx={4} fill="url(#greenGrad)" />
          <text x={cx + 10} y={cy + 28} fill="#94a3b8" fontSize={8}>Clarity</text>
          <rect x={cx + 10} y={cy + 31} width={100} height={8} rx={4} fill="#f1f5f9" />
          <rect x={cx + 10} y={cy + 31} width={92} height={8} rx={4} fill="url(#blueGrad)" />
        </g>
      ),
    },
    {
      step: "06", title: "REFERRAL",
      subtitle: "Mentor vouches for you with real evidence",
      fill: "url(#greenGrad)", textColor: "white", subColor: "rgba(255,255,255,0.72)",
      badge: { bg: "#6b46c1", text: "white" },
      inner: (cx, cy) => (
        <g>
          <text x={cx - 30} y={cy + 10} textAnchor="middle" fontSize={32}>🤝</text>
          <rect x={cx - 10} y={cy - 26} width={125} height={22} rx={9} fill="rgba(255,255,255,0.28)" />
          <text x={cx + 52} y={cy - 11} textAnchor="middle" fill="white" fontSize={9} fontWeight="700">"I vouch for them."</text>
          {["🏢","💼","🚀","⭐"].map((icon, i) => (
            <g key={i}>
              <circle cx={cx - 10 + i * 34} cy={cy + 34} r={13} fill="rgba(255,255,255,0.22)" />
              <text x={cx - 10 + i * 34} y={cy + 39} textAnchor="middle" fontSize={11}>{icon}</text>
            </g>
          ))}
        </g>
      ),
    },
  ];

  // Position mapping: row1 left→right, row2 right→left
  const positions = [
    { cx: COL_CX[0], cy: ROW1_Y + CARD_H / 2 },
    { cx: COL_CX[1], cy: ROW1_Y + CARD_H / 2 },
    { cx: COL_CX[2], cy: ROW1_Y + CARD_H / 2 },
    { cx: COL_CX[2], cy: ROW2_Y + CARD_H / 2 },
    { cx: COL_CX[1], cy: ROW2_Y + CARD_H / 2 },
    { cx: COL_CX[0], cy: ROW2_Y + CARD_H / 2 },
  ];

  // Arrow paths between consecutive nodes
  const arrows = [
    // 0→1: right along row1
    { d: `M ${COL_CX[0] + CARD_W/2 + 4} ${ROW1_Y + CARD_H/2} L ${COL_CX[1] - CARD_W/2 - 4} ${ROW1_Y + CARD_H/2}` },
    // 1→2: right along row1
    { d: `M ${COL_CX[1] + CARD_W/2 + 4} ${ROW1_Y + CARD_H/2} L ${COL_CX[2] - CARD_W/2 - 4} ${ROW1_Y + CARD_H/2}` },
    // 2→3: curve down (right side)
    { d: `M ${COL_CX[2]} ${ROW1_Y + CARD_H + 4} C ${COL_CX[2]} ${ROW1_Y + CARD_H + 55}, ${COL_CX[2]} ${ROW2_Y - 55}, ${COL_CX[2]} ${ROW2_Y - 4}`, curve: true },
    // 3→4: left along row2
    { d: `M ${COL_CX[2] - CARD_W/2 - 4} ${ROW2_Y + CARD_H/2} L ${COL_CX[1] + CARD_W/2 + 4} ${ROW2_Y + CARD_H/2}` },
    // 4→5: left along row2
    { d: `M ${COL_CX[1] - CARD_W/2 - 4} ${ROW2_Y + CARD_H/2} L ${COL_CX[0] + CARD_W/2 + 4} ${ROW2_Y + CARD_H/2}` },
  ];

  return (
    <section className="w-full px-4 py-20">
      <div className="text-center mb-12">
        <span className="inline-block bg-[#6b46c1]/10 text-[#6b46c1] text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
          The AlgoNest Journey
        </span>
        <h2 className="text-4xl font-bold text-[#333] mb-3">
          From confused learner to{" "}
          <span className="text-[#6b46c1]">placed professional</span>
        </h2>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Six stages. One outcome. Here's exactly what happens.
        </p>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <defs>
          <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6b46c1" /><stop offset="100%" stopColor="#9333ea" />
          </linearGradient>
          <linearGradient id="yellowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f6c90e" /><stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <filter id="cardShadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="#6b46c1" floodOpacity="0.10" />
          </filter>
          <filter id="badgeGlow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Arrow markers — horizontal right, horizontal left, vertical down */}
          <marker id="arrR" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L0,8 L8,4 z" fill="#c4b5fd" />
          </marker>
          <marker id="arrL" markerWidth="8" markerHeight="8" refX="1" refY="4" orient="auto-start-reverse">
            <path d="M8,0 L8,8 L0,4 z" fill="#c4b5fd" />
          </marker>
          <marker id="arrD" markerWidth="8" markerHeight="8" refX="4" refY="7" orient="auto">
            <path d="M0,0 L8,0 L4,8 z" fill="#f6c90e" />
          </marker>
        </defs>

        {/* Background */}
        <rect width={W} height={H} rx="24" fill="#0f0020" />

        {/* Dot grid */}
        {Array.from({ length: 21 }).map((_, col) =>
          Array.from({ length: 9 }).map((_, row) => (
            <circle key={`${col}-${row}`}
              cx={col * 54 + 20} cy={row * 52 + 14}
              r="1.4" fill="#6b46c1" opacity="0.05" />
          ))
        )}

        {/* ── ARROWS ── */}
        {/* 0→1 right */}
        <line x1={COL_CX[0] + CARD_W/2 + 4} y1={ROW1_Y + CARD_H/2}
              x2={COL_CX[1] - CARD_W/2 - 10} y2={ROW1_Y + CARD_H/2}
          stroke="#c4b5fd" strokeWidth="2.5" strokeDasharray="6 4" markerEnd="url(#arrR)" />
        {/* 1→2 right */}
        <line x1={COL_CX[1] + CARD_W/2 + 4} y1={ROW1_Y + CARD_H/2}
              x2={COL_CX[2] - CARD_W/2 - 10} y2={ROW1_Y + CARD_H/2}
          stroke="#c4b5fd" strokeWidth="2.5" strokeDasharray="6 4" markerEnd="url(#arrR)" />
        {/* 2→3 curve down */}
        <path d={`M ${COL_CX[2]} ${ROW1_Y + CARD_H + 4} C ${COL_CX[2]} ${ROW1_Y + CARD_H + 50}, ${COL_CX[2]} ${ROW2_Y - 50}, ${COL_CX[2]} ${ROW2_Y - 4}`}
          stroke="#f6c90e" strokeWidth="2.5" strokeDasharray="6 4" fill="none" markerEnd="url(#arrD)" />
        {/* 3→4 left */}
        <line x1={COL_CX[2] - CARD_W/2 - 4} y1={ROW2_Y + CARD_H/2}
              x2={COL_CX[1] + CARD_W/2 + 10} y2={ROW2_Y + CARD_H/2}
          stroke="#c4b5fd" strokeWidth="2.5" strokeDasharray="6 4" markerEnd="url(#arrL)" />
        {/* 4→5 left */}
        <line x1={COL_CX[1] - CARD_W/2 - 4} y1={ROW2_Y + CARD_H/2}
              x2={COL_CX[0] + CARD_W/2 + 10} y2={ROW2_Y + CARD_H/2}
          stroke="#c4b5fd" strokeWidth="2.5" strokeDasharray="6 4" markerEnd="url(#arrL)" />

        {/* Row labels between arrows */}
        {/* "Start" label row 1 */}
        <rect x={COL_CX[0] + CARD_W/2 + 10} y={ROW1_Y + CARD_H/2 - 13} width={70} height={26} rx={13} fill="white" stroke="#e9e3ff" strokeWidth="1.5"/>
        <text x={COL_CX[0] + CARD_W/2 + 45} y={ROW1_Y + CARD_H/2 + 5} textAnchor="middle" fill="#6b46c1" fontSize={10} fontWeight="700">1 → 2</text>

        <rect x={COL_CX[1] + CARD_W/2 + 10} y={ROW1_Y + CARD_H/2 - 13} width={70} height={26} rx={13} fill="white" stroke="#e9e3ff" strokeWidth="1.5"/>
        <text x={COL_CX[1] + CARD_W/2 + 45} y={ROW1_Y + CARD_H/2 + 5} textAnchor="middle" fill="#6b46c1" fontSize={10} fontWeight="700">2 → 3</text>

        {/* Turn label */}
        <rect x={COL_CX[2] + 14} y={(ROW1_Y + CARD_H + ROW2_Y)/2 - 13} width={70} height={26} rx={13} fill="white" stroke="#f6c90e" strokeWidth="1.5"/>
        <text x={COL_CX[2] + 49} y={(ROW1_Y + CARD_H + ROW2_Y)/2 + 5} textAnchor="middle" fill="#f59e0b" fontSize={10} fontWeight="700">3 → 4</text>

        <rect x={COL_CX[1] + CARD_W/2 + 10} y={ROW2_Y + CARD_H/2 - 13} width={70} height={26} rx={13} fill="white" stroke="#e9e3ff" strokeWidth="1.5"/>
        <text x={COL_CX[1] + CARD_W/2 + 45} y={ROW2_Y + CARD_H/2 + 5} textAnchor="middle" fill="#6b46c1" fontSize={10} fontWeight="700">4 → 5</text>

        <rect x={COL_CX[0] + CARD_W/2 + 10} y={ROW2_Y + CARD_H/2 - 13} width={70} height={26} rx={13} fill="white" stroke="#e9e3ff" strokeWidth="1.5"/>
        <text x={COL_CX[0] + CARD_W/2 + 45} y={ROW2_Y + CARD_H/2 + 5} textAnchor="middle" fill="#6b46c1" fontSize={10} fontWeight="700">5 → 6</text>

        {/* ── CARDS ── */}
        {nodes.map((node, i) => {
          const { cx, cy } = positions[i];
          const x = cx - CARD_W / 2;
          const y = cy - CARD_H / 2;

          return (
            <g key={i} filter="url(#cardShadow)">
              <rect x={x} y={y} width={CARD_W} height={CARD_H} rx={18}
                fill={node.fill}
                stroke={node.stroke || "none"}
                strokeWidth={node.stroke ? 2 : 0} />

              {/* Badge — top-center */}
              <circle cx={cx} cy={y - 1} r={16} fill={node.badge.bg} filter="url(#badgeGlow)" />
              <text x={cx} y={y + 5} textAnchor="middle"
                fill={node.badge.text} fontSize={11} fontWeight="800">{node.step}</text>

              {/* Title */}
              <text x={cx} y={y + 30} textAnchor="middle"
                fill={node.textColor} fontSize={11} fontWeight="800" letterSpacing="0.4">
                {node.title}
              </text>

              {/* Subtitle */}
              <text x={cx} y={y + 40} textAnchor="middle"
                fill={node.subColor} fontSize={8.5}>
                {node.subtitle}
              </text>

              {/* Divider */}
              <line x1={x + 18} y1={y + 44} x2={x + CARD_W - 18} y2={y + 44}
                stroke={node.textColor} strokeWidth={0.6} opacity={0.12} />

              {/* Inner */}
              {node.inner(cx, cy)}
            </g>
          );
        })}

        {/* Bottom tagline */}
        {/* <text x={W / 2} y={H - 5} textAnchor="middle"
          fill="#94a3b8" fontSize={11} fontWeight="500">
          Free to start · Mentorship at checkpoints · One verified outcome
        </text> */}
      </svg>
    </section>
  );
}
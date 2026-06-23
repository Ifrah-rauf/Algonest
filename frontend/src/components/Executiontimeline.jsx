// ExecutionTimeline.jsx — v3 (compact text, fixed-height cards, prominent cursor)
import { Link } from "react-router-dom";
function CursorIcon({ style = {} }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      style={{
        position: "absolute",
        width: 30,
        height: 30,
        pointerEvents: "none",
        filter: "drop-shadow(0 2px 4px #9334ad9e)",
        ...style,
      }}
    >
      <path
        d="M4 2L4 18L8.5 13.5L11 19.5L13 18.8L10.5 12.8L16 12.8L4 2Z"
        fill="#9c55da"
        stroke="white"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* <circle cx="18" cy="20" r="3.5" fill="none" stroke="#7c3aed" strokeWidth="1.2" opacity="0.7" />
      <circle cx="18" cy="20" r="1.5" fill="#7c3aed" opacity="0.9" /> */}
    </svg>
  );
}

function MockBar() {
  return (
    <div className="flex items-center gap-1 px-2 py-[5px] bg-white border-b border-violet-100">
      <div className="w-[5px] h-[5px] rounded-full bg-red-200" />
      <div className="w-[5px] h-[5px] rounded-full bg-yellow-200" />
      <div className="w-[5px] h-[5px] rounded-full bg-green-200" />
      <div className="flex-1 h-[10px] bg-violet-50 rounded mx-1" />
    </div>
  );
}

/* ── Mockup 1: Project Roadmap ── */
function RoadmapMockup() {
  const items = [
    { pct: "82%", label: "Shipped",      color: "bg-violet-600" },
    { pct: "55%", label: "In progress",  color: "bg-violet-400" },
    { pct: "20%", label: "Planned",      color: "bg-violet-200" },
  ];
  return (
    <div className="relative w-full h-[168px] bg-violet-50/60 border border-violet-100 rounded-xl overflow-hidden flex-shrink-0">
      <MockBar />

      <div className="p-2">
        <p className="text-[7px] font-semibold uppercase tracking-widest text-violet-400 mb-[5px]">My Projects</p>
        {items.map(({ pct, label, color }) => (
          <div key={label} className="flex items-center gap-1.5 mb-1">
            <div className={`w-[5px] h-[5px] rounded-full flex-shrink-0 ${color}`} />
            <div className="flex-1 h-1 bg-violet-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full" style={{ width: pct }} />
            </div>
            <span className="text-[7px] text-violet-700 bg-violet-100 rounded px-1 whitespace-nowrap">{label}</span>
          </div>
        ))}
        <div className="h-px bg-violet-100 my-1.5" />
        <div className="flex gap-1">
          {["📄 README", "🔗 GitHub"].map(t => (
            <div key={t} className="bg-white border border-violet-100 rounded px-1.5 py-0.5 text-[7px] text-violet-700">{t}</div>
          ))}
          <div className="bg-violet-600 rounded px-1.5 py-0.5 text-[7px] text-white">+ Add</div>
        </div>
      </div>

      <CursorIcon style={{ bottom: 16, right: 14 }} />
    </div>
  );
}

/* ── Mockup 2: CS Fundamentals ── */
function FundamentalsMockup() {
  const bars = [
    { label: "DSA",  pct: 88 },
    { label: "OOP",  pct: 72 },
    { label: "OS",   pct: 60 },
    { label: "DBMS", pct: 50 },
  ];
  return (
    <div className="relative w-full h-[168px] bg-violet-50/60 border border-violet-100 rounded-xl overflow-hidden flex-shrink-0">
      <MockBar />
      <div className="p-2">
        <p className="text-[7px] font-semibold uppercase tracking-widest text-violet-400 mb-[5px]">Topic Progress</p>
        {bars.map(({ label, pct }) => (
          <div key={label} className="flex items-center gap-1.5 mb-1">
            <span className="text-[7px] text-slate-400 w-5 text-right">{label}</span>
            <div className="flex-1 h-1 bg-violet-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-violet-600 to-indigo-400 rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-[7px] font-semibold text-violet-600 w-5">{pct}%</span>
          </div>
        ))}
        <div className="flex flex-wrap mt-1.5">
          {[["Trees","#7c3aed"],["Graphs","#818cf8"],["DP","#a78bfa"]].map(([t,c]) => (
            <span key={t} className="inline-flex items-center gap-1 bg-white border border-violet-200 rounded-full px-1.5 py-0.5 text-[7px] text-violet-800 font-medium mr-1 mb-1">
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: c, display:"inline-block" }} />{t}
            </span>
          ))}
        </div>
      </div>
      <CursorIcon style={{ top: 52, right: 10 }} />
    </div>
  );
}

/* ── Mockup 3: Grill Session ── */
function GrillMockup() {
  return (
    <div className="relative w-full h-[168px] bg-violet-50/60 border border-violet-100 rounded-xl overflow-hidden flex-shrink-0">
      <MockBar />
      <div className="p-2">
        <div className="flex items-center justify-between mb-1.5">
          <div className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5 text-[7px] font-semibold text-amber-800">
            <span style={{width:4,height:4,borderRadius:"50%",background:"#f59e0b",display:"inline-block"}} />Live Review
          </div>
          <span className="text-[7px] text-violet-400">Placed Pro</span>
        </div>
        {/* Q1 */}
        <div className="flex items-end gap-1 mb-1">
          <div style={{width:14,height:14,borderRadius:"50%",background:"#7c3aed",display:"flex",alignItems:"center",justifyContent:"center",fontSize:6,fontWeight:700,color:"#fff",flexShrink:0}}>P</div>
          <div className="bg-violet-600 text-white text-[7.5px] rounded-lg rounded-bl-sm px-1.5 py-1 leading-snug max-w-[84%]">Why this tech stack?</div>
        </div>
        {/* A */}
        <div className="flex items-end flex-row-reverse gap-1 mb-1">
          <div style={{width:14,height:14,borderRadius:"50%",background:"#ddd6fe",display:"flex",alignItems:"center",justifyContent:"center",fontSize:6,fontWeight:700,color:"#5b21b6",flexShrink:0}}>U</div>
          <div className="bg-white border border-violet-100 text-violet-900 text-[7.5px] rounded-lg rounded-br-sm px-1.5 py-1 leading-snug max-w-[84%]">React + Spring Boot for scale…</div>
        </div>
        {/* Q2 */}
        <div className="flex items-end gap-1 mb-1.5">
          <div style={{width:14,height:14,borderRadius:"50%",background:"#7c3aed",display:"flex",alignItems:"center",justifyContent:"center",fontSize:6,fontWeight:700,color:"#fff",flexShrink:0}}>P</div>
          <div className="bg-violet-600 text-white text-[7.5px] rounded-lg rounded-bl-sm px-1.5 py-1 leading-snug max-w-[84%]">What would you change?</div>
        </div>
        {/* Typing */}
        <div className="flex items-center gap-1.5 pl-[18px]">
          <div className="flex gap-0.5">
            {["#ddd6fe","#c4b5fd","#a78bfa"].map((c,i) => (
              <div key={i} style={{width:4,height:4,borderRadius:"50%",background:c}} />
            ))}
          </div>
          <span className="text-[7px] text-violet-400">thinking…</span>
        </div>
      </div>
      <CursorIcon style={{ bottom: 12, right: 12 }} />
    </div>
  );
}

/* ── Connector ── */
function Connector() {
  return (
    <div className="flex items-start pt-[14px]" style={{ minWidth: 55, flexShrink: 0 }}>
      <div className="relative flex-1 h-px bg-gradient-to-r from-violet-300 to-violet-500">
        <div style={{
          position:"absolute", right:-4, top:"50%", transform:"translateY(-50%)",
          width:0, height:0,
          borderLeft:"10px solid #a78bfa",
          borderTop:"7px solid transparent",
          borderBottom:"7px solid transparent",
        }} />
      </div>
    </div>
  );
}

/* ── Step ── */
function Step({ num, label, accent = "#7c3aed", children, link }) {
  return (
    <div className="flex-1 flex flex-col items-center min-w-0">
      <div style={{
        width:28, height:28, borderRadius:"50%", background: accent,
        color:"#fff", display:"flex", alignItems:"center", justifyContent:"center",
        fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:700, marginBottom:7, flexShrink:0
      }}>{num}</div>
      <Link to={link} style={{color: '#fff', textDecoration: 'none' , backgroundColor:'#7c3aed', padding: '10px 12px 2px', borderRadius: 12, marginBottom: 12,boxShadow:"0 4px 6px rgba(124,58,237,0.3)"}}
       className={"hover:bg-white"}>
        <p style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:700,marginBottom:8,textAlign:"center",lineHeight:1.3, cursor: "pointer"}}>{label}</p>
      </Link>
      <div style={{width:"100%"}}>{children}</div>
    </div>
  );
}

/* ── Main ── */
export default function ExecutionTimeline() {
  return (
    <div style={{ background:"#fff", padding:"32px 28px", width:"75%", margin:"0 auto", fontFamily:"'DM Sans',sans-serif", marginTop:36, marginBottom:36, border: "1px solid #e5e7eb", borderRadius:12,boxShadow:"0 4px 6px rgba(0,0,0,0.1)" }}>
      <div style={{ marginBottom:56 }}>
        <p style={{fontSize:9,fontWeight:600,letterSpacing:2,textTransform:"uppercase",color:"#7c3aed",marginBottom:6}}>Execution Timeline</p>
        <h2 style={{fontSize:40,fontWeight:700,color:"#1a1028",lineHeight:1.2,marginBottom:7}}>
          Project first, fundamentals second, pressure last.
        </h2>
        <p style={{fontSize:20,color:"#7a6e8a",lineHeight:1.5}}>
          The order matters. Each stage sets up the next — no shortcuts.
        </p>
      </div>

      <div style={{ display:"flex", alignItems:"flex-start", gap:0 }}>
        <Step num="1" label="Project Roadmaps" accent="#7c3aed" link="/roadmaps"><RoadmapMockup/></Step>
        <Connector />
        <Step num="2" label="CS Fundamentals" accent="#6d28d9" link="/cscore"><FundamentalsMockup /></Step>
        <Connector />
        <Step num="3" label="Grill Sessions" accent="#4f46e5" link="/grill"><GrillMockup /></Step>
      </div>
    </div>
  );
}

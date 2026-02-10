// import React, { useEffect, useMemo, useState } from "react";
// import { useParams } from "react-router-dom";
// import { motion } from "framer-motion";
// import Navbar from "../components/navbar";

// export default function CourseOutline({id}) {
//   console.log("ID: "+id);
//   const [outline, setOutline] = useState(null);
//   const [sessions, setSessions] = useState([]);
//   const [totalSessions, setTotalSessions] = useState(0);
//   const [remSessions, setRemSessions] = useState(0);
//   const [attachments, setAttachments] = useState([]);

//   const [hovered, setHovered] = useState(null);
//   const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });

//   /* ================= FETCH ================= */
//   useEffect(() => {
//     async function load() {
//       const res = await fetch(
//         `http://localhost:5000/api/plans/course-outline/${id}`
//       );
//       const json = await res.json();

//       if (json.success) {
//         setOutline(json.outline);
//         setSessions(json.sessions || []);
//         setAttachments(json.attachments || []);
//         setTotalSessions(json.totalSessions || 0);
//         setRemSessions(json.remSessions || 0);
//       }
//     }
//     load();
//   }, [id]);

//   /* ================= PROGRESS ================= */
//   const progressPercent =
//     totalSessions > 0
//       ? Math.round(((totalSessions - remSessions) / totalSessions) * 100)
//       : 0;

//   /* ================= ROADMAP GEOMETRY ================= */
//   const points = useMemo(() => {
//     const width = 900;
//     const height = 100;
//     const margin = 60;

//     if (totalSessions <= 1) {
//       return [{ x: width / 2, y: height / 2 }];
//     }

//     const step = (width - margin * 2) / (totalSessions - 1);

//     return Array.from({ length: totalSessions }).map((_, i) => ({
//       x: margin + i * step,
//       y: height / 2 + Math.sin(i * 0.8) * 18,
//     }));
//   }, [totalSessions]);

//   const pathD = points.reduce((acc, p, i) => {
//     if (i === 0) return `M ${p.x} ${p.y}`;
//     const prev = points[i - 1];
//     const cx = (prev.x + p.x) / 2;
//     return `${acc} C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
//   }, "");

//   /* ================= RENDER ================= */
//   return (
//     <div>
//       {/* ================= HERO ================= */}
//       <section
//         className="relative h-[320px] px-16 py-14 pb-32 rounded"
//         style={{ background: `url(${bg}) center / cover no-repeat` }}
//       >
//         <div className="max-w-3xl">
//           <p className="mt-7 text-gray-700">
//             Active plan <strong>{outline?.title || "student_name"}</strong>
//           </p>
//           <p className="text-sm text-gray-500">{outline?.plan_name}</p>
//         </div>

//         {/* ================= ROADMAP ================= */}
//         <div className="mt-10 w-full px-16">
//           <svg
//             viewBox="0 0 900 100"
//             width="100%"
//             height="100"
//             preserveAspectRatio="xMidYMid meet"
//             style={{ overflow: "visible" }}
//           >
//             {/* PATH */}
//             <path
//               d={pathD}
//               stroke="#c4b5fd"
//               strokeWidth={4}
//               fill="none"
//               strokeDasharray="6 8"
//             />

//             {/* DOTS */}
//             {points.map((p, i) => {
//               const isActive = i < sessions.length;
//               const isNext = i === sessions.length;
//               const color = isActive
//                 ? "#8b5cf6"
//                 : isNext
//                 ? "#facc15"
//                 : "#d1d5db";

//               return (
//                 <motion.circle
//                   key={i}
//                   cx={p.x}
//                   cy={p.y}
//                   r={8}
//                   fill={color}
//                   stroke={isActive ? "#6d28d9" : "#9ca3af"}
//                   strokeWidth={2}
//                   style={{
//                     cursor: isActive ? "pointer" : "not-allowed",
//                   }}
//                   whileHover={isActive ? { scale: 1.25 } : {}}
//                   onMouseEnter={
//                     isActive
//                       ? (e) => {
//                           setHovered(sessions[i]);
//                           setHoverPos({
//                             x: e.clientX,
//                             y: e.clientY,
//                           });
//                         }
//                       : undefined
//                   }
//                   onMouseLeave={() => setHovered(null)}
//                 />
//               );
//             })}
//           </svg>

//           {/* ================= PROGRESS BAR ================= */}
//           <div className="mt-4 flex items-center gap-3">
//             <div className="flex-1 h-2 bg-gray-300 rounded">
//               <div
//                 className="h-2 bg-[#8b5cf6] rounded "
//                 style={{ width: `${progressPercent}%` }}
//               />
//             </div>
//             <span className="text-sm font-semibold text-gray-700">
//               {progressPercent}% completed
//             </span>
//           </div>
//         </div>
//       </section>

//       {/* ================= MAIN ================= */}
//       <div className="grid grid-cols-10 bg-gray-50 p-10 rounded-xl m-8 shadow-[0px_5px_15px_rgba(0,0,0,0.5)]">
//         {/* -------- SESSIONS -------- */}
//         <div className="col-span-5">
//           <div className="bg-[#ffd98e] inline-block px-3 py-3 rounded-full text-sm font-medium mb-8 m-5 text-gray-800">
//             {sessions.length} / {totalSessions} Sessions ·{" "}
//             {attachments.length} attachments
//           </div>

//           <div className="space-y-12">
//             {sessions.map((s, i) => (
//               <div key={s.session_id} className="relative">
//                 <div className="flex items-start gap-6">
//                   <div className="font-semibold text-lg">
//                     Session-{i + 1}
//                   </div>

//                   <div className="flex-1">
//                     <p className="text-gray-700">
//                       {s.title || "Introduction to DBMS"}
//                     </p>
//                     <p className="text-sm text-gray-500 mt-1">
//                       {new Date(s.start_time).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </div>

//                 {/* CONNECTOR */}
//                 {i !== sessions.length - 1 && (
//                   <div className="ml-[28%] mt-1 h-10 w-24 border-l-4 border-b-4 border-purple-400 rounded-bl-3xl" />
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* -------- ATTACHMENTS -------- */}
//         <div className="col-span-1 bg-[#2f2f2f] text-white p-8 w-[500px]">
//           <h2 className="text-3xl font-bold mb-8">Attachments</h2>

//           <div className="grid grid-cols-3 gap-6">
//             {attachments.map((a, i) => (
//               <a
//                 key={i}
//                 href={a.attachment}
//                 target="_blank"
//                 rel="noreferrer"
//                 className="text-center"
//               >
//                 <div className="text-5xl mb-2">📄</div>
//                 <p className="text-xs opacity-80">
//                   {a.title || "Notes"}
//                 </p>
//               </a>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ================= HOVER POPUP ================= */}
//       {hovered && (
//         <div
//           className="fixed bg-white shadow-lg p-3 rounded-lg w-64 z-50"
//           style={{
//             top: hoverPos.y - 150,
//             left: hoverPos.x - 120,
//           }}
//         >
//           <h4 className="font-semibold text-sm">
//             {hovered.title || "Session"}
//           </h4>
//           <p className="text-s text-gray-500">
//             {new Date(hovered.start_time).toLocaleString()}
//           </p>
//           <p className="text-s text-gray-500"> <b>Mentor</b>: {hovered.mentor?.name || "TBD"} </p>

//         </div>
//       )}
//     </div>
//   );
// }

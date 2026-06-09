import React, { useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Handle,
  Position,
  NodeToolbar,
} from "reactflow";
import { motion } from "framer-motion";
import "reactflow/dist/style.css";

/* ---------------- THEME ---------------- */
const theme = {
  primary: "#6b46c1",
  accent: "#f6c90e",
  base: "#ffffff",
  text: "#333",
};

/* ---------------- NODE ---------------- */
function BoxNode({ data }) {
  const [open, setOpen] = useState(false);

  const isSub = data.variant === "subtopic";
  const isPoint = data.isPoint === true;
  const isCheckpoint = data.variant === "checkpoint";
  const isPrimary = !isPoint && !isSub && !isCheckpoint;

  const Wrapper = isCheckpoint && data.active ? motion.div : "div";

  return (
    <Wrapper
      onClick={(e) => {
        e.stopPropagation();
        setOpen((v) => !v);
      }}
      {...(isCheckpoint && data.active
        ? {
            initial: { scale: 0.85, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            transition: {
              type: "spring",
              stiffness: 260,
              damping: 18,
            },
          }
        : {})}
      className={`relative rounded-xl border cursor-pointer
        ${isSub ? "p-2 text-xs shadow-sm" : "p-4 text-sm shadow-md"}
      `}
      style={{
        minWidth: isSub ? 140 : isCheckpoint ? 280 : 190,

        background: isPoint
          ? "#333"
          : isCheckpoint
          ? theme.accent
          : isPrimary
          ? theme.primary
          : theme.accent,

        color: isPoint || isPrimary || isCheckpoint ? "#fff" : theme.text,

        borderColor: isCheckpoint
          ? theme.primary
          : isPoint
          ? "#999"
          : theme.primary,
      }}
    >
      {/* TOOLBAR */}
      <NodeToolbar isVisible={open} position="top">
        <div className="flex gap-2 bg-white border rounded-md shadow px-2 py-1">
          {Array.isArray(data.content) && (
            <button className="text-sm text-purple-900 max-w-[320px] p-2">
              <ol className="mt-1 list-disc list-inside space-y-1 text-[90%] text-gray-600 text-left">
                {data.content.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ol>
            </button>
          )}
          {!isSub && !isPoint && (
            <button className="text-xs text-green-600 font-semibold">
              ✔ Complete
            </button>
          )}
        </div>
      </NodeToolbar>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />

      <h4
        className={`font-semibold ${
          isCheckpoint ? "text-4xl" : isSub ? "text-sm" : "text-xl"
        }`}
      >
        {data.title}
      </h4>

      {data.content && !Array.isArray(data.content) && (
        <p className="text-xs mt-1 opacity-90">{data.content}</p>
      )}

      {isCheckpoint && data.active && (
        <p className="text-xs mt-2 font-semibold text-purple-900">
          🎯 Milestone unlocked
        </p>
      )}
    </Wrapper>
  );
}

const nodeTypes = { box: BoxNode };

/* ---------------- COMPONENT ---------------- */
export default function RoadmapStage({ nodes, edges }) {
  return (
    <div
      className="relative w-full max-w-full h-[700px] bg-white border rounded-xl shadow-lg"
      style={{ borderColor: theme.primary }}
    >
      {/* Scroll container */}
      <div className="w-full h-full scrollbar-hide">
        {/* Canvas */}
        <div className="w-full h-full overflow-auto">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            nodesDraggable={false}
            nodesConnectable={false}
            zoomOnScroll={false}
            zoomOnPinch={false}
            zoomOnDoubleClick={false}
            panOnScroll={true}
            minZoom={0.7}
            maxZoom={1.2}
          >
            <Background variant="dots" gap={24} size={2} />
            <Controls position="top-right" />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

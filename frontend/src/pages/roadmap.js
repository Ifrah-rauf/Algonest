import React from "react";
import RoadmapStage from "../components/roadmapStage";
import Navbar from "../components/navbar";

/* ---------------- THEME ---------------- */
const theme = {
  primary: "#6b46c1",
};

/* ---------------- SESSION 1 POINTS ---------------- */
const s1Points = [
  "Express, Nodemon packages",
  "npm, npm init",
  ".env file",
  "app.get()",
];
const s2Points = [
  "REST principles",
  "GET / POST routes",
  "req.params & req.query",
  "API structuring",
];

const s3Points = [
  "Middleware concept",
  "express.json()",
  "Error handling",
  "next() flow",
];
/* ---------------- COMPLETION STATE (TEMP / ASSUMED) ---------------- */
const lessonCompletion = {
  s1: false,
  s2: false,
  s3: false,
};

const isMilestone1Active =
  lessonCompletion.s1 &&
  lessonCompletion.s2 &&
  lessonCompletion.s3;

/* ---------------- POINT NODE GENERATOR ---------------- */
function generatePointNodes(parentX, parentY, sessionId, points) {
  const verticalSpacing = 40;

  return points.map((point, i) => ({
    id: `${sessionId}-point-${i}`,
    type: "box",
    position: {
      x: parentX,
      y: parentY + i * verticalSpacing,
    },
    data: {
      title: point,
      variant: "subtopic",
      isPoint: true,
    },
  }));
}


/* ---------------- GENERATED POINT NODES ---------------- */
const s1PointNodes = generatePointNodes(800, 80, "s1", s1Points);
const s2PointNodes = generatePointNodes(350, 600, "s2", s2Points);
const s3PointNodes = generatePointNodes(650, 600, "s3", s3Points);

/* ---------------- NODES ---------------- */
const nodes = [
  {
    id: "s1",
    type: "box",
    position: { x: 500, y: 40 },
    data: { title: "Lesson 1", content: "Project Setup & Basic Routing" },
  },

  {
    id: "s1-l1",
    type: "box",
    position: { x: 150, y: 40 },
    data: {
      title: "1. Key Development Goals",
      content: [
        "Initialize the Node.js project",
        "Set up Express server",
        "Install required packages (Express, Nodemon)",
        "Configure environment variables (.env)",
      ],
      points: s1Points,
      Questions: [
        "How to setup a basic Express app?",
        "How do ports listen?",
        "Can you create basic routing?",
      ],
      variant: "subtopic",
    },
  },

  {
    id: "s1-l2",
    type: "box",
    position: { x: 150, y: 140 },
    data: { title: "2. Concepts", content: "Node & Express", variant: "subtopic" },
  },

  {
    id: "s1-r",
    type: "box",
    position: { x: 820, y: 10 },
    data: { title: "3. Deep Dive", content: "Routing & req/res", variant: "subtopic" },
  },

  {
  id: "s1-branch",
  type: "box",
  position: { x: 1000, y: 120 }, // right of session 1
  data: { title: "CheckList", variant: "subtopic", hidden: true },
}
,

  { id: "s2", type: "box", position: { x: 350, y: 300 }, data: { title: "Lesson 2", content: "REST API Design" } },
  { id: "s3", type: "box", position: { x: 650, y: 300 }, data: { title: "Lesson 3", content: "Middleware" } },

  { id: "s2-a", type: "box", position: { x: 70, y: 450 }, data: { title: "Endpoints", variant: "subtopic" } },
  { id: "s2-b", type: "box", position: { x: 250, y: 450 }, data: { title: "Methods", variant: "subtopic" } },
  { id: "s2-c", type: "box", position: { x: 430, y: 450 }, data: { title: "Structure", variant: "subtopic" } },
  {
    id: "s2-branch",
    type: "box",
    position: { x: 350, y: 550 },
    data: { title: "CheckPoints", variant: "subtopic", hidden: true },
  },

  {
    id: "s3-branch",
    type: "box",
    position: { x: 650, y: 550 },
    data: { title: "CheckPoints", variant: "subtopic", hidden: true },
  },
  { id: "s3-a", type: "box", position: { x: 600, y: 450 }, data: { title: "CORS", variant: "subtopic" } },
  { id: "s3-b", type: "box", position: { x: 770, y: 450 }, data: { title: "JSON", variant: "subtopic" } },
  { id: "s3-c", type: "box", position: { x: 930, y: 450 }, data: { title: "Errors", variant: "subtopic" } },

  //THE MILESTONE NODE.
{
  id: "checkpoint-1",
  type: "box",
  position: { x: 300, y: 800 },
  data: {
    title: "🎉 Milestone 1 Unlocked!",
    content:
      "You can now confidently set up an Express project and explain its fundamentals.",
    variant: "checkpoint",
    active: isMilestone1Active,   // 🔥 IMPORTANT
  },
},

  // 🔽 ADD GENERATED POINT NODES
  ...s1PointNodes,
  ...s2PointNodes,
  ...s3PointNodes,
];

/* ---------------- EDGES ---------------- */
const dashed = { strokeDasharray: "6 4", stroke: "#aaa", strokeWidth: 2 };
const checkedDashed = { strokeDasharray: "6 4", stroke: "#464646ff", strokeWidth: 2 };

const s1PointEdges = s1Points.map((_, i) => ({
  id: `e-s1-point-${i}`,
  source: "s1-branch",
  target: `s1-point-${i}`,
  type: "step",
  style: checkedDashed,
}));
const s2PointEdges = s2Points.map((_, i) => ({
  id: `e-s2-point-${i}`,
  source: "s2-branch",
  target: `s2-point-${i}`,
  type: "step",
  style: checkedDashed,
}));

const s3PointEdges = s3Points.map((_, i) => ({
  id: `e-s3-point-${i}`,
  source: "s3-branch",
  target: `s3-point-${i}`,
  type: "step",
  style: checkedDashed,
}));
const edges = [
  { id: "e1", source: "s1", target: "s2", type: "step", style: { stroke: theme.primary, strokeWidth: 2 } },

  { id: "e3", source: "s1", target: "s1-l1", type: "step", style: dashed },
  { id: "e4", source: "s1", target: "s1-l2", type: "step", style: dashed },
  { id: "e5", source: "s1", target: "s1-r", type: "step", style: dashed },

  { id: "e6", source: "s2", target: "s2-a", type: "step", style: dashed },
  { id: "e7", source: "s2", target: "s2-b", type: "step", style: dashed },
  { id: "e8", source: "s2", target: "s2-c", type: "step", style: dashed },

  { id: "e9", source: "s3", target: "s3-a", type: "step", style: dashed },
  { id: "e10", source: "s3", target: "s3-b", type: "step", style: dashed },
  { id: "e11", source: "s3", target: "s3-c", type: "step", style: dashed },

  { id: "e12", source: "s2", target: "s3", type: "step", style: { stroke: theme.primary, strokeWidth: 2 } },

  { id: "e-s1-branch", source: "s1", target: "s1-branch", type: "step", style: checkedDashed },
  { id: "e-s2-branch", source: "s2", target: "s2-branch", type: "step", style: checkedDashed },
  { id: "e-s3-branch", source: "s3", target: "s3-branch", type: "step", style: checkedDashed },

  {
  id: "e-s3-milestone-1",
  source: "s3",
  target: "checkpoint-1",
  type: "step",
  style: isMilestone1Active
    ? { stroke: theme.primary, strokeWidth: 3 }
    : { stroke: theme.primary, strokeWidth:2},
},

  // 🔽 ADD POINT EDGES
  // ...s1PointEdges,
  // ...s2PointEdges,
  // ...s3PointEdges,

];

/* ---------------- PAGE ---------------- */
export default function AlgoNestRoadmap() {
  return (
    <div className="w-full h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex justify-center items-center p-6">
        <RoadmapStage nodes={nodes} edges={edges} />
      </div>
    </div>
  );
}

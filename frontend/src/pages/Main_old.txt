import { Link } from "react-router-dom";
import AlgoPlane from "../static/AlgoPlane.png";
import AlgoNest2 from "../static/AlgoNest2.PNG";
import page from "../static/page.jpg";
import bg7 from "../static/bg7.png";
import tdl from "../static/to-do-list.png";
import book from "../static/book-main.png";
import oclass from "../static/online-class.png";
import m1 from "../static/m1.png";
import m2 from "../static/m2.png";
import m3 from "../static/m3.png";
import { motion } from "framer-motion";
import BookPlan from "./BookPlan";
import { useAuth } from "../context/AuthContext.jsx";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; 
import Navbar from "../components/navbar";
import { CheckCircle2 } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { ClipboardList, Users, TrendingUp } from "lucide-react";
import HowItWorksScroll from "../components/howitworks.jsx";
import { Monitor, Smartphone, Brain, Database, Cloud, Palette, Code2, Rocket, ArrowRight } from "lucide-react";
import RoadmapsSection from "../components/roadmaps.jsx";

const technologyDomains = [
  {
    title: "Web Development",
    link: "#web-development"
  },
  {
    title: "Mobile Development",
    link: "#mobile-development"
  },
  {
    title: "AI & Machine Learning",
    link: "#ai-ml"
  },
  {
    title: "Data Science",
    link: "#data-science"
  },
  {
    title: "Cloud & DevOps",
    link: "#cloud-devops"
  },
  {
    title: "Backend Development",
    link: "#backend"
  },
  {
    title: "Frontend Development",
    link: "#frontend"
  },
  {
    title: "Database Management",
    link: "#database"
  },
  {
    title: "Cybersecurity",
    link: "#cybersecurity"
  },
  {
    title: "Blockchain",
    link: "#blockchain"
  }
];

const applicationDomains = [
  {
    title: "System Software",
    link: "#fintech"
  },
  {
    title: "Embedded Systems",
    link: "#healthtech"
  },
  {
    title: "E-Commerce",
    link: "#ecommerce"
  },
  {
    title: "Business Solutions",
    link: "#edtech"
  },
  {
    title: "Social Media",
    link: "#social-media"
  },
  {
    title: "SaaS Products",
    link: "#saas"
  },
  {
    title: "Gaming",
    link: "#gaming"
  },
  {
    title: "IoT & Smart Devices",
    link: "#iot"
  },
  {
    title: "Dev Tools and Utlities",
    link: "#proptech"
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: -40,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1], // smooth, premium
    },
  },
};

/* ================= PAGE ================= */

export default function Landing() {
  const [activeStep, setActiveStep] = useState(0);
  return (
    <>
      <Navbar />

      <main className="text-[#333333] overflow-x-hidden">

        {/* ======================================================
            SECTION 1 — HERO (FULL-WIDTH BACKGROUND)
        ====================================================== */}
        <section
  className="relative bg-no-repeat bg-cover bg-center overflow-hidden"
  style={{ backgroundImage: `url(${bg7})` }}
>
  {/* Soft overlay (intentionally clipped, not full height) */}
  <div className="absolute inset-x-0 top-0"
  />
  {/* Content */}
  <div className="relative max-w-7xl mx-auto grid gap-24 items-center justify-center text-center">
    <div>
      <h1 className="text-5xl md:text-6xl font-bold mt-16">
        Build Real Projects.<br/>
        Become <span className="text-[#f6c90e]">Job Ready</span>.
      </h1>

      <p className="mt-6 text-lg text-gray-600">
        Master tech through structured roadmaps and 1:1 mentorship. <br/>
        From web development to AI, build your portfolio with hands-on projects that matter.
      </p>

      {/* <p className="text-lg text-gray-600">
        Projects | School & College Syllabus | Placements
      </p> */}

      <div className="mt-10 flex gap-6 justify-center">
        <Link
          to="/start"
          className="bg-[#6b46c1] text-white px-8 py-3 rounded-md font-medium"
        >
          Start your journey
        </Link>

        <Link
          to="/tour"
          className="text-[#6b46c1] font-medium self-center"
        >
          Take a tour →
        </Link>
      </div>
    </div>

    {/* Illustration */}
    <div className="hidden md:flex justify-center mt-[-22%] mb-6">
      <img
        src={AlgoNest2}
        alt="AlgoNest Illustration"
        className="w-[360px]"
      />
    </div>
  </div>

  {/* WAVE CUT — THIS IS THE KEY FIX */}
<svg
  className="absolute bottom-[-1px] left-0 w-full"
  viewBox="0 0 1440 40"
  preserveAspectRatio="none"
>
  <path
    fill="#6b46c1"
    d="
      M0,20
      C24,36 72,36 96,20
      C120,4 168,4 192,20
      C216,36 264,36 288,20
      C312,4 360,4 384,20
      C408,36 456,36 480,20
      C504,4 552,4 576,20
      C600,36 648,36 672,20
      C696,4 744,4 768,20
      C792,36 840,36 864,20
      C888,4 936,4 960,20
      C984,36 1032,36 1056,20
      C1080,4 1128,4 1152,20
      C1176,36 1224,36 1248,20
      C1272,4 1320,4 1344,20
      C1368,36 1416,36 1440,20
      L1440,40 L0,40 Z
    "
  />
</svg>
</section>
<section className="relative bg-[#6b46c1] text-white py-24 overflow-hidden">
  <div className="max-w-6xl mx-auto text-center px-6">
    <p className="text-3xl font-medium leading-relaxed">
      AlgoNest replaces random mentoring with{" "}
      <span className="bg-[#f6c90e] text-[#333333] px-1">
        fixed plans
      </span>
      , session accountability, and measurable progress.
    </p>
  </div>

  {/* BOTTOM WAVE (same style as hero cut) */}
<svg
  className="absolute bottom-[-1px] left-0 w-full"
  viewBox="0 0 1440 40"
  preserveAspectRatio="none"
>
  <path
    fill="#ffffff"
    d="
      M0,20
      C24,36 72,36 96,20
      C120,4 168,4 192,20
      C216,36 264,36 288,20
      C312,4 360,4 384,20
      C408,36 456,36 480,20
      C504,4 552,4 576,20
      C600,36 648,36 672,20
      C696,4 744,4 768,20
      C792,36 840,36 864,20
      C888,4 936,4 960,20
      C984,36 1032,36 1056,20
      C1080,4 1128,4 1152,20
      C1176,36 1224,36 1248,20
      C1272,4 1320,4 1344,20
      C1368,36 1416,36 1440,20
      L1440,40 L0,40 Z
    "
  />
</svg>

</section>


        {/* ======================================================
            SECTION 3 — Mentorship isn’t broken
        ====================================================== */}
        <section className="max-w-6xl mx-auto px-6 py-24">
  <div className="grid md:grid-cols-1 gap-12 items-center text-center">

    {/* CENTER CONTENT */}
    <div>
      {/* Main heading */}
      <h2 className="text-4xl font-bold leading-tight mb-6">
        Mentorship isn’t broken,  
        <br />
        the way traditional system deliver is.
      </h2>

      {/* Supporting copy */}
      <p className="text-gray-700 mb-4">
        Let’s be honest.
      </p>

      <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
        Random mentor selection, inconsistent teaching styles, and
        zero continuity make most learning systems fail — even when
        mentors are good.
      </p>

      {/* Strong close */}
      <p className="text-2xl font-semibold leading-snug">
        Stop restarting.
        <br />
        Start finishing.
      </p>
    </div>

    {/* HORIZONTAL PROBLEM BOXES */}
    <div className="flex flex-wrap justify-center gap-4 mt-6">

      {[
        "No fixed roadmap or milestones",
        "Getting stuck without guidance",
        "Waiting weeks to recover lost momentum",
        "Dropping off midway in frustration",
      ].map((text, i) => (
        <div
          key={i}
          className="flex items-center gap-3 border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-700 bg-white shadow-lg"
        >
          {/* Cross icon */}
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600 text-sm font-extrabold">
            ✕
          </span>

          {/* Text */}
          <span className="whitespace-nowrap">{text}</span>
        </div>
      ))}

    </div>

  </div>
</section>


        {/* ======================================================
            SECTION 4 — Explore domains
        ====================================================== */}
<div id="roadmaps">
<RoadmapsSection/>

</div>
        {/* ======================================================
            SECTION 4 — Stop choosing random mentors.
        ====================================================== */}

<section className="max-w-6xl mx-auto px-6 py-20">

  {/* HEADING — CENTERED */}
  <div className="text-center max-w-2xl mx-auto mb-16">
    <h2 className="text-4xl font-semibold leading-tight mb-4">
      Stop choosing random mentors.
      <br />
      Choose the right system.
    </h2>

    <p className="text-gray-600">
      Completion doesn’t happen by chance.
      It needs structure, flexibility, and visibility.
    </p>
  </div>

  {/* STICKY NOTES GRID */}
  <div className="grid md:grid-cols-3 gap-8 justify-items-center">

    {/* NOTE 1 */}
    <div className="relative bg-white p-6 w-full max-w-sm rounded-xl
      shadow-[4px_4px_0px_rgba(0,0,0,0.25)] rotate-[-2deg]">
      <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-purple-400 rounded-full" />
      <h3 className="font-medium text-lg mb-2">1:1 Mentorship</h3>
      <p className="text-sm text-gray-700">
        Get personalized guidance from industry experts who help you navigate challenges and accelerate your learning."
      </p>
    </div>

    {/* NOTE 2 */}
    <div className="relative bg-[#fafafa] p-6 w-full max-w-sm rounded-xl
      shadow-[4px_4px_0px_rgba(0,0,0,0.25)] rotate-[1.5deg]">
      <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-yellow-400 rounded-full" />
      <h3 className="font-medium text-lg mb-2">Real-World Projects</h3>
      <p className="text-sm text-gray-700">
        Build production-ready applications that solve actual problems, not just tutorial projects."
      </p>
    </div>

    {/* NOTE 3 */}
    <div className="relative bg-white p-6 w-full max-w-sm rounded-xl
      shadow-[4px_4px_0px_rgba(0,0,0,0.25)] rotate-[-1deg]">
      <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-purple-400 rounded-full" />
      <h3 className="font-medium text-lg mb-2">Structured Roadmaps</h3>
      <p className="text-sm text-gray-700">
        Follow proven learning paths designed to take you from beginner to job-ready developer.
      </p>
    </div>

    {/* NOTE 4 */}
    <div className="relative bg-[#fdfdfd] p-6 w-full max-w-sm rounded-xl    
      shadow-[4px_4px_0px_rgba(0,0,0,0.25)] rotate-[2deg]">
      <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-yellow-400 rounded-full" />
      <h3 className="font-medium text-lg mb-2">Portfolio Building</h3>
      <p className="text-sm text-gray-700">
        Create an impressive portfolio that showcases your skills to potential employers.
      </p>
    </div>

    {/* NOTE 5 */}
    <div className="relative bg-white p-6 w-full max-w-sm rounded-xl
      shadow-[4px_4px_0px_rgba(0,0,0,0.25)] rotate-[-1.5deg]">
      <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-purple-400 rounded-full" />
      <h3 className="font-medium text-lg mb-2">Career Support</h3>
      <p className="text-sm text-gray-700">
        Resume reviews, interview prep, and job placement assistance to help you land your dream role."
      </p>
    </div>

    {/* NOTE 6 */}
    <div className="relative bg-[#fafafa] p-6 w-full max-w-sm rounded-xl
      shadow-[4px_4px_0px_rgba(0,0,0,0.25)] rotate-[1deg]">
      <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-yellow-400 rounded-full" />
      <h3 className="font-medium text-lg mb-2">Hands-On Experience</h3>
      <p className="text-sm text-gray-700">
        Learn by doing with practical coding challenges and real development workflows.
      </p>
    </div>

  </div>
</section>



        {/* ======================================================
            SECTION 4 —how it works
        ====================================================== */}

<div id="howitworks">
<HowItWorksScroll/>
</div>


        {/* ======================================================
            SECTION 4 — mentors
        ====================================================== */}
<section className="max-w-6xl mx-auto px-6 py-28 flex items-center justify-center">
  <h2 className="text-5xl font-semibold mb-16 py-4 mr-8">
    Mentors at every stage
  </h2>

  <motion.div
    className="grid md:grid-cols-3 gap-8 justify-items-center"
    variants={containerVariants}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.3 }}
  >

    {/* STUDENT MENTORS */}
    <motion.div
      className="relative flex flex-col items-center"
      variants={itemVariants}
    >
      <div className="w-60 h-60 rounded-full bg-gray-200 flex items-center justify-center">
        <img src={m1} className="w-60 h-60 rounded-full" />
      </div>

      <div className="bg-white px-6 py-4 rounded-md text-center w-56">
        <p className="font-medium text-[#333333] text-2xl">
          Student Mentors
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Strong fundamentals & execution
        </p>
      </div>
    </motion.div>

    {/* CORPORATE MENTORS */}
    <motion.div
      className="relative flex flex-col items-center"
      variants={itemVariants}
    >
      <div className="w-60 h-60 rounded-full bg-gray-200 flex items-center justify-center">
        <img src={m2} className="w-60 h-60 rounded-full" />
      </div>

      <div className="bg-white px-6 py-4 rounded-md text-center w-56">
        <p className="font-medium text-[#333333] text-2xl">
          Corporate Mentors
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Real-world project exposure
        </p>
      </div>
    </motion.div>

    {/* INDUSTRY EXPERTS */}
    <motion.div
      className="relative flex flex-col items-center"
      variants={itemVariants}
    >
      <div className="w-60 h-60 rounded-full bg-gray-200 flex items-center justify-center">
        <img src={m3} className="w-60 h-60 rounded-full" />
      </div>

      <div className="bg-white px-6 py-4 rounded-md text-center w-56">
        <p className="font-medium text-[#333333] text-2xl">
          Industry Experts
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Advanced guidance & mastery
        </p>
      </div>
    </motion.div>

  </motion.div>

  {/* Spacer so overlap doesn't collide with next section */}
  <div className="h-20" />
</section>


        {/* ======================================================
            SECTION 4 — outro
        ====================================================== */}
<section
  className="relative mx-auto px-6 py-20 overflow-hidden"
  style={{ backgroundColor: "var(--algo-purple)" }}
>
  <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">

    {/* LEFT — TEXT */}
    <div>
      <h2 className="text-5xl font-semibold leading-tight mb-6 text-white">
        Stop hopping mentors.
        <br />
        Take a structured flight with AlgoNest.
      </h2>

      <p className="text-lg text-purple-100 max-w-xl mb-10">
        Real progress doesn’t come from random sessions.
        It comes from a clear plan, consistent execution,
        and a system designed for completion.
      </p>

      <div className="flex gap-6 items-center">
        <a
          href="/start"
          className="px-8 py-3 rounded-md font-medium text-[var(--text-dark)]"
          style={{ backgroundColor: "var(--nest-yellow)" }}
        >
          Start with a structured plan
        </a>

        <a
          href="/consult"
          className="font-medium text-white underline underline-offset-4"
        >
          Consult before starting →
        </a>
      </div>
    </div>

    {/* RIGHT — AIRPLANE + PATH */}
    <div className="relative h-[320px]">

      {/* Curved dashed path */}
      <svg
        className="absolute inset-0"
        viewBox="0 0 400 300"
        fill="none"
      >
        <path
          d="M20 240 C120 160, 220 180, 340 80"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="2"
          strokeDasharray="6 6"
        />
      </svg>

      {/* Airplane placeholder */}
      <div className="relative top-[-210px] right-[-160px] text-white text-lg">
        <img src={AlgoPlane}/>
      </div>
{/* 
      <div className="absolute bottom-0 left-0 w-48 h-48 border border-dashed border-white/40 rounded-lg flex items-center justify-center text-white/70 text-sm text-center">
        
      </div> */}
    </div>

  </div>
</section>




        {/* ======================================================
            FOOTER
        ====================================================== */}
<footer className="border-t border-gray-200 bg-white">
  <div className="max-w-7xl mx-auto px-6 py-20">

    {/* Top grid */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

      {/* Brand */}
      <div>
        <h3 className="text-lg font-semibold text-[#333333] mb-3">
          AlgoNest
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
          A structured 1-to-1 mentorship system designed to help students
          finish what they start — with clarity, accountability, and outcomes.
        </p>
      </div>

      {/* Product */}
      <div>
        <h4 className="text-sm font-medium text-[#333333] mb-4">
          Product
        </h4>
        <ul className="space-y-3 text-sm text-gray-600">
          <li>
            <a href="/how-it-works" className="hover:text-[#333333]">
              How it works
            </a>
          </li>
          <li>
            <a href="/projects" className="hover:text-[#333333]">
              Project Development
            </a>
          </li>
          <li>
            <a href="/school-help" className="hover:text-[#333333]">
              School & College Help
            </a>
          </li>
          <li>
            <a href="/placements" className="hover:text-[#333333]">
              Placement Preparation
            </a>
          </li>
        </ul>
      </div>

      {/* Company */}
      <div>
        <h4 className="text-sm font-medium text-[#333333] mb-4">
          Company
        </h4>
        <ul className="space-y-3 text-sm text-gray-600">
          <li>
            <a href="/about" className="hover:text-[#333333]">
              About AlgoNest
            </a>
          </li>
          <li>
            <a href="/mentors" className="hover:text-[#333333]">
              Mentor ecosystem
            </a>
          </li>
          <li>
            <a href="/consult" className="hover:text-[#333333]">
              Consult before starting
            </a>
          </li>
          <li>
            <a href="/careers" className="hover:text-[#333333]">
              Careers
            </a>
          </li>
        </ul>
      </div>

      {/* Support */}
      <div>
        <h4 className="text-sm font-medium text-[#333333] mb-4">
          Support
        </h4>
        <ul className="space-y-3 text-sm text-gray-600">
          <li>
            <a href="/contact" className="hover:text-[#333333]">
              Contact us
            </a>
          </li>
          <li>
            <a href="/faq" className="hover:text-[#333333]">
              FAQs
            </a>
          </li>
          <li>
            <a href="/policies/privacy" className="hover:text-[#333333]">
              Privacy policy
            </a>
          </li>
          <li>
            <a href="/policies/terms" className="hover:text-[#333333]">
              Terms of service
            </a>
          </li>
        </ul>
      </div>
    </div>

    {/* Divider */}
    <div className="border-t border-gray-100 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">

      <p className="text-sm text-gray-500">
        © {new Date().getFullYear()} AlgoNest. All rights reserved.
      </p>

      <p className="text-sm text-gray-500">
        Built for completion, not consumption.
      </p>
    </div>

  </div>
</footer>


      </main>
    </>
  );
}

/* ================= COMPONENTS ================= */
function FlowBox({ text }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
      <span className="text-sm text-gray-700">
        {text}
      </span>
    </div>
  );
}

function SystemCard({ title, points }) {
  return (
    <div className="bg-white p-8 rounded-xl border border-gray-200">
      <h3 className="text-lg font-semibold text-[#6b46c1] mb-4">
        {title}
      </h3>
      <ul className="space-y-2 text-gray-700">
        {points.map((p, i) => (
          <li key={i}>• {p}</li>
        ))}
      </ul>
    </div>
  );
}

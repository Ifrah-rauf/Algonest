import Navbar from "../components/navbar";
import Footer from "../components/footer";
import formula from "../static/growth.png"

export default function PlacementPrep() {
  return (
    <div>
      <Navbar />

      {/* ======================================================
          HERO — PLACEMENT PREP
      ====================================================== */}
      <section className="relative bg-white overflow-hidden">
              <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-24 items-center">
      
                {/* LEFT */}
                <div>
                  <span className="inline-block mb-6 px-4 py-1 border border-gray-300 rounded-full text-sm text-gray-600">
                    Placement mentorship
                  </span>
      
                  <h1 className="text-3xl md:text-5xl font-semibold leading-tight text-[#333] mb-8">
                    Not another DSA course.  
            <br />
            A system that forces consistency.
                  </h1>
      
                  <p className="text-lg text-gray-600 max-w-xl mb-10">
                    Not another DSA course.  
            <br />
            A system that forces consistency.
                  </p>
      
                  <div className="flex gap-12 mb-10">
                    <div>
                      <p className="text-3xl font-semibold">100%</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Exam-aligned planning
                      </p>
                    </div>
                    <div>
                      <p className="text-3xl font-semibold">0</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Syllabus gaps
                      </p>
                    </div>
                  </div>
      
                  <div className="flex gap-6 items-center">
                    <a
                      href="/start"
                      className="px-8 py-3 rounded-md font-medium text-[#333]"
                      style={{ backgroundColor: "#f6c90e" }}
                    >
                      Start syllabus plan
                    </a>
                    <a href="/consult" className="text-[#6b46c1] font-medium">
                      Consult before starting →
                    </a>
                  </div>
                </div>
      
                {/* RIGHT PLACEHOLDER */}
                <div className="relative">
                  <div className="relative rounded-2xl overflow-hidden">
                      <img
                      src={formula}
                      alt="Project Development"
                      className="w-[70%] object-cover grayscale"
                      />
                  </div>
                  <div className="absolute top-[-20px] right-[-40px] bg-white rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.18)] w-56 overflow-hidden">
                      <div className="bg-[#6b46c1] text-white px-4 py-2 text-sm font-medium">
                      Project Plan
                      </div>
                      <div className="p-4 text-sm text-gray-600 space-y-2">
                      <p>✔ Focused study with mentor</p>
                      <p>✔ Track progress</p>
                      <p>✔ Tests, quizes and learning!</p>
                      </div>
                  </div>
                  </div>
                </div>
              <svg
          className="absolute bottom-[-1px] left-0 w-full"
          viewBox="0 0 1440 40"
          preserveAspectRatio="none"
          >
          <path
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
              "
              fill="none"
              stroke="#6b46c1"
              strokeWidth="18"
              opacity="1"
          />
          </svg>
            </section>

      {/* ======================================================
          WHO THIS IS FOR
      ====================================================== */}
      <section className="py-28 px-6">
  <div className="max-w-6xl mx-auto">

    <div className="grid md:grid-cols-[1fr_1.2fr_1.2fr] gap-12 items-center">

      {/* COLUMN 1 — HEADING */}
      <div>
        <h2 className="text-5xl font-semibold text-[#333] leading-tight">
          Are you 
          <br />
          facing this too?
        </h2>
      </div>

      {/* COLUMN 2 — POINTS 1–3 */}
      <div className="space-y-4">
        <PinnedNote text="You know at least one programming language" style={{fontSize:"30px !important"}}/>
        <PinnedNote text="You want a job in an MNC or product-based company" />
        <PinnedNote text="You keep postponing DSA practice" />
      </div>

      {/* COLUMN 3 — POINTS 4–6 */}
      <div className="space-y-4">
        <PinnedNote text="You are weak in English & communication" />
        <PinnedNote text="Interviews and coding, both scare you" />
        <PinnedNote text="You need external accountability to stay consistent" />
      </div>

    </div>
  </div>
</section>


      {/* ======================================================
          WHAT WE ARE (POSITIONING)
      ====================================================== */}
      <section className="relative py-20 px-6">
  <div className="max-w-4xl mx-auto">

    {/* Heading */}
    <h2 className="text-4xl max-w-2xl mx-auto font-semibold mb-10 text-center">
      What placement mentorship really means at AlgoNest
    </h2>

    {/* Comparison Table */}
    <div className="grid grid-cols-[0.35fr_0.325fr_0.325fr] max-w-5xl mx-auto rounded-xl overflow-hidden shadow-xl">

      {/* LEFT LABEL COLUMN */}
      <div className="bg-white mt-20">
        {[
          "Primary focus",
          "Teaching style",
          "Daily responsibility",
          "DSA approach",
          "Communication training",
          "Final outcome",
        ].map((item, i) => (
          <div
            key={i}
            className="px-4 py-3 border-b border-gray-200 text-sm text-gray-700 font-medium"
          >
            {item}
          </div>
        ))}
      </div>

      {/* WHAT WE ARE */}
      <div className="border-2 border-[#6b46c1] rounded">
        <div className="px-6 py-6 border-b border-[#6b46c1]/40 font-semibold text-[#1f2a6d]">
          What we ARE
        </div>

        {[
          "Consistency & discipline system",
          "Mentor-led, pattern-first learning",
          "Mentors track & push execution",
          "Daily DSA patterns, not random questions",
          "Regular speaking & interview practice",
          "Placement readiness & confidence",
        ].map((item, i) => (
          <div
            key={i}
            className="px-4 py-3 border-b border-[#6b46c1]/40 text-sm text-[#1f2a6d] flex items-center gap-2"
          >
            <span className="text-green-700 font-bold">✔</span>
            {item}
          </div>
        ))}
      </div>

      {/* WHAT WE ARE NOT */}
      <div className="rounded">
        <div className="px-6 py-6 border-b border-black/40 font-semibold text-[#7a1f1f]">
          What we are NOT
        </div>

        {[
          "A video-based DSA course",
          "YouTube-style problem solving",
          "Self-paced, no-followup learning",
          "Random question marathons",
          "One-time mock interviews",
          "Certificate-only programs",
        ].map((item, i) => (
          <div
            key={i}
            className="px-4 py-3 border-b border-black/30 text-sm text-[#7a1f1f] flex items-center gap-2"
          >
            <span className="text-red-600 font-bold">✕</span>
            {item}
          </div>
        ))}
      </div>

    </div>
  </div>
</section>


      {/* ======================================================
          TIMELINE / PHASES
      ====================================================== */}
    <section className="relative mx-auto px-6 py-32 bg-[#333] overflow-hidden">

  {/* ================= TOP WAVE ================= */}
  <svg
    className="absolute top-[-1px] left-0 w-full rotate-180"
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

  <div className="max-w-6xl mx-auto">

    {/* Heading */}
    <div className="mb-20 max-w-3xl">
      <h2 className="text-4xl font-semibold text-white mb-4 mt-5">
        How placement prep actually works
      </h2>
      <p className="text-gray-200 text-lg">
        A fixed mentorship structure that builds consistency, confidence,
        and interview readiness — regardless of college or syllabus.
      </p>
    </div>

    {/* Timeline */}
    <div className="relative">

      {/* Timeline line */}
      <div className="absolute top-6 left-0 right-0 h-1 bg-gray-500 rounded" />

      {/* Timeline steps */}
      <div className="grid grid-cols-6 gap-6 relative">

        {[
          {
            title: "Initial Assessment",
            period: "Week 1",
            desc: "Evaluate coding level, communication gaps, and interview readiness.",
          },
          {
            title: "Syllabus Analysis",
            period: "Weeks 2–3",
            desc: "Identify relevant DSA topics and learning order based on goals.",
          },
          {
            title: "Structured Practice",
            period: "Months 1–3",
            desc: "Daily pattern-based problem solving with mentor accountability.",
          },
          {
            title: "Mid-Phase Review",
            period: "Midpoint",
            desc: "Periodic test, gap analysis, and plan correction.",
          },
          {
            title: "Interview Readiness",
            period: "Months 4–5",
            desc: "Mock interviews, communication practice, and confidence building.",
          },
          {
            title: "Final Evaluation",
            period: "End Phase",
            desc: "Final mock interviews and placement readiness review.",
          },
        ].map((step, i) => (
          <div key={i} className="relative text-center">

            {/* Timeline node */}
            <div className="relative z-10 mx-auto w-10 h-10 rounded-full bg-white border-2 border-[#6b46c1] flex items-center justify-center text-lg font-medium text-[#6b46c1]">
              {i + 1}
            </div>

            {/* Content */}
            <div className="mt-6 px-2">
              <p className="text-sm text-gray-300">
                {step.period}
              </p>
              <h3 className="text-gray-100 font-semibold mt-1">
                {step.title}
              </h3>
              <p className="text-sm text-gray-300 mt-2">
                {step.desc}
              </p>
            </div>

          </div>
        ))}

      </div>
    </div>
  </div>

  {/* ================= BOTTOM WAVE ================= */}
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
          PRICING
      ====================================================== */}
      <section id="pricing" className="bg-white py-32 px-6">
        <div className="max-w-6xl mx-auto">

          <h2 className="text-4xl font-semibold text-[#333] mb-16">
            Placement Prep Pricing
          </h2>

          <div className="grid md:grid-cols-3 gap-10">

            <PricingCard
              title="DSA — 6 Months"
              price="₹18,000 – ₹25,000"
              points={[
                "Pattern-based DSA",
                "Weekly mentor reviews",
                "Basic communication support",
              ]}
            />

            <PricingCard
              title="Crash Course — 2 Months"
              price="₹8,000 – ₹12,000"
              highlight
              points={[
                "Revision-focused",
                "Mock interviews",
                "Last-mile confidence boost",
              ]}
            />

            <PricingCard
              title="DSA — 12 Months"
              price="₹30,000 – ₹45,000"
              points={[
                "Slow & disciplined prep",
                "Deep consistency tracking",
                "Full interview readiness",
              ]}
            />

          </div>
        </div>
        <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-4 max-w-4xl border-l-4 border-[#6b46c1] pl-6 ml-6  mb-5 mt-14">
          <h2 className="text-xl font-semibold text-[#333]">
            Optional add-ons:
          </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10">

            <AddonCard
              title="Interview Prep"
              price="₹2,000 – ₹5,000"
              desc="Mock interviews with detailed feedback."
            />

            <AddonCard
              title="Project Evaluation"
              price="₹1,500 – ₹4,000"
              desc="Review existing projects from interviewer perspective."
            />

            <AddonCard
              title="Technical Communication"
              price="₹2,000 – ₹6,000"
              desc="English, explanations, and confidence training."
            />

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ================= COMPONENTS ================= */

function PinnedNote({ text }) {
  return (
    <div className="relative bg-white border border-gray-300 rounded-md px-4 py-3 text-m text-gray-800 shadow-[2px_2px_0px_rgba(0,0,0,0.25)]">
      <span className="absolute -left-3 -top-3 text-3xl">📌</span>
      {text}
    </div>
  );
}

function PhaseCard({ title, desc }) {
  return (
    <div className="bg-white text-[#333] rounded-xl p-6">
      <h3 className="font-medium text-lg mb-2 text-[#6b46c1]">
        {title}
      </h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}

function PricingCard({ title, price, points, highlight }) {
  return (
    <div
      className={`rounded-xl p-8 text-center border ${
        highlight ? "border-2 border-[#6b46c1]" : "border-gray-200"
      }`}
    >
      <h3 className="font-medium text-xl mb-2">{title}</h3>
      <p className="text-3xl font-semibold text-[#6b46c1] mb-6">
        {price}
      </p>
      <ul className="space-y-2 text-sm text-gray-600">
        {points.map((p, i) => (
          <li key={i}>• {p}</li>
        ))}
      </ul>
    </div>
  );
}

function AddonCard({ title, price, desc }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="font-medium text-lg mb-2">{title}</h3>
      <p className="text-[#6b46c1] font-medium mb-2">{price}</p>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}

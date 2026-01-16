import Navbar from "../components/navbar";
import formula from "../static/formula.png"
import Footer from "../components/footer.jsx";

export default function CourseSyllabus() {
  return (
    <div>
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-24 items-center">

          {/* LEFT */}
          <div>
            <span className="inline-block mb-6 px-4 py-1 border border-gray-300 rounded-full text-sm text-gray-600">
              Structured syllabus mentorship
            </span>

            <h1 className="text-3xl md:text-5xl font-semibold leading-tight text-[#333] mb-8">
              Finish your syllabus  
              <br />
              without last-minute panic.
            </h1>

            <p className="text-lg text-gray-600 max-w-xl mb-10">
              1-to-1 syllabus completion mentorship for school and college students —
              aligned with exams, NEP outcomes, and academic confidence.
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

      {/* ================= TAKEAWAYS ================= */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">

          <h2 className="text-4xl font-semibold text-center mb-16">
            What this mentorship actually gives you
          </h2>

          <div className="grid md:grid-cols-2 gap-16">

            {/* ================= SCHOOL COLUMN ================= */}
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <h3 className="text-2xl font-semibold text-[#6b46c1] mb-6">
                School Students (NEP-Aligned)
              </h3>

              <ul className="space-y-4 text-gray-700 text-sm">
                <li>✔ Competency-based learning (not rote memorization)</li>
                <li>✔ NEP-aligned focus on understanding & application</li>
                <li>✔ Project-based thinking encouraged by NEP 2020</li>
                <li>✔ Reduced exam anxiety through planned coverage</li>
                <li>✔ Continuous assessment readiness</li>
                <li>✔ Concept clarity across subjects</li>
                <li>✔ Builds independent learning habits early</li>
              </ul>

              <div className="mt-6 text-sm text-gray-500">
                Ideal for Classes 6–12 following CBSE / ICSE / State Boards
              </div>
            </div>

            {/* ================= COLLEGE COLUMN ================= */}
            <div className="bg-white border-2 border-[#6b46c1] rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-semibold text-[#6b46c1] mb-6">
                College Students (Career-Oriented)
              </h3>

              <ul className="space-y-4 text-gray-700 text-sm">
                <li>✔ Strong conceptual base for technical interviews</li>
                <li>✔ Syllabus linked to real-world applications</li>
                <li>✔ Better GPA through structured revision</li>
                <li>✔ Resume-relevant subject mastery</li>
                <li>✔ Preparation for placements & higher studies</li>
                <li>✔ Credit-wise prioritization</li>
                <li>✔ Reduces dependency on last-minute cramming</li>
              </ul>

              <div className="mt-6 text-sm text-gray-500">
                Ideal for UG / PG students across streams
              </div>
            </div>

          </div>
        </div>
      </section>

<div className="py-20 px-20 bg-[#333]">

  {/* Heading */}
  <div className="mb-20 max-w-3xl">
    <h2 className="text-4xl font-semibold text-white mb-4 mt-5">
      How your syllabus is completed
    </h2>
    <p className="text-gray-200 text-lg">
      A fixed academic process that adapts to your syllabus —
      not a one-size-fits-all content plan.
    </p>
  </div>

  {/* Timeline */}
  <div className="relative">

    {/* Timeline line */}
    <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded" />

    {/* Timeline steps */}
    <div className="grid grid-cols-6 gap-6 relative">
      {[
        {
          title: "Syllabus Analysis",
          phase: "Start",
          desc: "Understand board/university syllabus, exam pattern, and priorities.",
        },
        {
          title: "Content Mapping",
          phase: "Phase 1",
          desc: "Identify important chapters, weightage, and learning sequence.",
        },
        {
          title: "Session Distribution",
          phase: "Phase 2",
          desc: "Allocate time across subjects and topics based on difficulty.",
        },
        {
          title: "Guided Coverage",
          phase: "Phase 3",
          desc: "Structured teaching with regular doubt resolution and checkpoints.",
        },
        {
          title: "Mid-Plan Evaluation",
          phase: "Checkpoint",
          desc: "Periodic test to assess understanding and rebalance focus.",
        },
        {
          title: "Final Revision & Test",
          phase: "Completion",
          desc: "End-to-end revision with final evaluation before exams.",
        },
      ].map((step, i) => (
        <div key={i} className="relative text-center">

          {/* Timeline node */}
          <div className="relative z-10 mx-auto w-10 h-10 rounded-full bg-white border-2 border-[#6b46c1] flex items-center justify-center text-lg font-medium text-[#6b46c1]">
            {i + 1}
          </div>

          {/* Content */}
          <div className="mt-6 px-2">
            <p className="text-sm text-gray-300">{step.phase}</p>
            <h3 className="text-gray-200 font-semibold mt-1">
              {step.title}
            </h3>
            <p className="text-sm text-gray-200 mt-2">
              {step.desc}
            </p>
          </div>

        </div>
      ))}
    </div>

    {/* Reinforcement */}
    <div className="mt-24 max-w-4xl border-l-4 border-[#6b46c1] pl-6">
      <p className="text-gray-200 text-lg">
        Subjects may differ.  
        <span className="font-medium">The academic process stays the same.</span>
        <br />
        That’s how syllabus completion stays predictable.
      </p>
    </div>

  </div>

</div>



      {/* ================= PRICING ================= */}
      <section className="bg-white py-32 px-6">
        <div className="max-w-6xl mx-auto">

          <div className="mb-20 max-w-3xl">
            <h2 className="text-4xl font-semibold mb-4">
              Pricing — based on syllabus scope
            </h2>
            <p className="text-gray-600 text-lg">
              You pay for structured completion, not random sessions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">

            {/* SCHOOL PRICING */}
            <div className="bg-white border-2 border-[#6b46c1] rounded-xl p-8">
              <h3 className="text-xl font-medium mb-6 text-center">
                School Syllabus
              </h3>
              <div className="grid grid-cols-2 gap-6 relative">
                <div className="absolute left-1/2 top-0 h-full w-px bg-gray-300" />

                <div className="pr-4">
                  <h4 className="font-medium text-[#6b46c1]">
                    Mid-Semester
                  </h4>
                  <h4 className="text-sm text-[#6b46c1] mb-3">
                    6 months
                  </h4>
                  <p className="text-xl font-semibold mb-3">₹3,000 – ₹6,000</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Selected chapters</li>
                    <li>• Exam-focused revision</li>
                    <li>• Doubt clearing</li>
                  </ul>
                </div>

                <div className="pl-4">
                  <h4 className="font-medium text-[#6b46c1] ">
                    Full Semester
                  </h4>
                  <h4 className="text-sm text-[#6b46c1] mb-3">
                    12 months
                  </h4>
                  <p className="text-xl font-semibold mb-3">₹8,000 – ₹15,000</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Complete syllabus</li>
                    <li>• Weekly mentoring</li>
                    <li>• Revision & assessments</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* COLLEGE PRICING */}
            <div className="bg-white border-2 border-[#6b46c1] rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-medium mb-6 text-center">
                College Syllabus
              </h3>

              <div className="grid grid-cols-2 gap-6 relative">
                <div className="absolute left-1/2 top-0 h-full w-px bg-gray-300" />

                <div className="pr-4">
                  <h4 className="font-medium text-[#6b46c1]">
                    Semester
                  </h4>
                  <h4 className="text-sm text-[#6b46c1] mb-3">
                    6 months
                  </h4>
                  <p className="text-xl font-semibold mb-3">₹5,000 – ₹8,000</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Backlog focus</li>
                    <li>• Internals prep</li>
                    <li>• Numericals & theory</li>
                  </ul>
                </div>

                <div className="pl-4">
                  <h4 className="font-medium text-[#6b46c1]">
                    Year
                  </h4>
                  <h4 className="text-sm text-[#6b46c1] mb-3">
                    12 months
                  </h4>
                  <p className="text-xl font-semibold mb-3">₹12,000 – ₹25,000</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• End-to-end coverage</li>
                    <li>• PYQs & exam patterns</li>
                    <li>• Placement-ready concepts</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-20 max-w-4xl border-l-4 border-[#6b46c1] pl-6">
            <p className="text-gray-700 text-lg">
              Mentors may change.  
              <span className="font-medium">The syllabus plan does not.</span>
              <br />
              That’s how students actually finish on time.
            </p>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}

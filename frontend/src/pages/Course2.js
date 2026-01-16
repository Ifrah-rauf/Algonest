import Navbar from "../components/navbar";
import teamwork from "../static/teamwork.png"
import AlgoPlane from "../static/AlgoPlane.png";
import Footer from "../components/footer.jsx";
export default function Course2() {
    
return(
    
    <div>
        <Navbar/>
        <section className="relative bg-white overflow-hidden">

        {/* ================= CONTENT ================= */}
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-24 items-center">

            {/* LEFT — TEXT */}
            <div>
            {/* Eyebrow */}
            <span className="inline-block mb-6 px-4 py-1 border border-gray-300 rounded-full text-sm text-gray-600">
                For serious builders
            </span>

            <h1 className="text-3xl md:text-5xl font-semibold leading-tight text-[#333] mb-8">
                Finish complex projects
                <br />
                - the way professionals do.
            </h1>

            <p className="text-lg text-gray-600 max-w-xl mb-10">
                Advanced project development mentorship designed for students
                who want to build real, production-grade systems — not half-done demos.
            </p>

            {/* Metrics */}
            <div className="flex gap-12 mb-10">
                <div>
                <p className="text-3xl font-semibold text-[#333]">100%</p>
                <p className="text-sm text-gray-500 mt-1">
                    Structured roadmap
                </p>
                </div>

                <div>
                <p className="text-3xl font-semibold text-[#333]">0</p>
                <p className="text-sm text-gray-500 mt-1">
                    Random mentoring
                </p>
                </div>
            </div>

            {/* CTA */}
            <div className="flex gap-6 items-center">
                <a
                href="/start"
                className="px-8 py-3 rounded-md font-medium text-[#333]"
                style={{ backgroundColor: "#f6c90e" }}
                >
                Start Advanced Project Plan
                </a>

                <a
                href="/consult"
                className="text-[#6b46c1] font-medium"
                >
                Consult before starting →
                </a>
            </div>
            </div>

            {/* RIGHT — VISUAL */}
            <div className="relative">

            {/* Main card */}
            <div className="relative rounded-2xl overflow-hidden">
                <img
                src={teamwork}
                alt="Project Development"
                className="w-[70%] object-cover grayscale"
                />
            </div>

            {/* Floating UI card */}
            <div className="absolute top-[-20px] right-[-20px] bg-white rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.18)] w-64 overflow-hidden">
                <div className="bg-[#6b46c1] text-white px-4 py-2 text-sm font-medium">
                Project Plan
                </div>
                <div className="p-4 text-sm text-gray-600 space-y-2">
                <p>✔ System design breakdown</p>
                <p>✔ Milestone-based execution</p>
                <p>✔ Code reviews & iteration</p>
                </div>
            </div>

            </div>
        </div>

        {/* ================= BOTTOM WAVES ================= */}
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
    <section className="relative py-32 px-6">


    <div className="max-w-4xl mx-auto">

    {/* Heading */}
    <h2 className="text-4xl max-w-xl mx-auto font-semibold mb-10 text-center">
      Is Advanced Project Development right for you?
    </h2>

    {/* Comparison Table */}
    <div className="grid grid-cols-[0.3fr_0.4fr_0.4fr] max-w-5xl rounded-xl overflow-hidden shadow-xl">

      {/* LEFT LABEL COLUMN */}
      <div className="bg-white mt-20">
        {[
          "Experience level",
          "Learning intent",
          "Commitment expectation",
          "Mentorship style",
          "Outcome focus",
          "Completion mindset",
        ].map((item, i) => (
          <div
            key={i}
            className="px-2 py-3 border-b border-gray-200 text-sm text-gray-700 font-medium"
          >
            {item}
          </div>
        ))}
      </div>

      {/* FOR YOU */}
      {/* <div className="bg-[#ccff99] "> */}
      <div className="border-2 border-[#6b46c1] rounded">
        <div className="px-6 py-6 border-b border-[#6b46c1]/40 font-semibold text-[#1f2a6d]">
          This is for you
        </div>

        {[
          "You already know the basics",
          "You want to build something real",
          "You can commit weekly time",
          "You want guidance, not spoon-feeding",
          "You care about architecture & quality",
          "You want to finish what you start",
        ].map((item, i) => (
          <div
            key={i}
            className="px-2 py-3 border-b border-[#6b46c1]/40 text-sm text-[#1f2a6d] flex items-center gap-2"
          >
            <span className="text-green-700 font-bold">✔</span>
            {item}
          </div>
        ))}
      </div>

      {/* NOT FOR YOU */}
      {/* <div className="bg-[#ffe6e6]"> */}
      <div className="rounded">
        <div className="px-6 py-6 border-b border-black/40 font-semibold text-[#7a1f1f]">
          This is NOT for you
        </div>

        {[
          "You are a complete beginner",
          "You want only videos or notes",
          "You can’t commit time regularly",
          "You expect mentors to do the work",
          "You want quick certificates",
          "You are not ready to finish a project",
        ].map((item, i) => (
          <div
            key={i}
            className="px-2 py-3 border-b border-black/30 text-sm text-[#7a1f1f] flex items-center gap-2"
          >
            <span className="text-red-600 font-bold">✕</span>
            {item}
          </div>
        ))}
      </div>

    </div>

  </div>
</section>
<section className="bg-white py-20 px-6 max-w-7xl mx-auto shadow-xl rounded-xl border-2 border-gray-200">
  <div className="max-w-6xl mx-auto">

    {/* Heading */}
    <div className="mb-14 max-w-3xl m-auto">
      <h2 className="text-4xl font-semibold text-[#333] mb-4 text-center">
        {/* <img className="h-[50px] w-[50px]" src={AlgoPlane}/> */}
        What you will actually build
      </h2>
      <p className="text-gray-600 text-lg">
        This is not a “learning experience”.  
        You leave with a finished, reviewable, real-world project.
      </p>
    </div>

    {/* Outcomes Grid */}
    <div className="grid md:grid-cols-3 gap-10">

      {/* Outcome 1 */}
      <div className="border border-gray-200 rounded-xl p-8">
        <h3 className="font-medium text-xl mb-3 text-[#6b46c1]">
          A Production-Grade Project
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          A fully working application with real use-cases — not a toy demo.
          Designed to be discussed confidently in interviews.
        </p>
        <ul className="mt-4 text-sm text-gray-600 space-y-2">
          <li>• Clear problem statement</li>
          <li>• End-to-end functionality</li>
          <li>• Realistic constraints</li>
        </ul>
      </div>

      {/* Outcome 2 */}
      <div className="border border-gray-200 rounded-xl p-8">
        <h3 className="font-medium text-xl mb-3 text-[#6b46c1]">
          Clean Architecture & Design
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          Your project is structured the way real teams expect — readable,
          scalable, and maintainable.
        </p>
        <ul className="mt-4 text-sm text-gray-600 space-y-2">
          <li>• Modular code structure</li>
          <li>• Logical separation of concerns</li>
          <li>• Industry-aligned patterns</li>
        </ul>
      </div>

      {/* Outcome 3 */}
      <div className="border border-gray-200 rounded-xl p-8">
        <h3 className="font-medium text-xl mb-3 text-[#6b46c1]">
          Deployment & Real Usage
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          Your project doesn’t live on localhost.  
          It’s deployed, usable, and ready to be shared.
        </p>
        <ul className="mt-4 text-sm text-gray-600 space-y-2">
          <li>• Live deployment</li>
          <li>• Environment setup</li>
          <li>• Basic performance awareness</li>
        </ul>
      </div>

    </div>
    <div className="flex items-center gap-4 mt-20 mb-6 max-w-4xl border-l-4 border-[#6b46c1] pl-6 ml-6">
        <h1 className="text-4xl font-semibold ">
        Key Takeaways
        </h1>
        {/* <div className="w-48 h-48 flex items-center justify-center">
            <img
            src={AlgoPlane}
            alt="AlgoNest plane"
            className="w-full h-full object-contain"
            />
        </div> */}
    </div>
    <div className="grid grid-cols-3 relative">

      {/* Vertical dividers */}
      <div className="absolute left-1/3 top-0 h-full w-px bg-gray-300" />
      <div className="absolute left-2/3 top-0 h-full w-px bg-gray-300" />

      {/* COLUMN 1 */}
      <div className="px-6 space-y-4">
        <PinnedNote text="No fixed direction after sessions." />
        <PinnedNote text="Mentors change the flow every time." />
        <PinnedNote text="Progress feels unclear." />
      </div>

      {/* COLUMN 2 */}
      <div className="px-6 space-y-4">
        <PinnedNote text="Same doubts repeat across sessions." />
        <PinnedNote text="Issues are patched, not solved." />
        <PinnedNote text="Learning moves in circles." />
      </div>

      {/* COLUMN 3 */}
      <div className="px-6 space-y-4">
        <PinnedNote text="Motivation drops after 2–3 weeks." />
        <PinnedNote text="No visible finish line." />
        <PinnedNote text="Projects are abandoned quietly." />
      </div>

    </div>

  </div>
</section>

<section className="relative mx-auto px-6 py-16 bg-[#333] overflow-hidden mt-20">

  {/* ================= TOP WAVE ================= */}
  {/* <svg
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
  </svg> */}
  <div className="max-w-6xl mx-auto">

    {/* Heading */}
    <div className="mb-20 max-w-3xl">
      <h2 className="text-4xl font-semibold text-white mb-4 mt-5">
        How your project is built
      </h2>
      <p className="text-gray-200 text-lg">
        A fixed curriculum used by mentors and teams to take projects
        from idea → deployment without losing direction.
      </p>
      {/* <p className="text-gray-700 text-lg">
          Mentors may change.  
          <span className="font-medium"> The curriculum does not.</span>
          <br />
          That’s how projects actually get finished.
        </p> */}
    </div>

    {/* Timeline */}
    <div className="relative">

      {/* Timeline line */}
      <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded" />

      {/* Timeline steps */}
      <div className="grid grid-cols-6 gap-6 relative">
        {[
          {
            title: "Problem Definition",
            month: "Week 1",
            desc: "Clear problem statement, constraints, and success criteria.",
          },
          {
            title: "Scope & Planning",
            month: "Weeks 2–3",
            desc: "Feature breakdown, tech stack selection, milestones locked.",
          },
          {
            title: "System Design",
            month: "Weeks 4–5",
            desc: "Architecture, data flow, APIs, and design decisions.",
          },
          {
            title: "Core Development",
            month: "Weeks 6–9",
            desc: "Incremental feature building with mentor reviews.",
          },
          {
            title: "Refinement",
            month: "Weeks 10–11",
            desc: "Edge cases, cleanup, performance, and UX polish.",
          },
          {
            title: "Deployment & Review",
            month: "Week 12+",
            desc: "Deployment, documentation, and interview-ready walkthrough.",
          },
        ].map((step, i) => (
          <div key={i} className="relative text-center">

            {/* Timeline node */}
            <div className="relative z-10 mx-auto w-10 h-10 rounded-full bg-white border-2 border-[#6b46c1] flex items-center justify-center text-2xl font-medium text-[#6b46c1]">
              {i + 1}
            </div>

            {/* Content */}
            <div className="mt-6 px-2">
              <p className="text-sm text-gray-300">{step.month}</p>
              <h3 className="text-gray-200 font-extrabold mt-1">
                {step.title}
              </h3>
              <p className="text-sm text-gray-200 mt-2">
                {step.desc}
              </p>
            </div>

          </div>
        ))}
      </div>

    </div>

  </div>
  {/* <svg
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
  </svg> */}
</section>


<section className="bg-gray-50 py-32 px-6">
  <div className="max-w-6xl mx-auto">

    {/* Heading */}
    <div className="mb-20 max-w-3xl">
      <h2 className="text-4xl font-semibold text-[#333] mb-4">
        Pricing — based on scope, not hype
      </h2>
      <p className="text-gray-600 text-lg">
        You pay for completion, structure, and mentorship — not randomness.
      </p>
    </div>

    {/* Pricing Cards */}
    <div className="grid md:grid-cols-2 gap-10">

      {/* Basic */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
        <h3 className="font-medium text-xl mb-2">Basic Projects</h3>
        <p className="text-gray-500 text-sm mb-6">
          Small to medium scoped projects
        </p>
        <p className="text-3xl font-semibold text-[#6b46c1] mb-6">
          ₹14,000 – ₹25,000
        </p>
        <ul className="text-sm text-gray-600 space-y-2 w-full justify-center">
          <li>• Fixed curriculum</li>
          <li>• Student & working mentors</li>
          <li>• Completion-focused milestones</li>
        </ul>
      </div>

      {/* Advanced (Highlighted) */}
      <div className="bg-white border-2 border-[#6b46c1] rounded-xl p-8 shadow-lg text-center">
        <h3 className="font-medium text-xl mb-2">Advanced Projects</h3>
        <p className="text-gray-500 text-sm mb-6">
          Complex, interview-grade systems
        </p>
        <p className="text-3xl font-semibold text-[#6b46c1] mb-6">
          ₹25,000 – ₹70,000
        </p>
        <ul className="text-sm text-gray-600 space-y-2 justify-center">
          <li>• Deep system design</li>
          <li>• Industry expert reviews</li>
          <li>• Deployment & documentation</li>
        </ul>
      </div>
    </div>

    {/* Pricing Note */}
    <div className="mt-20 max-w-4xl border-l-4 border-[#6b46c1] pl-6">
      <p className="text-gray-700 text-lg">
        Exact pricing depends on project scope and complexity.  
        We align expectations <span className="font-medium">before</span> you start.
      </p>
    </div>

  </div>
</section>


<Footer/>

</div>
)
}
function PinnedNote({ text }) {
  return (
    <div className="relative bg-white border border-black rounded-md px-4 py-2 text-sm text-gray-800 shadow-sm">

      {/* Pin */}
      <span className="absolute -left-3 -top-3 text-lg">
        📌
      </span>

      {text}
    </div>
  );
}

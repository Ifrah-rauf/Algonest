import { Check, X } from "lucide-react";

export default function ComparisonSection() {
  const rows = [
    {
      title: "Project Ownership",
      algonest: "Build and defend your own idea",
      other: "Assigned projects / copied tutorials",
    },
    {
      title: "Accountability",
      algonest: "Strict checkpoints. Cannot drift.",
      other: "Miss sessions, still continue",
    },
    {
      title: "Mentorship",
      algonest: "1:1 mentor for the full system",
      other: "Batch / ad-hoc / rotating mentors",
    },
    {
      title: "Execution Focus",
      algonest: "Outcome = deployed + explainable proof",
      other: "Videos + certificates",
    },
    {
      title: "Feedback Quality",
      algonest: "Deep comprehension checks",
      other: "Surface-level or delayed feedback",
    },
    {
      title: "AI Usage",
      algonest: "AI guides thinking (doesn’t write code)",
      other: "Blind dependency → no understanding",
    },
    {
      title: "Interview Readiness",
      algonest: "Pressure-test sessions on your work",
      other: "Generic prep",
    },
    {
      title: "Completion Rate",
      algonest: "High (tracked + enforced)",
      other: "Low (self-discipline dependent)",
    },
  ];

  return (
    <section className="w-full py-16 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800">
            AlgoNest vs{" "}
            <span className="text-purple-600">Bootcamps & Passive Prep</span>
          </h2>
          <p className="text-gray-500 mt-3 text-sm md:text-base">
            Not access. Not content. Execution.
          </p>
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden shadow-lg border border-purple-100">
          
          {/* Header */}
          <div className="grid grid-cols-3 bg-purple-600 text-white text-sm md:text-base font-medium">
            <div className="p-4">What matters</div>
            <div className="p-4 text-center">AlgoNest</div>
            <div className="p-4 text-center">Others</div>
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-3 text-sm md:text-[15px] ${
                i % 2 === 0 ? "bg-white" : "bg-purple-50"
              }`}
            >
              <div className="p-4 font-medium text-gray-700">
                {row.title}
              </div>

              <div className="p-4 flex items-center gap-2 text-gray-800">
                <Check className="text-purple-600 w-4 h-4" />
                {row.algonest}
              </div>

              <div className="p-4 flex items-center gap-2 text-gray-500">
                <X className="text-gray-400 w-4 h-4" />
                {row.other}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Insight Strip */}
        <div className="mt-8 text-center bg-purple-600 text-white py-4 px-6 rounded-xl text-sm md:text-base shadow-md">
          You can skip passive prep. You cannot skip AlgoNest.
        </div>

      </div>
    </section>
  );
}

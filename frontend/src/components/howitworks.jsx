import { useState } from "react";
import HowItWorksStep from "../components/HowItWorksStep";

export default function HowItWorksScroll() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: 1,
      title: "Consult & Assess",
      description:
        "Drop us a query, 'Where do I begin?' We understand your level, goals, and constraints before planning.",
    },
    {
      number: 2,
      title: "Structured Plan",
      description:
        "Choose a fixed roadmap on what you aim to build that replaces cohorts, bootcamps, random sessions and confusion. Select your own project or take smart suggestions",
    },
    {
      number: 3,
      title: "Execute it with Mentors personally",
      description:
        "We'll make possible! According to you we'll plan daily accountability, tracking, pattern training, guidance and interviews",
    },
    {
      number: 4,
      title: "Track & Finish",
      description:
        "You end up being creating your own product! deploy, compete and see visible progress until completion",
    },
  ];

  return (
    <section id="howitworks" className="py-20 bg-white rounded-xl">
      <div className="max-w-4xl mx-auto px-4">

        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-[#333] mb-4">
            How It <span className="text-[#6b46c1]">Works</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A system designed to keep you moving — not restarting.
          </p>
        </div>

        {steps.map((step, index) => (
          <HowItWorksStep
            key={index}
            step={step}
            index={index}
            isActive={activeStep === index}
            setActiveStep={setActiveStep}
            isLast={index === steps.length - 1}
          />
        ))}

      </div>
    </section>
  );
}

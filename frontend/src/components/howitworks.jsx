import { useState } from "react";
import HowItWorksStep from "../components/HowItWorksStep";

export default function HowItWorksScroll() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: 1,
      title: "Create your profile.",
      description:
        "Signup to your account and create your profile. Add your resume, github and project details to get started in the profile tab.",
    },
    {
      number: 2,
      title: "Choose your roadmap.",
      description:
        "Pick a roadmap-Project/ CS or Grill Sessions. Choose the roadmap which aligns with your goals, deadlines, target companies and skillset.",
    },
    {
      number: 3,
      title: "Execute it with AI and Mentor.",
      description:
        "Within the timeline of the roadmap, complete given tasks, assignments and projects under mentor and AI support and tracking.",
    },
    {
      number: 4,
      title: "Finish",
      description:
        "Get your final project reviewed, recorded and deployed. You may continue your journey with more roadmaps from CS and Grill sessions to wrap up interview prep.",
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

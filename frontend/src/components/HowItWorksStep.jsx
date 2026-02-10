import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export default function HowItWorksStep({
  step,
  index,
  isActive,
  setActiveStep,
  isLast,
}) {
  const { ref, inView } = useInView({
    threshold: 1.0,
  });

  useEffect(() => {
  if (!inView) return;

  const timer = setTimeout(() => {
    setActiveStep(index);
  }, 250); // 200–400ms sweet spot

  return () => clearTimeout(timer);
}, [inView, index]);

  return (
    <div ref={ref} className="relative mb-16">

      <div className="flex gap-6 items-start">

        {/* CHECKPOINT */}
        <motion.div
          animate={{
            scale: isActive ? 1.25 : 1,
            backgroundColor: isActive ? "#f6c90e" : "#6b46c1",
          }}
          transition={{
    type: "spring",
    stiffness: 120,
    damping: 18,
    mass: 0.8,
  }}
          className="w-16 h-16 rounded-full flex items-center justify-center
          font-bold text-xl text-[#333] shadow-md"
        >
          {step.number}
        </motion.div>

        {/* TEXT */}
        <div
          className={`flex-1 pt-2 transition-colors duration-300 ${
            isActive ? "text-[#333]" : "text-gray-400"
          }`}
        >
          <h3 className="text-2xl font-bold mb-3">
            {step.title}
          </h3>
          <p className="text-lg leading-relaxed">
            {step.description}
          </p>
        </div>
      </div>

      {/* CONNECTOR */}
      {!isLast && (
        <div className="absolute left-8 top-16 h-16 w-0.5 bg-gray-300" />
      )}
    </div>
  );
}

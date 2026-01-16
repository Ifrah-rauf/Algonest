import { useRef, useEffect, useState } from "react";

export default function FadeInSection({ children }) {
  const ref = useRef(null);
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target); // run once
        }
      },
      { threshold: 0.1 } // 10% visible triggers animation
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
<div
  ref={ref}
  className={`transition-all duration-[2500ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] ${
    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
  }`}
  style={{ willChange: "opacity, transform" }}
>
  {children}
</div>
  );
}

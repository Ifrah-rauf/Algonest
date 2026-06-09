import {
  Linkedin,
  Twitter,
  MessageCircle,
  Sparkles,
  Rocket,
} from "lucide-react";
import { useEffect } from "react";

export default function ComingSoon() {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-violet-800 to-purple-900">
      {/* Background Glow Orbs */}
      <div className="absolute -top-24 right-16 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl animate-pulse" />

      <div className="absolute top-32 left-10 h-72 w-72 rounded-full bg-pink-500/15 blur-3xl animate-pulse [animation-delay:1000ms]" />

      <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-indigo-400/15 blur-3xl animate-pulse [animation-delay:2000ms]" />

      <div className="absolute bottom-20 left-1/3 h-52 w-52 rounded-full bg-cyan-400/10 blur-3xl animate-pulse [animation-delay:3000ms]" />

      {/* Radial Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_60%)]" />

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Noise Effect */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div className="w-full max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-xl transition-all duration-300 hover:scale-105">
            <Sparkles size={14} />
            AlgoNest Community
          </div>

          {/* Heading */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Something
            <span className="block bg-gradient-to-r from-pink-300 via-white to-cyan-300 bg-clip-text text-transparent">
              Exciting
            </span>
            is Coming Soon
          </h1>

          {/* Description */}
          <p className="mx-auto mb-10 max-w-2xl text-sm leading-7 text-white/75 md:text-base">
            Join the AlgoNest ecosystem for project builders, placement
            aspirants, mentors and developers. Stay connected while we build
            the future of project-based learning and mentorship.
          </p>

          {/* Glass Card */}
          <div className="mx-auto mb-8 max-w-xl rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-2xl shadow-2xl shadow-black/20 transition-all duration-500 hover:scale-[1.02]">
            <div className="mb-4 flex items-center justify-center gap-2 text-white">
              <Rocket size={18} />
              <span className="text-sm font-medium">
                Community Launch In Progress
              </span>
            </div>

            <p className="text-xs leading-6 text-white/70">
              Connect with us through our social channels and join the WhatsApp
              community for updates, discussions and early access to AlgoNest.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://www.linkedin.com/company/algonest-edtech/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm text-white backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:shadow-lg hover:shadow-white/10"
            >
              <Linkedin
                size={16}
                className="transition-transform group-hover:rotate-6"
              />
              LinkedIn
            </a>

            <a
              href="https://x.com/algonest_edtech?s=11"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm text-white backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:shadow-lg hover:shadow-white/10"
            >
              <Twitter
                size={16}
                className="transition-transform group-hover:rotate-6"
              />
              Twitter / X
            </a>

            <a
              href="https://chat.whatsapp.com/LZHVXXtGxsO6eVQ1Phh3Bp"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm text-white backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:shadow-lg hover:shadow-white/10"
            >
              <MessageCircle
                size={16}
                className="transition-transform group-hover:rotate-6"
              />
              WhatsApp Community
            </a>
          </div>

          {/* Bottom Label */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-xs text-white/50">
            <span>Project-Based Learning</span>
            <span>1:1 Mentorship</span>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from "react";
import {
  FaEnvelope,
  FaGraduationCap,
  FaInstagram,
  FaLinkedin,
  FaPhone,
} from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";
import "../styles/footer.css";

const platformLinks = [
  { label: "Roadmaps", href: "/roadmaps" },
  { label: "CS Core", href: "/cscore" },
  { label: "Grill Sessions", href: "/grill" },
  { label: "Career Quiz", href: "/careerQuiz" },
];

const exploreLinks = [
  { label: "How It Works", href: "/howitworks" },
  { label: "Find Teachers", href: "/teachers" },
  { label: "Book a Session", href: "/book-now" },
  { label: "Dashboard", href: "/dashboard" },
];

const legalLinks = [
  { label: "Roadmaps", href: "/roadmaps" },
  { label: "Teachers", href: "/teachers" },
  { label: "Book Now", href: "/book-now" },
  { label: "Career Quiz", href: "/careerQuiz" },
];

export function Footer({ className = "" }) {
  const [email, setEmail] = useState("");
  const unsubscribeSubject = encodeURIComponent("Newsletter Unsubscribe");
  const unsubscribeBody = encodeURIComponent(
    "Please unsubscribe this email from the AlgoNest newsletter:"
  );

  const handleSubscribe = (event) => {
    event.preventDefault();

    const subject = encodeURIComponent("Newsletter Subscription");
    const body = encodeURIComponent(`Please subscribe this email: ${email}`);

    window.location.href = `mailto:support@algonest.com?subject=${subject}&body=${body}`;
    setEmail("");
  };

  return (
    <footer className={`algonest-footer w-full text-white ${className}`.trim()}>
      
    <section className="relative py-12 md:py-16 bg-white overflow-hidden">
  
  {/* Left Top Dot Grid Doodle */}
  <div className="absolute left-4 top-8 hidden md:grid grid-cols-4 gap-1.5 opacity-20">
    {[...Array(16)].map((_, i) => (
      <div key={i} className="w-1 h-1 rounded-full bg-violet-600" />
    ))}
  </div>

  {/* Right Bottom Zig-Zag Line Doodle */}
  <div className="absolute right-6 bottom-10 hidden sm:block opacity-20">
    <svg width="60" height="30" fill="none">
      <path d="M0 20 L15 5 L30 20 L45 5 L60 20" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>

  <div className="max-w-4xl mx-auto px-4 relative">
    {/* Main Card with Split Layout */}
    <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-[0_20px_50px_rgba(109,40,217,0.05)] px-6 py-10 md:px-12 md:py-12">
      
      {/* Background Subtle Blobs */}
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-violet-50/70 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-yellow-50/60 blur-2xl pointer-events-none" />

      {/* Doodle Arrow */}
      <svg
        className="absolute right-8 top-10 hidden lg:block opacity-30"
        width="100"
        height="60"
        fill="none"
      >
        <path
          d="M10 15 C35 5 65 15 80 32"
          stroke="#8b5cf6"
          strokeWidth="2"
          strokeDasharray="4 4"
          strokeLinecap="round"
        />
        <path
          d="M70 32 L80 32 L78 22"
          stroke="#8b5cf6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Grid Container: Left Heading, Right Content */}
      <div className="relative z-10 grid md:grid-cols-[1fr_1.2fr] gap-8 md:gap-12 items-start text-left flex justify-center items-center">
        
        {/* Left Side: Main Title */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Ready to build{" "}
            <span className="relative text-violet-600 inline-block">
              proof of work?
              <svg
                className="absolute -bottom-1.5 left-0 w-full"
                height="8"
                viewBox="0 0 170 18"
                preserveAspectRatio="none"
                fill="none"
              >
                <path
                  d="M4 12C45 5 100 5 130 12"
                  fill="none"
                  stroke="#FACC15"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>
        </div>

        {/* Right Side: Description and Professional Actions */}
        <div className="space-y-6">
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            Join a community dedicated to structured technical development, system blueprints, and rigorous progress tracking alongside industry engineers.
          </p>

          <div className="space-y-4 pt-2 border-t border-slate-100">
            {/* Primary Action: Join Community */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-700">Enter as a platform member</span>
              <button className="group px-4 py-2 bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white text-xs font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm">
                Join Community
                <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Secondary Action: Join as Teacher/Mentor (With Email Input) */}
            <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 space-y-3">
              <span className="block text-xs font-semibold text-slate-700">Apply to collaborate as a mentor</span>
              <form className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your professional email"
                  className="flex-1 px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 outline-none focus:border-violet-400 transition-all shadow-inner"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 active:scale-[0.99] text-white text-xs font-semibold rounded-lg transition-all duration-200 text-center whitespace-nowrap shadow-sm"
                >
                  Join as Teacher
                </button>
              </form>
            </div>
          </div>
          
        </div>

      </div>
    </div>
  </div>
</section>


      <section className="mx-auto max-w-7xl px-6 py-12 mt-12">
        <div className="m-4 mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <div className="footer-brand-mark flex h-12 w-12 items-center justify-center rounded-lg">
                <span className="text-3xl font-black">A</span>
              </div>

              <h3 className="text-2xl font-bold text-white">AlgoNest</h3>
            </div>

            {/* <p className="mb-6 max-w-xs text-sm leading-6 text-white/55">
              Structured roadmaps, AI guidance, and personal mentorship for
              students who want to build proof of work.
            </p> */}

            <div className="flex gap-3">
              <SocialLink href="https://twitter.com" label="Twitter">
                <RiTwitterXLine size={18} />
              </SocialLink>

              <SocialLink href="https://instagram.com" label="Instagram">
                <FaInstagram size={18} />
              </SocialLink>

              <SocialLink href="https://linkedin.com" label="LinkedIn">
                <FaLinkedin size={18} />
              </SocialLink>
            </div>
          </div>

          <FooterLinks title="Platform" links={platformLinks} />
          <FooterLinks title="Explore" links={exploreLinks} />

          <div>
            <h4 className="mb-4 font-semibold text-gray-400">Contact Us</h4>

            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400">
                <FaPhone size={14} />
                <FooterTextLink href="tel:+15551234567">
                  +1 (555) 123-4567
                </FooterTextLink>
              </li>

              <li className="flex items-center gap-2 text-gray-400">
                <FaEnvelope size={14} />
                <FooterTextLink href="mailto:support@algonest.com">
                  support@algonest.com
                </FooterTextLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} AlgoNest. All rights reserved.
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              {legalLinks.map((link) => (
                <FooterTextLink key={link.href} href={link.href} small>
                  {link.label}
                </FooterTextLink>
              ))}
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}

function FooterLinks({ title, links }) {
  return (
    <div>
      <h4 className="mb-4 font-semibold text-gray-400">{title}</h4>

      <ul className="space-y-3 text-gray-400">
        {links.map((link) => (
          <li key={link.href}>
            <FooterTextLink href={link.href}>{link.label}</FooterTextLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterTextLink({ href, children, small = false }) {
  return (
    <a
      href={href}
      className={`footer-text-link transition-colors ${
        small ? "text-sm text-gray-400" : "text-sm text-gray-400"
      }`}
    >
      {children}
    </a>
  );
}

function SocialLink({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="footer-social-link flex h-9 w-9 items-center justify-center rounded-full transition-colors"
    >
      {children}
    </a>
  );
}

export default Footer;

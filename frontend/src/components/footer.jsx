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
    <footer className={`algonest-footer mt-20 w-full text-white ${className}`.trim()}>
      <section className="footer-newsletter-band w-full px-4 py-3 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="footer-newsletter-card rounded-lg px-6 py-8 md:px-10 md:py-10">
            <div className="grid items-center gap-8 md:grid-cols-[320px_1fr] lg:gap-12">
              <div className="flex justify-center md:justify-start">
                <div className="footer-cap-card flex h-44 w-44 items-center justify-center rounded-lg">
                  <div className="text-center">
                    <FaGraduationCap className="footer-cap-icon mx-auto mb-4 animate-bounce text-5xl" />
                    <div className="text-sm font-bold">Learn &amp; Grow</div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="mb-3 text-2xl font-bold md:text-3xl">
                  Subscribe to our newsletter
                </h2>

                <p className="mb-6 max-w-2xl text-sm leading-6 text-white/75">
                  Get updates on roadmaps, mentor sessions, projects, and
                  placement preparation resources.
                </p>

                <form
                  onSubmit={handleSubscribe}
                  className="mb-4 flex w-full flex-col gap-3 sm:flex-row"
                >
                  <input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                    className="footer-newsletter-input min-w-0 flex-1 rounded-lg px-4 py-3 text-sm outline-none transition"
                  />

                  <button
                    type="submit"
                    className="footer-subscribe-button shrink-0 rounded-lg px-8 py-3 text-sm font-bold transition-colors"
                  >
                    Subscribe
                  </button>
                </form>

                <p className="text-xs text-white/70">
                  You can{" "}
                  <a
                    href={`mailto:support@algonest.com?subject=${unsubscribeSubject}&body=${unsubscribeBody}`}
                    className="footer-inline-link underline"
                  >
                    unsubscribe
                  </a>{" "}
                  at any time. Explore our{" "}
                  <a
                    href="/roadmaps"
                    className="footer-inline-link underline"
                  >
                    roadmaps
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <div className="footer-brand-mark flex h-12 w-12 items-center justify-center rounded-lg">
                <span className="text-3xl font-black">A</span>
              </div>

              <h3 className="text-2xl font-bold text-white">AlgoNest</h3>
            </div>

            <p className="mb-6 max-w-xs text-sm leading-6 text-white/55">
              Structured roadmaps, AI guidance, and personal mentorship for
              students who want to build proof of work.
            </p>

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
            <h4 className="mb-4 font-semibold text-white">Contact Us</h4>

            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-white/55">
                <FaPhone size={14} />
                <FooterTextLink href="tel:+15551234567">
                  +1 (555) 123-4567
                </FooterTextLink>
              </li>

              <li className="flex items-center gap-2 text-white/55">
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
            <p className="text-sm text-white/40">
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
      <h4 className="mb-4 font-semibold text-white">{title}</h4>

      <ul className="space-y-3">
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
        small ? "text-sm text-white/40" : "text-sm text-white/55"
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

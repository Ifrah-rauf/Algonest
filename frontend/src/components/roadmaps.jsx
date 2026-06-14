import React from "react";
import { ArrowRight } from "lucide-react";

export default function RoadmapsSection() {
const technologyDomains = [
  {
    title: "Web Development",
    link: "#web-development"
  },
  {
    title: "Mobile Development",
    link: "#mobile-development"
  },
  {
    title: "AI & Machine Learning",
    link: "#ai-ml"
  },
  {
    title: "Data Science",
    link: "#data-science"
  },
  {
    title: "Cloud & DevOps",
    link: "#cloud-devops"
  },
  {
    title: "Backend Development",
    link: "#backend"
  },
  {
    title: "Frontend Development",
    link: "#frontend"
  },
  {
    title: "Database Management",
    link: "#database"
  },
  {
    title: "Cybersecurity",
    link: "#cybersecurity"
  },
  {
    title: "Blockchain",
    link: "#blockchain"
  }
];

const applicationDomains = [
  {
    title: "System Software",
    link: "#fintech"
  },
  {
    title: "Embedded Systems",
    link: "#healthtech"
  },
  {
    title: "E-Commerce",
    link: "#ecommerce"
  },
  {
    title: "Business Solutions",
    link: "#edtech"
  },
  {
    title: "Social Media",
    link: "#social-media"
  },
  {
    title: "SaaS Products",
    link: "#saas"
  },
  {
    title: "Gaming",
    link: "#gaming"
  },
  {
    title: "IoT & Smart Devices",
    link: "#iot"
  },
  {
    title: "Dev Tools and Utlities",
    link: "#proptech"
  },
];


  return (
    <div id="roadmaps">
      <section className="mx-auto max-w-[94%] rounded-2xl bg-[#333] py-12 sm:max-w-[90%] md:max-w-[85%] md:rounded-3xl md:py-20">
        <div className="container mx-auto px-4">

          {/* ================= HEADING ================= */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
              Explore <span className="text-[#f6c90e]">Domains</span>
            </h2>

            <p className="mx-auto max-w-2xl text-base text-gray-200 sm:text-lg">
              Choose from a wide range of domains and technologies to build your expertise
            </p>

            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-200 sm:text-2xl">
              Select a domain <span className="text-[#f6c90e]">roadmap</span> to begin with.
            </p>
          </div>

          {/* ================= LISTS ================= */}
          <div className="mx-auto grid max-w-3xl gap-5 md:grid-cols-2 md:gap-12">

            {/* TECHNOLOGY ROADMAPS */}
            <div className="rounded-2xl border-2 border-gray-100 bg-white p-5 shadow-lg sm:p-8">
              <div className="mb-6 flex items-center gap-3 sm:mb-8">
                <div className="w-1 h-10 bg-[#6b46c1] rounded-full" />
                <h3 className="text-xl md:text-2xl font-bold text-[#333]">
                  Technology Roadmaps
                </h3>
              </div>

              <div className="space-y-3">
                {technologyDomains.map((domain, index) => (
                  <a
                    key={index}
                    href={domain.link}
                    className="flex items-center gap-3 rounded-lg p-2
                               hover:bg-[#6b46c1]/5
                               transition-all duration-300 group"
                  >
                    <ArrowRight
                      className="h-5 w-5 shrink-0 text-[#6b46c1]
                                 group-hover:translate-x-1
                                 transition-transform duration-300"
                    />
                    <span
                      className="min-w-0 break-words text-sm text-[#333]
                                 transition-colors duration-300 group-hover:text-[#6b46c1] sm:text-base"
                    >
                      {domain.title}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* APPLICATION ROADMAPS */}
            <div className="rounded-2xl border-2 border-gray-100 bg-white p-5 shadow-lg sm:p-8">
              <div className="mb-6 flex items-center gap-3 sm:mb-8">
                <div className="w-1 h-10 bg-[#f6c90e] rounded-full" />
                <h3 className="text-xl md:text-2xl font-bold text-[#333]">
                  Application Roadmaps
                </h3>
              </div>

              <div className="space-y-3">
                {applicationDomains.map((domain, index) => (
                  <a
                    key={index}
                    href={domain.link}
                    className="flex items-center gap-3 rounded-lg p-2
                               hover:bg-[#f6c90e]/5
                               transition-all duration-300 group"
                  >
                    <ArrowRight
                      className="h-5 w-5 shrink-0 text-[#f6c90e]
                                 group-hover:translate-x-1
                                 transition-transform duration-300"
                    />
                    <span
                      className="min-w-0 break-words text-sm text-[#333]
                                 transition-colors duration-300 group-hover:text-[#f6c90e] sm:text-base"
                    >
                      {domain.title}
                    </span>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

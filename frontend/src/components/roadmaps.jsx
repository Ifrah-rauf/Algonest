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
      <section className="py-20 bg-[#333] max-w-[85%] mx-auto rounded-3xl">
        <div className="container mx-auto px-2 md:px-4">

          {/* ================= HEADING ================= */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
              Explore <span className="text-[#f6c90e]">Domains</span>
            </h2>

            <p className="text-lg text-gray-200 max-w-2xl mx-auto">
              Choose from a wide range of domains and technologies to build your expertise
            </p>

            <p className="text-2xl text-gray-200 max-w-2xl mx-auto mt-4">
              Select a domain <span className="text-[#f6c90e]">roadmap</span> to begin with.
            </p>
          </div>

          {/* ================= LISTS ================= */}
          <div className="grid md:grid-cols-2 gap-12 max-w-3xl mx-auto">

            {/* TECHNOLOGY ROADMAPS */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
              <div className="flex items-center gap-3 mb-8">
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
                    className="flex items-center gap-3 p-2 rounded-lg
                               hover:bg-[#6b46c1]/5
                               transition-all duration-300 group"
                  >
                    <ArrowRight
                      className="w-5 h-5 text-[#6b46c1]
                                 group-hover:translate-x-1
                                 transition-transform duration-300 flex-shrink-0"
                    />
                    <span
                      className="text-[#333] group-hover:text-[#6b46c1]
                                 transition-colors duration-300 text-[100%]"
                    >
                      {domain.title}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* APPLICATION ROADMAPS */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
              <div className="flex items-center gap-3 mb-8">
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
                    className="flex items-center gap-3 p-2 rounded-lg
                               hover:bg-[#f6c90e]/5
                               transition-all duration-300 group"
                  >
                    <ArrowRight
                      className="w-5 h-5 text-[#f6c90e]
                                 group-hover:translate-x-1
                                 transition-transform duration-300 flex-shrink-0"
                    />
                    <span
                      className="text-[#333] group-hover:text-[#f6c90e]
                                 transition-colors duration-300 text-[100%]"
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

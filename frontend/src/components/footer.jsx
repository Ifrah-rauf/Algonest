export default function footer(){
    return(
        <footer className="border-t border-gray-200 bg-white">
  <div className="max-w-7xl mx-auto px-6 py-20">

    {/* Top grid */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

      {/* Brand */}
      <div>
        <h3 className="text-lg font-semibold text-[#333333] mb-3">
          AlgoNest
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
          A structured 1-to-1 mentorship system designed to help students
          finish what they start — with clarity, accountability, and outcomes.
        </p>
      </div>

      {/* Product */}
      <div>
        <h4 className="text-sm font-medium text-[#333333] mb-4">
          Product
        </h4>
        <ul className="space-y-3 text-sm text-gray-600">
          <li>
            <a href="/how-it-works" className="hover:text-[#333333]">
              How it works
            </a>
          </li>
          <li>
            <a href="/projects" className="hover:text-[#333333]">
              Project Development
            </a>
          </li>
          <li>
            <a href="/school-help" className="hover:text-[#333333]">
              School & College Help
            </a>
          </li>
          <li>
            <a href="/placements" className="hover:text-[#333333]">
              Placement Preparation
            </a>
          </li>
        </ul>
      </div>

      {/* Company */}
      <div>
        <h4 className="text-sm font-medium text-[#333333] mb-4">
          Company
        </h4>
        <ul className="space-y-3 text-sm text-gray-600">
          <li>
            <a href="/about" className="hover:text-[#333333]">
              About AlgoNest
            </a>
          </li>
          <li>
            <a href="/mentors" className="hover:text-[#333333]">
              Mentor ecosystem
            </a>
          </li>
          <li>
            <a href="/consult" className="hover:text-[#333333]">
              Consult before starting
            </a>
          </li>
          <li>
            <a href="/careers" className="hover:text-[#333333]">
              Careers
            </a>
          </li>
        </ul>
      </div>

      {/* Support */}
      <div>
        <h4 className="text-sm font-medium text-[#333333] mb-4">
          Support
        </h4>
        <ul className="space-y-3 text-sm text-gray-600">
          <li>
            <a href="/contact" className="hover:text-[#333333]">
              Contact us
            </a>
          </li>
          <li>
            <a href="/faq" className="hover:text-[#333333]">
              FAQs
            </a>
          </li>
          <li>
            <a href="/policies/privacy" className="hover:text-[#333333]">
              Privacy policy
            </a>
          </li>
          <li>
            <a href="/policies/terms" className="hover:text-[#333333]">
              Terms of service
            </a>
          </li>
        </ul>
      </div>
    </div>

    {/* Divider */}
    <div className="border-t border-gray-100 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">

      <p className="text-sm text-gray-500">
        © {new Date().getFullYear()} AlgoNest. All rights reserved.
      </p>

      <p className="text-sm text-gray-500">
        Built for completion, not consumption.
      </p>
    </div>

  </div>
</footer>
    )
}
import React from "react";

/**
 * Props:
 * title (string)
 * subtitle (string)
 * plans (array)
 * each plan:
 * {
 *   name: string,
 *   description: string,
 *   sessionPrice: string,
 *   pricePlan: string,
 *   month: string,
 *   features: string[],
 *   buttonText: string,
 *   popular?: boolean,
 *   color?: string
 * }
 */

const DynamicPricingSection = ({
  title = "Clear and Fair Pricing for Everyone.",
  subtitle = "Choose the plan that fits your learning journey and build real projects with expert mentors.",
  plans = [],
  onBook
}) => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center px-6">
        {/* Header */}
        <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-600 mb-10 max-w-2xl mx-auto">{subtitle}</p>

        {/* Dynamic Pricing Cards */}
        <div
          className={`grid md:grid-cols-${plans.length} sm:grid-cols-2 gap-8 justify-items-center`}
        >
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-md p-8 border border-gray-100 hover:shadow-lg transition-all ${
                plan.popular ? "border-2 border-[#4B0082]" : ""
              }`}
            >
              {/* Most Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#4B0082] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              {/* Title & Description */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {plan.name}
              </h3>
              <p className="text-gray-500 mb-6">{plan.description}</p>

              {/* Price Display */}
              <div className="text-4xl font-bold mb-6">
                {plan.pricePlan}{" "}
                <span className="text-lg font-medium text-gray-400">
                  /{plan.month}
                </span>
              </div>

              {/* Features */}
              <ul className="text-gray-600 text-sm mb-8 space-y-2 text-left">
                <li>Per Session: {plan.sessionPrice}</li>
                {plan.features.map((f, i) => (
                  <li key={i}>✔ {f}</li>
                ))}
              </ul>

              {/* Button */}
              <button
                onClick={() => onBook(plan.id)}
                className={`w-full py-3 rounded-lg font-medium transition-all ${
                  plan.popular
                    ? "bg-[#4B0082] hover:bg-[#6b12b5] text-white"
                    : plan.color === "yellow"
                    ? "bg-[#FFB800] hover:bg-[#ffd24d] text-black"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DynamicPricingSection;

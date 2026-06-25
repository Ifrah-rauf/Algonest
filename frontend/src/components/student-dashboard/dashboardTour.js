import { driver } from "driver.js";
import "../../styles/driver.css";
import { API_BASE } from "./constants";

// Polls for an element to exist in the DOM (after a React re-render),
// then runs a callback. Avoids racing driver.js against React's commit.
function waitForElement(selector, callback, { timeout = 4000, interval = 50 } = {}) {
  const start = Date.now();

  const tick = () => {
    const el = document.querySelector(selector);
    if (el) {
      callback(el);
      return;
    }
    if (Date.now() - start >= timeout) {
      console.warn(`Tour: timed out waiting for "${selector}"`);
      return;
    }
    setTimeout(tick, interval);
  };

  tick();
}

export const startDashboardTour = ({ setActiveTab, uid }) => {
  const driverObj = driver({
    stageRadius: 24,
    stagePadding: 18,
    showProgress: true,

    onDestroyed: async () => {
      try {
        await fetch(`${API_BASE}/api/dashboard/tour/${uid}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (err) {
        console.error("Failed to update tour status:", err);
      }
    },

    steps: [
      {
        element: "#activity-roadmaps",
        popover: {
          title: "Activities",
          description:
            "All your recent activities and quick actions are available here.",
        },
      },

      {
        element: "#roadmaps-section",
        popover: {
          title: "Roadmaps",
          description:
            "Your active roadmap progress and recommendations are displayed here.",
        },
      },

      {
        // No `element`: this step is a centered modal-style popover.
        // Going forward (Next) it switches Activity -> Profile.
        // Going backward (Previous) it switches Profile -> Activity.
        // Both directions must live INSIDE `popover` --- driver.js reads
        // step.popover.onNextClick / step.popover.onPrevClick, not
        // step.onNextClick / step.onPrevClick.
        popover: {
          title: "Profile Tab",
          description: "Let's switch to your profile and complete important details.",

          onNextClick: () => {
            setActiveTab("profile");

            waitForElement("#github-section", () => {
              driverObj.moveNext();
            });
          },

          onPrevClick: () => {
            setActiveTab("activity");

            waitForElement("#roadmaps-section", () => {
              driverObj.movePrevious();
            });
          },
        },
      },

      {
        element: "#github-section",
        popover: {
          title: "GitHub Profile",
          description:
            "Add your GitHub profile so mentors can review your projects and contributions.",
        },
      },

      {
        element: "#project-section",
        popover: {
          title: "Projects 🌟",
          description: "Add your project details and roadmap context to enable free AI preview of the roadmap.",
        },
      },

      {
        // Forward (Next): Profile -> Explore.
        // Backward (Previous): Explore -> Profile.
        popover: {
          title: "Explore Projects",
          description: "Let's check out suggested projects for you. Click Next to switch to the Explore tab.",

          onNextClick: () => {
            setActiveTab("explore");

            waitForElement("#explore-projects-section", () => {
              driverObj.moveNext();
            });
          },

          onPrevClick: () => {
            setActiveTab("profile");

            waitForElement("#project-section", () => {
              driverObj.movePrevious();
            });
          },
        },
      },

      {
        element: "#explore-projects-section",
        popover: {
          title: "Explore",
          description: "Discover projects, collaborate with others, and build your portfolio.",
        },
      },
    ],
  });

  driverObj.drive();
};
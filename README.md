<!-- PROJECT LOGO / HEADER -->
<br />
<div align="center">
  <a href="https://github.com/yourusername/your-repo">
    <img src="https://via.placeholder.com/150" alt="Logo" width="80" height="80">
  </a>
  <h1 align="center">AlgoNest</h1>
  <p align="center">
    Dynamic Roadmaps with Mentor and AI collaboration to learn tech stack and ship real projects. 
    <br />
    <a href="#table-of-contents"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Ifrah-rauf/Algonest/issues">Report Bug</a>
    ·
    <a href="https://github.com/Ifrah-rauf/Algonest/issues">Request Feature</a>
  </p>
</div>

<hr />

<!-- TABLE OF CONTENTS -->
<details id="table-of-contents" open>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#built-with">Built With</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#project-architecture">Project Architecture</a></li>
    <li><a href="#modules-and-services">Modules and Services</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
  </ol>
</details>

<hr />

<!-- ABOUT THE PROJECT -->
<h2 id="about-the-project">About The Project</h2>
<p>
  Provide a solid overview of the system here. Explain the core problem it solves and the high-level business logic. 
</p>

<h3 id="built-with">Built With</h3>
<ul>
  <li><a href="https://reactjs.org/">React.js</a></li>
  <li><a href="https://nodejs.org/">Node.js</a></li>
  <li><a href="https://docker.com/">Docker</a></li>
</ul>

<hr />

<!-- GETTING STARTED -->
<h2 id="getting-started">Getting Started</h2>
<p>To get a local copy up and running, follow these simple steps.</p>

<h3>Prerequisites</h3>
<pre><code>npm install npm@latest -g</code></pre>

<h3>Installation & Setup</h3>
<ol>
  <li>Clone the repo: <pre><code>git clone https://github.com/yourusername/your-repo.git</code></pre></li>
  <li>Install dependencies: <pre><code>npm install</code></pre></li>
  <li>Set up your <code>.env</code> file based on <code>.env.example</code></li>
  <li>Run the development server: <pre><code>npm run dev</code></pre></li>
</ol>

<hr />

<!-- PROJECT ARCHITECTURE -->
<h2 id="project-architecture">Project Architecture</h2>
<p>
  Data Model (high level)


auth — central identity table (role-based: STUDENT / TEACHER), referenced by both student and teacher
student / teacher — profile tables, linked 1:1 to auth via uid
plan / plan_outline / booking / payment — commercial layer: what a student has purchased, what it unlocks, and how it was paid for
availability / timeslot / slotbooking — mentor availability windows broken into bookable slots, reserved via slotbooking, and converted into a confirmed session
session / session_attachment — the actual Zoom-backed meeting record, with duration, feedback, status, and any attached files (scorecards, resumes, code links)
lessons / lesson_topics / lesson_progress — the roadmap skeleton: ordered lessons with prerequisites, granular topics per lesson (each with an applied_task and ai_note for the Build Companion), and per-student progress tracking
checkpoints / support_stages — milestone gates within a roadmap, optionally requiring teacher sign-off, tied back to a specific booking
specialisation / languages / frameworks — teacher-side tagging for matching mentors to student needs
testimonials — student success stories surfaced on the public site



Note: the current schema retains generic plan/booking terminology from an earlier package-based pricing model; Grill Sessions, CS Fundamentals, and Project Roadmaps are implemented as distinct plan types on top of the same booking/session infrastructure.



AI Build Companion — Context Awareness

At any point in a conversation, the Companion is aware of:


Where the student is in their roadmap (lesson_progress, checkpoints)
What their current project/codebase looks like
Their past questions and recurring struggle patterns (via student_memories + embedding retrieval)


Hard constraint, enforced at the system-prompt level: the Companion scaffolds, it never completes. If a student asks it to write code, it redirects to guided questioning instead.

Session Automation Flow


Mentor sets availability → sliced into timeslot records
Student books a timeslot → slotbooking created
On confirmation, a Zoom meeting is provisioned via the Zoom API → join_url / start_url stored on the session record
pg_cron jobs handle reminders and no-show/expiry cleanup
Post-session, mentor feedback and scorecard data are written back to session / session_attachment
</p>
<!-- If you have an architecture diagram image, place it here -->
<!-- <img src="docs/architecture-diagram.png" alt="Architecture Diagram" width="100%" /> -->

<hr />

<!-- MODULES AND SERVICES (Repeatable Structure) -->
<h2 id="modules-and-services">Modules and Services</h2>
<p>This project is broken down into modular components. Expand each section below to see specific details.</p>

<!-- START REPEATABLE MODULE BLOCK -->
<details>
  <summary>📦 <strong>Module 1: Auth Service</strong> (Click to expand)</summary>
  <br />
  <blockquote>
    Handles user authentication, token generation, and session management.
  </blockquote>
  
  <h4>Tech Stack / Dependencies</h4>
  <ul>
    <li>Express.js</li>
    <li>JWT (JsonWebToken)</li>
    <li>Redis (Session caching)</li>
  </ul>

  <h4>Key Directories</h4>
  <ul>
    <li><code>/src/auth/controllers</code> - Request handlers</li>
    <li><code>/src/auth/middleware</code> - Route guards and validation</li>
  </ul>

  <h4>API Endpoints / Usage</h4>
  <table>
    <thead>
      <tr>
        <th>Method</th>
        <th>Endpoint</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>POST</code></td>
        <td><code>/api/v1/auth/register</code></td>
        <td>Registers a new user account.</td>
      </tr>
      <tr>
        <td><code>POST</code></td>
        <td><code>/api/v1/auth/login</code></td>
        <td>Authenticates user and returns a JWT.</td>
      </tr>
    </tbody>
  </table>
</details>
<!-- END REPEATABLE MODULE BLOCK -->

<!-- START REPEATABLE MODULE BLOCK -->
<details>
  <summary>📦 <strong>Module 2: Core Data Engine</strong> (Click to expand)</summary>
  <br />
  <blockquote>
    Processes incoming data packets, executes pipeline validation, and writes to the database.
  </blockquote>
  
  <h4>Tech Stack / Dependencies</h4>
  <ul>
    <li>Python / FastAPI</li>
    <li>PostgreSQL</li>
  </ul>

  <h4>API Endpoints / Usage</h4>
  <table>
    <thead>
      <tr>
        <th>Method</th>
        <th>Endpoint</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>GET</code></td>
        <td><code>/api/v1/data/metrics</code></td>
        <td>Fetches aggregated system performance metrics.</td>
      </tr>
    </tbody>
  </table>
</details>
<!-- END REPEATABLE MODULE BLOCK -->

<hr />

<!-- ROADMAP -->
<h2 id="roadmap">Roadmap</h2>
<ul>
  <li>[x] Initial Monorepo Setup</li>
  <li>[x] Complete Core Data Engine Module</li>
  <li>[ ] Implement OAuth2 for Auth Service</li>
  <li>[ ] Add end-to-end testing pipeline</li>
</ul>

<hr />

<!-- CONTRIBUTING -->
<h2 id="contributing">Contributing</h2>
<p>Contributions are what make the open source community such an amazing place to learn, inspire, and create.</p>
<ol>
  <li>Fork the Project</li>
  <li>Create your Feature Branch (<code>git checkout -b feature/AmazingFeature</code>)</li>
  <li>Commit your Changes (<code>git commit -m 'Add some AmazingFeature'</code>)</li>
  <li>Push to the Branch (<code>git push origin feature/AmazingFeature</code>)</li>
  <li>Open a Pull Request</li>
</ol>

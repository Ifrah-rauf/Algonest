import React from "react";
import grid from '../static/grid-bg.jpg';
import django from'../static/django.png';
import springboot from'../static/springboot.png';
import react from'../static/react.png';
import flutter from'../static/flutter.png';
import mern from'../static/mern.png';
import express from'../static/express.png';
// Example project data
const projects = [
  {
    id: "django",
    title: "Django",
    image: django,
    description:
      "Python Django framework for building websites with inbuilt SQLite DB - MVT architecture.",
  },
  {
    id: "springboot",
    title: "SpringBoot",
    image: springboot,
    description:
      "Java framework for building websites - MVC architecture. Supports MongoDB and relational databases.",
  },
  {
    id: "react",
    title: "React",
    image: react,
    description:
      "Frontend library for building dynamic UI with component-based architecture. Integrates well with REST APIs.",
  },
  {
    id: "flutter",
    title: "Flutter",
    image: flutter,
    description:
      "Cross-platform mobile framework using Dart. Build Android & iOS apps with single codebase.",
  },
  {
    id: "mern",
    title: "MERN",
    image: mern,
    description:
      "Cross-platform mobile framework using Dart. Build Android & iOS apps with single codebase.",
  },
  {
    id: "express",
    title: "Express.js",
    image: express,
    description:
      "Cross-platform mobile framework using Dart. Build Android & iOS apps with single codebase.",
  },
];

const TechStackGrid = ({ onProjectClick }) => {
  return (
    <div className="relative w-full min-h-screen bg-gray-800 bg-opacity-90 p-10 bg-cover bg-center"
    style={{
            backgroundImage: `url(${grid})`,marginTop:"5%"
          }}>
    <div className="absolute inset-0 bg-black/60"></div>
      <h2 className="relative z-10 text-white text-3xl font-bold mb-8 text-center">
        Popular Frameworks
      </h2>
        <h2 className="relative z-10 text-white text-xl mb-20 text-center">
        Prerequisite knowledge of a framework is not required. 
        Learn the framework while building it from scratch.
      </h2>
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14">
        {projects.map((project) => (
          <div
            key={project.id}
            id={project.id}
            className="bg-gray-900 rounded-xl shadow-lg cursor-pointer overflow-hidden hover:scale-105 transition-transform duration-300"
            onClick={() => onProjectClick(project.id)}
          >
            {/* Image Holder */}
            <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
              <img
                src={project.image}
                alt={project.title}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Tech Description */}
            <div className="p-6 bg-gray-100 text-gray-800">
              <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
              <p className="text-sm text-gray-800">{project.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStackGrid;

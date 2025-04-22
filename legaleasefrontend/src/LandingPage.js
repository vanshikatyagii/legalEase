import React, { useState, useEffect } from "react";
import { FaFileUpload, FaRobot, FaDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const steps = [
  {
    icon: <FaFileUpload />,
    title: "Upload Document",
    desc: "Upload PDF or DOCX legal files securely.",
  },
  {
    icon: <FaRobot />,
    title: "AI Analysis",
    desc: "Our AI summarizes, extracts entities & simplifies the content.",
  },
  {
    icon: <FaDownload />,
    title: "Get Results",
    desc: "Download summary or view structured results instantly.",
  },
];

const LandingPage = () => {
  const [showSteps, setShowSteps] = useState(false);
  const navigate = useNavigate();

  const handleLearnMore = () => {
    setShowSteps(true);
  };

  const handleTryNow = () => {
    navigate("/login");
  };

  useEffect(() => {
    if (showSteps) {
      const el = document.getElementById("steps-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [showSteps]);

  return (
    <div className="landing-container">
      <div className="hero">
        <h1 className="logo">LegalEase</h1>
        <p className="tagline">AI-powered Legal Document Intelligence</p>
        {!showSteps && (
          <button className="learn-more-btn" onClick={handleLearnMore}>
            Learn More
          </button>
        )}
      </div>

      {showSteps && (
        <div className="steps-wrapper" id="steps-section">
          <h2>How LegalEase Works</h2>
          <div className="steps-row">
            {steps.map((step, index) => (
              <div className="step-card" key={index}>
                <div className="icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
          <button className="try-now-btn" onClick={handleTryNow}>
            Try Now
          </button>
        </div>
      )}
    </div>
  );
};

export default LandingPage;

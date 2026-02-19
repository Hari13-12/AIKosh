import React from "react";
import { useNavigate } from "react-router-dom";
import FileUploader from "./FileUploader";
import "./HomePage.css";
import { useState } from "react";


// ✅ IMPORT LOGOS
import emblem from "../assets/emblem.png";
import rampLogo from "../assets/ramp.png";
import nsicLogo from "../assets/nse.png"; // adjust if needed
import ondcLogo from "../assets/ondc-network-vertical.png";
import ocrimg from "../assets/ocr.png"
import voiceagent from "../assets/voice-agent.png";
import aisnp from "../assets/ai-snp.png"

import DocumentUploader2 from "./DocumentUploader2";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [activeView, setActiveView] = useState("dashboard"); 

  const menuViews = {
  HOME: "home",
  OCR: "ocr",
  ABOUT: "about"
};


  const navigate = useNavigate();
  const handleAIClick = () => {
    navigate("/voice");
  };

  const handleFormClick = () => {
    navigate("/form");
  };

  return (
    <>
      {/* 🔥 GOVERNMENT HEADER */}
      <div className="top-header">
        {/* LEFT LOGOS */}
        <div className="header-left">
          <img src={rampLogo} alt="RAMP" style={{ width: '100px', height: 'auto' }} />
          <img src={emblem} alt="India Emblem" style={{ width: '70px', height: 'auto', margin:"25px" }}/>
        </div>

        {/* CENTER TITLE */}
        <div className="header-center">
          <h2 style = {{}}>एमएसएमई टीम पहल</h2>
          <br />
          <h1 style = {{color: "#E56717"}}>MSME TEAM Initiative</h1>
          <br />
          <h2 style = {{color: "black"}}>MINISTRY OF MICRO, SMALL & MEDIUM ENTERPRISES, GOI</h2>
        </div>

        {/* RIGHT LOGOS */}
        <div className="header-right">
          <img src={nsicLogo} alt="NSIC" style={{ width: '100px', height: 'auto' }}/>
          <img src={ondcLogo} alt="ONDC" style={{ width: '200px', height: 'auto' }}/>
        </div>
      </div>

<nav className="navbar-mainbg">
  <div className="navbar-container">
    <div className="navbar-logo">AI ONDC ONBOARDING</div>



<ul className="navbar-nav">
  {Object.keys(menuViews).map((item) => (
    <li
      key={item}
      className={`nav-item ${activeTab === item ? "active" : ""}`}
      onClick={() => {
        setActiveTab(item);
        setActiveView(menuViews[item]); // ⭐ THIS IS THE KEY
      }}
    >
      <span className="nav-link">{item}</span>
    </li>
  ))}
</ul>


  </div>
</nav>

      {/* <div className = "home-nav" >
        AI-Powered Digital Enablement Platform for MSMEs
Empowering Businesses with Intelligent Automation

We provide an end-to-end AI-driven system that helps MSMEs digitally register, categorize their products, and discover eligible schemes — using document intelligence, voice AI, and smart recommendation engines.

Our platform simplifies complex government processes into a guided, multilingual, voice-enabled experience.
        <div className = "ocr-part">
          <h3></h3>
          <img src={ocrimg} alt="OCR" style={{ width: '200px', height: 'auto' }}/></div>
        <br />
        <div className="voiceagent-part"><img src={voiceagent} alt="VOICE AGENT" style={{ width: '200px', height: 'auto' }}/></div>
        <br />
        <div className="aisnp-part"><img src={aisnp} alt="AI-SNP" style={{ width: '200px', height: 'auto' }}/></div>
      </div> */}
      

      {/* 🔥 EXISTING CONTENT */}
      <div className="home-container">
        {activeView === "home" && (
            <div className="home-nav">
  <div className="home-nav-inner">

    {/* EYEBROW */}
    <div className="home-nav-eyebrow">
      <span className="eyebrow-line"></span>
      AI-Powered Digital Enablement Platform for MSMEs
    </div>

    {/* TITLE */}
    <h1 className="home-nav-title">
      Empowering Businesses with{" "}
      <span className="hn-highlight">Intelligent Automation</span>
    </h1>

    {/* SUBTITLE */}
    <p className="home-nav-subtitle">
      We provide an end-to-end AI-driven system that helps MSMEs digitally register,
      categorize their products, and discover eligible schemes — using document
      intelligence, voice AI, and smart recommendation engines.
      <br /><br />
      Our platform simplifies complex government processes into a guided,{" "}
      <strong>multilingual, voice-enabled</strong> experience.
    </p>

    {/* TAGS */}
    <div className="home-nav-tags">
      <span className="hn-tag hn-tag-orange">📄 Document Intelligence</span>
      <span className="hn-tag hn-tag-teal">🎙️ Voice AI</span>
      <span className="hn-tag hn-tag-gold">🗺️ Multilingual</span>
      <span className="hn-tag hn-tag-orange">⚡ Smart Recommendations</span>
      <span className="hn-tag hn-tag-teal">🏛️ Government Schemes</span>
    </div>

    {/* FEATURE CARDS */}
    <div className="home-nav-features">
      <div className="hn-card">
        <div className="hn-card-accent hn-accent-orange"></div>
        <img src={ocrimg} alt="OCR" className="hn-card-img" />
        <div className="hn-card-icon">🔏</div>
        <h3 className="hn-card-title">Document Intelligence</h3>
        <p className="hn-card-text">AI-powered OCR extracts and validates data from your business documents instantly — no manual entry needed.</p>
      </div>
      <div className="hn-card">
        <div className="hn-card-accent hn-accent-teal"></div>
        <img src={voiceagent} alt="Voice Agent" className="hn-card-img" />
        <div className="hn-card-icon">🎙️</div>
        <h3 className="hn-card-title">Voice AI Agent</h3>
        <p className="hn-card-text">A multilingual voice assistant guides you through every step — speak in your language, we handle the rest.</p>
      </div>
      <div className="hn-card">
        <div className="hn-card-accent hn-accent-gold"></div>
        <img src={aisnp} alt="AI SNP" className="hn-card-img" />
        <div className="hn-card-icon">💡</div>
        <h3 className="hn-card-title">Scheme Discovery</h3>
        <p className="hn-card-text">Smart engine surfaces every eligible government scheme, subsidy, and benefit your business qualifies for.</p>
      </div>
    </div>

    {/* STAT BAND */}
    <div className="home-nav-stats">
      <div className="hn-stat"><div className="hn-stat-num">10+</div><div className="hn-stat-label">Languages Supported</div></div>
      <div className="hn-stat"><div className="hn-stat-num">300+</div><div className="hn-stat-label">Govt. Schemes Mapped</div></div>
      <div className="hn-stat"><div className="hn-stat-num">60M+</div><div className="hn-stat-label">MSMEs in India</div></div>
      <div className="hn-stat"><div className="hn-stat-num">&lt; 5 min</div><div className="hn-stat-label">Avg. Registration Time</div></div>
    </div>

  </div>
</div>
          )}

        {activeView === "ocr" && (
        <div className="home-content">
          <h1 className="home-title">AI ONDC ONBOARDING</h1>
          <p className="home-subtitle">
            Upload your documents to start the onboarding
          </p>

          <DocumentUploader2 />

          <button className="form-btn" onClick={handleFormClick}>
            View Form
          </button>
        </div>
        )}
  

      {activeView === "about" && (
        
<div class="about-section">
  <div class="about-inner">

    <div class="about-eyebrow">
      <span class="about-eyebrow-line"></span>
      About the Platform
    </div>

    <h1 class="about-title">
      Digitising India's <span class="orange">63 Million</span><br/>
      <span class="navy">MSMEs</span>, One Business at a Time
    </h1>

    <p class="about-lead">
      The <strong>MSME TEAM Initiative</strong> is a government-backed, AI-powered digital enablement
      platform built to bridge the gap between India's micro, small, and medium enterprises and the
      digital economy. From <strong>Udyam registration</strong> to <strong>ONDC onboarding</strong>,
      we simplify every step with voice AI, document intelligence, and smart scheme discovery.
    </p>

    <div class="about-block">
      <div class="about-block-text">
        <h2>What Is This Platform?</h2>
        <p>
          We are an end-to-end digital onboarding system designed specifically for MSMEs. Our AI
          reads your documents, speaks your language, and walks you through government registration
          processes in under <strong>5 minutes</strong>.
        </p>
        <p>
          The platform integrates with <strong>ONDC</strong>, <strong>NSIC</strong>, and
          <strong>RAMP</strong> ecosystems to provide a unified, single-window experience — whether
          you're a small handicraft maker in rural Rajasthan or a mid-scale manufacturer in Pune.
        </p>
        <p>
          Powered by <strong>multilingual voice AI</strong> supporting 10+ Indian languages, our
          system ensures no MSME is left behind due to language or digital literacy barriers.
        </p>
      </div>

      <div class="about-block-visual">
        <div class="about-visual-title">Platform Journey</div>
        <div class="about-step-list">
          <div class="about-step s1">
            <div class="about-step-icon">📄</div>
            <div class="about-step-body">
              <span class="about-step-name">Document Upload & OCR</span>
              <span class="about-step-desc">Aadhaar, GST, PAN — auto-extracted instantly</span>
            </div>
          </div>
          <div class="about-step s2">
            <div class="about-step-icon">🤖</div>
            <div class="about-step-body">
              <span class="about-step-name">AI Product Categorisation</span>
              <span class="about-step-desc">NIC codes mapped automatically by AI</span>
            </div>
          </div>
          <div class="about-step s3">
            <div class="about-step-icon">🏛️</div>
            <div class="about-step-body">
              <span class="about-step-name">Scheme & Benefit Discovery</span>
              <span class="about-step-desc">300+ schemes matched to your profile</span>
            </div>
          </div>
          <div class="about-step s4">
            <div class="about-step-icon">✅</div>
            <div class="about-step-body">
              <span class="about-step-name">Digital Registration</span>
              <span class="about-step-desc">ONDC, Udyam, GeM — guided end-to-end</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <p class="about-section-label">Key Capabilities</p>
    <div class="about-cards">

      <div class="about-card">
        <div class="about-card-bar bar-orange"></div>
        <div class="about-card-icon ic-orange">📄</div>
        <div class="about-card-title">Document Intelligence</div>
        <p class="about-card-text">AI-powered OCR reads Aadhaar, GST certificates, PAN cards and business documents — eliminating manual data entry entirely.</p>
      </div>

      <div class="about-card">
        <div class="about-card-bar bar-teal"></div>
        <div class="about-card-icon ic-teal">🎙️</div>
        <div class="about-card-title">Multilingual Voice AI</div>
        <p class="about-card-text">Supports 10+ Indian languages. Business owners can speak naturally — the AI understands, responds, and fills forms on their behalf.</p>
      </div>

      <div class="about-card">
        <div class="about-card-bar bar-navy"></div>
        <div class="about-card-icon ic-navy">💡</div>
        <div class="about-card-title">Scheme Discovery Engine</div>
        <p class="about-card-text">Smart recommendation engine matches businesses to 300+ central and state government schemes, subsidies, and credit-linked benefits.</p>
      </div>

      <div class="about-card">
        <div class="about-card-bar bar-gold"></div>
        <div class="about-card-icon ic-gold">🛒</div>
        <div class="about-card-title">ONDC Onboarding</div>
        <p class="about-card-text">Seamlessly lists MSME products on the Open Network for Digital Commerce, opening access to millions of buyers across India.</p>
      </div>

      <div class="about-card">
        <div class="about-card-bar bar-indigo"></div>
        <div class="about-card-icon ic-indigo">🔐</div>
        <div class="about-card-title">Secure & Compliant</div>
        <p class="about-card-text">Built on government-grade security standards. All document data is encrypted, processed in compliance with the IT Act and DPDP Bill.</p>
      </div>

      <div class="about-card">
        <div class="about-card-bar bar-red"></div>
        <div class="about-card-icon ic-red">📊</div>
        <div class="about-card-title">Business Analytics</div>
        <p class="about-card-text">Post-registration dashboard provides MSMEs with market insights, competitor benchmarks, and growth opportunity tracking.</p>
      </div>

    </div>

    <div class="about-partners">
      <div class="about-partners-title">Ecosystem Partners & Integrations</div>
      <div class="about-logos-row">
        <div class="about-logo-pill"><span class="pill-icon">🏛️</span> Ministry of MSME, GOI</div>
        <div class="about-logo-pill"><span class="pill-icon">🔗</span> ONDC Network</div>
        <div class="about-logo-pill"><span class="pill-icon">🏦</span> NSIC</div>
        <div class="about-logo-pill"><span class="pill-icon">📈</span> RAMP Programme</div>
        <div class="about-logo-pill"><span class="pill-icon">🛍️</span> GeM Portal</div>
        <div class="about-logo-pill"><span class="pill-icon">📋</span> Udyam Registration</div>
      </div>
    </div>

    <p class="about-section-label">Our Purpose</p>
    <div class="about-mv">

      <div class="about-mv-card mission">
        <div class="mv-eyebrow">Our Mission</div>
        <div class="mv-title">Democratise Digital Access for Every MSME</div>
        <p class="mv-text">
          To make digital registration, scheme access, and marketplace participation
          effortless for every micro and small business in India — regardless of language,
          location, or digital literacy.
        </p>
        <div class="mv-icon">🎯</div>
      </div>

      <div class="about-mv-card vision">
        <div class="mv-eyebrow">Our Vision</div>
        <div class="mv-title">A Fully Formalised, Digitally Empowered MSME Ecosystem</div>
        <p class="mv-text">
          By 2030, every MSME in India should have a digital identity, access to
          formal credit, and the ability to sell on national commerce networks —
          powered by AI that speaks their language.
        </p>
        <div class="mv-icon">🌏</div>
      </div>

    </div>

    <div class="about-stats">
      <div class="about-stat">
        <div class="about-stat-num">63M+</div>
        <div class="about-stat-lbl">MSMEs in India</div>
      </div>
      <div class="about-stat">
        <div class="about-stat-num">10+</div>
        <div class="about-stat-lbl">Languages Supported</div>
      </div>
      <div class="about-stat">
        <div class="about-stat-num">300+</div>
        <div class="about-stat-lbl">Govt. Schemes Mapped</div>
      </div>
      <div class="about-stat">
        <div class="about-stat-num">&lt;5 min</div>
        <div class="about-stat-lbl">Avg. Onboarding Time</div>
      </div>
      <div class="about-stat">
        <div class="about-stat-num">110M+</div>
        <div class="about-stat-lbl">Jobs Supported</div>
      </div>
    </div>

  </div>
</div>
      )}


        {/* 🎙️ Floating AI Button */}
        <button className="ai-float-btn" onClick={handleAIClick}>
          🎙️
        </button>
      </div>
    </>
  );
};

export default HomePage;

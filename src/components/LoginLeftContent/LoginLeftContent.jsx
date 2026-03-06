import React from "react";
import "./LoginLeftContent.css";
import { LogoIcon } from "../../Helper/Icons";
const DOTS = [true, true, true, true, true, true, true];

const LoginLeftContent = () => {
  return (
    <div className="hf-left">
      <div className="hf-logo">
        <div className="hf-logo-icon">
          <LogoIcon />
        </div>
        <span className="hf-logo-name">HabitForge</span>
      </div>

      <div className="hf-left-content">
        <h1>
          Build habits that <em>actually</em> stick.
        </h1>
        <p>
          Track daily streaks, build momentum, and turn small actions into
          lasting change.
        </p>

        <div className="hf-streak-preview">
          <div className="hf-streak-label">Your streak preview</div>
          <div className="hf-streak-dots">
            {DOTS.map((_, i) => (
              <div
                key={i}
                className={`hf-dot ${i < 6 ? "filled" : "today"}`}
                style={{ animationDelay: `${0.1 + i * 0.05}s` }}
              />
            ))}
          </div>
          <div className="hf-streak-count">
            <span>7-day</span> streak starts today
          </div>
        </div>
      </div>

      <div className="hf-trusted">Trusted by 12,000+ habit builders</div>
    </div>
  );
};

export default LoginLeftContent;

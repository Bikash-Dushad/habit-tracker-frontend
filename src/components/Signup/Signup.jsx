import { useState } from "react";
import "./Signup.css";
import {
  UserIcon,
  EmailIcon,
  LockIcon,
  EyeIcon,
  LogoIcon,
  GoogleIcon,
} from "../../Helper/Icons";
import { getPasswordScore } from "../../Helper/Helper";
const DOTS = [true, true, true, true, true, true, true];

function getStrengthColor(score) {
  return ["", "#f87171", "#fb923c", "#facc15", "#4ade80"][score];
}

function InputField({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  error,
  children,
  animationDelay,
}) {
  return (
    <div className="hf-field" style={{ animationDelay }}>
      <label htmlFor={id}>{label}</label>
      <div className="hf-input-wrap">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={error ? "hf-has-error" : ""}
          autoComplete={id}
        />
        <span className="hf-input-icon">{icon}</span>
        {children}
      </div>
      {error && <span className="hf-error-msg">{error}</span>}
    </div>
  );
}

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [pwScore, setPwScore] = useState(0);

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: "" }));
    if (field === "password") setPwScore(getPasswordScore(e.target.value));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email";
    if (form.password.length < 8)
      errs.password = "Password must be at least 8 characters";
    if (!form.confirmPassword)
      errs.confirmPassword = "Please confirm your password";
    else if (form.confirmPassword !== form.password)
      errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitted(true);
  };

  const strengthColor = getStrengthColor(pwScore);

  return (
    <>
      <div className="hf-root">
        <div className="hf-grid" />
        <div className="hf-orb" />

        <div className="hf-container">
          {/* Left Panel */}
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

          {/* Right Panel */}
          <div className="hf-right">
            <h2>Create your account</h2>
            <p className="hf-subtitle">
              Start your journey — it's free forever.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <InputField
                label="Name"
                id="name"
                placeholder="Alex Jordan"
                value={form.name}
                onChange={update("name")}
                icon={<UserIcon />}
                error={errors.name}
                animationDelay="0.15s"
              />

              <InputField
                label="Email address"
                id="email"
                type="email"
                placeholder="alex@example.com"
                value={form.email}
                onChange={update("email")}
                icon={<EmailIcon />}
                error={errors.email}
                animationDelay="0.2s"
              />

              <div className="hf-field" style={{ animationDelay: "0.25s" }}>
                <label htmlFor="password">Password</label>
                <div className="hf-input-wrap">
                  <input
                    id="password"
                    type={showPw ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={update("password")}
                    className={errors.password ? "hf-has-error" : ""}
                    autoComplete="new-password"
                  />
                  <span className="hf-input-icon">
                    <LockIcon />
                  </span>
                  <button
                    type="button"
                    className="hf-toggle-pw"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label="Toggle password visibility"
                  >
                    <EyeIcon open={showPw} />
                  </button>
                </div>
                <div className="hf-strength-bar">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="hf-strength-seg"
                      style={{
                        background: i <= pwScore ? strengthColor : "#1e2e28",
                      }}
                    />
                  ))}
                </div>
                {errors.password && (
                  <span className="hf-error-msg">{errors.password}</span>
                )}
              </div>

              <div className="hf-field" style={{ animationDelay: "0.3s" }}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="hf-input-wrap">
                  <input
                    id="confirmPassword"
                    type={showConfirmPw ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={form.confirmPassword}
                    onChange={update("confirmPassword")}
                    className={errors.confirmPassword ? "hf-has-error" : ""}
                    autoComplete="new-password"
                  />
                  <span className="hf-input-icon">
                    <LockIcon />
                  </span>
                  <button
                    type="button"
                    className="hf-toggle-pw"
                    onClick={() => setShowConfirmPw((v) => !v)}
                    aria-label="Toggle confirm password visibility"
                  >
                    <EyeIcon open={showConfirmPw} />
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="hf-error-msg">{errors.confirmPassword}</span>
                )}
              </div>

              <button
                type="submit"
                className={`hf-btn-submit${submitted ? " success" : ""}`}
              >
                {submitted ? "✓ Account Created!" : "Create Account →"}
              </button>
            </form>

            <div className="hf-divider">
              <span>or</span>
            </div>

            <button className="hf-btn-google">
              <GoogleIcon />
              Continue with Google
            </button>

            <p className="hf-signin-link">
              Already have an account? <a href="#">Sign in</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;

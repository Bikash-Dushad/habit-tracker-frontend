import { useContext, useState } from "react";
import "./Signin.css";
import { EmailIcon, LockIcon, EyeIcon, GoogleIcon } from "../../Helper/Icons";
import { InputField } from "../../Helper/Helper";
import LoginLeftContent from "../LoginLeftContent/LoginLeftContent";
import { useNavigate, NavLink } from "react-router-dom";
import { postData } from "../../api/apiService";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

// Add this at the top of your Signin component temporarily
console.log("Current origin:", window.location.origin);
console.log("Current href:", window.location.href);

const Signin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { setToken } = useContext(AuthContext);
  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    try {
      const payload = { ...form };
      const response = await postData("/api/user/signin", payload);
      if (response?.responseCode === 200) {
        toast.success(response.message);
        localStorage.setItem("habitToken", response.data.token);
        setToken(response.data.token);
        setSubmitted(true);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="hf-root">
      <div className="hf-grid" />
      <div className="hf-orb" />

      <div className="hf-container">
        {/* Left Panel */}
        <LoginLeftContent />

        {/* Right Panel */}
        <div className="hf-right">
          <h2>Sign in to your account</h2>
          <p className="hf-subtitle">Good to have you back.</p>

          <form onSubmit={handleSubmit} noValidate>
            <InputField
              label="Email address"
              id="email"
              type="email"
              placeholder="alex@example.com"
              value={form.email}
              onChange={update("email")}
              icon={<EmailIcon />}
              error={errors.email}
              animationDelay="0.15s"
            />

            <div className="hf-field" style={{ animationDelay: "0.2s" }}>
              <div className="hf-label-row">
                <label htmlFor="password">Password</label>
                <a href="#" className="hf-forgot">
                  Forgot password?
                </a>
              </div>
              <div className="hf-input-wrap">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={update("password")}
                  className={errors.password ? "hf-has-error" : ""}
                  autoComplete="current-password"
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
              {errors.password && (
                <span className="hf-error-msg">{errors.password}</span>
              )}
            </div>

            <button
              type="submit"
              className={`hf-btn-submit${submitted ? " success" : ""}`}
            >
              {submitted ? "✓ Signed In!" : "Sign In →"}
            </button>
          </form>

          <div className="hf-divider">
            <span>or</span>
          </div>

          <div className="hf-btn-google">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const token = credentialResponse.credential;
                  console.log("token is", token);
                  const response = await postData("/api/OAuth/google-auth", {
                    credential: token,
                  });
                  console.log("response is ", response);

                  if (response?.responseCode === 200) {
                    toast.success(response.message);

                    localStorage.setItem("habitToken", response.data.token);
                    setToken(response.data.token);

                    navigate("/");
                  } else {
                    toast.error(response.message);
                  }
                } catch (error) {
                  toast.error("Google login failed");
                }
              }}
              onError={() => {
                toast.error("Google login failed");
              }}
            />
          </div>

          <p className="hf-signin-link">
            Don't have an account? <NavLink to="/signup">Sign up</NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;

import { HomeIcon, ProfileIcon, LogoutIcon } from "./Icons";

export const getPasswordScore = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

export const InputField = ({
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
}) => {
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
};

export const getStrengthColor = (score) => {
  return ["", "#f87171", "#fb923c", "#facc15", "#4ade80"][score];
};

export const getInitials = (name) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

export const formatName = (name) =>
  name
    .split(" ")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");

export const getFirstName = (name) => {
  const w = name.split(" ")[0];
  return w.charAt(0) + w.slice(1).toLowerCase();
};

// ── User Dropdown ──────────────────────────────────────────────────────────
export const UserDropdown = ({ userDetails, onLogout }) => (
  <div className="nb-dropdown" onClick={(e) => e.stopPropagation()}>
    <div className="nb-dropdown-profile">
      <div className="nb-dropdown-avatar-wrap">
        <div className="nb-dropdown-avatar">
          {getInitials(userDetails.name)}
        </div>
        <div className="nb-dropdown-avatar-ring" />
      </div>
      <div>
        <div className="nb-dropdown-name">{formatName(userDetails.name)}</div>
        <div className="nb-dropdown-email">{userDetails.email}</div>
      </div>
    </div>

    <div className="nb-divider" />

    <button className="nb-dropdown-item">
      <HomeIcon /> Home
    </button>
    <button className="nb-dropdown-item">
      <ProfileIcon /> Profile
    </button>

    <div className="nb-divider" />

    <button className="nb-dropdown-item danger" onClick={onLogout}>
      <LogoutIcon /> Sign Out
    </button>
  </div>
);

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  const tomorrow = new Date();

  // Reset times to compare only date parts
  today.setHours(0, 0, 0, 0);
  yesterday.setDate(today.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  tomorrow.setDate(today.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);

  if (checkDate.getTime() === today.getTime()) return "Today";
  if (checkDate.getTime() === yesterday.getTime()) return "Yesterday";
  if (checkDate.getTime() === tomorrow.getTime()) return "Tomorrow";

  return date.toLocaleDateString();
};

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

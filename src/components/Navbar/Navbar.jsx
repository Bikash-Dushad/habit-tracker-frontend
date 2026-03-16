import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import "./Navbar.css";

const Navbar = ({ isAuthenticated, userDetails, logout }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 600) setDrawerOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleProfileClick = (e) => {
    e.preventDefault();
    toast("Profile page is still under development 🚧");
    setDrawerOpen(false);
  };

  const close = () => setDrawerOpen(false);

  const AuthLinks = ({ onClick }) =>
    isAuthenticated ? (
      <>
        <li>
          <Link to="/dashboard" onClick={onClick}>
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/profile"
            onClick={(e) => {
              handleProfileClick(e);
              onClick?.();
            }}
          >
            Profile
          </Link>
        </li>
        <li>
          <Link
            to="/signin"
            onClick={() => {
              logout();
              onClick?.();
            }}
          >
            Logout
          </Link>
        </li>
      </>
    ) : (
      <>
        <li>
          <Link to="/signin" onClick={onClick}>
            Sign In
          </Link>
        </li>
        <li>
          <Link to="/signup" onClick={onClick}>
            Sign Up
          </Link>
        </li>
      </>
    );

  return (
    <nav>
      {/* Left */}
      <div className="left">
        <h4>
          {isAuthenticated
            ? `Welcome, ${userDetails?.name?.split(" ")[0]}`
            : "Habit Tracker"}
        </h4>
      </div>

      {/* Desktop links */}
      <div className="right">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <AuthLinks />
        </ul>
      </div>

      {/* Hamburger */}
      <button
        className="nav-hamburger"
        onClick={() => setDrawerOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Mobile drawer */}
      <div className={`nav-drawer${drawerOpen ? " open" : ""}`}>
        <ul>
          <li>
            <Link to="/" onClick={close}>
              Home
            </Link>
          </li>
          <AuthLinks onClick={close} />
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
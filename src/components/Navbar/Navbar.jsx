import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import "./Navbar.css";

const Navbar = ({ isAuthenticated, userDetails, logout }) => {
  const handleProfileClick = (e) => {
    e.preventDefault();
    toast("Profile page is still under development 🚧");
  };

  return (
    <nav>
      <div className="left">
        {isAuthenticated ? (
          <h4>Welcome, {userDetails?.name?.split(" ")[0]}</h4>
        ) : (
          <h4>Habit Tracker</h4>
        )}
      </div>

      <div className="right">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>

          {isAuthenticated ? (
            <>
              <li>
                <Link to="/profile" onClick={handleProfileClick}>
                  Profile
                </Link>
              </li>

              <li>
                <Link to="/signin" onClick={logout}>
                  Logout
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/signin">Signin</Link>
              </li>

              <li>
                <Link to="/signup">Signup</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

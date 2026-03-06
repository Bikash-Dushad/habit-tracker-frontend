import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, userDetails, profileLoading } =
    useContext(AuthContext);

  return (
    <nav>
      {isAuthenticated && !profileLoading ? (
        <div>
          <h4>Welcome, {userDetails.name}</h4>
        </div>
      ) : (
        <div>
          <h4>Habit Tracker</h4>
        </div>
      )}
      <div className="right">
        <ul>
          <li>Home</li>
          <li>Profile</li>
          <li>{isAuthenticated || !profileLoading ? "logout" : "signin"}</li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

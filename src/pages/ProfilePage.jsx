import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import Navbar from "../components/Navbar/Navbar";
import Profile from "../components/Profile/Profile";

const ProfilePage = () => {
  const { isAuthenticated, userDetails, logout } = useContext(AuthContext);

  return (
    <div>
      <Navbar
        isAuthenticated={isAuthenticated}
        userDetails={userDetails}
        logout={logout}
      />
      <Profile />
    </div>
  );
};

export default ProfilePage;

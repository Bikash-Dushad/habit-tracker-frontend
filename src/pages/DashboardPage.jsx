import { useContext } from "react";
import Dashboard from "../components/Dashboard/Dashboard";
import Navbar from "../components/Navbar/Navbar";
import { AuthContext } from "../context/AuthContext";

const DashboardPage = () => {
  const { isAuthenticated, userDetails, logout } = useContext(AuthContext);

  return (
    <div>
      <Navbar
        isAuthenticated={isAuthenticated}
        userDetails={userDetails}
        logout={logout}
      />
      <Dashboard />
    </div>
  );
};

export default DashboardPage;

import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route
          path="/signin"
          element={
            !isAuthenticated ? <SigninPage /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/signup"
          element={
            !isAuthenticated ? <SignupPage /> : <Navigate to="/" replace />
          }
        />
      </Routes>
    </>
  );
}

export default App;

import { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { fetchData } from "../api/apiService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [tokenLoading, setTokenLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("habitToken");
      setToken(storedToken);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setTokenLoading(false);
    }
  }, []);
  console.log("token is ", token);

  useEffect(() => {
    if (!token || tokenLoading) {
      return;
    }
    const getUserProfile = async () => {
      try {
        const response = await fetchData("/api/user/get-user-profile");
        console.log("user details response is", response);
        if (response?.responseCode === 200) {
          setUserDetails(response.data);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setProfileLoading(false);
      }
    };
    getUserProfile();
  }, [token]);

  const value = {
    token,
    userDetails,
    profileLoading,
    isAuthenticated: !!token,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

import { useContext, useState } from "react";
import AddHabit from "../AddHabit/AddHabit";
import HabitList from "../HabitList/HabitList";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../Navbar/Navbar";
import "./Home.css";

const Home = () => {
  const { isAuthenticated, userDetails, logout } = useContext(AuthContext);
  const [refreshHabits, setRefreshHabits] = useState(false);
  const refreshHabitList = () => {
    setRefreshHabits((prev) => !prev);
  };

  return (
    <div>
      <Navbar
        isAuthenticated={isAuthenticated}
        userDetails={userDetails}
        logout={logout}
      />
      <AddHabit
        onHabitAdded={refreshHabitList}
        isAuthenticated={isAuthenticated}
      />
      <HabitList
        refreshHabits={refreshHabits}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
};

export default Home;

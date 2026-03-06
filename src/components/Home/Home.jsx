import React, { useEffect, useState, useContext } from "react";
import { fetchData } from "../../api/apiService";
import toast from "react-hot-toast";
import Navbar from "../Navbar/Navbar";
import AddHabit from "../AddHabit/AddHabit";
import HabitList from "../HabitList/HabitList";

const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <AddHabit />
      <HabitList />
    </div>
  );
};

export default Home;

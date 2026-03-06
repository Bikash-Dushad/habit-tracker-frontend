import { useEffect, useState } from "react";
import { fetchData } from "../../api/apiService";
import toast from "react-hot-toast";

const HabitList = () => {
  const [habits, setHabits] = useState([]);
  const [habitLoading, setHabitLoading] = useState(true);

  useEffect(() => {
    const getHabits = async () => {
      try {
        const response = await fetchData("api/user/list-of-habit");
        if (response?.responseCode === 200) {
          setHabits(response.data);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setHabitLoading(false);
      }
    };
    getHabits();
  }, []);

  return (
    <>
      <h2>Your Habits</h2>
      {habitLoading || habits.length === 0 ? (
        <p>No habits found.</p>
      ) : (
        habits.map((habit) => (
          <div key={habit._id}>
            <h4>{habit.name}</h4>
            <p>Off Days: {habit.offDays.join(", ")}</p>
          </div>
        ))
      )}
    </>
  );
};

export default HabitList;

import React, { useEffect, useState, useContext } from "react";
import { fetchData } from "../../api/apiService";
import toast from "react-hot-toast";

const AddHabit = () => {
  const [offDays, setOffDays] = useState([]);
  const [selectedOffDays, setSelectedOffDays] = useState([]);
  const [habitName, setHabitName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOffDays = async () => {
      try {
        const response = await fetchData("api/user/list-of-off-days-dropdown");
        if (response?.responseCode === 200) {
          setOffDays(response.data);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    getOffDays();
  }, []);

  const handleChange = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    setSelectedOffDays(values);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: habitName,
      offDays: selectedOffDays,
    };
    console.log("Submitting:", payload);
    // Here you will call API to create habit
  };

  return (
    <form action="">
      <h2>Add Habit</h2>
      <input
        type="text"
        placeholder="Enter habit name"
        value={habitName}
        onChange={(e) => setHabitName(e.target.value)}
      />
      <label>Select Off Days:</label>
      <select multiple value={selectedOffDays} onChange={handleChange}>
        {offDays || !loading
          ? offDays.map((day, index) => (
              <option key={index} value={day}>
                {day}
              </option>
            ))
          : ""}
      </select>

      <p>Selected Off Days: {JSON.stringify(selectedOffDays)}</p>
      <button type="submit">Add Habit</button>
    </form>
  );
};

export default AddHabit;

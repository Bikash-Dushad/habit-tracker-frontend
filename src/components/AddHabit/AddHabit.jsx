import { useEffect, useState, useMemo } from "react";
import { fetchData, postData } from "../../api/apiService";
import toast from "react-hot-toast";
import Select from "react-select";
import "./AddHabit.css";

const AddHabit = ({ onHabitAdded, isAuthenticated }) => {
  const [offDays, setOffDays] = useState([]);
  const [selectedOffDays, setSelectedOffDays] = useState([]);
  const [habitName, setHabitName] = useState("");
  const [loadingOffDays, setLoadingOffDays] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const options = useMemo(
    () => offDays.map((day) => ({ value: day, label: day })),
    [offDays],
  );

  useEffect(() => {
    const getOffDays = async () => {
      try {
        const response = await fetchData("api/user/list-of-off-days-dropdown");
        if (response?.responseCode === 200) setOffDays(response.data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoadingOffDays(false);
      }
    };
    getOffDays();
  }, []);

  const handleChange = (selectedOptions) => {
    setSelectedOffDays(
      selectedOptions ? selectedOptions.map((o) => o.value) : [],
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please signin or signup first to add a habit.");
      return;
    }

    if (!habitName.trim()) {
      toast.error("Please enter a habit name");
      return;
    }
    const payload = { name: habitName.trim(), offDays: selectedOffDays };
    try {
      setSubmitting(true);
      const response = await postData("/api/user/create-habit", payload);
      if (response?.responseCode === 200) {
        toast.success("Habit added successfully");
        setHabitName("");
        setSelectedOffDays([]);
        onHabitAdded();
      } else {
        toast.error(response?.message || "Failed to add habit");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="habit-form" onSubmit={handleSubmit}>
      <div className="habit-form-header">
        <h2>Add Habit</h2>
        <p className="habit-form-subtitle">Track a new habit starting today</p>
      </div>

      <div className="habit-fields-row">
        <div className="habit-field">
          <label className="habit-label">Habit Name</label>
          <input
            className="habit-input"
            type="text"
            placeholder="e.g. Morning run, Read 20 pages..."
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="habit-field">
          <label className="habit-label">Off Days</label>
          {!loadingOffDays ? (
            <Select
              className="habit-react-select"
              classNamePrefix="select"
              options={options}
              isMulti
              onChange={handleChange}
              placeholder="Select days you'll skip..."
              noOptionsMessage={() => "No days available"}
              value={options.filter((opt) =>
                selectedOffDays.includes(opt.value),
              )}
              isDisabled={submitting}
            />
          ) : (
            <div className="habit-input" style={{ color: "#3a5248" }}>
              Loading...
            </div>
          )}
        </div>
      </div>

      <p className="habit-preview">
        Selected off days:{" "}
        <span>
          {selectedOffDays.length ? selectedOffDays.join(", ") : "None"}
        </span>
      </p>

      <button className="habit-btn" type="submit" disabled={submitting}>
        {submitting ? "Adding..." : "Add Habit →"}
      </button>
    </form>
  );
};

export default AddHabit;

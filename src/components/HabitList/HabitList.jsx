import { useEffect, useState, useRef } from "react";
import { fetchData, postData } from "../../api/apiService";
import toast from "react-hot-toast";
import { formatDate } from "../../Helper/Helper";
import "./HabitList.css";

const COOLDOWN_SECONDS = 120;

const HabitList = ({ refreshHabits, isAuthenticated }) => {
  const [habits, setHabits] = useState([]);
  const [habitLoading, setHabitLoading] = useState(true);
  const [cooldowns, setCooldowns] = useState({});
  const intervalsRef = useRef({});

  useEffect(() => {
    if (!isAuthenticated) {
      setHabits([]);
      setHabitLoading(false);
      return;
    }
    const getHabits = async () => {
      try {
        const response = await fetchData("api/user/list-of-habit");
        if (response?.responseCode === 200) setHabits(response.data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setHabitLoading(false);
      }
    };
    getHabits();
  }, [refreshHabits, isAuthenticated]);

  useEffect(() => {
    return () => Object.values(intervalsRef.current).forEach(clearInterval);
  }, []);

  const isToday = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date();
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  };

  const startCooldown = (metadataId) => {
    setCooldowns((prev) => ({ ...prev, [metadataId]: COOLDOWN_SECONDS }));
    intervalsRef.current[metadataId] = setInterval(() => {
      setCooldowns((prev) => {
        const next = (prev[metadataId] ?? 0) - 1;
        if (next <= 0) {
          clearInterval(intervalsRef.current[metadataId]);
          delete intervalsRef.current[metadataId];
          const { [metadataId]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [metadataId]: next };
      });
    }, 1000);
  };

  const toggleHabit = async (payload, isOffDay, date) => {
    if (isOffDay) {
      toast.error("Cannot mark an off day");
      return;
    }

    if (!isToday(date)) {
      console.log(isToday(date));
      toast.error("You can only update today's habit");
      return;
    }

    if (cooldowns[payload.metadataId]) {
      toast.error(
        `Please wait ${cooldowns[payload.metadataId]}s before changing again`,
      );
      return;
    }

    setHabits((prev) =>
      prev.map((habit) =>
        habit._id === payload.habitId
          ? {
              ...habit,
              metadata: habit.metadata.map((m) =>
                m._id === payload.metadataId
                  ? { ...m, status: payload.status }
                  : m,
              ),
            }
          : habit,
      ),
    );

    try {
      const response = await postData("/api/user/toggle-habit", payload);
      if (response?.responseCode !== 200) {
        setHabits((prev) =>
          prev.map((habit) =>
            habit._id === payload.habitId
              ? {
                  ...habit,
                  metadata: habit.metadata.map((m) =>
                    m._id === payload.metadataId
                      ? { ...m, status: !payload.status }
                      : m,
                  ),
                }
              : habit,
          ),
        );
        toast.error(response?.message || "Something went wrong");
      } else {
        toast.success("Status updated");
        startCooldown(payload.metadataId);
      }
    } catch (error) {
      setHabits((prev) =>
        prev.map((habit) =>
          habit._id === payload.habitId
            ? {
                ...habit,
                metadata: habit.metadata.map((m) =>
                  m._id === payload.metadataId
                    ? { ...m, status: !payload.status }
                    : m,
                ),
              }
            : habit,
        ),
      );
      toast.error(error.message);
    }
  };

  const formatCountdown = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m > 0 ? `${m}:${String(s).padStart(2, "0")}` : `${s}s`;
  };

  return (
    <div className="hl-section">
      <h2 className="hl-heading">Your Habits</h2>

      {!isAuthenticated ? (
        <p className="hl-msg">
          Nothing to show. Please signin to view your habits.
        </p>
      ) : habitLoading ? (
        <p className="hl-msg">Loading habits...</p>
      ) : habits.length === 0 ? (
        <p className="hl-msg">No habits found.</p>
      ) : (
        habits.map((habit) => {
          const dates = habit.metadata.map((m) => new Date(m.date));
          const fromDate = dates.length ? new Date(Math.min(...dates)) : null;
          const toDate = dates.length ? new Date(Math.max(...dates)) : null;

          return (
            <div key={habit._id} className="hl-card">
              <div className="hl-card-left">
                <h4 className="hl-habit-name">{habit.name}</h4>
              </div>

              <div className="hl-card-right">
                {dates.length > 0 ? (
                  <>
                    <p className="hl-range">
                      <span>From</span> {formatDate(fromDate)}
                      <span className="hl-range-sep">→</span>
                      <span>To</span> {formatDate(toDate)}
                    </p>

                    <ul className="hl-dates">
                      {habit.metadata.map((m) => {
                        const remaining = cooldowns[m._id];
                        const onCooldown = !!remaining;
                        const isPast =
                          !isToday(m.date) && new Date(m.date) < new Date();

                        return (
                          <li
                            key={m._id}
                            className={`hl-date-item${m.isOffDay ? " off-day" : ""}${isPast ? " past-day" : ""}${onCooldown ? " on-cooldown" : ""}`}
                          >
                            <span className="hl-date-label">
                              {formatDate(m.date)}
                            </span>

                            <input
                              type="checkbox"
                              className="hl-checkbox"
                              checked={!!m.status}
                              onChange={(e) =>
                                toggleHabit(
                                  {
                                    habitId: habit._id,
                                    metadataId: m._id,
                                    status: e.target.checked,
                                  },
                                  m.isOffDay,
                                  m.date,
                                )
                              }
                            />

                            {onCooldown && (
                              <span className="hl-countdown">
                                {formatCountdown(remaining)}
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </>
                ) : (
                  <p className="hl-msg">No dates available.</p>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default HabitList;

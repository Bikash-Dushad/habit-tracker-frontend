import { useEffect, useState } from "react";
import { fetchData } from "../../api/apiService";
import toast from "react-hot-toast";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import "./Dashboard.css";

const COLORS = {
  completed: "#4ade80",
  remaining: "#1e2e28",
};

const MONTH_NAMES = {
  "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr",
  "05": "May", "06": "Jun", "07": "Jul", "08": "Aug",
  "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec",
};

const formatMonth = (m) => {
  const [year, month] = m.split("-");
  return `${MONTH_NAMES[month]} ${year}`;
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="db-tooltip">
      <p>{payload[0].name}: <span>{payload[0].value}</span></p>
    </div>
  );
};

const HabitPieCard = ({ habit }) => {
  return (
    <div className="db-habit-block">
      <h4 className="db-habit-name">{habit.habitName}</h4>
      <div className="db-month-row">
        {habit.monthlyData.map((m) => {
          const remaining = m.totalDays - m.completedDays;
          const data = [
            { name: "Completed", value: m.completedDays },
            { name: "Remaining", value: remaining },
          ];

          return (
            <div key={m.month} className="db-month-card">
              <p className="db-month-label">{formatMonth(m.month)}</p>

              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    <Cell fill={COLORS.completed} />
                    <Cell fill={COLORS.remaining} />
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Center label overlay */}
              <div className="db-pie-center">
                <span className="db-rate">{m.completionRate}%</span>
              </div>

              <div className="db-stats">
                <div className="db-stat">
                  <span className="db-stat-val completed">{m.completedDays}</span>
                  <span className="db-stat-key">Done</span>
                </div>
                <div className="db-stat-divider" />
                <div className="db-stat">
                  <span className="db-stat-val">{m.totalDays}</span>
                  <span className="db-stat-key">Total</span>
                </div>
                <div className="db-stat-divider" />
                <div className="db-stat">
                  <span className="db-stat-val streak">{m.longestStreak}</span>
                  <span className="db-stat-key">Best Streak</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDashboard = async () => {
      try {
        const response = await fetchData("/api/user/dashboard");
        if (response?.responseCode === 200) setData(response.data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    getDashboard();
  }, []);

  if (loading) return <p className="db-msg">Loading dashboard...</p>;
  if (!data || !data.habits?.length) return <p className="db-msg">No data yet.</p>;

  return (
    <div className="db-section">
      <h2 className="db-heading">Dashboard</h2>
      <div className="db-grid">
        {data.habits.map((habit) => (
          <HabitPieCard key={habit.habitId} habit={habit} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
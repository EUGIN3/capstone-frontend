import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import AxiosInstance from "../../API/AxiosInstance";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Legend, Tooltip);

export default function PaymentsOverTimeChart() {
  const [chartData, setChartData] = useState(null);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await AxiosInstance.get("/design/designs/");
      const data = response.data;

      // Extract unique years from data
      const yearsSet = new Set(data.map(item => new Date(item.created_at).getFullYear()));
      const yearsArray = Array.from(yearsSet).sort((a,b) => a - b);
      setYears(yearsArray);

      // Default to current month/year
      const now = new Date();
      setSelectedYear(now.getFullYear());
      setSelectedMonth(now.getMonth() + 1);

      updateChart(data, now.getFullYear(), now.getMonth() + 1);
    } catch (error) {
      console.error(error);
    }
  };

  const updateChart = (data, year, month) => {
    // Filter data by selected month/year
    const filteredData = data.filter(item => {
      const date = new Date(item.created_at);
      return date.getFullYear() === year && date.getMonth() + 1 === month;
    });

    // Aggregate payments per day
    const daysInMonth = new Date(year, month, 0).getDate(); // last day of month
    const dailyAmounts = Array(daysInMonth).fill(0);

    filteredData.forEach(item => {
      const day = new Date(item.created_at).getDate();
      dailyAmounts[day - 1] += parseFloat(item.amount_paid);
    });

    const labels = Array.from({length: daysInMonth}, (_, i) => i + 1);

    setChartData({
      labels,
      datasets: [
        {
          label: "Amount Paid",
          data: dailyAmounts,
          borderColor: "#0c0c0c",
          backgroundColor: "#0c0c0c25",
          tension: 0.3,
          fill: true,
          pointRadius: 3,
        },
      ],
    });
  };

  const handleYearChange = (e) => {
    const year = parseInt(e.target.value);
    setSelectedYear(year);
    AxiosInstance.get("/design/designs/")
      .then((res) => updateChart(res.data, year, selectedMonth))
      .catch(err => console.error(err));
  };

  const handleMonthChange = (e) => {
    const month = parseInt(e.target.value);
    setSelectedMonth(month);
    AxiosInstance.get("/design/designs/")
      .then((res) => updateChart(res.data, selectedYear, month))
      .catch(err => console.error(err));
  };

  return (
  <div style={{
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    minHeight: 0, // critical for nested flex/grid
  }}>
    <h2 className="text-xl font-semibold mb-2">💵 Payments Over Time</h2>

    <div className="mb-3 flex items-center gap-4 flex-wrap">
      <div>
        <label className="mr-2 font-medium">Year:</label>
        <select value={selectedYear} onChange={handleYearChange} className="border px-2 py-1 rounded">
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mr-2 font-medium">Month:</label>
        <select value={selectedMonth} onChange={handleMonthChange} className="border px-2 py-1 rounded">
          {monthNames.map((name, idx) => (
            <option key={idx} value={idx + 1}>{name}</option>
          ))}
        </select>
      </div>
    </div>

    {/* 👇 This is the key: let chart take ONLY remaining space */}
    <div style={{ 
      flex: 1, 
      minHeight: 0,   // ← prevents overflow
      width: "100%" 
    }}>
      {chartData ? (
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false, // 👍 good — keep this
            plugins: {
              legend: { position: "top" },
              tooltip: { mode: "index", intersect: false },
            },
            scales: {
              y: { 
                beginAtZero: true, 
                title: { display: true, text: "Amount Paid" } 
              },
              x: { 
                title: { display: true, text: "Day of Month" } 
              },
            },
          }}
        />
      ) : (
        <div style={{
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#666'
        }}>
          Loading chart...
        </div>
      )}
    </div>
  </div>
);
}

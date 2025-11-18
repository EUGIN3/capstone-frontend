import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import AxiosInstance from "../../API/AxiosInstance";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Legend, Tooltip);

export default function AppointmentsPerMonthChart() {
  const [chartData, setChartData] = useState(null);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await AxiosInstance.get("/appointment/appointments/");
      const data = response.data;

      // Extract unique years
      const yearsSet = new Set(data.map(item => new Date(item.date).getFullYear()));
      const yearsArray = Array.from(yearsSet).sort((a, b) => a - b);
      setYears(yearsArray);

      // Load chart for default year
      updateChart(data, selectedYear);
    } catch (error) {
      console.error(error);
    }
  };

  const updateChart = (data, year) => {
    const monthsCount = Array(12).fill(0); // Jan-Dec

    data.forEach(item => {
      const date = new Date(item.date);
      if (date.getFullYear() === year) {
        monthsCount[date.getMonth()] += 1;
      }
    });

    setChartData({
      labels: monthNames,
      datasets: [
        {
          label: `Number of Appointments in ${year}`,
          data: monthsCount,
          backgroundColor: "#0c0c0c25",
          borderColor: "#0c0c0c",
          borderWidth: 1,
        },
      ],
    });
  };

  const handleYearChange = (e) => {
    const year = parseInt(e.target.value);
    setSelectedYear(year);
    AxiosInstance.get("/appointment/appointments/")
      .then((res) => updateChart(res.data, year))
      .catch(err => console.error(err));
  };

return (
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      minHeight: 0, // ← critical
    }}
  >
    <h2 className="text-xl font-semibold mb-2">📅 Appointments Per Month</h2>

    <div className="mb-3">
      <label className="mr-2 font-medium">Select Year:</label>
      <select
        value={selectedYear}
        onChange={handleYearChange}
        className="border px-2 py-1 rounded"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>

    {/* Chart container: takes remaining space */}
    <div style={{ flex: 1, minHeight: 0, width: "100%" }}>
      {chartData ? (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { 
                position: "top",
                labels: {
                  padding: 10,
                  usePointStyle: true,
                }
              },
              tooltip: { 
                mode: "index", 
                intersect: false 
              },
            },
            scales: {
              y: { 
                beginAtZero: true, 
                title: { display: true, text: "Number of Appointments" },
                ticks: { precision: 0 }
              },
              x: { 
                title: { display: true, text: "Month" } 
              },
            },
            layout: {
              padding: { top: 10, bottom: 10 } // optional: reduce extra padding
            }
          }}
        />
      ) : (
        <div
          style={{
            display: "flex",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            color: "#666",
          }}
        >
          Loading chart...
        </div>
      )}
    </div>
  </div>
  );
}

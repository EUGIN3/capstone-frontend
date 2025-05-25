import React from 'react';
import './Chart.css';

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
} from 'chart.js';

import { Bar, Doughnut, Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
  ChartDataLabels
);

const Chart = () => {

  const randomData = (min, max) =>
    Array.from({ length: 12 }, () => Math.floor(Math.random() * (max - min + 1)) + min);

  return (
    <div className='chartComponent'>

      <div className="mainGraph">
        <p className="title">🗓️ MONTHLY APPOINTMENT</p>

        <div className="line">
              <Line
              data={{
                labels: [
                  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                ],
                datasets: [
                  {
                    label: 'Client Visits',
                    data: randomData(100, 500),
                    borderColor: 'rgba(54, 162, 235, 0.6)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2
                  },
                  {
                    label: 'Fittings',
                    data: randomData(50, 350),
                    borderColor: 'rgba(255, 99, 132, 0.6)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2
                  },
                  {
                    label: 'Orders',
                    data: randomData(80, 400),
                    borderColor: 'rgba(255, 206, 86, 0.6)',
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 2
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Number of Events',
                      color: '#333',
                      font: {
                        size: 14,
                        weight: 'bold'
                      }
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Months',
                      color: '#333',
                      font: {
                        size: 14,
                        weight: 'bold'
                      }
                    }
                  }
                },
                plugins: {
                  legend: {
                    position: 'top',
                    labels: {
                      font: {
                        size: 14
                      }
                    }
                  },
                  tooltip: {
                    callbacks: {
                      label: context => `${context.dataset.label}: ${context.raw}`
                    }
                  }
                }
              }}
            />
        </div>
      </div>

      <div className="subGraphs">
        <div className="subGraphOne">
          <p className="title">✅ APPOINTMENT CATEGORIES</p>
          <div className="bar">
            <Bar
              data={{
                labels: ['Approved', 'Denied', 'Cancelled'],  
                datasets: [{
                  label: 'Appointments',
                  data: [
                    Math.floor(Math.random() * (300 - 50 + 1)) + 50,
                    Math.floor(Math.random() * (300 - 50 + 1)) + 50,
                    Math.floor(Math.random() * (300 - 50 + 1)) + 50
                  ],
                  backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(255, 206, 86, 0.6)'
                  ],
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { stepSize: 50 }
                  }
                },
                plugins: {
                  legend: { position: 'top' },
                  tooltip: {
                    callbacks: {
                      label: context => `${context.label}: ${context.raw}`
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="subGraphTwo">
          <p className="title">👗 ATTIRE TYPES</p>
          <div className="pie">
            <Doughnut
              data={{ 
                labels: ['Evening Gown', 'Wedding Gown', 'Cocktail Dress', 'Ball Gown', 'Sheath Dress'],  // 5 gown types
                datasets: [{
                  label: 'Gown Types',
                  data: [
                    Math.floor(Math.random() * (300 - 50 + 1)) + 50,
                    Math.floor(Math.random() * (300 - 50 + 1)) + 50,
                    Math.floor(Math.random() * (300 - 50 + 1)) + 50,
                    Math.floor(Math.random() * (300 - 50 + 1)) + 50,
                    Math.floor(Math.random() * (300 - 50 + 1)) + 50
                  ],
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',   // red-ish
                    'rgba(54, 162, 235, 0.6)',   // blue-ish
                    'rgba(255, 206, 86, 0.6)',   // yellow-ish
                    'rgba(75, 192, 192, 0.6)',   // green-ish
                    'rgba(153, 102, 255, 0.6)'   // purple-ish
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                  ],
                  borderWidth: 1
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  datalabels: {
                    color: '#000',
                    font: {
                      weight: 'bold',
                      size: 14
                    },
                    formatter: (value, context) => {
                      const data = context.chart.data.datasets[0].data;
                      const total = data.reduce((a, b) => a + b, 0);
                      const percentage = (value / total * 100).toFixed(1);
                      return `${percentage}%`;
                    }
                  }
                }
              }}
              plugins={[ChartDataLabels]}
            />
          </div>
        </div>
      </div>

    </div>
  );
}

export default Chart;

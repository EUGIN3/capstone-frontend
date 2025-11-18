// import './AdminDashboard.css';
// import React, {useState, useEffect} from 'react';
// import AxiosInstance from '../../API/AxiosInstance'
// import {Tooltip} from '@mui/material'
// import PaymentsOverTimeChart from './PaymentsOverTimeChart';
// import AppointmentsPerMonthChart from './AppointmentsPerMonthChart';

// function AdminDashboard() {
//   const [totalUser, setTotalUser] = useState(0)
//   const [totalPending, setTotalPending] = useState(0)
//   const [totalApprove, setTotalApprove] = useState(0)
//   const [totalProjects, setTotalProjects] = useState(0)
//   const [totalRevenue, setTotalRevenue] = useState(0)

//   const fetchUsers = async () => {
//     const response = await AxiosInstance('/auth/users/')
//     setTotalUser(response.data.length)
//   }

//   const fetchAppointment = async () => {
//     const response = await AxiosInstance('/appointment/appointments/')
    
//     const pending = response.data.filter(appointment =>
//       appointment.appointment_status === 'pending'
//     );
//     setTotalPending(pending.length)
    
//     const approve = response.data.filter(appointment =>
//       appointment.appointment_status === 'approved'
//     );
//     setTotalApprove(approve.length)
//   }

//   const fetchProjects = async () => {
//     const response = await AxiosInstance('/design/designs/')
//     setTotalProjects(response.data.length)
//   }

//   const fetchTotalPayment = async () => {
//     try {
//       const response = await AxiosInstance.get('/design/designs/');
//       const data = response.data;

//       // Sum all amount_paid fields
//       const totalAmount = data.reduce((sum, item) => sum + parseFloat(item.amount_paid || 0), 0);

//       // Format with commas
//       const formattedAmount = totalAmount.toLocaleString("en-US", {
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2
//       });

//       setTotalRevenue(formattedAmount); 
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(()=> {
//     fetchUsers()
//     fetchAppointment()
//     fetchProjects()
//     fetchTotalPayment()
//   }, [])

//   // useEffect(()=> {
//   //   console.log(totalUser)
//   //   console.log(totalPending)
//   //   console.log(totalProjects)
//   // }, [totalPending])
  





//   return (
//     <div className="admin-dashboard-container">
//       {/* Header Section */}
//       <div className="header-container">
//         <div className="header-left">
//           <h1>Admin Dashboard</h1>
//         </div>
//       </div>

//       <div className="small-data">
//         <Tooltip title='Visit' arrow>
//           <div className="number-user small-data-item">
//             <span className='small-data-item-label'>👤 registered user</span>
//             {totalUser}
//           </div>
//         </Tooltip>
//         <Tooltip title='Visit' arrow>
//           <div className="number-of-peding-appointment small-data-item">
//             <span className='small-data-item-label'>🗓️ pending appointment</span>
//             {totalPending}
//           </div>
//         </Tooltip>
//         <Tooltip title='Visit' arrow>
//           <div className="number-approve-appointment small-data-item">
//             <span className='small-data-item-label'>✅ approve appointment</span>
//             {totalApprove}
//           </div>
//         </Tooltip>
//         <Tooltip title='Visit' arrow>
//           <div className="number-ongoing-project small-data-item">
//             <span className='small-data-item-label'>📐 projects</span>
//             {totalProjects}
//           </div>
//         </Tooltip>
//         <Tooltip title='Visit' arrow>
//         <div className="total-amount-monthly small-data-item">
//           <span className='small-data-item-label'>💵 Total Revenue</span>
//           ₱ {totalRevenue}
//         </div>
//         </Tooltip>
//       </div>

//       <div className="big-graph">
//         <div className="graph">
//           <AppointmentsPerMonthChart/>
//           {/* hello */}
//         </div>

//         <div className="graph">
//           <PaymentsOverTimeChart/>
//         </div>
//       </div>

//     </div>
//   );
// }

// export default AdminDashboard;





import './AdminDashboard.css';
import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../API/AxiosInstance';
import { Tooltip } from '@mui/material';
import PaymentsOverTimeChart from './PaymentsOverTimeChart';
import AppointmentsPerMonthChart from './AppointmentsPerMonthChart';
import { useNavigate } from 'react-router-dom'

function AdminDashboard() {
  const [totalUser, setTotalUser] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [totalApprove, setTotalApprove] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthOptions, setMonthOptions] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const navigate = useNavigate()

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const fetchUsers = async () => {
    const response = await AxiosInstance.get('/auth/users/');
    setTotalUser(response.data.length);
  };

  const fetchAppointment = async () => {
    const response = await AxiosInstance.get('/appointment/appointments/');
    const pending = response.data.filter(a => a.appointment_status === 'pending');
    const approve = response.data.filter(a => a.appointment_status === 'approved');
    setTotalPending(pending.length);
    setTotalApprove(approve.length);
  };

  const fetchProjects = async () => {
    const response = await AxiosInstance.get('/design/designs/');
    setTotalProjects(response.data.length);
  };

  const fetchTotalPayment = async () => {
    try {
      const response = await AxiosInstance.get('/design/designs/');
      const data = response.data;

      // Extract unique years
      const yearsSet = new Set(data.map(item => new Date(item.created_at).getFullYear()));
      const yearsArray = Array.from(yearsSet).sort((a,b) => a-b);
      setYearOptions(yearsArray);

      // Calculate revenue for current month/year
      calculateRevenue(data, selectedYear, selectedMonth);
    } catch (error) {
      console.error(error);
    }
  };

  const calculateRevenue = (data, year, month) => {
    // Filter by selected year and month
    const filteredData = data.filter(item => {
      const date = new Date(item.created_at);
      return date.getFullYear() === year && date.getMonth() + 1 === month;
    });

    const totalAmount = filteredData.reduce(
      (sum, item) => sum + parseFloat(item.amount_paid || 0),
      0
    );

    const formattedAmount = totalAmount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    setTotalRevenue(formattedAmount);
  };

  const handleMonthChange = (e) => {
    const month = parseInt(e.target.value);
    setSelectedMonth(month);
    AxiosInstance.get('/design/designs/')
      .then(res => calculateRevenue(res.data, selectedYear, month))
      .catch(err => console.error(err));
  };

  const handleYearChange = (e) => {
    const year = parseInt(e.target.value);
    setSelectedYear(year);
    AxiosInstance.get('/design/designs/')
      .then(res => calculateRevenue(res.data, year, selectedMonth))
      .catch(err => console.error(err));
  };

  useEffect(()=> {
    fetchUsers();
    fetchAppointment();
    fetchProjects();
    fetchTotalPayment();
  }, []);

  return (
    <div className="admin-dashboard-container">
      <div className="header-container">
        <div className="header-left">
          <h1>Admin Dashboard</h1>
        </div>
      </div>

      <div className="small-data">
        <Tooltip title='See more.' arrow>
          <div className="number-user small-data-item" onClick={() => navigate('/admin/manage-user')}>
            <span className='small-data-item-label'>👤 Registered Users</span>
            {totalUser}
          </div>
        </Tooltip>

        <Tooltip title='See more.' arrow>
          <div className="number-of-peding-appointment small-data-item" onClick={() => navigate('/admin/manage-appointments')}>
            <span className='small-data-item-label'>🗓️ Pending Appointments</span>
            {totalPending}
          </div>
        </Tooltip>

        <Tooltip title='See more.' arrow>
          <div className="number-approve-appointment small-data-item" onClick={() => navigate('/admin/approved-appointment')}>
            <span className='small-data-item-label'>✅ Approved Appointments</span>
            {totalApprove}
          </div>
        </Tooltip>

        <Tooltip title='See more.' arrow>
          <div className="number-ongoing-project small-data-item" onClick={() => navigate('/admin/on-going-project')}>
            <span className='small-data-item-label'>📐 Projects</span>
            {totalProjects}
          </div>
        </Tooltip>

        <div className="total-amount-monthly small-data-item">
          <span className='small-data-item-label'>💵 Total Revenue</span>
          <div className="flex items-center gap-2">
            <span>₱ {totalRevenue}</span>
          </div>

          <div className="date-select-container">
            <select value={selectedYear} onChange={handleYearChange} className="border px-2 py-1 rounded">
              {yearOptions.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <select value={selectedMonth} onChange={handleMonthChange} className="border px-2 py-1 rounded">
              {monthNames.map((name, idx) => (
                <option key={idx} value={idx + 1}>{name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="big-graph">
        <div className="graph">
          <AppointmentsPerMonthChart/>
        </div>

        <div className="graph">
          <PaymentsOverTimeChart/>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

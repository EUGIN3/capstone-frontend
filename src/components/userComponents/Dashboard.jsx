import '../../index.css'
import '../styles/Dashboard.css'


import Construction from '../Construction'
import Chart from '../Charts/Chart'


const Dashboard = () => {
    return (
        <div className='appContainer dashboard-main-container'>
            <Chart />
        </div>
    )
}

export default Dashboard;
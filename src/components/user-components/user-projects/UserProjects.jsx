import React, {useState, useEffect} from 'react'
import './UserProjects.css'
import AppHeader from '../user-header/userHeader'
import IndividualProject from './IndividualProject'

import AxiosInstance from '../../API/AxiosInstance'

function UserProjects() {
  const [project, setProject] = useState(null);
  const [appointment, setAppointment] = useState(null)
  
  const fetchProject = async () => {
    const response = await AxiosInstance.get('/design/user_designs');
    setProject(await response.data);
  }

  const fetchAppointment = async () => {
    const response = await AxiosInstance('/appointment/user_appointments/')
    const archived = response.data.filter(a => a.appointment_status === 'archived');
    setAppointment(await archived)
  }

  useEffect(() => {
    fetchProject();
    fetchAppointment()
  },[]);


  return (
    <div className='UserProjects'>
      <AppHeader 
          headerTitle="Projects:"
      />
      <IndividualProject project={project} appointment={appointment}/>
    </div>
  )
}

export default UserProjects
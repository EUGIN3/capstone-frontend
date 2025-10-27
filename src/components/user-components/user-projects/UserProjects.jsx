import React, {useState, useEffect} from 'react'
import './UserProjects.css'
import AppHeader from '../user-header/userHeader'
import IndividualProject from './IndividualProject'

import AxiosInstance from '../../API/AxiosInstance'

function UserProjects() {
  const [project, setProject] = useState(null);
  
  const fetchProject = async () => {
    const response = await AxiosInstance.get('/design/user_designs');
    setProject(await response.data);
  }

  useEffect(() => {
    fetchProject();
  },[]);


  return (
    <div className='UserProjects'>
      <AppHeader 
          headerTitle="Projects:"
      />
      <IndividualProject project={project}/>
    </div>
  )
}

export default UserProjects
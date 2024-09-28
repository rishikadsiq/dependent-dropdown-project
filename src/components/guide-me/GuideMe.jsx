import React, { useState, useEffect } from 'react'
import HeaderLayout from '../home/HeaderLayout'
import TrackingCard from './TrackingCard'
import Stepper from './Stepper'
import ClientGuideMe from './client-guideme/ClientGuideMe'
import ProjectGuideMe from './project-guideme/ProjectGuideMe'
import TaskGuideMe from './task-guideme/TaskGuideMe'
import UserGuideMe from './user-guideme/UserGuideMe'
import { useLocation } from 'react-router-dom'

const GuideMe = () => {
  const [clientComponent, setClientComponent] = useState(false);
  const [projectComponent, setProjectComponent] = useState(false);
  const [userComponent, setUserComponent] = useState(false);
  const [taskComponent, setTaskComponent] = useState(false);

  const location = useLocation();
  // Clear specific localStorage data when navigating away
  useEffect(() => {
    const handleRouteChange = () => {
      if (!location.pathname.includes('/guide-me')) {
        localStorage.removeItem('guideMeTaskData');
        localStorage.removeItem('guideMeUserData');
        localStorage.removeItem('guideMeProjectData');
        localStorage.removeItem('guideMeClientData')
    }
  };
  handleRouteChange();
}, [location.pathname]);
  return (
    <HeaderLayout>
        <div>GuideMe</div>
        {!(clientComponent || projectComponent || taskComponent || userComponent) && (
          <TrackingCard setClientComponent={setClientComponent}/>
        )}
        
        {(clientComponent || projectComponent || taskComponent || userComponent) && (
          <Stepper clientComponent={clientComponent} projectComponent={projectComponent} taskComponent={taskComponent} userComponent={userComponent}/>
        )}
        
        {clientComponent && <ClientGuideMe setProjectComponent={setProjectComponent} setClientComponent={setClientComponent} clientComponent={clientComponent} />}
        {projectComponent && <ProjectGuideMe setProjectComponent={setProjectComponent}setClientComponent={setClientComponent} setTaskComponent={setTaskComponent} projectComponent={projectComponent} />}
        {taskComponent && <TaskGuideMe setProjectComponent={setProjectComponent} setTaskComponent={setTaskComponent} setUserComponent={setUserComponent}/>}
        {userComponent && (<UserGuideMe setTaskComponent={setTaskComponent} setUserComponent={setUserComponent} />)}
        
        
    </HeaderLayout>
  )
}

export default GuideMe
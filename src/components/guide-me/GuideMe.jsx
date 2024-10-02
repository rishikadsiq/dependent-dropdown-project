import { useState, useEffect } from 'react'
import { Window } from "@progress/kendo-react-dialogs";
import HeaderLayout from '../home/HeaderLayout'
import TrackingCard from './TrackingCard'
import Stepper from './Stepper'
import ClientGuideMe from './client-guideme/ClientGuideMe'
import ProjectGuideMe from './project-guideme/ProjectGuideMe'
import TaskGuideMe from './task-guideme/TaskGuideMe'
import UserGuideMe from './user-guideme/UserGuideMe'
import { useNavigate } from 'react-router-dom';

const GuideMe = () => {
  const [clientComponent, setClientComponent] = useState(false);
  const [projectComponent, setProjectComponent] = useState(false);
  const [userComponent, setUserComponent] = useState(false);
  const [taskComponent, setTaskComponent] = useState(false);
  const [navigateHome, setNavigateHome] = useState(false);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    if(clientComponent===false && projectComponent===false && userComponent===false && taskComponent===false){
      localStorage.removeItem('guideMeClientData')
      localStorage.removeItem('guideMeUserData')
      localStorage.removeItem('guideMeTaskData')
      localStorage.removeItem('guideMeProjectData')
    }
  },[clientComponent,taskComponent,userComponent,projectComponent])
  // useEffect(() => {
  //   if(clientComponent===false && projectComponent===false && userComponent===false && taskComponent===false){
  //     localStorage.removeItem('guideMeClientData')
  //     localStorage.removeItem('guideMeUserData')
  //     localStorage.removeItem('guideMeTaskData')
  //     localStorage.removeItem('guideMeProjectData')
  //   }
  // },[userComponent])
 
    useEffect(() => {
      if(navigateHome){
        navigate('/')
        setNavigateHome(false)
        setVisible(false)
      }
    },[navigateHome])

    const toggleWindow = () => {
      setVisible(!visible);
      localStorage.removeItem('guideMeClientData')
      localStorage.removeItem('guideMeUserData')
      localStorage.removeItem('guideMeTaskData')
      localStorage.removeItem('guideMeProjectData')
      setNavigateHome(true)
    };
  return (
    <HeaderLayout>
        <div>
          <h1>Guide Me</h1>
        </div>
        {!(clientComponent || projectComponent || taskComponent || userComponent) && (
          <TrackingCard setVisible={setVisible} setClientComponent={setClientComponent}/>
        )}
        <div>
        {visible && <Window title={"Guide Me"} onClose={toggleWindow} initialHeight={850} initialWidth={900}>
          <div>
          
        
        {(clientComponent || projectComponent || taskComponent || userComponent) && (
          <Stepper clientComponent={clientComponent} projectComponent={projectComponent} taskComponent={taskComponent} userComponent={userComponent}/>
        )}
        
        {clientComponent && <ClientGuideMe setProjectComponent={setProjectComponent} setClientComponent={setClientComponent} clientComponent={clientComponent} />}
        {projectComponent && <ProjectGuideMe setProjectComponent={setProjectComponent}setClientComponent={setClientComponent} setTaskComponent={setTaskComponent} projectComponent={projectComponent} />}
        {taskComponent && <TaskGuideMe setProjectComponent={setProjectComponent} setTaskComponent={setTaskComponent} setUserComponent={setUserComponent}/>}
        {userComponent && (<UserGuideMe setTaskComponent={setTaskComponent} setUserComponent={setUserComponent} toggleWindow={toggleWindow}/>)}
        
        
          </div>
        </Window>}
      </div>
        
    </HeaderLayout>
  )
}

export default GuideMe
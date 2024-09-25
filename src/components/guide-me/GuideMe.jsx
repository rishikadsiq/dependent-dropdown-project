import React, { useState } from 'react'
import HeaderLayout from '../home/HeaderLayout'
import TrackingCard from './TrackingCard'
import Stepper from './Stepper'
import GuideMeClient from './GuideMeClient'
import GuideMeProject from './GuideMeProject'

const GuideMe = () => {
  const [clientComponent, setClientComponent] = useState(false);
  const [projectComponent, setProjectComponent] = useState(false);
  const [userComponent, setUserComponent] = useState(false);
  const [taskComponent, setTaskComponent] = useState(false);

  return (
    <HeaderLayout>
        <div>GuideMe</div>
        {!(clientComponent || projectComponent || taskComponent || userComponent) && (
          <TrackingCard setClientComponent={setClientComponent}/>
        )}
        
        {(clientComponent || projectComponent || taskComponent || userComponent) && (
          <Stepper clientComponent={clientComponent} projectComponent={projectComponent} taskComponent={taskComponent} userComponent={userComponent} />
        )}
        
        {clientComponent && <GuideMeClient setProjectComponent={setProjectComponent} setClientComponent={setClientComponent} />}
        {projectComponent && <GuideMeProject setProjectComponent={setProjectComponent}setClientComponent={setClientComponent} setTaskComponent={setTaskComponent} />}
        
    </HeaderLayout>
  )
}

export default GuideMe
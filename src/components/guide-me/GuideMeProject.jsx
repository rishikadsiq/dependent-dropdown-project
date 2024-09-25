import { Button } from '@progress/kendo-react-buttons';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import React, { useEffect, useState } from 'react'


const EditCommandCell = props => {
    return (
      <td>
        <Button
          themeColor={'primary'}
          type="button"
          onClick={() => props.addProject(props.dataItem)}
        >
          Add Project
        </Button>
      </td>
    );
  };
  
const MyEditCommandCell = props => <EditCommandCell {...props} />;



const GuideMeProject = ({setClientComponent, setProjectComponent,setTaskComponent}) => {
    const [clientData, setClientData] = useState([])

    const clientListing = () => {
        const localData = JSON.parse(localStorage.getItem('guideMeClientData'));
        if (localData) {
          const updatedData = localData.map((client, index) =>{
            return {
              ...client,
              new_id: index+1
            }
          })
          setClientData(updatedData);
        }
      }
    
    useEffect(() => {
        clientListing();
    },[])

    const handleAddProject = (dataItem) => {
        localStorage.setItem('selectedClient', JSON.stringify({ 'name': dataItem.name, 'id': dataItem.id }))
      }
    
    
  return (
    <div>
        <div>
            <div>
                <h4>Clients</h4>
            </div>
            <Grid data={clientData}>
                <Column field="new_id" title="ID" />
                <Column field='name' title='Client Name' />
                <Column field='email' title='Email' />
                <Column field='phone' title='Phone' />
                <Column title='Actions' cell={props => <MyEditCommandCell {...props} addProject={handleAddProject} />} />
            </Grid>
            
            
        <style>
            {`.k-animation-container {
                z-index: 10003;
            }`}
        </style>
        </div>
        <div className='d-flex justify-content-between align-items-center mt-3'>
            <Button themeColor={'primary'} onClick={() => {
                setClientComponent(true)
                setProjectComponent(false)
            }}> Previous</Button>
            <Button themeColor={'primary'} disabled onClick={() => {
                setProjectComponent(false)
                setTaskComponent(true)
            }}>Next</Button>
        </div>
    </div>
  )
}

export default GuideMeProject
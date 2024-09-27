import * as React from 'react';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import { Button } from "@progress/kendo-react-buttons";
import {PostRequestHelper} from '../../helper/PostRequestHelper'
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import AddFormProject from './AddFormProject'
import HeaderLayout from '../../home/HeaderLayout';
import { useNavigate } from "react-router-dom";

import AddFormFromClientGuideMe from './AddFormFromClientGuideMe';


const EditCommandCell = props => {
    return (
      <td>
        <Button
          themeColor={'primary'}
          type="button"
          onClick={() =>props.addTask(props.dataItem)}
        >
          Add Task
        </Button>
      </td>
    );
  };
  
const MyEditCommandCell = props => <EditCommandCell {...props} />;
const ProjectGuideMe = ({setClientComponent, setProjectComponent, setTaskComponent}) => {
    
    const [openAddForm, setOpenAddForm] = React.useState(false);
    const [editItem, setEditItem] = React.useState({
        id: 1
    });
    const [data, setData] = React.useState([]);
    const [showDuplicateDialog, setShowDuplicateDialog] = React.useState(false)
    const [openAddFormFromClients, setOpenAddFormFromClients] = React.useState(false)
    const [openSuccessDialog, setOpenSuccessDialog] = React.useState(false)
    const [openConflictDialog, setOpenConflictDialog] = React.useState(false);
    const navigate = useNavigate()

    const getListing = () => {
      const localData = JSON.parse(localStorage.getItem('guideMeProjectData'));
      if (localData) {
        const updatedData = localData.map((project, index) =>{
          return {
            ...project,
            new_id: index+1,
            start_date: project.start_date ? new Date(project.start_date) : null,
            end_date: project.end_date ? new Date(project.end_date) : null,
          }
        })
        setData(updatedData);
      }
    }

  React.useEffect(() => {
    getListing(); 
}, []);

const toggleSuccessDialog = () => {
  setOpenSuccessDialog(false)
}

const toggleConflictDialog = () => {
  setOpenConflictDialog(false)
}

const addNewFromClients = (localdata) => {
  setEditItem({
    id: undefined,
    client_id: localdata.id,
    client_name: localdata.name,
  });
}
React.useEffect(() => {
  const localdata = JSON.parse(localStorage.getItem('selectedClient'))
  if(localdata){
    addNewFromClients(localdata)
    setOpenAddFormFromClients(true)
    localStorage.removeItem('selectedClient')
  }
  else{
    setOpenAddForm(true)
    setEditItem({
      id: undefined
    });
  }
},[])


    const handleAddTask = (dataItem) => {
      localStorage.setItem('selectedProject', JSON.stringify({'name': dataItem.name, 'id': dataItem.id}))
      setProjectComponent(false)
      setTaskComponent(true)
    }

  const handleSubmit = event => {
    let newItem = true;
    let newData = data.map(item => {
        if (event.id === item.id) {
          newItem = false;
          item = {
            ...event
          };
        }
        return item;
      });
    if (newItem) {
        console.log(event)
        const fetchData = async() => {
            try {
                delete event.id
                console.log(event);
                let updatedEvent = {}
                if(event.client_id.client_id){
                  updatedEvent = {...event, client_id: event.client_id.client_id}
               }else if(event.client_id){
                   updatedEvent = {...event}
               }
                  
                console.log(updatedEvent)
                localStorage.setItem('to_be_add', JSON.stringify(updatedEvent));
                
                const data1 = await PostRequestHelper('addproject', updatedEvent, navigate);
                if(data1.status === 201){
                    localStorage.removeItem('to_be_add');
                    localStorage.setItem('selectedProject', JSON.stringify({ 'name': data1.name, 'id': data1.id, 'client_name': data1.client_name, 'client_id': data1.client_id, start_date: data1.start_date, end_date: data1.end_date}));
                    const localData = JSON.parse(localStorage.getItem('guideMeProjectData'))
                    if (localData) {
                      localStorage.setItem('guideMeProjectData', JSON.stringify([...localData, { 'name': data1.name, 'id': data1.id, 'client_name': data1.client_name, 'client_id': data1.client_id, start_date: data1.start_date, end_date: data1.end_date}]))
                    } else {
                      localStorage.setItem('guideMeProjectData', JSON.stringify([{ 'name': data1.name, 'id': data1.id, 'client_name': data1.client_name, 'client_id': data1.client_id, start_date: data1.start_date, end_date: data1.end_date}]))
                    }
                    setOpenSuccessDialog(true);
                }
                else if(data1.status === 409 ){
                    setShowDuplicateDialog(true)
                }
                else if(data1.status === 400 ){
                    console.log(data1.message)
                    localStorage.removeItem('to_be_add');
                }
                console.log(data1);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        }
        fetchData(); 
        setOpenAddForm(false)
        setOpenAddFormFromClients(false)
    }
    getListing()
  };


  const addNew = () => {
    setOpenAddForm(true);
    setEditItem({
      id: undefined
    });
  };
  const handleCancelEdit = () => {
    setOpenAddForm(false);
    setOpenAddFormFromClients(false);
  };

  const toggleDuplicateDialog = () => {
    setShowDuplicateDialog(!showDuplicateDialog);
  };

  const handleAddDuplicate = () => {
    const fetchData = async() => {
        try{
            const toBeAdded = localStorage.getItem('to_be_add');
            if (toBeAdded) {
                const parsedData = JSON.parse(toBeAdded)
                const data1 = await PostRequestHelper('addduplicateproject', parsedData, navigate)
                console.log(data1)
                if(data1.status === 201) {
                        localStorage.removeItem('to_be_add');
                        localStorage.setItem('selectedProject', JSON.stringify({ 'name': data1.name, 'id': data1.id, 'client_name': data1.client_name, 'client_id': data1.client_id, start_date: data1.start_date, end_date: data1.end_date}));
                    const localData = JSON.parse(localStorage.getItem('guideMeProjectData'))
                    if (localData) {
                      localStorage.setItem('guideMeProjectData', JSON.stringify([...localData, { 'name': data1.name, 'id': data1.id, 'client_name': data1.client_name, 'client_id': data1.client_id, start_date: data1.start_date, end_date: data1.end_date}]))
                    } else {
                      localStorage.setItem('guideMeProjectData', JSON.stringify([{ 'name': data1.name, 'id': data1.id, 'client_name': data1.client_name, 'client_id': data1.client_id, start_date: data1.start_date, end_date: data1.end_date}]))
                    }
                    setOpenSuccessDialog(true);
                }
                getListing();
            }
        }catch(e){
            localStorage.removeItem('to_be_add');
            console.error('Error adding duplicate data:', e);
        }
    }
    fetchData();
    toggleDuplicateDialog();
  }
  return <React.Fragment>
            <HeaderLayout>
            {/* Main content with header and grid */}
            <div className='mt-3 mb-3'>
                <h4>Projects</h4>
            </div>

            {showDuplicateDialog && (
                <Dialog title={"Please confirm"} onClose={toggleDuplicateDialog}>
                <p
                    style={{
                    margin: "25px",
                    textAlign: "center",
                    }}
                >
                    This project name already exists and is associated with the same client. Do you want to add this duplicate name?
                </p>
                <DialogActionsBar>
                    <Button type="button" onClick={() => {
                      toggleDuplicateDialog()
                      setOpenConflictDialog(true)
                    }}>
                    No
                    </Button>
                    <Button type="button" onClick={handleAddDuplicate}>
                    Yes
                    </Button>
                </DialogActionsBar>
                </Dialog>
            )}
            <Grid
               data={data}
            >
                <GridToolbar>
                    <Button title="Add new" type="button" themeColor={'primary'} onClick={addNew}>
                        Add new
                    </Button>
                </GridToolbar>
                <Column field="new_id" title="ID" />
                <Column field='name' title='Project Name' />
                <Column field='client_name' title='Client Name' />
                <Column field='start_date' title='Start Date' format="{0:d}" />
                <Column field='end_date' title='End Date' format="{0:d}" />
                <Column title='Actions' cell={props => <MyEditCommandCell {...props} addTask={handleAddTask}/>} />
            </Grid>
            <div className='d-flex justify-content-between align-items-center mt-3'>
                <Button themeColor={'primary'} onClick={() => {
                  setClientComponent(true)
                  setProjectComponent(false)
                }}> Previous</Button>
                <Button themeColor={'primary'} disabled={!data.length} onClick={() => {
                  setProjectComponent(false)
                  setTaskComponent(true)
                }}>Next</Button>
              </div>
            {openAddFormFromClients&& <AddFormFromClientGuideMe cancelEdit={handleCancelEdit} onSubmit={handleSubmit} item={editItem} />}
            {openAddForm && <AddFormProject cancelEdit={handleCancelEdit} onSubmit={handleSubmit} item={editItem} />}
            {openSuccessDialog && (
                <Dialog title={"Guide"} onClose={toggleSuccessDialog} width={350}>
                    <div>
                    You have successfully added the project. To add another project, click <strong>'Add Project'</strong>. If you'd like to add a task for the project you just added, click <strong>'Add Task'</strong>.
                    </div>
                    <DialogActionsBar>
                        <Button onClick={()=> {
                          localStorage.removeItem('selectedProject')
                          setOpenSuccessDialog(false)
                          addNew()
                        }}>Add Project</Button>
                        <Button onClick={() => {
                          setOpenSuccessDialog(false)
                          setProjectComponent(false)
                          setTaskComponent(true)
                        }}>Add Task</Button>
                    </DialogActionsBar>
                </Dialog>
            )}
                {openConflictDialog && (
                <Dialog title={"Message"} onClose={toggleConflictDialog} width={350}>
                    <div>
                    To add other project, click <strong>'Add Project'</strong>. If you'd like to add a project, click <strong>'Next'</strong>.
                    </div>
                    <DialogActionsBar>
                        <Button onClick={()=> {
                          setOpenConflictDialog(false)
                          addNew()
                        }}>Add Project</Button>
                        <Button onClick={() => {
                          setOpenConflictDialog(false)
                          setProjectComponent(false)
                          setTaskComponent(true)
                        }}>Next</Button>
                    </DialogActionsBar>
                </Dialog>
            )}
            <style>
                {`.k-animation-container {
                    z-index: 10003;
                }`}
            </style>
            </HeaderLayout>
        </React.Fragment>;
};
export default ProjectGuideMe;
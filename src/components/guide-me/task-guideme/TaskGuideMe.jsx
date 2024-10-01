import * as React from 'react';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import { Button } from "@progress/kendo-react-buttons";
import {PostRequestHelper} from '../../helper/PostRequestHelper'
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { useNavigate } from "react-router-dom";
import AddFormFromProjectGuideMe from './AddFormFromProjectGuideMe';
import AddFormTask from './AddFormTask';



const TaskGuideMe = ({ setProjectComponent, setTaskComponent, setUserComponent}) => {
    const [openAddForm, setOpenAddForm] = React.useState(false);
    const [editItem, setEditItem] = React.useState({
        id: 1
    });
    const [data, setData] = React.useState([]);
    const [showDuplicateDialog, setShowDuplicateDialog] = React.useState(false)
    const [openAddFormFromProjects, setopenAddFormFromProjects] = React.useState(false)
    const [openSuccessDialog, setOpenSuccessDialog] = React.useState(false)
    const [openConflictDialog, setOpenConflictDialog] = React.useState(false);
    const navigate = useNavigate()

    const getListing = () => {
      const localData = JSON.parse(localStorage.getItem('guideMeTaskData'));
      if (localData) {
        const updatedData = localData.map((task, index) =>{
          return {
            ...task,
            new_id: index+1,
            start_date: task.start_date ? new Date(task.start_date) : null,
            end_date: task.end_date ? new Date(task.end_date) : null,
          }
        })
        setData(updatedData);
      }
    }

  React.useEffect(() => {
    getListing(); // Call the function to fetch data
}, []);

  React.useEffect(() => {
    getListing();
  },[openSuccessDialog])

const toggleSuccessDialog = () => {
  setOpenSuccessDialog(false)
}

const toggleConflictDialog = () => {
  setOpenConflictDialog(false)
}

const addNewFromProjects = (localdata) => {
  setEditItem({
    id: undefined,
    project_id: localdata.id,
    project_name: localdata.name,
  });
}

  React.useEffect(() => {
    const localdata = JSON.parse(localStorage.getItem('selectedProject'))
    if(localdata){
      addNewFromProjects(localdata)
      setopenAddFormFromProjects(true)
      localStorage.removeItem('selectedProject')
    } else{
      setOpenAddForm(true)
      setEditItem({
        id: undefined
      });
    }
  },[])


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
        const fetchData = async() => {
            try {
                delete event.id
                let updatedEvent = {}
                if(event.project_id.project_id){
                   updatedEvent = {...event, project_id: event.project_id.project_id}
                }else if(event.project_id){
                    updatedEvent = {...event}
                }
                
                localStorage.setItem('to_be_add', JSON.stringify(updatedEvent));
                const data1 = await PostRequestHelper('addtask', updatedEvent, navigate);
                if(data1.status === 201){
                    localStorage.removeItem('to_be_add');
                    const localData = JSON.parse(localStorage.getItem('guideMeTaskData'))
                    if (localData) {
                      localStorage.setItem('guideMeTaskData', JSON.stringify([...localData, { 'name': data1.name, 'id': data1.id, 'client_name': data1.client_name, 'client_id': data1.client_id, start_date: data1.start_date, end_date: data1.end_date, project_id:data1.project_id, project_name: data1.project_name }]))
                    } else {
                      localStorage.setItem('guideMeTaskData', JSON.stringify([{ 'name': data1.name, 'id': data1.id, 'client_name': data1.client_name, 'client_id': data1.client_id, start_date: data1.start_date, end_date: data1.end_date, project_id:data1.project_id, project_name: data1.project_name }]))
                    }
                    setOpenSuccessDialog(true);
                    getListing(); 
                }
                else if(data1.status === 409 ){
                    setShowDuplicateDialog(true)
                }
                else if(data1.status === 400 ){
                    localStorage.removeItem('to_be_add');
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        }
        fetchData(); 
        setOpenAddForm(false)
        setopenAddFormFromProjects(false)
    }
  };
  const addNew = () => {
    setOpenAddForm(true);
    setEditItem({
      id: undefined
    }); 
  };
  const handleCancelEdit = () => {
    setOpenAddForm(false);
    setopenAddFormFromProjects(false); 
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
                const response = await PostRequestHelper('addduplicatetask', parsedData, navigate)
                if(response.status === 201 || response.status ===200) {
                        localStorage.removeItem('to_be_add');
                        const localData = JSON.parse(localStorage.getItem('guideMeTaskData'))
                    if (localData) {
                      localStorage.setItem('guideMeTaskData', JSON.stringify([...localData, { 'name': data1.name, 'id': data1.id, 'client_name': data1.client_name, 'client_id': data1.client_id, start_date: data1.start_date, end_date: data1.end_date, project_id:data1.project_id, project_name: data1.project_name }]))
                    } else {
                      localStorage.setItem('guideMeTaskData', JSON.stringify([{ 'name': data1.name, 'id': data1.id, 'client_name': data1.client_name, 'client_id': data1.client_id, start_date: data1.start_date, end_date: data1.end_date, project_id:data1.project_id, project_name: data1.project_name }]))
                    }
                    setOpenSuccessDialog(true);

                }
                getListing();
            }
        }catch(e){
            console.error('Error adding duplicate data:', e);
        }
    }
    fetchData();
    toggleDuplicateDialog();
    
  }
  return <React.Fragment>
            <div className='mt-3 mb-3'>
                <h4>Tasks</h4>
            </div>
            {showDuplicateDialog && (
                <Dialog title={"Please confirm"} onClose={toggleDuplicateDialog}>
                <p
                    style={{
                    margin: "25px",
                    textAlign: "center",
                    }}
                >
                    This task name already exists and is associated with the same project. Do you want to add this duplicate name?
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
                <Column field='name' title='Task Name' />
                <Column field='project_name' title='Project Name' />
                <Column field='client_name' title='Client Name' />
                <Column field='start_date' title='Start Date' format="{0:d}" />
                <Column field='end_date' title='End Date' format="{0:d}" />
            </Grid>
            <div className='d-flex justify-content-between align-items-center mt-3'>
                <Button themeColor={'primary'} onClick={() => {
                  setProjectComponent(true)
                  setTaskComponent(false)
                }}> Previous</Button>
                <Button themeColor={'primary'} disabled={!data.length} onClick={() => {
                  setTaskComponent(false)
                  setUserComponent(true)
                }}>Next</Button>
              </div>
            {openAddFormFromProjects && <AddFormFromProjectGuideMe cancelEdit={handleCancelEdit} onSubmit={handleSubmit} item={editItem} />}
            {openAddForm && <AddFormTask cancelEdit={handleCancelEdit} onSubmit={handleSubmit} item={editItem} />}
            {openSuccessDialog && (
                <Dialog title={"Guide"} onClose={toggleSuccessDialog} width={350}>
                    <div>
                    You have successfully added the task. To add another task, click <strong>'Add Task'</strong>. If you'd like to add a new user, click <strong>'Add User'</strong>.
                    </div>
                    <DialogActionsBar>
                        <Button onClick={()=> {
                          setOpenSuccessDialog(false)
                          addNew()
                        }}>Add Task</Button>
                        <Button onClick={() => {
                          setOpenSuccessDialog(false)
                          setTaskComponent(false)
                          setUserComponent(true)
                        }}>Add User</Button>
                    </DialogActionsBar>
                </Dialog>
            )}
                {openConflictDialog && (
                <Dialog title={"Message"} onClose={toggleConflictDialog} width={350}>
                    <div>
                    To add other task, click <strong>'Add Task'</strong>. If you'd like to add a new user, click <strong>'Next'</strong>.
                    </div>
                    <DialogActionsBar>
                        <Button onClick={()=> {
                          setOpenConflictDialog(false)
                          addNew()
                        }}>Add Task</Button>
                        <Button onClick={() => {
                          setOpenConflictDialog(false)
                          setTaskComponent(false)
                          setUserComponent(true)
                        }}>Next</Button>
                    </DialogActionsBar>
                </Dialog>
            )}
            <style>
                {`.k-animation-container {
                    z-index: 10003;
                }`}
            </style>
        </React.Fragment>;
};
export default TaskGuideMe;
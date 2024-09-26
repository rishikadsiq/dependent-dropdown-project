import * as React from 'react';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import { Button } from "@progress/kendo-react-buttons";
import { PostRequestHelper } from '../helper/PostRequestHelper';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import AddFormProject from './AddFormProject';
import { useNavigate } from "react-router-dom";
import AddFormProjectFromClient from './AddFormProjectFromClient';


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
  
const MyEditCommandCell = props => <EditCommandCell {...props} enterEdit={props.enterEdit} />;
const Projects = () => {
    const [openAddForm, setOpenAddForm] = React.useState(false);
    const [editItem, setEditItem] = React.useState({
        id: 1
    });
    const [data, setData] = React.useState([]);
    const [showDuplicateDialog, setShowDuplicateDialog] = React.useState(false)
    const [openAddFormFromClients, setOpenAddFormFromClients] = React.useState(false)
    const [openDialogConfirmNavigate, setOpenDialogConfirmNavigate] = React.useState(false)
    const[confirmNavigate, setConfirmNavigate] = React.useState(false)
    const navigate = useNavigate()


    const getListing = () => {
      const localData = JSON.parse(localStorage.getItem('guideProjectData'));
      if (localData) {
        const updatedData = localData.map((project, index) =>{
          return {
            ...project,
            new_id: index+1,
            start_date: item.start_date ? new Date(item.start_date) : null,
            end_date: item.end_date ? new Date(item.end_date) : null,
          }
        })
        setData(updatedData);
      }
    }

  React.useEffect(() => {
    setOpenAddForm(true)
    setEditItem({
      id: undefined
    });
    getListing(); // Call the function to fetch data
}, []);

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
},[])

    


    const handleAddTask = (dataItem) => {
      localStorage.setItem('selectedProject', JSON.stringify({'name': dataItem.name, 'id': dataItem.id}))
      setConfirmNavigate(true)
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
                if(event.client_id.id){
                   updatedEvent = {...event, client_id: event.client_id.id}
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
                    getListing()
                    setOpenAddForm(false);
                    setOpenAddSuccessDialog(true)
                }
                else if(data1.status === 409 ){
                    setShowDuplicateDialog(true)
                }
                else if(data1.status === 400 ){
                    localStorage.removeItem('to_be_add');
                }
                console.log(data1);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        }
        fetchData(); // Call the function to fetch data
        setOpenAddForm(false)
        setOpenAddFormFromClients(false)
    } 
    getListing()
  };

  React.useEffect(() => {
    console.log(confirmNavigate)
    if(confirmNavigate){
        navigate('/tasks');
    }
    else if(!confirmNavigate){
      localStorage.removeItem('selectedProject')
    }
    
  }, [confirmNavigate])

  const addNew = () => {
    setOpenAddForm(true);
    setEditItem({
      id: undefined
    }); // you need to change the logic for adding unique ID value;
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
                const response = await PostRequestHelper('addduplicateproject', parsedData, navigate)
                console.log(response)
                if(response.status === 201) {
                    setMessage(response.message)
                        setShowAlert(true)
                        setVariant("success")
                        localStorage.removeItem('to_be_add');
                        localStorage.setItem('selectedProject', JSON.stringify({'name': response.name, 'id': response.id}));
                        setOpenDialogConfirmNavigate(true);
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
                    <Button type="button" onClick={toggleDuplicateDialog}>
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
                <Column field='client_name' title='Client Name'/>
                <Column field='start_date' title='Start Date' format="{0:d}" />
                <Column field='end_date' title='End Date' format="{0:d}" />
                <Column field='is_active' title='Active' filter='boolean'/>
                <Column title='Actions' cell={props => <MyEditCommandCell {...props}  addTask={handleAddTask}/>} />
            </Grid>
            {openAddFormFromClients && <AddFormProjectFromClient cancelEdit={handleCancelEdit} onSubmit={handleSubmit} item={editItem} />}   
            {openAddForm && <AddFormProject cancelEdit={handleCancelEdit} onSubmit={handleSubmit} item={editItem} />}
            {openDialogConfirmNavigate && (
                <Dialog 
                  title={"Confirm Navigate"} 
                  onClose={() => {
                    localStorage.removeItem('selectedProject')
                    setOpenDialogConfirmNavigate(false)
                  }} 
                  width={350}
                >
                    <div>
                        Are you sure you want to add task for the project you recently added?
                    </div>
                    <DialogActionsBar>
                        <Button onClick={() => {
                            localStorage.removeItem('selectedProject')
                            setOpenDialogConfirmNavigate(false)
                          }}>No</Button>
                        <Button onClick={() => {
                          setOpenDialogConfirmNavigate(false)
                          setConfirmNavigate(true)
                        }}>Yes</Button>
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
export default Projects;
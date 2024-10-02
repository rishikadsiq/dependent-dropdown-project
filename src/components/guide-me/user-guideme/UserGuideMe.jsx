import * as React from 'react';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import { Button } from "@progress/kendo-react-buttons";
import {PostRequestHelper} from '../../helper/PostRequestHelper'
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { useNavigate } from "react-router-dom";
import AddFormUser from './AddFormUser'

const Users = ({setUserComponent, setTaskComponent, toggleWindow}) => {
    const [openAddForm, setOpenAddForm] = React.useState(false);
    const [editItem, setEditItem] = React.useState({
        id: 1
    });
    const [data, setData] = React.useState([]);
    const [openSuccessDialog, setOpenSuccessDialog] = React.useState(false)
    const [openConflictDialog, setOpenConflictDialog] = React.useState(false);
    const navigate = useNavigate()



    const getListing = () => {
      const localData = JSON.parse(localStorage.getItem('guideMeUserData'));
      if (localData) {
        const updatedData = localData.map((user, index) => ({
          ...user,
          new_id: index + 1,
        }))
        setData(updatedData);
      }
    }


  React.useEffect(() => {
    getListing(); // Call the function to fetch data
    addNew()
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
                const updatedEvent = {...event, approver_id: event.approver_id.id, supervisor_id: event.supervisor_id.id}
                
                const data1 = await PostRequestHelper('adduser', updatedEvent, navigate);
                if(data1.status === 201){
                  const localData = JSON.parse(localStorage.getItem('guideMeUserData'))
                  if (localData) {
                    localStorage.setItem('guideMeUserData', JSON.stringify([...localData, { 'name': data1.name, 'id': data1.id, email: data1.email, role: data1.role, supervisor_id: data1.supervisor_id, supervisor_name: data1.supervisor_name, approver_id: data1.approver_id, approver_name: data1.approver_name }]))
                  } else {
                    localStorage.setItem('guideMeUserData', JSON.stringify([{ 'name': data1.name, 'id': data1.id, email: data1.email, role: data1.role, supervisor_id: data1.supervisor_id, supervisor_name: data1.supervisor_name, approver_id: data1.approver_id, approver_name: data1.approver_name }]))
                  }
                  setOpenSuccessDialog(true);
                }
                else if(data1.status === 409){
                  setOpenConflictDialog(true)
                } else if(data1.status === 400){
                }
                getListing()
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        }
        fetchData();
    } 
    getListing()
    setOpenAddForm(false)
  };
  const addNew = () => {
    setOpenAddForm(true);
    setEditItem({
      id: undefined
    }); // you need to change the logic for adding unique ID value;
  };
  const handleCancelEdit = () => {
    setOpenAddForm(false);
  };
  return <React.Fragment>
            <div className='mt-3 mb-3'>
                <h4>Users</h4>
            </div>
            <Grid
               data={data}
            >
                <GridToolbar>
                    <Button title="Add new" type="button" themeColor={'primary'} onClick={addNew}>
                        Add new
                    </Button>
                </GridToolbar>
                <Column field="new_id" title="ID" />
                <Column field='name' title='User Name' />
                <Column field='email' title='Email' />
                <Column field='role' title='Role' />
                <Column field='supervisor_name' title='Supervisor Name' />
                <Column field='approver_name' title='Approver Name' />
            </Grid>
            <div className='d-flex justify-content-between align-items-center mt-3'>
                <Button themeColor={'primary'} onClick={() => {
                  setTaskComponent(true)
                  setUserComponent(false)
                }}> Previous</Button>
                <Button themeColor={'primary'} disabled={!data.length} onClick={() => {
                  setUserComponent(false)
                  navigate('/')
                }}>Close Guide</Button>
              </div>
            {openAddForm && <AddFormUser cancelEdit={handleCancelEdit} onSubmit={handleSubmit} item={editItem} />}
            
            {openSuccessDialog && (
                <Dialog title={"Guide"} onClose={toggleSuccessDialog} width={350}>
                    <div>
                    You have successfully added the user. To add another user, click <strong>'Add User'</strong>. If you'd like to close guide me, click <strong>'Close Guide'</strong>.
                    </div>
                    <DialogActionsBar>
                        <Button onClick={()=> {
                          setOpenSuccessDialog(false)
                          addNew()
                        }}>Add User</Button>
                        <Button onClick={() => {
                          setOpenSuccessDialog(false)
                          setUserComponent(false)
                          
                          toggleWindow()
                        }}>Close Guide</Button>
                    </DialogActionsBar>
                </Dialog>
            )}
                {openConflictDialog && (
                <Dialog title={"Message"} onClose={toggleConflictDialog} width={350}>
                    <div>
                    The user you added recently is already exist. To add other client, click <strong>'Add User'</strong>. If you'd like to close guide, click <strong>'Close Guide'</strong>.
                    </div>
                    <DialogActionsBar>
                        <Button onClick={()=> {
                          setOpenConflictDialog(false)
                          addNew()
                        }}>Add User</Button>
                        <Button onClick={() => {
                          setOpenConflictDialog(false)
                          setUserComponent(false)
                          toggleWindow()
                        }}>Close Guide</Button>
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
export default Users;
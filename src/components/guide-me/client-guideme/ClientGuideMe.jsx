import * as React from 'react';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import { Button } from "@progress/kendo-react-buttons";
import {PostRequestHelper} from '../../helper/PostRequestHelper'
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import AddClientGuideMe from './AddClientGuideMe';
import { useNavigate } from 'react-router-dom';

const EditCommandCell = props => {
    return (
      <td>
        <Button
          themeColor={'primary'}
          type="button"
          onClick={() =>props.addProject(props.dataItem)}
        >
          Add Project
        </Button>
      </td>
    );
  };
  
const MyEditCommandCell = props => <EditCommandCell {...props} />;
const ClientGuideMe = ({setClientComponent, setProjectComponent, clientComponent}) => {
    const [openAddForm, setOpenAddForm] = React.useState(false);
    const [editItem, setEditItem] = React.useState({
        id: 1
    });
    const [data, setData] = React.useState([]);
    const [openSuccessDialog, setOpenSuccessDialog] = React.useState(false)
    const [openConflictDialog, setOpenConflictDialog] = React.useState(false);
    const navigate = useNavigate()

    const getListing = async () => {
      const localData = JSON.parse(localStorage.getItem('guideMeClientData'));
      if (localData) {
        const updatedData = localData.map((client, index) =>{
          return {
            ...client,
            new_id: index+1
          }
        })
        setData(updatedData);
      }
    }

    React.useEffect(() => {
      getListing();
      addNew();
    }, [clientComponent])

  const toggleSuccessDialog = () => {
    setOpenSuccessDialog(false)
  }

  const toggleConflictDialog = () => {
    setOpenConflictDialog(false)
  }


    const handleAddProject = (dataItem) => {
      localStorage.setItem('selectedClient', JSON.stringify({'name': dataItem.name, 'id': dataItem.id}))
      setClientComponent(false)
      setProjectComponent(true)
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
    //   newData.push(event);
        const fetchData = async() => {
            try {
                delete event.id
                
                const data1 = await PostRequestHelper('addclient', event, navigate);
                if(data1.status === 201){
                  localStorage.setItem('selectedClient', JSON.stringify({ 'name': data1.name, 'id': data1.id, 'phone': data1.phone, 'email': data1.email, 'is_active': data1.is_active }));
                  const localData = JSON.parse(localStorage.getItem('guideMeClientData'))
                  if (localData) {
                    localStorage.setItem('guideMeClientData', JSON.stringify([...localData, { 'name': data1.name, 'id': data1.id, 'phone': data1.phone, 'email': data1.email, 'is_active': data1.is_active }]))
                  } else {
                    localStorage.setItem('guideMeClientData', JSON.stringify([{ 'name': data1.name, 'id': data1.id, 'phone': data1.phone, 'email': data1.email, 'is_active': data1.is_active }]))
                  }
                    setOpenSuccessDialog(true);
                }
                else if(data1.status === 409){
                    setOpenConflictDialog(true)
                } else if(data1.status === 400){
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        }
        fetchData(); // Call the function to fetch data
    }
    setOpenAddForm(false);
  };

  React.useEffect(() => {
    getListing();
  },[openSuccessDialog])


  const addNew = () => {
    setOpenAddForm(true);
    setEditItem({
      id: undefined
    });
  };

  const handleCancelEdit = () => {
    setOpenAddForm(false);
  };

  return <React.Fragment>
                <div className='mt-3 mb-3'>
                    <h4>Clients</h4>
                </div>
                <Grid
                  data={data}
                >
                    <GridToolbar>
                      {clientComponent && (
                        <Button title="Add new" type="button" themeColor={'primary'} onClick={addNew}>
                            Add new
                        </Button>
                      )}
                    </GridToolbar>
                    <Column field="new_id" title="ID" />
                    <Column field='name' title='Client Name' />
                    <Column field='email' title='Email' />
                    <Column field='phone' title='Phone' />
                    <Column title='Actions' cell={props => <MyEditCommandCell {...props} addProject={handleAddProject}/>} />
                </Grid>
                <div className='d-flex justify-content-between align-items-center mt-3'>
                <Button themeColor={'primary'} disabled> Previous</Button>
                <Button themeColor={'primary'} disabled={!data.length} onClick={() => {
                  setClientComponent(false)
                  setProjectComponent(true)
                }}>Next</Button>
              </div>
                {openAddForm && <AddClientGuideMe cancelEdit={handleCancelEdit} onSubmit={handleSubmit} item={editItem} />}
                {openSuccessDialog && (
                <Dialog title={"Guide"} onClose={toggleSuccessDialog} width={350}>
                    <div>
                    You have successfully added the client. To add another client, click <strong>'Add Client'</strong>. If you'd like to add a project for the client you just added, click <strong>'Add Project'</strong>.
                    </div>
                    <DialogActionsBar>
                        <Button onClick={()=> {
                          localStorage.removeItem('selectedClient')
                          setOpenSuccessDialog(false)
                          addNew()
                        }}>Add Client</Button>
                        <Button onClick={() => {
                          setOpenSuccessDialog(false)
                          setClientComponent(false)
                          setProjectComponent(true)
                        }}>Add Project</Button>
                    </DialogActionsBar>
                </Dialog>
            )}
                {openConflictDialog && (
                <Dialog title={"Message"} onClose={toggleConflictDialog} width={350}>
                    <div>
                    The client you added recently is already exist. To add other client, click <strong>'Add Client'</strong>. If you'd like to add a project, click <strong>'Next'</strong>.
                    </div>
                    <DialogActionsBar>
                        <Button onClick={()=> {
                          setOpenConflictDialog(false)
                          addNew()
                        }}>Add Client</Button>
                        <Button onClick={() => {
                          setOpenConflictDialog(false)
                          setClientComponent(false)
                          setProjectComponent(true)
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
export default ClientGuideMe;
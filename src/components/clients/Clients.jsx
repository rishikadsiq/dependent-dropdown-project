import * as React from 'react';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import { Button } from "@progress/kendo-react-buttons";
import {GetRequestHelper} from '../helper/GetRequestHelper'
import { PostRequestHelper } from '../helper/PostRequestHelper';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import EditForm from './editForm';
import AddClient from './AddClient';
import Alerts from '../dynamic-compoenents/Alerts';
import HeaderLayout from '../home/HeaderLayout';
import { useNavigate } from 'react-router-dom';
import { filterBy } from "@progress/kendo-data-query";

const EditCommandCell = props => {
    return (
      <td>
        <Button
          themeColor={'primary'}
          type="button"
          style={{ marginRight: '5px' }} // Adds space between buttons
          onClick={() => props.enterEdit(props.dataItem)}
        >
          Edit
        </Button>
        <Button
          themeColor={'primary'}
          type="button"
          style={{ marginRight: '5px' }}
          onClick={() => props.remove(props.dataItem)}
        >
          Delete
        </Button>
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
  
const MyEditCommandCell = props => <EditCommandCell {...props} enterEdit={props.enterEdit} />;
const Clients = () => {
  const initialFilter = {
    logic: "and", // or "or"
    filters: []
  };
  const initialDataState = {
    skip: 0,
    take: 10,
  };
    const [filter, setFilter] = React.useState(initialFilter);
    const [openAddForm, setOpenAddForm] = React.useState(false);
    const [openEditForm, setOpenEditForm] = React.useState(false);
    const [editItem, setEditItem] = React.useState({
        id: 1
    });
    const [data, setData] = React.useState([]);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState(null);
    const [showAlert, setShowAlert] = React.useState(false)
    const [message, setMessage] = React.useState("")
    const [variant, setVariant] = React.useState(null)
    const [openDialogConfirmNavigate, setOpenDialogConfirmNavigate] = React.useState(false)
    const[confirmNavigate, setConfirmNavigate] = React.useState(false)
    const [page, setPage] = React.useState(initialDataState);
    const [pageSizeValue, setPageSizeValue] = React.useState();
    const pageChange = (event) => {
      const targetEvent = event.targetEvent;
      const take =
        targetEvent.value === "All" ? data.length : event.page.take;
      if (targetEvent.value) {
        setPageSizeValue(targetEvent.value);
      }
      setPage({
        ...event.page,
        take,
      });
    };
    const navigate = useNavigate()

  const getListing = async() => {
    try {
        const data1 = await GetRequestHelper('clientlist', navigate);
        if (data1.status === 404) {
            setData([]);
        } else {
          const updatedData = data1.clients.map((client, index) => ({
            ...client,
            new_id: index+1 // Add or update 'new_id' column with serialized data
          }));
          setData(updatedData);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        setData([]); // Handle error case by setting an empty array or some default data
    }
};

  React.useEffect(() => {
    getListing(); // Call the function to fetch data
}, []);


  const enterEdit = item => {
    setOpenEditForm(true);
    setEditItem(item);
  };

 
  const onDeleteData = async () => {
    setOpenDialog(false);

    // You can make a request to the backend to delete the item here
    try {
        const response = await PostRequestHelper('deleteclient', { id: selectedItem.id }, navigate);
        if(response.status === 200){
            setMessage(response.message)
            setShowAlert(true)
            setVariant("success")
        }
        else if(response.status === 409 || response.status === 400 || response.status === 404){
            setMessage(response.message)
            setShowAlert(true)
            setVariant("danger")
        }
    } catch (err) {
        console.error('Error deleting data:', err);
    }
    setOpenDialog(false)
    getListing()
    };

    const toggleDialog = () => {
        setOpenDialog(false);
    };

    const remove = (dataItem) => {
        setSelectedItem(dataItem);
        setOpenDialog(true);
    };

    const handleAddProject = (dataItem) => {
      localStorage.setItem('selectedClient', JSON.stringify({'name': dataItem.name, 'id': dataItem.id}))
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
    //   newData.push(event);
        const fetchData = async() => {
            try {
                delete event.id
                
                const data1 = await PostRequestHelper('addclient', event, navigate);
                if(data1.status === 201){
                    setMessage(data1.message)
                    setShowAlert(true)
                    setVariant("success")
                    localStorage.setItem('selectedClient', JSON.stringify({'name': data1.name, 'id': data1.id}));
                    setOpenDialogConfirmNavigate(true);
                    // navigate('/projects')
                }
                else if(data1.status === 409 || data1.status === 400){
                    setMessage(data1.message)
                    setShowAlert(true)
                    setVariant("danger")
                }
                setOpenAddForm(false);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        }
        fetchData(); // Call the function to fetch data
    } else {
        const fetchData = async() => {
            try {
                const orignalData = data.find(item => item.id ===event.id);

                    // Function to find changed properties in the event object compared to orignalData
                    function getChangedData(original, updated) {
                      const changedData = {};  
                      Object.keys(updated).forEach(key => {
                        if (updated[key] !== original[key]) {
                          changedData[key] = updated[key];
                        }
                      });
                      return changedData;
                    }
                  
                    const changedData = getChangedData(orignalData, event);
                    changedData['id'] = event.id;
                const data1 = await PostRequestHelper('updateclient', changedData, navigate);
                if(data1.status === 200){
                    setMessage(data1.message)
                    setShowAlert(true)
                    setVariant("success")
                }
                else if(data1.status === 409 || data1.status===400 || data1.status === 404){
                    setMessage(data1.message)
                    setShowAlert(true)
                    setVariant("danger")
                }
                setOpenEditForm(false);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        }
        fetchData();
    }
    getListing()
    
  };


  React.useEffect(() => {
    if(confirmNavigate){
        navigate('/projects');
    }
    else if(!confirmNavigate){
      localStorage.removeItem('selectedClient')
    }  
  }, [confirmNavigate])


  const addNew = () => {
    setOpenAddForm(true);
    setEditItem({
      id: undefined
    }); // you need to change the logic for adding unique ID value;
  };
  const handleCancelEdit = () => {
    setOpenEditForm(false);
    setOpenAddForm(false);
};
  return <React.Fragment>
            <HeaderLayout>
            {showAlert && (
                <div className='container'>
                    <Alerts showAlert={showAlert} setShowAlert={setShowAlert} message={message} variant={variant} />
                </div>
            )}

            
            {/* Main content with header and grid */}
            <div className='mt-3 mb-3' style={{ paddingTop: showAlert ? '60px' : '0' }}>
                <h4>Clients</h4>
            </div>
            <Grid
               data={filterBy(data, filter).slice(page.skip, page.take + page.skip)}
               skip={page.skip}
               take={page.take}
               total={data.length}
               pageable={{
                 buttonCount: 4,
                 pageSizes: [5, 10, 15, "All"],
                 pageSizeValue: pageSizeValue,
               }}
               onPageChange={pageChange}
              navigatable={true}
              filterable={true}
              filter={filter}
              onFilterChange={(e) => setFilter(e.filter)}
            >
                <GridToolbar>
                    <Button title="Add new" type="button" themeColor={'primary'} onClick={addNew}>
                        Add new
                    </Button>
                </GridToolbar>
                <Column field="new_id" title="ID" />
                <Column field='name' title='Client Name' />
                <Column field='email' title='Email' />
                <Column field='phone' title='Phone' />
                <Column field='is_active' title='Active' filter='boolean'/>
                <Column title='Actions' cell={props => <MyEditCommandCell {...props} enterEdit={enterEdit} remove={remove} addProject={handleAddProject}/>} filterable={false}/>
            </Grid>
            {openAddForm && <AddClient cancelEdit={handleCancelEdit} onSubmit={handleSubmit} item={editItem} />}
            {openEditForm && <EditForm cancelEdit={handleCancelEdit} onSubmit={handleSubmit} item={editItem} />}
            {openDialog && (
                <Dialog title={"Delete Client"} onClose={toggleDialog} width={350}>
                    <div>
                        Are you sure you want to delete the client {selectedItem?.name} with ID {selectedItem?.id}?
                    </div>
                    <DialogActionsBar>
                        <Button onClick={onDeleteData}>Delete</Button>
                        <Button onClick={toggleDialog}>Cancel</Button>
                    </DialogActionsBar>
                </Dialog>
            )}
            {openDialogConfirmNavigate && (
                <Dialog 
                  title={"Confirm Navigate"} 
                  onClose={() => {
                    localStorage.removeItem('selectedClient')
                    setOpenDialogConfirmNavigate(false)
                  }} 
                  width={350}
                >
                    <div>
                        Are you sure you want to add project for the client you recently added?
                    </div>
                    <DialogActionsBar>
                        <Button onClick={() => {
                            localStorage.removeItem('selectedClient')
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
            </HeaderLayout>
        </React.Fragment>;
};
export default Clients;
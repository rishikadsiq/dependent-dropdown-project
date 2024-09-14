import * as React from 'react';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import { Button } from "@progress/kendo-react-buttons";
import {GetRequestHelper} from '../helper/GetRequestHelper'
import { PostRequestHelper } from '../helper/PostRequestHelper';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import EditForm from './editForm';
import AddClient from './AddClient';
import Alerts from '../alerts/Alerts';
import NavbarComponent from '../home/NavbarComponent';
import { useNavigate } from 'react-router-dom';

const EditCommandCell = props => {
  return <td>
            <Button themeColor={'primary'} type="button" onClick={() => props.enterEdit(props.dataItem)}>
                Edit
            </Button>
            <Button themeColor={'primary'} type="button" onClick={() => props.remove(props.dataItem)}>
                Delete
            </Button>
        </td>;
};
const MyEditCommandCell = props => <EditCommandCell {...props} enterEdit={props.enterEdit} />;
const Clients = () => {
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
    const navigate = useNavigate()

  const getListing = async() => {
    try {
        const data1 = await GetRequestHelper('clientlist', navigate);
        console.log(data1);
        if (data1.status === 404) {
            setData([]);
        } else {
            setData(data1.clients);
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
        console.log(response);
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
    //   newData.push(event);
        const fetchData = async() => {
            try {
                delete event.id
                console.log(event);
                
                const data1 = await PostRequestHelper('addclient', event, navigate);
                if(data1.status === 201){
                    setMessage(data1.message)
                    setShowAlert(true)
                    setVariant("success")
                }
                else if(data1.status === 409 || data1.status === 400){
                    setMessage(data1.message)
                    setShowAlert(true)
                    setVariant("danger")
                }

                console.log(data1);
                setOpenAddForm(false);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        }
        fetchData(); // Call the function to fetch data
    } else {
        const fetchData = async() => {
            try {
                console.log(event);
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
                console.log(changedData) 
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
                console.log(data1);
                setOpenEditForm(false);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        }
        fetchData();
    }
    getListing()
    
  };
  const addNew = () => {
    setOpenAddForm(true);
    setEditItem({
      id: 99
    }); // you need to change the logic for adding unique ID value;
  };
  const handleCancelEdit = () => {
    setOpenEditForm(false);
    setOpenAddForm(false);
};
  return <React.Fragment>
    <NavbarComponent />
            {showAlert && (
                <div style={{
                    position: 'fixed',
                    top: "45px",
                    left: 0,
                    right: 0,
                    zIndex: 10003,
                    padding: '1rem',
                }} className='container'>
                <Alerts showAlert={showAlert} setShowAlert={setShowAlert} message={message} variant={variant} />
                </div>
            )}
            
            {/* Main content with header and grid */}
            <div className='mt-3 mb-3' style={{ paddingTop: showAlert ? '60px' : '0' }}>
                <h4>Clients</h4>
            </div>
            <Grid data={data}>
                <GridToolbar>
                    <Button title="Add new" type="button" themeColor={'primary'} onClick={addNew}>
                        Add new
                    </Button>
                </GridToolbar>
                <Column field="id" title="ID" />
                <Column field='name' title='Client Name' />
                <Column field='email' title='Email' />
                <Column field='phone' title='Contact' />
                <Column field='is_active' title='Active' />
                <Column title='Actions' cell={props => <MyEditCommandCell {...props} enterEdit={enterEdit} remove={remove}/>} />
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

            <style>
                {`.k-animation-container {
                    z-index: 10003;
                }`}
            </style>
        </React.Fragment>;
};
export default Clients;
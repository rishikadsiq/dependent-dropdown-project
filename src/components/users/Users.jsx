import * as React from 'react';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import { Button } from "@progress/kendo-react-buttons";
import {GetRequestHelper} from '../helper/GetRequestHelper'
import { PostRequestHelper } from '../helper/PostRequestHelper';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import AddForm from './AddForm';
import EditForm from './editForm';
import Alerts from '../dynamic-compoenents/Alerts';
import HeaderLayout from '../home/HeaderLayout';
import { useNavigate } from "react-router-dom";
import { filterBy } from "@progress/kendo-data-query";


const EditCommandCell = props => {
    return (
      <td>
        <Button
          themeColor={'primary'}
          type="button"
          style={{ marginRight: '10px' }} // Adds space between buttons
          onClick={() => props.enterEdit(props.dataItem)}
        >
          Edit
        </Button>
        <Button
          themeColor={'primary'}
          type="button"
          onClick={() => props.remove(props.dataItem)}
        >
          Delete
        </Button>
      </td>
    );
  };
  
const MyEditCommandCell = props => <EditCommandCell {...props} enterEdit={props.enterEdit} />;
const Users = () => {
  const initialFilter = {
    logic: "and", // or "or"
    filters: []
  };
  const initialDataState = {
    skip: 0,
    take: 10,
  };
    const [filter, setFilter] = React.useState(initialFilter);
    const [openEditForm, setOpenEditForm] = React.useState(false);
    const [openAddForm, setOpenAddForm] = React.useState(false);
    const [editItem, setEditItem] = React.useState({
        id: 1
    });
    const [data, setData] = React.useState([]);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState(null);
    const [showAlert, setShowAlert] = React.useState(false)
    const [message, setMessage] = React.useState("")
    const [variant, setVariant] = React.useState(null)
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
        const data1 = await GetRequestHelper('userlist', navigate);
        console.log(data1);
        if (data1.status === 404) {
            setData([]);
        } else {
            console.log(data1)
            const updatedData = data1.users.map((item, index) => ({
                ...item, // Spread the other properties
                new_id: index+1
            }));
            console.log(updatedData);
            
            setData(updatedData || []);
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
    // You can make a request to the backend to delete the item here
    try {
        const response = await PostRequestHelper('deleteuser', { id: selectedItem.id }, navigate);
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
        const fetchData = async() => {
            try {
                delete event.id
                console.log(event);
                const updatedEvent = {...event, approver_id: event.approver_id.id, supervisor_id: event.supervisor_id.id}
                console.log(updatedEvent)
                
                const data1 = await PostRequestHelper('adduser', updatedEvent, navigate);
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
                getListing()
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        }
        fetchData(); 
        setOpenAddForm(false)
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
                const data1 = await PostRequestHelper('updateuser', changedData, navigate);
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
                getListing()
                setOpenEditForm(false);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        }
        fetchData();
    }
   
  };
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
                <h4>Users</h4>
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
                <Column field='name' title='User Name' />
                <Column field='email' title='Email' />
                <Column field='role' title='Role' />
                <Column field='supervisor_name' title='Supervisor Name' />
                <Column field='approver_name' title='Approver Name' />
                <Column field='is_active' title='Active' filter='boolean'/>
                <Column title='Actions' cell={props => <MyEditCommandCell {...props} enterEdit={enterEdit} remove={remove}/>} filterable={false}/>
            </Grid>
            {openEditForm && <EditForm cancelEdit={handleCancelEdit} onSubmit={handleSubmit} item={editItem} />}
            {openAddForm && <AddForm cancelEdit={handleCancelEdit} onSubmit={handleSubmit} item={editItem} />}
            {openDialog && (
                <Dialog title={"Delete User"} onClose={toggleDialog} width={350}>
                    <div>
                        Are you sure you want to delete the user {selectedItem?.name} with ID {selectedItem?.id}?
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
            </HeaderLayout>
        </React.Fragment>;
};
export default Users;
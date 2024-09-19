import * as React from 'react';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import { Button } from "@progress/kendo-react-buttons";
import {GetRequestHelper} from '../helper/GetRequestHelper'
import { PostRequestHelper } from '../helper/PostRequestHelper';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import AddForm from './AddForm';
import Alerts from '../alerts/Alerts';
import HeaderLayout from '../home/HeaderLayout';
import { useNavigate } from 'react-router-dom';



const EditCommandCell = props => {
  const { approval } = props.dataItem;

  return (
    <td>
      {['DRAFT', 'REJECTED'].includes(approval) && (
        <Button
          themeColor={'primary'}
          type="button"
          style={{ marginRight: '10px' }} // Add spacing between buttons
          onClick={() => props.enterEdit(props.dataItem)}
        >
          Edit
        </Button>
      )}

      {approval === 'DRAFT' && (
        <Button
          themeColor={'primary'}
          type="button"
          onClick={() => props.remove(props.dataItem)}
        >
          Delete
        </Button>
      )}

      {approval === 'APPROVED' && (
        <>
          <Button
            themeColor={'primary'}
            type="button"
            style={{ marginRight: '10px' }} // Add spacing between buttons
            onClick={() => props.enterEdit(props.dataItem)}
          >
            Show
          </Button>
          <Button
            themeColor={'primary'}
            type="button"
            onClick={() => props.recall(props.dataItem)}
          >
            Recall
          </Button>
        </>
      )}

      {approval === 'PENDING' && (
        <Button
          themeColor={'primary'}
          type="button"
          onClick={() => props.enterEdit(props.dataItem)}
        >
          Show
        </Button>
      )}

      {approval === 'RECALLED' && (
        <Button
          themeColor={'primary'}
          type="button"
          onClick={() => props.enterEdit(props.dataItem)}
        >
          Show
        </Button>
      )}
    </td>
  );
};



const MyEditCommandCell = props => <EditCommandCell {...props} enterEdit={props.enterEdit} />;
const Timesheets = () => {
    const [openAddForm, setOpenAddForm] = React.useState(false);
    const [data, setData] = React.useState([]);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState(null);
    const [showAlert, setShowAlert] = React.useState(false)
    const [message, setMessage] = React.useState("")
    const [variant, setVariant] = React.useState(null)
    const [editItem, setEditItem] = React.useState({
        id: 1
    });
    const navigate = useNavigate();


  const getListing = async() => {
    try {
        const data1 = await GetRequestHelper('timesheetlist', navigate);
        console.log(data1);
        if (data1.status === 404) {
            setData([]);
        } else {
            console.log(data1)
            const updatedData = data1.timesheets.map((item, index) => ({
                ...item, // Spread the other properties
                new_id: index+1,
                start_date: item.start_date ? new Date(item.start_date) : null,
                end_date: item.end_date ? new Date(item.end_date) : null,
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
        navigate(`/timesheet/${item.id}`)
    }

    const recall =async(item) => {
      // You can make a request to the backend to recall the item here
      try {
        const response = await PostRequestHelper('recallrequest', { timesheet_id: item.id }, navigate);
        if(response.status === 201){
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
        console.error('Error recalling data:', err);
      }
      finally{
        getListing()
      }
    }

    
  const onDeleteData = async () => {
    // You can make a request to the backend to delete the item here
    try {
        const response = await PostRequestHelper('deletetimesheet', { id: selectedItem.id }, navigate);
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
      const formatDate = (date) => {
        const d = new Date(date);
        const month = ('0' + (d.getMonth() + 1)).slice(-2);
        const day = ('0' + d.getDate()).slice(-2);
        const year = d.getFullYear();
        return `${year}-${month}-${day}`;
    };
    if (newItem) {
        console.log(event)
        const fetchData = async() => {
            try {
                delete event.id
                console.log(event);
                const formattedDate = formatDate(event.date);
                console.log(formattedDate); // Now it should show the correct date

                const data1 = await PostRequestHelper('addtimesheet', { date: formattedDate }, navigate);
                console.log(data1);
                console.log(data1);
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
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        }
        fetchData(); // Call the function to fetch data
        setOpenAddForm(false)
    } 
    getListing()
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
            <HeaderLayout>
            {showAlert && (
                <div className='container'>
                <Alerts showAlert={showAlert} setShowAlert={setShowAlert} message={message} variant={variant} />
                </div>
            )}
            
            {/* Main content with header and grid */}
            <div className='mt-3 mb-3' style={{ paddingTop: showAlert ? '60px' : '0' }}>
                <h4>Timesheets</h4>
            </div>
            <Grid data={data}>
                <GridToolbar>
                    <Button title="Add new" type="button" themeColor={'primary'} onClick={addNew}>
                        Add new
                    </Button>
                </GridToolbar>
                <Column field="new_id" title="ID" />
                <Column field='name' title='Timesheet Name' />
                <Column field='start_date' title='Start Date' format="{0:d}"/>
                <Column field='end_date' title='End Date' format="{0:d}"/>
                <Column field='approval' title='Status' />
                <Column title='Actions' cell={props => <MyEditCommandCell {...props}  remove={remove} enterEdit={enterEdit} recall={recall}/>} />
            </Grid>
            
            {openAddForm && <AddForm cancelEdit={handleCancelEdit} onSubmit={handleSubmit} item={editItem} />}
            {openDialog && (
                <Dialog title={"Delete Timesheet"} onClose={toggleDialog} width={350}>
                    <div>
                        Are you sure you want to delete the timesheet {selectedItem?.name} with ID {selectedItem?.id}?
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
export default Timesheets;
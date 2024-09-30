import * as React from 'react';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import {GetRequestHelper} from  '../helper/GetRequestHelper'
import {PostRequestHelper} from  '../helper/PostRequestHelper'
import { useNavigate } from 'react-router-dom';
import HeaderLayout from '../home/HeaderLayout'
import { useParams } from 'react-router-dom';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import Alerts from '../dynamic-compoenents/Alerts';
import CardComponent from './CardComponent';
import { NumericTextBox } from '@progress/kendo-react-inputs';
import {v4 as uuidv4} from 'uuid';



const CustomCell = ({ tdProps, children, color }) => {
    return tdProps ? (
        <td {...tdProps} style={{ ...tdProps.style, backgroundColor: color }}>
            {children}
        </td>
    ) : null;
};

const CustomCellNumeric = ({ tdProps, dataItem, field, onChange, color }) => {
    const handleChange = (event) => {
        const value = event.value;
        // Only update if the value is between 0 and 24
        if (value >= 0 && value <= 24) {
            onChange({ ...event, dataItem, field });
        }
    };

    return tdProps ? (
        <td {...tdProps} style={{ ...tdProps.style, backgroundColor: color }}>
            <NumericTextBox
                value={dataItem[field]}
                onChange={handleChange}
                min={0}
                max={24}
            />
            {/* Remove the children if you don't want extra inputs */}
        </td>
    ) : null;
};

const MyInputCustomCell = (props) => <CustomCell {...props} color="red" />;
const MyNumericCustomCell = (props) => <CustomCellNumeric {...props} color="lightgreen" />;
const MyBooleanCustomCell = (props) => <CustomCell {...props} color="pink" />;


const TaskHour = () => {
  const [data, setData] = React.useState([]);
  const [originalData, setOriginalData] = React.useState([]);
  const [timesheetData, setTimesheetData] = React.useState([]);
  const [clientData, setClientData] = React.useState([]);
  const [projectData, setProjectData] = React.useState([]);
  const [taskData, setTaskData] = React.useState([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [showAlert, setShowAlert] = React.useState(false)
  const [message, setMessage] = React.useState("")
  const [variant, setVariant] = React.useState(null)
  const [showCard, setShowCard] = React.useState(false)
  const [sums, setSums] = React.useState({});
  const [disabled, setDisabled] = React.useState(true)

  const { timesheetId } = useParams();
  const navigate = useNavigate();

  const fetchMetaData = async () => {
    const response = await GetRequestHelper('metadata', navigate);
    return response.message;
  };



  React.useEffect(() => {
    const getMetadata = async () => {
      const metadata = await fetchMetaData();
      const dataClients = metadata.clients
      const dataProjects = metadata.projects
      const dataTasks = metadata.tasks

      setClientData(dataClients);
      setProjectData(dataProjects);
      setTaskData(dataTasks);
    };

    getMetadata();
  }, []);

  React.useEffect(() => {
    if(!clientData.length && !projectData.length && !taskData.length){
      setShowCard(true)
    }
  },[clientData, projectData, taskData])
  React.useEffect(() => {
    if(clientData.length && projectData.length && taskData.length){
      setShowCard(false)
    }
  },[clientData, projectData, taskData])

  const getListing = async () => {
    try {
      const data1 = await PostRequestHelper('taskhourslist', { timesheet_id: timesheetId }, navigate);
      const updatedData = data1.taskhours.map((item, index) => ({
        ...item,
        new_id: index + 1,
      }));
      setData(updatedData || []);
      setOriginalData(updatedData || []);
      setTimesheetData([data1.timesheet_details])
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
    }
  };

  React.useEffect(() => {
    const initialSums = { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 };

    const newSums = data.reduce((acc, item) => {
      acc.mon += item.mon || 0;
      acc.tue += item.tue || 0;
      acc.wed += item.wed || 0;
      acc.thu += item.thu || 0;
      acc.fri += item.fri || 0;
      acc.sat += item.sat || 0;
      acc.sun += item.sun || 0;
      return acc;
    }, initialSums);

    setSums(newSums);
  },[data])

  React.useEffect(() => {
    const handleApprovalButton = Object.values(sums).every(day => day >= 8);
    setDisabled(!handleApprovalButton);
  }, [data]);

  React.useEffect(() => {
    getListing();
  }, []);

  const enterInsert = () => {
    let myuuid = uuidv4();
    console.log(myuuid)
    const dataItem = {
      id: myuuid,
      new_id: undefined,
      client_name: '',
      project_name: '',
      task_name: '',
      mon: 0,
      tue: 0,
      wed: 0,
      thu: 0,
      fri: 0,
      sat: 0,
      sun: 0,
      inEdit: true,
    };
    setData([dataItem, ...data]);
  };

  
const allInEdit = () => {
  setData(data.map(item => ({...item, inEdit: true })));
};

const DropDownCell = props => {
  const localizedData = clientData;
  const { dataItem } = props;

  const handleChange = e => {
      if (props.onChange) {
          const client = e.target.value; // Get the selected client object
          console.log(props.dataItem)
          props.onChange({
              dataItem: {
                  ...props.dataItem,
                  project_id: "", // Reset project_id
                  task_id: "",    // Reset task_id
              },
              field: 'client_id', // Set client_id instead of client_name
              syntheticEvent: e.syntheticEvent,
              value: client.id, // Set client ID
          });
          console.log(props.dataItem)
      }
  };

  const field = 'client_id'; // Use client_id field
  const dataValue = dataItem[field] === null ? '' : dataItem[field];

  return (
      <td>
          {dataItem.inEdit ? (
              <DropDownList
                  style={{ width: '100px' }}
                  onChange={handleChange}
                  value={localizedData.find(c => c.id === dataValue)}
                  data={localizedData}
                  textField="name"
              />
          ) : (
              localizedData.find(c => c.id === dataValue)?.name || '' // Render the client name or empty string
          )}
      </td>
  );
};

const ProjectDropDownCell = props => {
  const localizedData = projectData;
  const handleChange = e => {
      if (props.onChange) {
          const project = e.target.value; // Get the selected project object
          props.onChange({
              dataItem: {
                  ...props.dataItem,
                  client_id: project.client_id,
                  task_id: "", // Reset task_id when project changes
              },
              field: 'project_id', // Set project_id instead of project_name
              syntheticEvent: e.syntheticEvent,
              value: project.id, // Set project ID
          });
      }
  };

  const { dataItem } = props;
  const filteredProject = dataItem.client_id ? localizedData.filter(project => project.client_id === dataItem.client_id) : localizedData;

  const field = 'project_id'; // Use project_id field
  const dataValue = dataItem[field] === null ? '' : dataItem[field];

  return (
      <td>
          {dataItem.inEdit ? (
              <DropDownList
                  style={{ width: '100px' }}
                  onChange={handleChange}
                  value={localizedData.find(p => p.id === dataValue)}
                  data={filteredProject}
                  textField="name"
              />
          ) : (
              localizedData.find(p => p.id === dataValue)?.name || '' // Render the project name or empty string
          )}
      </td>
  );
};

const TaskDropDownCell = props => {
  const localizedData = taskData;
  const handleChange = e => {
      if (props.onChange) {
          const task = e.target.value; // Get the selected task object
          console.log(task)
          props.onChange({
              dataItem: {
                  ...props.dataItem,
                  task_id: task.id,
                  project_id: task.project_id, // Reset project_id
                  client_id: task.client_id,    // Reset task_id
              },
              field: 'task_id', // Set task_id instead of task_name
              syntheticEvent: e.syntheticEvent,
              value: task.id, // Set task ID
          });
          console.log(props.dataItem)
      }
  };

  const { dataItem } = props;
  const filteredTask = dataItem.project_id ? localizedData.filter(task => task.project_id === dataItem.project_id) : dataItem.client_id ? localizedData.filter(task => task.client_id === dataItem.client_id) : localizedData;
  const field = 'task_id'; // Use task_id field
  const dataValue = dataItem[field] === null ? '' : dataItem[field];

  return (
      <td>
          {dataItem.inEdit ? (
              <DropDownList
                  style={{ width: '100px' }}
                  onChange={handleChange}
                  value={localizedData.find(t => t.id === dataValue)}
                  data={filteredTask}
                  textField="name"
              />
          ) : (
              localizedData.find(t => t.id === dataValue)?.name || '' // Render the task name or empty string
          )}
      </td>
  );
};


  const save = async dataItem => {
    if (!dataItem.new_id) {
      let updatedDataItem = [{
        values: [dataItem.mon, dataItem.tue, dataItem.wed, dataItem.thu, dataItem.fri, dataItem.sat, dataItem.sun],
        task_id: dataItem.task_name,
        timesheet_id: timesheetId
      }];
      delete updatedDataItem.inEdit;
      console.log(updatedDataItem)
      
      const fetchData = async() => {
        try {
            const data1 = await PostRequestHelper('addtaskhours', updatedDataItem, navigate);
            console.log(data1);
            if(data1.status === 201){
                setMessage(data1.message)
                setShowAlert(true)
                setVariant("success")
            }else if(data1.status === 400 || data1.status ===409){
                setMessage(data1.message)
                setShowAlert(true)
                setVariant("danger")
            }
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    }
    fetchData(); 
    }
    else{
      const updatedDataItem = {
        ...dataItem,
        task_id: task,
        timesheet_id: timesheetId,
        id: dataItem.id
      };
      
      // Find the original data item by matching the `id`
      const originalData = data.find(item => item.id === updatedDataItem.id);
      
      // Function to find changed properties in the event object compared to originalData
      function getChangedData(original, updated) {
        const changedData = {};
        Object.keys(updated).forEach(key => {
          if (updated[key] !== original[key]) {
            changedData[key] = updated[key];
          }
        });
        return changedData;
      }
      
      // Get the changed data and ensure the `id` is included
      const changedData = getChangedData(originalData, updatedDataItem);
      changedData['id'] = updatedDataItem.id;
      changedData['values'] = [dataItem.mon, dataItem.tue, dataItem.wed, dataItem.thu, dataItem.fri, dataItem.sat, dataItem.sun]
      
      console.log(changedData);
      
      const fetchData = async() => {
        try {
          console.log(updatedDataItem)
            const data1 = await PostRequestHelper('updatetaskhours', changedData, navigate);
            console.log(data1);
            if(data1.status === 200){
                setMessage(data1.message)
                setShowAlert(true)
                setVariant("success")
                setSelectedItem(null)
            }else if(data1.status === 400 || data1.status ===409){
                setMessage(data1.message)
                setShowAlert(true)
                setVariant("danger")
                setSelectedItem(null)
            }
        } catch (e) {
          console.error('Error fetching data:', e);
          setSelectedItem(null)
        }
      }
      fetchData();
    }

    getListing();
  };

  const cancel = dataItem => {
    if (!dataItem.id) {
      setData(data.filter(item => item.id !== undefined));
    } else {
      setData(data.map(item => (item.id === dataItem.id ? { ...dataItem, inEdit: false } : item)));
    }
  };

  const onDeleteData = async () => {
    // You can make a request to the backend to delete the item here
    try {
        const response = await PostRequestHelper('deletetaskhours', { id: selectedItem.id }, navigate);
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

    const itemChange = e => {
      let newData = data.map(item => {
          if (item.id === e.dataItem.id) {
              item[e.field || ''] = e.value;
              // Reset project_id and task_id when client_id changes
              if (e.field === 'client_id') {
                  item.project_id = '';
                  item.task_id = '';
              } else if (e.field === 'task_id') {
                  item.client_id = e.dataItem.client_id;
                  item.project_id = e.dataItem.project_id;
              } else if(e.field === 'project_id') {
                  item.client_id = e.dataItem.client_id;
                  item.task_id = '';
              }
          }
          return item;
      });
      setData(newData);
  };
  


  const MyCommandCell = props => (
    <td>
      {!props.dataItem.inEdit && (
        <>
          <Button themeColor={'primary'} onClick={() => remove(props.dataItem)}>
            Remove
          </Button>
        </>
      )}
    </td>
  );
  
  const handleSaveData = () => {
    console.log('Saved data:', data)
    const updatedData = data.map(dataItem => {
      return ({
          new_id: dataItem.new_id,
          id: dataItem.id,
          values: [dataItem.mon, dataItem.tue, dataItem.wed, dataItem.thu, dataItem.fri, dataItem.sat, dataItem.sun],
          task_id: dataItem.task_id,
          timesheet_id: timesheetId
      })
  })
    console.log(updatedData)
    const countUniqueTaskIds = (data) => {
      const uniqueTaskIds = new Set();
  
      data.forEach(item => {
          uniqueTaskIds.add(item.task_id);
      });
  
      return uniqueTaskIds.size; // Returns the count of unique task_ids
  };

  if(countUniqueTaskIds(updatedData) !== updatedData.length){
    setMessage('You are adding duplicate tasks')
    setVariant('danger')
    setShowAlert(true)
    console.log('Your are adding duplicate task')
    return;
  }
    const newRows = updatedData.filter(dataItem => !dataItem.new_id); // New rows where new_id is undefined
    const dropiddata = newRows.map(row => {
      return ({
        values: row.values,
        task_id: row.task_id,
        timesheet_id: timesheetId
      })
    })

    const updatedRows = updatedData.filter(dataItem => dataItem.new_id);
    console.log(updatedRows)

    const matchingTaskIds = newRows.filter(newRow => 
      updatedRows.some(updatedRow => updatedRow.task_id === newRow.task_id)
  );
  console.log(matchingTaskIds);

  if(matchingTaskIds.length > 0){
    console.log('Your are adding duplicate task')
    return;
  }
  // filtering changed values:
  const taskhoursData = [...dropiddata, ...updatedRows];
  

    
    const fetchData = async() => {
        try {
            const data1 = await PostRequestHelper('savetaskhours',taskhoursData, navigate);
            console.log(data1);
            if(data1.status === 200){
                setShowAlert(true);
                setMessage(data1.message);
                setVariant("success")
                console.log(data1)
            }else if(data1.status === 400 || data1.status ===409){
                console.log(data1)
            }
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    }
    fetchData();
    getListing();
  }
  

  const handleApprovalSubmit = async(dataItem) => {
    try {
        const response = await PostRequestHelper('approvalrequest', { timesheet_id: timesheetId }, navigate);
        if(response.status === 201){
            setMessage(response.message)
            setShowAlert(true)
            setVariant("success")
            navigate('/timesheets')
        }
        else if(response.status === 409 || response.status === 400 || response.status === 404){
            setMessage(response.message)
            setShowAlert(true)
            setVariant("danger")
        }
        console.log(response);
    } catch (err) {
        console.error('Error approving timesheet:', err);
    }
    finally{
      getListing();
    }
  }
  return (
    <div>
          <HeaderLayout>
          {showAlert && (
                <div className='container'>
                <Alerts showAlert={showAlert} setShowAlert={setShowAlert} message={message} variant={variant} />
                </div>
            )}
            {showCard && (
              <div>
                <CardComponent />
              </div>
            )}
            
            {/* Main content with header and grid */}
            <div className='mt-3 mb-3' style={{ paddingTop: showAlert ? '60px' : '0' }}>
                <h4>Timesheet Data</h4>
            </div>
            <div className='mb-3'>
            <Grid data={timesheetData}>
                <Column field="timesheet_id" title="ID" />
                <Column field='timesheet_name' title='Timesheet Name' />
                <Column field='start_date' title='Start Date' format="{0:d}"/>
                <Column field='end_date' title='End Date' format="{0:d}"/>
                <Column field='approval' title='Status' />
            </Grid>
            </div>
      <Grid
        data={data}
        onItemChange={itemChange}
        editField="inEdit"
        cells={{
          edit: {
            text: MyInputCustomCell,
            numeric: MyNumericCustomCell,
            boolean: MyBooleanCustomCell
          }
        }}
      >
        {((timesheetData[0]?.approval === 'DRAFT' || timesheetData[0]?.approval === 'REJECTED') && !showCard) && (
          <GridToolbar>
            <Button title="Add new" type="button" onClick={enterInsert}>
                    Add new
                </Button>
                {data.length > 0 && (
                    <Button title="Edit" type="button" onClick={allInEdit}>
                        Edit
                    </Button>
                )}

                <Button title="Save" type="button" onClick={handleSaveData}>
                Save
                </Button>
          </GridToolbar>
        )}
          
      
          <Column field="new_id" title="Id" editable={false} width={"50px"}/>
            <Column field="client_name" title="Client Name" editor='text' cell={DropDownCell}/>
            <Column field="project_name" title="Project Name" editor='text' cell={ProjectDropDownCell}/>
            <Column field="task_name" title="Task Name" editor='text' cell={TaskDropDownCell}/>
            <Column field="mon" title="Mon" editor="numeric" format="{0:n}" />
            <Column field="tue" title="Tue" editor="numeric" format="{0:n}" />
            <Column field="wed" title="Wed" editor="numeric" format="{0:n}" />
            <Column field="thu" title="Thu" editor="numeric" format="{0:n}" />
            <Column field="fri" title="Fri" editor="numeric" format="{0:n}" />
            <Column field="sat" title="Sat" editor="numeric" format="{0:n}" />
            <Column field="sun" title="Sun" editor="numeric" format="{0:n}" />
        {((timesheetData[0]?.approval === 'DRAFT' || timesheetData[0]?.approval === 'REJECTED') && !showCard) && (
          <Column cell={MyCommandCell} title="Actions" filterable={false}/>
        )}
        
          
      </Grid>
      {openDialog && (
                <Dialog title={"Delete Taskhours"} onClose={toggleDialog} width={350}>
                    <div>
                        Are you sure you want to delete the taskhours {selectedItem?.name} with ID {selectedItem?.id}?
                    </div>
                    <DialogActionsBar>
                        <Button onClick={onDeleteData}>Delete</Button>
                        <Button onClick={toggleDialog}>Cancel</Button>
                    </DialogActionsBar>
                </Dialog>
            )}
      {((timesheetData[0]?.approval === 'DRAFT' || timesheetData[0]?.approval === 'REJECTED') && !showCard) && (
          <div className='mt-3'>
            <div className='mb-3'>
            
                   <div className="d-flex justify-content-between align-items-center mt-3">
                    <Button
                      themeColor={"primary"}
                      onClick={handleApprovalSubmit}
                      disabled={disabled}
                    >
                      Send for Approval
                    </Button>
                  </div>
          </div>
          </div>
        )}

            <style>
                {`.k-animation-container {
                    z-index: 10003;
                }`}
            </style>
      </HeaderLayout>
    </div>
  );
};

export default TaskHour;
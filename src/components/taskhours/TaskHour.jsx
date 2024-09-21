import * as React from 'react';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import { AutoComplete, DropDownList } from '@progress/kendo-react-dropdowns';
import {GetRequestHelper} from  '../helper/GetRequestHelper'
import {PostRequestHelper} from  '../helper/PostRequestHelper'
import { useNavigate } from 'react-router-dom';
import HeaderLayout from '../home/HeaderLayout'
import { useParams } from 'react-router-dom';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import Alerts from '../dynamic-compoenents/Alerts';
import { TextArea } from '@progress/kendo-react-inputs';
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import CardComponent from './CardComponent';
import { filterBy } from "@progress/kendo-data-query";
import { RangeFilterCell } from "../dynamic-compoenents/rangeFilterCell";
import { NumericTextBox } from '@progress/kendo-react-inputs';



const numericValidator = (value) => {
  return value <= 24 ? "" : "The value must be less than or equal to 24";
};

const DropDownCell = ({ dataItem, field, onChange, client, project, task, setClient, setProject, setTask, dataClients }) => {
  const [value, setValue] = React.useState(client ? dataClients.find(c => c.value === client)?.text : ''); // Track typed value

  const handleChange = (e) => {
    const selectedValue = e.target.value;
    setValue(selectedValue); // Update local input value
    
    // Find the corresponding client object based on input
    const selectedClient = dataClients.find(c => c.text === selectedValue);

    if (onChange && selectedClient) {
      onChange({
        dataIndex: 0,
        dataItem: dataItem,
        field: field,
        syntheticEvent: e.syntheticEvent,
        value: selectedClient.value
      });
    }

    if (selectedClient) {
      setClient(selectedClient.value);
      setProject(null);  // Reset project and task when client changes
      setTask(null);
    }
  };

  const dataValue = dataItem[field] === null ? '' : dataItem[field];

  return (
    <td>
      {dataItem.inEdit ? (
        <AutoComplete
          style={{ width: '100px' }}
          onChange={handleChange}
          value={value} // The value now reflects the typed input
          data={dataClients}
          textField="text" // Specifies which field to display as the text
          dataItemKey="value" // Specifies the key used to identify each item
          placeholder="Type to search client..." // Optional placeholder
        />
      ) : dataValue == null ? (
        ''
      ) : (
        dataClients.find(c => c.value === dataValue)?.text || dataValue
      )}
    </td>
  );
};

const ProjectDropDownCell = ({ dataItem, field, onChange, client, project, task, setClient, setProject, setTask, dataProjects }) => {
  const [value, setValue] = React.useState(project ? dataProjects.find(p => p.value === project)?.text : ''); // Track typed value

  const handleChange = (e) => {
    const selectedValue = e.target.value;
    setValue(selectedValue); // Update local input value

    // Find the corresponding project object based on input
    const selectedProject = dataProjects.find(p => p.text === selectedValue);

    if (onChange && selectedProject) {
      onChange({
        dataIndex: 0,
        dataItem,
        field,
        syntheticEvent: e.syntheticEvent,
        value: selectedProject.value
      });
    }

    if (selectedProject) {
      setProject(selectedProject.value);
      setClient(selectedProject.client_id);  // Automatically select the corresponding client
      setTask(null);  // Reset the task when the project changes
    }
  };

  const filteredProjects = dataProjects.filter(p => p.client_id === client); // Filter projects based on selected client
  const dataValue = dataItem[field] === null ? '' : dataItem[field];

  return (
    <td>
      {dataItem.inEdit ? (
        <AutoComplete
          style={{ width: '100px' }}
          onChange={handleChange}
          value={value} // The value now reflects the typed input
          data={client ? filteredProjects : dataProjects} // Filtered projects based on the selected client
          textField="text" // Specifies which field to display as the text
          dataItemKey="value" // Specifies the key used to identify each item
          placeholder="Type to search project..." // Optional placeholder for guidance
        />
      ) : dataValue == null ? (
        ''
      ) : (
        filteredProjects.find(p => p.value === dataValue)?.text || dataValue
      )}
    </td>
  );
};

const TaskDropDownCell = ({ dataItem, field, onChange, client, project, task, setClient, setProject, setTask, dataTasks }) => {
  const [value, setValue] = React.useState(task ? dataTasks.find(t => t.value === task)?.text : ''); // Track typed value

  const handleChange = (e) => {
    const selectedValue = e.target.value;
    setValue(selectedValue); // Update local input value

    // Find the corresponding task object based on input
    const selectedTask = dataTasks.find(t => t.text === selectedValue);

    if (onChange && selectedTask) {
      onChange({
        dataIndex: 0,
        dataItem,
        field,
        syntheticEvent: e.syntheticEvent,
        value: selectedTask.value
      });
    }

    if (selectedTask) {
      setTask(selectedTask.value);
      setProject(selectedTask.project_id); // Automatically select the corresponding project
      setClient(selectedTask.client_id);  // Automatically select the corresponding client
    }
  };

  const filteredTasks = dataTasks.filter(t => t.client_id === client && t.project_id === project); // Filter tasks based on client and project
  const dataValue = dataItem[field] === null ? '' : dataItem[field];

  return (
    <td>
      {dataItem.inEdit ? (
        <AutoComplete
          style={{ width: '100px' }}
          onChange={handleChange}
          value={value} // The value now reflects the typed input
          data={(client && project) ? filteredTasks : client ? dataTasks.filter(t => t.client_id === client) : dataTasks} // Filter tasks based on client and project
          textField="text" // Specifies which field to display as the text
          dataItemKey="value" // Specifies the key used to identify each item
          placeholder="Type to search task..." // Optional placeholder
        />
      ) : dataValue == null ? (
        ''
      ) : (
        filteredTasks.find(t => t.value === dataValue)?.text || dataValue
      )}
    </td>
  );
};




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
  const initialFilter = {
    logic: "and", // or "or"
    filters: []
  };
    const [filter, setFilter] = React.useState(initialFilter);
  const [data, setData] = React.useState([]);
  const [timesheetData, setTimesheetData] = React.useState([]);
  const [clientData, setClientData] = React.useState([]);
  const [projectData, setProjectData] = React.useState([]);
  const [taskData, setTaskData] = React.useState([]);
  const [client, setClient] = React.useState(null);
  const [project, setProject] = React.useState(null);
  const [task, setTask] = React.useState(null);
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
      const dataClients = metadata.clients.map(client => ({
        value: client.id,
        text: client.name,
      }));
      const dataProjects = metadata.projects.map(project => ({
        client_id: project.client_id,
        value: project.id,
        text: project.name,
      }));
      const dataTasks = metadata.tasks.map(task => ({
        project_id: task.project_id,
        value: task.id,
        text: task.name,
        client_id: task.client_id,
      }));

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
    const dataItem = {
      id: undefined,
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

  const enterEdit = dataItem => {
    setData(data.map(item => (item.id === dataItem.id ? { ...item, inEdit: true } : item)));
    setClient(dataItem.client_id)
    setProject(dataItem.project_id)
    setTask(dataItem.task_id)
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
    setClient(null);
    setProject(null)
    setTask(null);
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

  const itemChange = event => {
    const { value, field } = event;
    const newValue = field === 'start_date' ? new Date(value) : value;
    setData(data.map(item => (item.id === event.dataItem.id ? { ...item, [field]: newValue } : item)));
  };


  const MyCommandCell = props => (
    <td>
      {!props.dataItem.inEdit ? (
        <>
          <Button
            themeColor={'primary'}
            style={{ marginRight: '10px' }} // Add margin between buttons
            onClick={() => enterEdit(props.dataItem)}
          >
            Edit
          </Button>
          <Button onClick={() => remove(props.dataItem)}>
            Remove
          </Button>
        </>
      ) : (
        <>
          <Button
            themeColor={'primary'}
            style={{ marginRight: '10px' }} // Add margin between buttons
            onClick={() => save(props.dataItem)}
          >
            {props.dataItem.id ? 'Update' : 'Add'}
          </Button>
          <Button onClick={() => cancel(props.dataItem)}>
            {props.dataItem.id ? 'Cancel' : 'Discard changes'}
          </Button>
        </>
      )}
    </td>
  );
  
  const NumericCell = ({ dataItem, field, onChange }) => {
    const handleChange = (e) => {
      const value = e.value;
      onChange({
        dataIndex: 0,
        dataItem,
        field,
        syntheticEvent: e.syntheticEvent,
        value,
      });
    };
  
    return (
      <td>
        {dataItem.inEdit ? (
          <Field
            name={field}
            validator={() => numericValidator(dataItem[field])} // Apply validator here
            render={({ validationMessage, value, ...fieldRenderProps }) => (
              <>
                <NumericTextBox
                  {...fieldRenderProps}
                  value={value === null ? 0 : value}
                  onChange={handleChange}
                  min={0} // Optional: Set minimum value
                  max={24} // Set max value to 24 for NumericTextBox
                  width="100%"
                />
                {validationMessage && (
                  <div style={{ color: "red" }}>{validationMessage}</div>
                )}
              </>
            )}
          />
        ) : (
          dataItem[field]
        )}
      </td>
    );
  };
  
  

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
  console.log('data',task,client,project);
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
            <div className='mt-3 mb-3'>
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
        data={filterBy(data, filter)}
        navigatable={true}
        filterable={true}
        filter={filter}
        onFilterChange={(e) => setFilter(e.filter)}
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
          </GridToolbar>
        )}
          
      
        <Column field="new_id" title="Id" editable={false} width={"50px"}/>
        <Column field="client_name" title="Client Name" cell={props=>
          <DropDownCell 
            {...props} 
            project={project} 
            task={task} 
            client={client} 
            setClient={setClient} 
            setProject={setProject} 
            setTask={setTask}
            dataClients={clientData}  // Pass client data here
          />} 
          editor='text' 
        />
        <Column field="project_name" title="Project Name" cell={props=>
          <ProjectDropDownCell 
            {...props} 
            project={project} 
            task={task} 
            client={client} 
            setClient={setClient} 
            setProject={setProject} 
            setTask={setTask} 
            dataProjects={projectData}  // Pass project data here
          />} 
          editor="text" 
        />
        <Column field="task_name" title="Task Name" cell={props=>
          <TaskDropDownCell 
            {...props} 
            project={project} 
            task={task} 
            client={client} 
            setClient={setClient} 
            setProject={setProject} 
            setTask={setTask} 
            dataTasks={taskData}  // Pass task data here
          />} 
          editor="text" 
        />
        <Column field="mon" title="Mon" editor="numeric" format="{0:n}" filterCell={RangeFilterCell}/>
        <Column field="tue" title="Tue" editor="numeric" format="{0:n}"  filterCell={RangeFilterCell}/>
        <Column field="wed" title="Wed" editor="numeric" format="{0:n}"  filterCell={RangeFilterCell}/>
        <Column field="thu" title="Thu" editor="numeric" format="{0:n}"  filterCell={RangeFilterCell}/>
        <Column field="fri" title="Fri" editor="numeric" format="{0:n}"  filterCell={RangeFilterCell}/>
        <Column field="sat" title="Sat" editor="numeric" format="{0:n}"  filterCell={RangeFilterCell}/>
        <Column field="sun" title="Sun" editor="numeric" format="{0:n}"  filterCell={RangeFilterCell}/>
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

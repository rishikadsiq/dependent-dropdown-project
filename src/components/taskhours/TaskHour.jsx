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
import Alerts from '../alerts/Alerts';



const DropDownCell = ({ dataItem, field, onChange, client, project, task, setClient, setProject, setTask, dataClients }) => {
  const handleChange = e => {
    if (onChange) {
      onChange({
        dataIndex: 0,
        dataItem: dataItem,
        field: field,
        syntheticEvent: e.syntheticEvent,
        value: e.target.value.value
      });
    }
    setClient(e.target.value.value)
    setProject(null)
    setTask(null)
  };
  const dataValue = dataItem[field] === null ? '' : dataItem[field];

  return (
    <td>
      {dataItem.inEdit ? (
        <DropDownList
          style={{ width: '100px' }}
          onChange={handleChange}
          value={dataClients.find(c => c.value === client)}
          data={dataClients}
          textField="text"
          dataItemKey="value"
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
  const handleChange = e => {
    if (onChange) {
      onChange({
        dataIndex: 0,
        dataItem,
        field,
        syntheticEvent: e.syntheticEvent,
        value: e.target.value.value
      });
    }
    setProject(e.target.value.value)
    setClient(e.target.value.client_id)
    setTask(null)
  };

  const selectedClient = dataItem.client_name;
  const filteredProjects = dataProjects.filter(p => p.client_id === client);

  const dataValue = dataItem[field] === null ? '' : dataItem[field];

  return (
    <td>
      {dataItem.inEdit ? (
        <DropDownList
          style={{ width: '100px' }}
          onChange={handleChange}
          value={dataProjects.find(p => p.value === project)}
          data={client ? filteredProjects : dataProjects}
          textField="text"
          dataItemKey="value"
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
  const handleChange = e => {
    if (onChange) {
      onChange({
        dataIndex: 0,
        dataItem,
        field,
        syntheticEvent: e.syntheticEvent,
        value: e.target.value.value
      });
      setTask(e.target.value.value)
      setProject(e.target.value.project_id)
      setClient(e.target.value.client_id)
    }

  };

  const selectedClient = dataItem.client_name;
  const selectedProject = dataItem.project_name;
  const filteredTasks = dataTasks.filter(t => t.client_id === client && t.project_id === project);

  const dataValue = dataItem[field] === null ? '' : dataItem[field];

  return (
    <td>
      {dataItem.inEdit ? (
        <DropDownList
          style={{ width: '100px' }}
          onChange={handleChange}
          value={dataTasks.find(t => t.value === task)}
          data={(client && project) ? filteredTasks : client ? dataTasks.filter(t => t.client_id === client) : dataTasks}
          textField="text"
          dataItemKey="value"
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

const MyInputCustomCell = props => <CustomCell {...props} color="red" />;
const MyNumericCustomCell = props => <CustomCell {...props} color="lightgreen" />;
const MyBooleanCustomCell = props => <CustomCell {...props} color="pink" />;

const TaskHour = () => {
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
  const [showActions, setShowActions] = React.useState(false)

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

  const getListing = async () => {
    try {
      const data1 = await PostRequestHelper('taskhourslist', { timesheet_id: timesheetId });
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
    getListing();
    setShowActions(true);
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

    setData(data.map(item => (item.id === dataItem.id ? { ...dataItem, inEdit: undefined } : item)));
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

  const itemChange = event => {
    const { value, field } = event;
    const newValue = field === 'start_date' ? new Date(value) : value;
    setData(data.map(item => (item.id === event.dataItem.id ? { ...item, [field]: newValue } : item)));
  };


  const MyCommandCell = props => (
    <td>
      {!props.dataItem.inEdit ? (
        <>
          <Button themeColor={'primary'} onClick={() => enterEdit(props.dataItem)}>
            Edit
          </Button>
          <Button onClick={() => remove(props.dataItem)}>
            Remove
          </Button>
        </>
      ) : (
        <>
          <Button themeColor={'primary'} onClick={() => save(props.dataItem)}>
            {props.dataItem.id ? 'Update' : 'Add'}
          </Button>
          <Button onClick={() => cancel(props.dataItem)}>
            {props.dataItem.id ? 'Cancel' : 'Discard changes'}
          </Button>
        </>
      )}
    </td>
  );
  console.log('data',task,client,project);
  return (
    <div>
          <HeaderLayout>
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
        {showActions && (timesheetData.approval === 'DRAFT' || timesheetData.approval === 'REJECTED') && (
          <GridToolbar>
            <Button title="Add new" type="button" onClick={enterInsert}>
              Add new
            </Button>
          </GridToolbar>
        )}
        <Column field="id" title="Id" editable={false} width={"50px"}/>
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
        <Column field="mon" title="Mon" editor="numeric" />
        <Column field="tue" title="Tue" editor="numeric" />
        <Column field="wed" title="Wed" editor="numeric" />
        <Column field="thu" title="Thu" editor="numeric" />
        <Column field="fri" title="Fri" editor="numeric" />
        <Column field="sat" title="Sat" editor="numeric" />
        <Column field="sun" title="Sun" editor="numeric" />
        {showActions && (timesheetData.approval === 'DRAFT' || timesheetData.approval === 'REJECTED') && (
            <Column cell={MyCommandCell} title="Actions" width="150px" />
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

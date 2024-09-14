import * as React from 'react';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Button } from '@progress/kendo-react-buttons';
import { useNavigate, useParams } from 'react-router-dom';
import { GetRequestHelper } from '../helper/GetRequestHelper';
import { PostRequestHelper } from '../helper/PostRequestHelper';
import NavbarComponent from '../home/NavbarComponent';
import Alerts from '../alerts/Alerts';

// This will fetch metadata in a React lifecycle hook
const useFetchMetadata = (navigate) => {
  const [metadata, setMetadata] = React.useState({ clients: [], projects: [], tasks: [] });

  React.useEffect(() => {
    const fetchMetaData = async () => {
      try {
        const response = await GetRequestHelper('metadata', navigate);
        const result = response.message
        setMetadata(result);
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    };
    fetchMetaData();
  }, [navigate]);

  return metadata;
};

const DropDownCell = ({ dataItem, field, onChange, clients, setClient, setProject, setTask }) => {
  const handleChange = e => {
    if (onChange) {
      onChange({
        dataIndex: 0,
        dataItem: dataItem,
        field: field,
        syntheticEvent: e.syntheticEvent,
        value: e.target.value.value,
      });
    }
    setClient(e.target.value.value);
    setProject(null);
    setTask(null);
  };

  const dataValue = dataItem[field] === null ? '' : dataItem[field];

  return (
    <td>
      {dataItem.inEdit ? (
        <DropDownList
          style={{ width: '100px' }}
          onChange={handleChange}
          value={clients.find(c => c.value === dataItem.client_name)}
          data={clients}
          textField="text"
          dataItemKey="value"
        />
      ) : (
        clients.find(c => c.value === dataValue)?.text || dataValue
      )}
    </td>
  );
};

const ProjectDropDownCell = ({ dataItem, field, onChange, projects, client, setProject }) => {
  const handleChange = e => {
    if (onChange) {
      onChange({
        dataIndex: 0,
        dataItem,
        field,
        syntheticEvent: e.syntheticEvent,
        value: e.target.value.value,
      });
    }
    setProject(e.target.value.value);
  };

  const filteredProjects = projects.filter(p => p.client_id === client);
  const dataValue = dataItem[field] === null ? '' : dataItem[field];

  return (
    <td>
      {dataItem.inEdit ? (
        <DropDownList
          style={{ width: '100px' }}
          onChange={handleChange}
          value={projects.find(p => p.value === dataItem.project_name)}
          data={filteredProjects}
          textField="text"
          dataItemKey="value"
        />
      ) : (
        filteredProjects.find(p => p.value === dataValue)?.text || dataValue
      )}
    </td>
  );
};

const TaskDropDownCell = ({ dataItem, field, onChange, tasks, project, setTask }) => {
  const handleChange = e => {
    if (onChange) {
      onChange({
        dataIndex: 0,
        dataItem,
        field,
        syntheticEvent: e.syntheticEvent,
        value: e.target.value.value,
      });
    }
    setTask(e.target.value.value);
  };

  const filteredTasks = tasks.filter(t => t.project_id === project);
  const dataValue = dataItem[field] === null ? '' : dataItem[field];

  return (
    <td>
      {dataItem.inEdit ? (
        <DropDownList
          style={{ width: '100px' }}
          onChange={handleChange}
          value={tasks.find(t => t.value === dataItem.task_name)}
          data={filteredTasks}
          textField="text"
          dataItemKey="value"
        />
      ) : (
        filteredTasks.find(t => t.value === dataValue)?.text || dataValue
      )}
    </td>
  );
};

const TaskHour = () => {
  const navigate = useNavigate();
  const metadata = useFetchMetadata(navigate); // Fetch metadata
  const [data, setData] = React.useState([]);
  const [timesheetData, setTimesheetData] = React.useState([]);
  const [client, setClient] = React.useState(null);
  const [project, setProject] = React.useState(null);
  const [task, setTask] = React.useState(null);
  const [showAlert, setShowAlert] = React.useState(false)
  const [message, setMessage] = React.useState("")
  const [variant, setVariant] = React.useState(null)

  const {timesheetId} = useParams()

  const getListing = async() => {
    try {
        const data1 = await PostRequestHelper('taskhourslist', {timesheet_id: timesheetId}, navigate);
        console.log(data1);
        if (data1.status === 404) {
            setData([]);
        } else {
            console.log(data1)
            const updatedData = data1.taskhours.map((item, index) => ({
                ...item, // Spread the other properties
                new_id: index+1,
            }));
            console.log(updatedData);
            
            setData(updatedData || []);
            setTimesheetData([data1.timesheet_details])
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        setData([]); // Handle error case by setting an empty array or some default data
    }
};

  React.useEffect(() => {
    getListing(); // Call the function to fetch data
    console.log(timesheetData)
}, []);

  const itemChange = event => {
    const { value, field } = event;
    const newValue = field === 'start_date' ? new Date(value) : value;
    const newData = data.map(item =>
      item.id === event.dataItem.id ? { ...item, [field]: newValue } : item,
    );
    setData(newData);
  };

  const enterInsert = () => {
    const dataItem = {
      id: undefined, // No id assigned until saved
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
      start_date: new Date(),
      inEdit: true,
    };
    const newData = [dataItem, ...data];
    setData(newData);
  };

  return (
    <div>
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
    <div>
      <Grid
        style={{ height: '400px' }}
        data={data}
        onItemChange={itemChange}
        editField="inEdit"
      >
        <GridToolbar>
          <Button title="Add new" type="button" onClick={() => enterInsert()}>
            Add new
          </Button>
        </GridToolbar>
        <Column field="id" title="ID" editable={false} width="50px" />
        <Column field="client_name" title="Client Name" cell={props => (
          <DropDownCell
            {...props}
            clients={metadata.clients}
            setClient={setClient}
            setProject={setProject}
            setTask={setTask}
          />
        )} />
        <Column field="project_name" title="Project Name" cell={props => (
          <ProjectDropDownCell
            {...props}
            projects={metadata.projects}
            client={client}
            setProject={setProject}
          />
        )} />
        <Column field="task_name" title="Task Name" cell={props => (
          <TaskDropDownCell
            {...props}
            tasks={metadata.tasks}
            project={project}
            setTask={setTask}
          />
        )} />
        {/* More columns */}
      </Grid>
    </div>
    </div>
  );
};

export default TaskHour;

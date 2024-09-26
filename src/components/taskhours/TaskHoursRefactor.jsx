import * as React from 'react';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import { PostRequestHelper } from '../helper/PostRequestHelper';
import HeaderLayout from '../home/HeaderLayout';
import { Button } from '@progress/kendo-react-buttons';
import { useNavigate, useParams } from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';
import { GetRequestHelper } from '../helper/GetRequestHelper';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { symbolIcon } from '@progress/kendo-svg-icons';




const App = () => {
  const [data, setData] = React.useState([]);
  const [timesheetData, setTimesheetData] = React.useState([]);
  const [clientData, setClientData] = React.useState([]);
  const [projectData, setProjectData] = React.useState([]);
  const [taskData, setTaskData] = React.useState([]);
  const { timesheetId } = useParams();
  const navigate = useNavigate();

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
    getListing();
  }, []);


  const enterInsert = () => {
    let myuuid = uuidv4();
    console.log(myuuid)
    const dataItem = {
      id: myuuid,
      new_id: myuuid,
      client_name: '',
      client_id: '',
      project_name: '',
      project_id: '',
      task_name: '',
      task_id: '',
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


const fetchMetaData = async () => {
    const response = await GetRequestHelper('metadata', navigate);
    return response.message;
  }


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

  const DropDownCell = props => {
    const localizedData = clientData;
    const { dataItem } = props;

    const handleChange = e => {
        if (props.onChange) {
            const client = e.target.value; // Get the selected client object
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
            props.onChange({
                dataItem: {
                    ...props.dataItem,
                    project_id: task.project_id, // Reset project_id
                    client_id: task.client_id,    // Reset task_id
                },
                field: 'task_id', // Set task_id instead of task_name
                syntheticEvent: e.syntheticEvent,
                value: task.id, // Set task ID
            });
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

const itemChange = e => {
    let newData = data.map(item => {
        if (item.id === e.dataItem.id) {
            item[e.field || ''] = e.value;
            // Reset project_id and task_id when client_id changes
            if (e.field === 'client_id') {
                item.project_id = '';
                item.task_id = '';
            }
        }
        return item;
    });
    setData(newData);
};

  
  
  const handleSaveData = () => {
    console.log('Saved data:', data)
    const updatedData = data.map(dataItem => {
        return ({
            values: [dataItem.mon, dataItem.tue, dataItem.wed, dataItem.thu, dataItem.fri, dataItem.sat, dataItem.sun],
            task_id: dataItem.task_id,
            timesheet_id: timesheetId
        })
    })
    console.log(updatedData)
    const fetchData = async() => {
        try {
            const data1 = await PostRequestHelper('addtaskhours', updatedData, navigate);
            console.log(data1);
            if(data1.status === 201){
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


  return (
    <HeaderLayout>
        <Grid data={data} editField="inEdit" onItemChange={itemChange}>
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
        </Grid>
    </HeaderLayout>
  )
};
export default App;
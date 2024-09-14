import * as React from 'react';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import { DropDownCell, ProjectDropDownCell, TaskDropDownCell } from './myDropDownCell';
import { PostRequestHelper } from '../helper/PostRequestHelper';
import Alerts from '../alerts/Alerts';
import NavbarComponent from '../home/NavbarComponent';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

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
const MyDateCustomCell = props => <CustomCell {...props} color="lightblue" />;

const TaskHour = () => {
  const [data, setData] = React.useState([]);
  const [timesheetData, setTimesheetData] = React.useState([]);
  const [client,setClient] = React.useState(null);
  const [project,setProject] = React.useState(null);
  const [task,setTask] = React.useState(null);
  const [showAlert, setShowAlert] = React.useState(false)
  const [message, setMessage] = React.useState("")
  const [variant, setVariant] = React.useState(null)
  const navigate = useNavigate()
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

  const enterEdit = dataItem => {
    const newData = data.map(item =>
      item.id === dataItem.id ? { ...item, inEdit: true } : item
    );
    console.log('dsasdgasg')
    setData(newData);
  };

  const save = async dataItem => {
    if (!dataItem.new_id) {
        // Remove the id before adding the new item
        delete dataItem.id;
        console.log('Adding new item:', dataItem);
        dataItem.start_date = dataItem.start_date.toISOString().split('T')[0];
        let updatedDataItem = {
            ...dataItem,
            values: [
                dataItem.mon,
                dataItem.tue,
                dataItem.wed,
                dataItem.thu,
                dataItem.fri,
                dataItem.sat,
                dataItem.sun
            ],
            task_id: dataItem.task_name
        };
        
        // Optionally remove the individual day fields if no longer needed:
        delete updatedDataItem.mon;
        delete updatedDataItem.tue;
        delete updatedDataItem.wed;
        delete updatedDataItem.thu;
        delete updatedDataItem.fri;
        delete updatedDataItem.sat;
        delete updatedDataItem.sun;
        delete updatedDataItem.task_name;
        delete updatedDataItem.client_name;
        delete updatedDataItem.project_name;
        delete updatedDataItem.inEdit
        
        
        console.log(updatedDataItem)
        const addData = async () => {
          try {
            const response = await PostRequestHelper("addtaskhours", updatedDataItem, navigate);
            console.log(response)
          } catch (error) {
            console.error("Error while adding data:", error);
          }
        };
        getListing()
     } else {
      console.log('Editing item:', dataItem);
    }
    const newData = data.map(item =>
      item.id === dataItem.id ? { ...dataItem, inEdit: undefined } : item
    );
    console.log(newData)
    setData(newData);
  };

  const cancel = dataItem => {
    if (!dataItem.id) {
      setData(data.filter(item => item.id !== undefined));
    } else {
      const newData = data.map(item =>
        item.id === dataItem.id
          ? { ...data.find(p => p.id === dataItem.id), inEdit: false }
          : item
      );
      setData(newData);
    }
  };

  const remove = async dataItem => {
    console.log(dataItem.id)
    const response = await fetch("http://127.0.0.1:5000/deletetaskhours", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({"id": dataItem.id})  // Send dataItem in request body
    });
    if (response.ok) {
      const data = await response.json();
      console.log("Response from server:", data);
      
      const fetchData = async () => {
        const response = await fetch("http://127.0.0.1:5000/taskhourslist", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        const data = await response.json();
        console.log(data)
        const updatedData = data.map((item, index) => ({
          ...item, // Spread the other properties
          new_id: index+1,
          start_date: new Date(item.start_date) // Convert start_date to Date object
        }));
        console.log(updatedData);
        
        setData(updatedData || []);
      }
      fetchData();
    // Optionally, update the UI with the new id or other server responses
    }
    // setData(data.filter(item => item.id !== dataItem.id));
  };

  const itemChange = event => {
    const { value, field } = event;
    if (!field) return;

    const newValue = field === 'start_date' ? new Date(value) : value;
    const newData = data.map(item =>
      item.id === event.dataItem.id ? { ...item, [field]: newValue } : item
    );
    setData(newData);
  };

  React.useEffect(() => {
    enterInsert();
  }, []);

  const MyCommandCell = props => (
    <td>
      {!props.dataItem.inEdit ? (
        <>
          <Button themeColor={'primary'} onClick={() => enterEdit(props.dataItem)}>
            Edit
          </Button>
          <Button onClick={() => window.confirm('Confirm deleting ' + props.dataItem.task_name) && remove(props.dataItem)}>
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

      <Grid
        style={{ height: '400px' }}
        data={data}
        onItemChange={itemChange}
        editField="inEdit"
        cells={{
          edit: {
            text: MyInputCustomCell,
            numeric: MyNumericCustomCell,
            boolean: MyBooleanCustomCell,
              date: MyDateCustomCell
          }
        }}
      >
        <GridToolbar>
          <Button title="Add new" type="button" onClick={enterInsert}>
            Add new
          </Button>
        </GridToolbar>
        <Column field="new_id" title="Id" editable={false} width={"50px"}/>
        <Column field="client_name" title="Client Name" cell={props=><DropDownCell {...props} project={project} task={task} client={client} setClient={setClient} setProject={setProject} setTask={setTask} />} editor='text' />
        <Column field="project_name" title="Project Name" cell={props=><ProjectDropDownCell {...props} project={project} task={task} client={client} setClient={setClient} setProject={setProject} setTask={setTask} />} editor="text" />
        <Column field="task_name" title="Task Name" cell={props=><TaskDropDownCell {...props} project={project} task={task} client={client} setClient={setClient} setProject={setProject} setTask={setTask} />} editor="text" />
        <Column field="mon" title="Mon" editor="numeric" width={"80px"}/>
        <Column field="tue" title="Tue" editor="numeric" width={"80px"}/>
        <Column field="wed" title="Wed" editor="numeric" width={"80px"}/>
        <Column field="thu" title="Thu" editor="numeric" width={"80px"}/>
        <Column field="fri" title="Fri" editor="numeric" width={"80px"}/>
        <Column field="sat" title="Sat" editor="numeric" width={"80px"}/>
        <Column field="sun" title="Sun" editor="numeric" width={"80px"}/>
        <Column field="start_date" title="Start Date" editor="date" format="{0:d}" />
        <Column cell={MyCommandCell} width="140px" />
      </Grid>
    </div>
  );
};

export default TaskHour;


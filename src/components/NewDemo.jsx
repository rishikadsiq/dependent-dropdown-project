import * as React from 'react';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import { DropDownCell, ProjectDropDownCell, TaskDropDownCell } from './myDropDownCell';

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

const NewDemo = () => {
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
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
            const response = await fetch("http://127.0.0.1:5000/addtaskhours", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(updatedDataItem)  // Send dataItem in request body
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log("Response from server:", data);
                
              // Optionally, update the UI with the new id or other server responses
            } else {
              console.error("Failed to add data:", response.statusText);
            }
          } catch (error) {
            console.error("Error while adding data:", error);
          }
        };
        await addData();
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

  const remove = dataItem => {
    setData(data.filter(item => item.id !== dataItem.id));
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
        <Column field="client_name" title="Client Name" cell={DropDownCell} editor='text' />
        <Column field="project_name" title="Project Name" cell={ProjectDropDownCell} editor="text" />
        <Column field="task_name" title="Task Name" cell={TaskDropDownCell} editor="text" />
        <Column field="mon" title="Mon" editor="numeric" />
        <Column field="tue" title="Tue" editor="numeric" />
        <Column field="wed" title="Wed" editor="numeric" />
        <Column field="thu" title="Thu" editor="numeric" />
        <Column field="fri" title="Fri" editor="numeric" />
        <Column field="sat" title="Sat" editor="numeric" />
        <Column field="sun" title="Sun" editor="numeric" />
        <Column field="start_date" title="Start Date" editor="date" format="{0:d}" />
        <Column cell={MyCommandCell} width="150px" />
      </Grid>
    </div>
  );
};

export default NewDemo;


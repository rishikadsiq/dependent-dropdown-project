import * as React from 'react';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';

const fetchMetaData = async () => {
  const response = await fetch("http://127.0.0.1:5000/metadata", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
  const metadata = await response.json();
  console.log(metadata);
  return metadata
}
const metadata = await fetchMetaData()
console.log(metadata);
const dataItemClients = metadata.clients
  const dataItemProjects = metadata.projects
  const dataItemTasks = metadata.tasks
  const dataClients = dataItemClients.map(client => {
    return (
      {
        value: client.id,
        text: client.name
      }
    )
    
  })
  const dataProjects = dataItemProjects.map(project => {
    return (
      {
        client_id: project.client_id,
        value: project.id,
        text: project.name
      }
    )
  })
  const dataTasks = dataItemTasks.map(task => {
    return (
      {
        project_id: task.project_id,
        value: task.id,
        text: task.name,
        client_id: task.client_id
      }
    )
  })
  console.log(metadata)
  console.log(dataClients)
  console.log(dataClients);
  console.log(dataProjects);
  console.log(dataTasks);


export const DropDownCell = props => {
  const handleChange = e => {
    if (props.onChange) {
      props.onChange({
        dataIndex: 0,
        dataItem: props.dataItem,
        field: props.field,
        syntheticEvent: e.syntheticEvent,
        value: e.target.value.value
      });
    }
  };

  const { dataItem } = props;
  const field = props.field || '';
  const dataValue = dataItem[field] === null ? '' : dataItem[field];

  return (
    <td>
      {dataItem.inEdit ? (
        <DropDownList
          style={{ width: '100px' }}
          onChange={handleChange}
          value={dataClients.find(c => c.value === dataValue)}
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

export const ProjectDropDownCell = ({ dataItem, field, onChange }) => {
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
  };

  const selectedClient = dataItem.client_name;
  const filteredProjects = dataProjects.filter(p => p.client_id === selectedClient);

  const dataValue = dataItem[field] === null ? '' : dataItem[field];

  return (
    <td>
      {dataItem.inEdit ? (
        <DropDownList
          style={{ width: '100px' }}
          onChange={handleChange}
          value={filteredProjects.find(p => p.value === dataValue)}
          data={filteredProjects}
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

export const TaskDropDownCell = ({ dataItem, field, onChange }) => {
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
  };

  const selectedClient = dataItem.client_name;
  const selectedProject = dataItem.project_name;
  const filteredTasks = dataTasks.filter(t => t.client_id === selectedClient && t.project_id === selectedProject);

  const dataValue = dataItem[field] === null ? '' : dataItem[field];

  return (
    <td>
      {dataItem.inEdit ? (
        <DropDownList
          style={{ width: '100px' }}
          onChange={handleChange}
          value={filteredTasks.find(t => t.value === dataValue)}
          data={filteredTasks}
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
const MyDateCustomCell = props => <CustomCell {...props} color="lightblue" />;

const NewDemo = () => {
  const [data, setData] = React.useState([
    {
      client_name: 'a09d4044-c87f-494a-91a7-43176d697a87',
      project_name: '5c20ef9a-df59-4262-a347-2ec32c81a6b0',
      task_name: '7dc8214c-107f-438a-bbd9-ef6d4960c369',
      mon: 0,
      tue: 0,
      wed: 0,
      thu: 0,
      fri: 0,
      sat: 0,
      sun: 0,
      start_date: new Date(),
      id: '1'
    }
  ]);

  const enterInsert = () => {
    const newId = data.length > 0 ? data.length + 1 : 1;
    const dataItem = {
      id: newId.toString(),
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
      inEdit: true
    };
    const newData = [dataItem, ...data];
    setData(newData);
  };

  const enterEdit = dataItem => {
    const newData = data.map(item =>
      item.id === dataItem.id ? { ...item, inEdit: true } : item
    );
    setData(newData);
  };

  const save = dataItem => {
    const newData = data.map(item =>
      item.id === dataItem.id ? { ...dataItem, inEdit: undefined } : item
    );
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
        <Column field="id" title="Id" editable={false} width={"50px"}/>
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


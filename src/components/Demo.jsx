import * as React from 'react';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { DropDownList } from "@progress/kendo-react-dropdowns";


const dataClients = [
  { value: 'a09d4044-c87f-494a-91a7-43176d697a87', text: 'client1' },
  { value: 'c2cefd50-b670-4b33-a74a-f4e75814b686', text: 'client2' },
  { value: '4eae71ab-fdcd-40f3-9233-4f71aad812eb', text: 'client3' }
];

const dataProjects = [
  { client_id: 'a09d4044-c87f-494a-91a7-43176d697a87', value: '5c20ef9a-df59-4262-a347-2ec32c81a6b0', text: 'project1' },
  { client_id: 'a09d4044-c87f-494a-91a7-43176d697a87', value: '0a833389-be1e-4387-971f-dc52f2485c30', text: 'project2' },
  { client_id: 'c2cefd50-b670-4b33-a74a-f4e75814b686', value: '1f71c999-f1cf-4677-a7b5-610be496ca8a', text: 'project12' },
  { client_id: '4eae71ab-fdcd-40f3-9233-4f71aad812eb', value: 'ab333167-0c0d-45da-8a05-b1629ee5b64a', text: 'project11' }
];

const dataTasks = [
  { client_id: 'a09d4044-c87f-494a-91a7-43176d697a87', value: '7dc8214c-107f-438a-bbd9-ef6d4960c369', text: 'task1', project_id: '5c20ef9a-df59-4262-a347-2ec32c81a6b0' },
  { client_id: 'a09d4044-c87f-494a-91a7-43176d697a87', value: 'ad5f91c3-e278-4e7e-9e0c-d82aa5fb7fa7', text: 'task2', project_id: '5c20ef9a-df59-4262-a347-2ec32c81a6b0' },
  { client_id: 'a09d4044-c87f-494a-91a7-43176d697a87', value: '5a227528-8c9a-4bc7-86fe-0bf5c218d8fa', text: 'task12', project_id: '0a833389-be1e-4387-971f-dc52f2485c30' }
];

// Custom DropDownCell components
const DropDownCell = ({ dataItem, field, onChange }) => {
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

  const dataValue = dataItem[field] || '';

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
      ) : dataValue ? (
        dataClients.find(c => c.value === dataValue)?.text || dataValue
      ) : (
        ''
      )}
    </td>
  );
};

const ProjectDropDownCell = ({ dataItem, field, onChange }) => {
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

  const selectedClient = dataClients.find(c => c.value === dataItem.client_id);
  const filteredProjects = selectedClient ? dataProjects.filter(p => p.client_id === selectedClient.value) : [];
  const dataValue = dataItem[field] || '';

  return (
    <td>
      {dataItem.inEdit ? (
        <DropDownList
          style={{ width: '100px' }}
          onChange={handleChange}
          value={dataProjects.find(p => p.value === dataValue)}
          data={filteredProjects}
          textField="text"
          dataItemKey="value"
        />
      ) : dataValue ? (
        dataProjects.find(p => p.value === dataValue)?.text || dataValue
      ) : (
        ''
      )}
    </td>
  );
};

const TaskDropDownCell = ({ dataItem, field, onChange }) => {
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

  const selectedClient = dataClients.find(c => c.value === dataItem.client_id);
  const selectedProject = dataProjects.find(p => p.value === dataItem.project_id);
  const filteredTasks = selectedProject ? dataTasks.filter(t => t.project_id === selectedProject.value) : [];
  const dataValue = dataItem[field] || '';

  return (
    <td>
      {dataItem.inEdit ? (
        <DropDownList
          style={{ width: '100px' }}
          onChange={handleChange}
          value={dataTasks.find(t => t.value === dataValue)}
          data={filteredTasks}
          textField="text"
          dataItemKey="value"
        />
      ) : dataValue ? (
        dataTasks.find(t => t.value === dataValue)?.text || dataValue
      ) : (
        ''
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

const MyInputCustomCell = (props) => <CustomCell {...props} color="red" />;
const MyNumericCustomCell = (props) => <CustomCell {...props} color="lightgreen" />;
const MyBooleanCustomCell = (props) => <CustomCell {...props} color="pink" />;
const MyDateCustomCell = (props) => {
  const value = props.dataItem[props.field];
  const dateValue = value ? new Date(value) : null; // Convert string to Date

  return (
    <CustomCell {...props} color="lightblue">
      <DatePicker
        value={dateValue}
        onChange={(e) => {
          // Handle Date change
          const newValue = e.value ? new Date(e.value) : null;
          props.onChange({ ...e, value: newValue });
        }}
      />
    </CustomCell>
  );
};

const Demo = () => {
  const [data, setData] = React.useState([
    {
      "client_name": "client1",
      "fri": 3,
      "id": "96a532f6-18de-4836-ab8b-61e1ba6c7196",
      "mon": 2,
      "project_name": "project1",
      "sat": 1,
      "start_date": "2024-08-27",
      "sun": 2,
      "task_name": "task1",
      "thu": 1,
      "tue": 4,
      "user_id": "28e9c26f-5bf6-4fe0-9473-a6774e50db7a",
      "wed": 2
    },
    {
      "client_name": "client1",
      "fri": 8,
      "id": "e1e4fec2-9c85-4c10-93c7-cdf762c0a372",
      "mon": 4,
      "project_name": "project1",
      "sat": 5,
      "start_date": "2024-08-27",
      "sun": 4,
      "task_name": "task2",
      "thu": 5,
      "tue": 8,
      "user_id": "28e9c26f-5bf6-4fe0-9473-a6774e50db7a",
      "wed": 6
    }
  ]);

  const dataClients = [
    {
      "id": "a09d4044-c87f-494a-91a7-43176d697a87",
      "name": "client1"
    },
    {
      "id": "c2cefd50-b670-4b33-a74a-f4e75814b686",
      "name": "client2"
    },
    {
      "id": "4eae71ab-fdcd-40f3-9233-4f71aad812eb",
      "name": "client3"
    }
  ];

  const dataProjects = [
    {
      "client_id": "a09d4044-c87f-494a-91a7-43176d697a87",
      "id": "5c20ef9a-df59-4262-a347-2ec32c81a6b0",
      "name": "project1"
    },
    {
      "client_id": "a09d4044-c87f-494a-91a7-43176d697a87",
      "id": "0a833389-be1e-4387-971f-dc52f2485c30",
      "name": "project2"
    },
    {
      "client_id": "c2cefd50-b670-4b33-a74a-f4e75814b686",
      "id": "1f71c999-f1cf-4677-a7b5-610be496ca8a",
      "name": "project12"
    },
    {
      "client_id": "4eae71ab-fdcd-40f3-9233-4f71aad812eb",
      "id": "ab333167-0c0d-45da-8a05-b1629ee5b64a",
      "name": "project11"
    }
  ];

  const dataTasks = [
    {
      "client_id": "a09d4044-c87f-494a-91a7-43176d697a87",
      "id": "7dc8214c-107f-438a-bbd9-ef6d4960c369",
      "name": "task1",
      "project_id": "5c20ef9a-df59-4262-a347-2ec32c81a6b0"
    },
    {
      "client_id": "a09d4044-c87f-494a-91a7-43176d697a87",
      "id": "ad5f91c3-e278-4e7e-9e0c-d82aa5fb7fa7",
      "name": "task2",
      "project_id": "5c20ef9a-df59-4262-a347-2ec32c81a6b0"
    },
    {
      "client_id": "a09d4044-c87f-494a-91a7-43176d697a87",
      "id": "5a227528-8c9a-4bc7-86fe-0bf5c218d8fa",
      "name": "task12",
      "project_id": "0a833389-be1e-4387-971f-dc52f2485c30"
    }
  ];

  const enterInsert = () => {
    if (!data || data.length === 0) {
      const dataItem = {
        id: 1, // Start with 1 or another default value
        inEdit: true
      };
      setData([dataItem]);
    } else {
      const maxId = data.reduce((acc, current) => Math.max(acc, current.id || 0), 0);
      const dataItem = {
        id: maxId + 1,
        inEdit: true
      };
      const newprojects = [dataItem, ...data];
      setData(newprojects);
    }
  };

  const enterEdit = (dataItem) => {
    const newData = data.map((item) =>
      item.id === dataItem.id ? { ...item, inEdit: true } : item
    );
    setData(newData);
  };

  const save = (dataItem) => {
    const newData = data.map((item) =>
      item.id === dataItem.id ? { ...dataItem, inEdit: undefined } : item
    );
    setData(newData);
  };

  const cancel = (dataItem) => {
    if (!dataItem.id) {
      setData(data.filter((item) => item.id !== undefined));
    } else {
      const newData = data.map((item) =>
        item.id === dataItem.id ? { ...data.find((p) => p.id === dataItem.id), inEdit: false } : item
      );
      setData(newData);
    }
  };

  const remove = (dataItem) => {
    setData(data.filter((item) => item.id !== dataItem.id));
  };

  const itemChange = (event) => {
    const { value, field } = event;
    if (!field) return;
    const newData = data.map((item) =>
      item.id === event.dataItem.id ? { ...item, [field]: value } : item
    );
    setData(newData);
  };

  const MyCommandCell = (props) => (
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
  )

  // Dependent dropdown
  const [selectedClient, setSelectedClient] = React.useState(null);
  const [selectedProject, setSelectedProject] = React.useState(null);
  const [selectedTask, setSelectedTask] = React.useState(null);

  const handleClientChange = (event) => {
    const client = event.target.value;
    setSelectedClient(client);
    setSelectedProject(null);
    setSelectedTask(null);
  };

  const handleProjectChange = (event) => {
    const project = event.target.value;
    const relatedClient = dataClients.find(client => client.id === project.client_id);
    setSelectedProject(project);
    setSelectedClient(relatedClient);
    setSelectedTask(null);
  };

  const handleTaskChange = (event) => {
    const task = event.target.value;
    const relatedProject = dataProjects.find(project => project.id === task.project_id);
    const relatedClient = dataClients.find(client => client.id === relatedProject.client_id);
    setSelectedTask(task);
    setSelectedProject(relatedProject);
    setSelectedClient(relatedClient);
  };


  return (
    <>
      <div>
        <Grid
          style={{ height: '400px' }}
          data={data}
          onItemChange={(e) => itemChange(e)}
          editField="inEdit"
        >
          <GridToolbar>
            <Button title="Add new" type="button" onClick={enterInsert}>
              Add new
            </Button>
          </GridToolbar>
          <Column field="id" title="Id" editable={false} />
          <Column field="client_name" title="Client Name" editor="text" />
          <Column field="project_name" title="Project Name" editor="text" />
          <Column field="task_name" title="Task Name" editor="text" />
          <Column field="mon" title="Mon" editor="numeric" />
          <Column field="tue" title="Tue" editor="numeric" />
          <Column field="wed" title="Wed" editor="numeric" />
          <Column field="thu" title="Thu" editor="numeric" />
          <Column field="fri" title="Fri" editor="numeric" />
          <Column field="sat" title="Sat" editor="numeric" />
          <Column field="sun" title="Sun" editor="numeric" />
          <Column field="start_date" title="Start Date" editor="date" cell={MyDateCustomCell} />
          <Column cell={MyCommandCell} width="200px" />
        </Grid>
      </div>
      <div>
        <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
          <div>
            Clients
            <br />
            <DropDownList
              style={{ width: "300px" }}
              data={dataClients}
              textField="name"
              onChange={handleClientChange}
              value={selectedClient}
              defaultItem={{ name: "Select Client ..." }}
            />
          </div>
          <div>
            Projects
            <br />
            <DropDownList
              style={{ width: "300px" }}
              data={dataProjects.filter(
                (project) => !selectedClient || project.client_id === selectedClient.id
              )}
              textField="name"
              onChange={handleProjectChange}
              value={selectedProject}
              defaultItem={{ name: "Select Project ..." }}
            />
          </div>
          <div>
            Tasks
            <br />
            <DropDownList
              style={{ width: "300px" }}
              data={dataTasks.filter(
                (task) => !selectedProject || task.project_id === selectedProject.id
              )}
              textField="name"
              onChange={handleTaskChange}
              value={selectedTask}
              defaultItem={{ name: "Select Task ..." }}
            />
          </div>
        </div>
      </div>
      </>
  );
};

export default Demo;
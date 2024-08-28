import * as React from 'react';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import { DatePicker } from '@progress/kendo-react-dateinputs';
// @ts-expect-error
import { sampleProducts } from './shared-gd-sample-products';
// @ts-expect-error

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
  return <CustomCell {...props} color="lightblue">
    <DatePicker value={dateValue} onChange={(e) => props.onChange(e)} />
  </CustomCell>;
};

const Demo = () => {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://127.0.0.1:5000/metalist", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data = await response.json();
      setData(data || []);
    }
    fetchData();
  }, []);

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
      const newProducts = [dataItem, ...data];
      setData(newProducts);
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
      console.log(newData);
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
          <Button onClick={() => window.confirm('Confirm deleting ' + props.dataItem.TaskName) && remove(props.dataItem)}>
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
        <Column field="start_date" title="Start Date" editor="date" format="{0:d}" />
        <Column cell={MyCommandCell} width="200px" />
      </Grid>
    </div>
  );
};

export default Demo;

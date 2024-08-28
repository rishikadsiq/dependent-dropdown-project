import * as React from 'react';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
// @ts-expect-error
import { sampleProducts } from './shared-gd-sample-products';
// @ts-expect-error

const CustomCell = ({
  tdProps,
  children,
  color
}) => {
  return tdProps ? <td {...tdProps} style={{
    ...tdProps.style,
    backgroundColor: color
  }}>
      {children}
    </td> : null;
};
const MyInputCustomCell = props => <CustomCell {...props} color="red" />;
const MyNumericCustomCell = props => <CustomCell {...props} color="lightgreen" />;
const MyBooleanCustomCell = props => <CustomCell {...props} color="pink" />;
const MyDateCustomCell = props => <CustomCell {...props} color="lightblue" />;
const Demo = () => {
  const [data, setData] = React.useState();
  React.useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("192.168.1.4:5000/metalist", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data = await response.json();
      setData(data);
    }
    fetchData();
  }, []);
  const enterInsert = () => {
    const maxId = data.reduce((acc, current) => Math.max(acc, current.ID || 0), 0);
    const dataItem = {
      ID: maxId + 1,
      inEdit: true
    };
    const newProducts = [dataItem, ...data];
    setData(newProducts);
  };
  const enterEdit = dataItem => {
    const newData = data.map(item => item.ID === dataItem.ID ? {
      ...item,
      inEdit: true
    } : item);
    setData(newData);
  };
  const save = dataItem => {
    const newData = data.map(item => item.ID === dataItem.ID ? {
      ...dataItem,
      inEdit: undefined
    } : item);
    setData(newData);
  };
  const cancel = dataItem => {
    if (!dataItem.ID) {
      setData(data.filter(item => item.ID !== undefined));
    } else {
      const newData = data.map(item => item.ID === dataItem.ID ? {
        ...data.find(p => p.ID === dataItem.ID),
        inEdit: false
      } : item);
      console.log(newData);
      setData(newData);
    }
  };
  const remove = dataItem => {
    setData(data.filter(item => item.ID !== dataItem.ID));
  };
  const itemChange = event => {
    const {
      value,
      field
    } = event;
    if (!field) return;
    const newData = data.map(item => item.ID === event.dataItem.ID ? {
      ...item,
      [field]: value
    } : item);
    setData(newData);
  };
  React.useEffect(() => {
    enterInsert();
  }, []);
  const MyCommandCell = props => <td>
      {!props.dataItem.inEdit ? <>
          <Button themeColor={'primary'} onClick={() => enterEdit(props.dataItem)}>
            Edit
          </Button>
          <Button onClick={() => window.confirm('Confirm deleting ' + props.dataItem.TaskName) && remove(props.dataItem)}>
            Remove
          </Button>
        </> : <>
          <Button themeColor={'primary'} onClick={() => save(props.dataItem)}>
            {props.dataItem.ID ? 'Update' : 'Add'}
          </Button>
          <Button onClick={() => cancel(props.dataItem)}>
            {props.dataItem.ID ? 'Cancel' : 'Discard changes'}
          </Button>
        </>}
    </td>;
  return <div>
      <Grid style={{
      height: '400px'
    }} data={data} onItemChange={itemChange} editField="inEdit" cells={{
      edit: {
        text: MyInputCustomCell,
        numeric: MyNumericCustomCell,
        boolean: MyBooleanCustomCell,
        date: MyDateCustomCell
      }
    }}>
        <GridToolbar>
          <Button title="Add new" type="button" onClick={enterInsert}>
            Add new
          </Button>
        </GridToolbar>
        <Column field="ID" title="Id" editable={false} />
        <Column field="ClientName" title="Client Name" editor="text" />
        <Column field="ProjectName" title="Project Name" editor="text" />
        <Column field="TaskName" title="Task Name" editor="text" />
        <Column field="Mon" title="Mon" editor="numeric" />
        <Column field="Tue" title="Tue" editor="numeric" />
        <Column field="Wed" title="Wed" editor="numeric" />
        <Column field="Thu" title="Thu" editor="numeric" />
        <Column field="Fri" title="Fri" editor="numeric" />
        <Column field="Sat" title="Sat" editor="numeric" />
        <Column field="Sun" title="Sun" editor="numeric" />
        <Column field="StartDate" title="Start Date" editor="date" format="{0:d}" />
        <Column cell={MyCommandCell} width="200px" />
      </Grid>
    </div>;
};
export default Demo;


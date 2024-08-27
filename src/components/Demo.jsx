import * as React from 'react';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
// @ts-expect-error
import { MyCommandCell } from './shared-gd-myCommandCell';
// @ts-expect-error
import { insertItem, getItems, updateItem, deleteItem } from './shared-gd-services';
import { Button } from "@progress/kendo-react-buttons";
const editField = 'inEdit';
// @ts-expect-error

const CommandCell = props => {
  const {
    edit,
    remove,
    add,
    discard,
    update,
    cancel,
    editField
  } = props;
  return <MyCommandCell {...props} edit={edit} remove={remove} add={add} discard={discard} update={update} cancel={cancel} editField={editField} />;
};
const Demo = () => {
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    let newItems = getItems();
    setData(newItems);
  }, []);

  // modify the data in the store, db etc
  const remove = dataItem => {
    const newData = [...deleteItem(dataItem)];
    setData(newData);
  };
  const add = dataItem => {
    dataItem.inEdit = true;
    const newData = insertItem(dataItem);
    setData(newData);
  };
  const update = dataItem => {
    dataItem.inEdit = false;
    const newData = updateItem(dataItem);
    setData(newData);
  };

  // Local state operations
  const discard = () => {
    const newData = [...data];
    newData.splice(0, 1);
    setData(newData);
  };
  const cancel = dataItem => {
    const originalItem = getItems().find(p => p.ProductID === dataItem.ProductID);
    const newData = data.map(item => item.ProductID === originalItem.ProductID ? originalItem : item);
    setData(newData);
  };
  const enterEdit = dataItem => {
    setData(data.map(item => item.ProductID === dataItem.ProductID ? {
      ...item,
      inEdit: true
    } : item));
  };
  const itemChange = event => {
    const newData = data.map(item => item.ProductID === event.dataItem.ProductID ? {
      ...item,
      [event.field || '']: event.value
    } : item);
    setData(newData);
  };
  const addNew = () => {
    const newDataItem = {
      inEdit: true,
      Discontinued: false
    };
    setData([newDataItem, ...data]);
  };
  const commandCellProps = {
    edit: enterEdit,
    remove: remove,
    add: add,
    discard: discard,
    update: update,
    cancel: cancel,
    editField: editField
  };
  return <Grid style={{
    height: '420px'
  }} data={data} onItemChange={itemChange} editField={editField}>
      <GridToolbar>
        <Button title="Add new" themeColor={"primary"} onClick={addNew} type="button">
          Add new
        </Button>
      </GridToolbar>
      <Column field="ProductID" title="Id" width="50px" editable={false} />
      <Column field="ProductName" title="Product Name" width="200px" />
      <Column field="FirstOrderedOn" title="First Ordered" editor="date" format="{0:d}" width="150px" />
      <Column field="UnitsInStock" title="Units" width="120px" editor="numeric" />
      <Column field="Discontinued" title="Discontinued" editor="boolean" />
      <Column cell={props => <CommandCell {...props} {...commandCellProps} />} width="200px" />
    </Grid>;
};
export default Demo;
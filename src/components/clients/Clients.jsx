import * as React from 'react';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import { MyCommandCell } from './shared-gd-myCommandCell';
import { Button } from '@progress/kendo-react-buttons';
import { insertItem, getItems, updateItem, deleteItem } from './shared-gd-services';
import ClientAddForm from './ClientAddForm';

const GridContext = React.createContext({});
const CommandCell = props => {
  const {
    enterEdit,
    remove,
    add,
    discard,
    update,
    cancel,
    editField
  } = React.useContext(GridContext);
  return <MyCommandCell {...props} edit={enterEdit} remove={remove} add={add} discard={discard} update={update} cancel={cancel} editField={editField} />;
};
const App = () => {
  const editField = 'inEdit';
  const [data, setData] = React.useState([
    {
        "email": "pwer1221@gmail.com",
        "id": "286b7aef-a104-4da0-9b2d-fa90aa5dbe15",
        "is_active": true,
        "name": "client2 ytfrtcvt",
        "phone": null
    }
]);
  const [openForm, setOpenForm] = React.useState(false);
  const [editItem, setEditItem] = React.useState({
    id: 1,
  });

  // modify the data in the store, db etc
  const remove = dataItem => {
    const newData = deleteItem(dataItem);
    setData([...newData]);
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
  const discard = dataItem => {
    const newData = [...data];
    newData.splice(0, 1);
    setData(newData);
  };
  const cancel = dataItem => {
    const originalItem = getItems().find(p => p.id === dataItem.id);
    const newData = data.map(item => item.id === originalItem.id ? originalItem : item);
    setData(newData);
  };
  const enterEdit = dataItem => {
    let newData = data.map(item => item.id === dataItem.id ? {
      ...item,
      inEdit: true
    } : item);
    setData(newData);
  };
  const itemChange = event => {
    const field = event.field || '';
    const newData = data.map(item => item.id === event.dataItem.id ? {
      ...item,
      [field]: event.value
    } : item);
    setData(newData);
  };
  
  const handleOpenForm = () => {
    console.log("Open Form");
    setOpenForm(true);
  }


  const handleSubmit = (event) => {
    let newItem = true;
    let newData = data.map((item) => {
      if (event.id === item.id) {
        newItem = false;
        item = {
          ...event,
        };
      }
      return item;
    });
    if (newItem) {
      newData.push(event);
    }
    setData(newData);
    setOpenForm(false);
  };


  const handleCancelEdit = () => {
    setOpenForm(false);
  };

  // React.useState(() => {
  //   const getDataLength = () => {
  //     return data.length;
  //   };
  //   setEditItem(getDataLength()+1)
  // },[data])



  return <GridContext.Provider value={{
    enterEdit,
    remove,
    add,
    discard,
    update,
    cancel,
    editField
  }}>
      <Grid data={data} onItemChange={itemChange} editField={editField} dataItemKey={'id'}>
        <GridToolbar>
          <Button title="Add new" themeColor={'primary'} type="button" onClick={handleOpenForm}>
            Add new
          </Button>
        </GridToolbar>
        <Column field="id" title="Id" width="50px" editable={false} />
        <Column field="name" title="Client Name" />
        <Column field="email" title="Email" />
        <Column field="phone" title="Contact" />
        <Column field='is_active' title="Active" editor='boolean'/>
        {/* <Column field="UnitPrice" title="Price" editor="numeric" />
        <Column field="UnitsInStock" title="Units" editor="numeric" /> */}
        {/* <Column field="CategoryName" title="Category Name" cell={DropDownCell} /> */}
        <Column title="Actions" cell={CommandCell} width="240px" />
      </Grid>
      {openForm && (
        <ClientAddForm
        cancelEdit={handleCancelEdit}
        onSubmit={handleSubmit}
        item={editItem}
        />
      )}
    </GridContext.Provider>;
};
export default App;
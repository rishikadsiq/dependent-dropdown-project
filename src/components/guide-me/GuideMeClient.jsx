import React, { useEffect } from 'react'
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid'
import { Button } from '@progress/kendo-react-buttons'
import AddClient from '../clients/AddClient';
import { useNavigate } from 'react-router-dom';
import { PostRequestHelper } from '../helper/PostRequestHelper';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';


const EditCommandCell = props => {
  return (
    <td>
      <Button
        themeColor={'primary'}
        type="button"
        onClick={() => props.addProject(props.dataItem)}
      >
        Add Project
      </Button>
    </td>
  );
};

const MyEditCommandCell = props => <EditCommandCell {...props} />;

const GuideMeClient = ({setProjectComponent, setClientComponent}) => {
  const [data, setData] = React.useState([])
  const [openAddForm, setOpenAddForm] = React.useState(false);
  const [editItem, setEditItem] = React.useState({
    id: 1
  });
  const [openAddSuccessDialog, setOpenAddSuccessDialog] = React.useState(false);
  const [openExistingDialog, setOpenExistingDialog] = React.useState(false)
  const [confirmNavigate, setConfirmNavigate] = React.useState(false)
  const navigate = useNavigate()

  const addNew = () => {
    localStorage.removeItem('selectedClient')
    setOpenAddSuccessDialog(false)
    setOpenAddForm(true);
    setEditItem({
      id: undefined
    }); // you need to change the logic for adding unique ID value;
  };

  useEffect(() => {
    setOpenAddForm(true)
    setEditItem({
      id: undefined
    }); // you need to change the logic for adding unique ID value;
    getListing();
  }, [])

  const getListing = () => {
    const localData = JSON.parse(localStorage.getItem('guideMeClientData'));
    if (localData) {
      const updatedData = localData.map((client, index) =>{
        return {
          ...client,
          new_id: index+1
        }
      })
      setData(updatedData);
    }
  }

  const handleSubmit = event => {
    let newItem = true;
    let newData = data.map(item => {
      if (event.id === item.id) {
        newItem = false;
        item = {
          ...event
        };
      }
      return item;
    });
    if (newItem) {
      console.log(event)
      const fetchData = async () => {
        try {
          delete event.id
          console.log(event);
          const data1 = await PostRequestHelper('addclient', event, navigate);
          if (data1.status === 201) {
            localStorage.setItem('selectedClient', JSON.stringify({ 'name': data1.name, 'id': data1.id, 'phone': data1.phone, 'email': data1.email, 'is_active': data1.is_active }));
            const localData = JSON.parse(localStorage.getItem('guideMeClientData'))
            if (localData) {
              localStorage.setItem('guideMeClientData', JSON.stringify([...localData, { 'name': data1.name, 'id': data1.id, 'phone': data1.phone, 'email': data1.email, 'is_active': data1.is_active }]))
            } else {
              localStorage.setItem('guideMeClientData', JSON.stringify([{ 'name': data1.name, 'id': data1.id, 'phone': data1.phone, 'email': data1.email, 'is_active': data1.is_active }]))
            }
            getListing()
            setOpenAddForm(false);
            setOpenAddSuccessDialog(true)
          }
          else if (data1.status === 409 || data1.status === 400) {
            console.log('fsdjksnfkj')
          }
          console.log(data1);
          setOpenAddForm(false);
        } catch (err) {
          console.error('Error fetching data:', err);
          setOpenAddForm(false);
        }
      }
      fetchData(); // Call the function to fetch data
      
    }
  }

  const handleCancelEdit = () => {
    localStorage.removeItem('selectedClient')
    setOpenAddForm(false);
  }

  const handleAddProject = (dataItem) => {
    localStorage.setItem('selectedClient', JSON.stringify({ 'name': dataItem.name, 'id': dataItem.id }))
  }

  const toggleAddSuccessDialog = () => {
    setOpenAddSuccessDialog(false)
  }

  return (
    <div>
        <div>
          <h4>Clients</h4>
        </div>
        <Grid data={data}>
          <GridToolbar>
            <Button title='Add new' type='button' onClick={addNew}>Add New</Button>
          </GridToolbar>
          <Column field="new_id" title="ID" />
          <Column field='name' title='Client Name' />
          <Column field='email' title='Email' />
          <Column field='phone' title='Phone' />
          <Column title='Actions' cell={props => <MyEditCommandCell {...props} addProject={handleAddProject} />} />
        </Grid>
        {openAddForm && <AddClient cancelEdit={handleCancelEdit} onSubmit={handleSubmit} item={editItem} />}
        <div className='d-flex justify-content-between align-items-center mt-3'>
          <Button themeColor={'primary'} disabled> Previous</Button>
          <Button themeColor={'primary'} disabled={!data.length} onClick={() => {
            setClientComponent(false)
            setProjectComponent(true)
          }}>Next</Button>
        </div>
        {openAddSuccessDialog && (
            <Dialog title={"Message"} onClose={toggleAddSuccessDialog} width={350}>
                <div>
                The client you added recently is already exist. To add other client, click <strong>'Add Client'</strong>. If you'd like to add a project, click <strong>'Next'</strong>.
                </div>
                <DialogActionsBar>
                    <Button onClick={addNew}>Add Client</Button>
                    <Button onClick={() => {
                      setOpenAddSuccessDialog(false)
                      setClientComponent(false)
                      setProjectComponent(true)
                    }}>Next</Button>
                </DialogActionsBar>
            </Dialog>
        )}
         <style>
              {`.k-animation-container {
                  z-index: 10003;
              }`}
          </style>
    </div>
  )
}

export default GuideMeClient;

import * as React from 'react';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import { Button } from "@progress/kendo-react-buttons";
import {GetRequestHelper} from '../helper/GetRequestHelper'
import { PostRequestHelper } from '../helper/PostRequestHelper';
import Alerts from '../alerts/Alerts';
import HeaderLayout from '../home/HeaderLayout';
import { useNavigate } from 'react-router-dom';


const EditCommandCell = props => {
  const { status } = props.dataItem;

  return (
    <td>
      {/* Show button appears for multiple statuses */}
      {['REJECTED', 'APPROVED', 'RECALLED', 'PENDING'].includes(status) && (
        <Button
          themeColor={'primary'}
          type="button"
          style={{ marginRight: '10px' }} // Adds spacing between buttons
          onClick={() => props.enterEdit(props.dataItem)}
        >
          Show
        </Button>
      )}

      {/* Additional buttons for specific statuses */}
      {status === 'RECALLED' && (
        <Button
          themeColor={'primary'}
          type="button"
          onClick={() => props.AcceptRecall(props.dataItem)}
        >
          Accept Recall
        </Button>
      )}

      {status === 'PENDING' && (
        <Button
          themeColor={'primary'}
          type="button"
          onClick={() => props.ApproveTimesheet(props.dataItem)}
        >
          Approve
        </Button>
      )}
    </td>
  );
};

const MyEditCommandCell = props => <EditCommandCell {...props} enterEdit={props.enterEdit} />;
const Approvals = () => {
    const [data, setData] = React.useState([]);
    const [showAlert, setShowAlert] = React.useState(false)
    const [message, setMessage] = React.useState("")
    const [variant, setVariant] = React.useState(null)
    
    const navigate = useNavigate();
    

  const getListing = async() => {
    try {
        const data1 = await GetRequestHelper('approverlist', navigate);
        console.log(data1);
        if (data1.status === 404) {
            setData([]);
        } else {
            console.log(data1)
            const updatedData = data1.timesheets.map((item, index) => ({
                ...item, // Spread the other properties
                new_id: index+1,
                start_date: item.start_date ? new Date(item.start_date) : null,
                end_date: item.end_date ? new Date(item.end_date) : null,
            }));
            console.log(updatedData);
            
            setData(updatedData || []);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        setData([]); // Handle error case by setting an empty array or some default data
    }
};

  React.useEffect(() => {
    getListing(); // Call the function to fetch data
}, []);

  const enterEdit = item => {
    navigate(`/approval/${item.id}`)
  }

  const ApproveTimesheet = async(item) => {
    try {
      const response = await PostRequestHelper('approvetimesheet', {timesheet_id: item.id}, navigate);
        if(response.status === 201) {
          setShowAlert(true)
          setMessage(response.message)
          setVariant('success')
          getListing()
        }
    } catch (error) {
        console.error('Error approving timesheet:', error);
        setShowAlert(true)
        setMessage("Error Approving Timesheet")
        setVariant('error')
    }
  }

  const AcceptRecall = async(item) => {
    try {
      const response = await PostRequestHelper('acceptrecallrequest', {timesheet_id: item.id}, navigate);
        if(response.status === 201) {
          setShowAlert(true)
          setMessage(response.message)
          setVariant('success')
          getListing()
        }
    } catch (error) {
        console.error('Error accepting recall:', error);
        setShowAlert(true)
        setMessage("Error Accepting Recall")
        setVariant('error')
    }
  }

  return <React.Fragment>
            <HeaderLayout>
            {showAlert && (
                <div className='container'>
                <Alerts showAlert={showAlert} setShowAlert={setShowAlert} message={message} variant={variant} />
                </div>
            )}
            
            {/* Main content with header and grid */}
            <div className='mt-3 mb-3' style={{ paddingTop: showAlert ? '60px' : '0' }}>
                <h4>Approvals</h4>
            </div>
            <Grid data={data}>
                
                <Column field="new_id" title="ID" />
                <Column field='name' title='Timesheet Name' />
                <Column field='start_date' title='Start Date' format="{0:d}"/>
                <Column field='end_date' title='End Date' format="{0:d}"/>
                <Column field='employee_name'  title='Employee Name'/>
                <Column field='status' title='Status' />
                <Column title='Actions' cell={props => <MyEditCommandCell {...props} enterEdit={enterEdit} ApproveTimesheet={ApproveTimesheet} AcceptRecall={AcceptRecall}/>} />
            </Grid>
            
            

            <style>
                {`.k-animation-container {
                    z-index: 10003;
                }`}
            </style>
            </HeaderLayout>
        </React.Fragment>;
};
export default Approvals;
import * as React from 'react';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import {PostRequestHelper} from  '../helper/PostRequestHelper'
import { useNavigate } from 'react-router-dom';
import HeaderLayout from '../home/HeaderLayout'
import { useParams } from 'react-router-dom';
import { Button } from '@progress/kendo-react-buttons';
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { TextArea } from '@progress/kendo-react-inputs';
import { filterBy } from "@progress/kendo-data-query";

const ApprovalTimesheet = () => {
  const initialFilter = {
    logic: "and", // or "or"
    filters: []
  };
  const initialDataState = {
    skip: 0,
    take: 10,
  };
    const [filter, setFilter] = React.useState(initialFilter);
  const [data, setData] = React.useState([]);
  const [timesheetData, setTimesheetData] = React.useState([]);
  const [page, setPage] = React.useState(initialDataState);
    const [pageSizeValue, setPageSizeValue] = React.useState();
    const pageChange = (event) => {
      const targetEvent = event.targetEvent;
      const take =
        targetEvent.value === "All" ? data.length : event.page.take;
      if (targetEvent.value) {
        setPageSizeValue(targetEvent.value);
      }
      setPage({
        ...event.page,
        take,
      });
    };
 

  const { timesheetId } = useParams();
  const navigate = useNavigate();
  const requiredValidator = value => value ? "" : "Error: This field is required.";


 
  const getListing = async () => {
    try {
      const data1 = await PostRequestHelper('taskhourslist', { timesheet_id: timesheetId }, navigate);
      const updatedData = data1.taskhours.map((item, index) => ({
        ...item,
        new_id: index + 1,
      }));
      setData(updatedData || []);
      setTimesheetData([data1.timesheet_details])
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
    }
  };

  React.useEffect(() => {
    getListing();
  }, []);

  const handleRejectSubmit = async (event) => {

    try {
      const response = await PostRequestHelper('rejecttimesheet', { timesheet_id: timesheetId, feedback: event.feedback }, navigate);
      if (response.status === 201) {
        alert('Timesheet rejected successfully');
        navigate(`/approvals`);
      }
    } catch (error) {
      console.error('Error rejecting timesheet:', error);
    }
  }

  const handleApproveTimesheet =  async() => {
    try {
      const response = await PostRequestHelper('approvetimesheet', { timesheet_id: timesheetId }, navigate);
      if (response.status === 201) {
        alert('Timesheet approved successfully');
        getListing()
        navigate(`/approvals`);
      }
    } catch (error) {
      console.error('Error approving timesheet:', error);
    }
  }


  return (
    <div>
          <HeaderLayout>
            {/* Main content with header and grid */}
            <div className='mt-3 mb-3'>
                <h4>Approval Timesheet Data</h4>
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
               data={filterBy(data, filter).slice(page.skip, page.take + page.skip)}
               skip={page.skip}
               take={page.take}
               total={data.length}
               pageable={{
                 buttonCount: 4,
                 pageSizes: [5, 10, 15, "All"],
                 pageSizeValue: pageSizeValue,
               }}
               onPageChange={pageChange}
              navigatable={true}
              filterable={true}
              filter={filter}
              onFilterChange={(e) => setFilter(e.filter)}
            >
              <Column field="new_id" title="Id" width={"50px"}/>
              <Column field="client_name" title="Client Name" />
              <Column field="project_name" title="Project Name" />
              <Column field="task_name" title="Task Name" />
              <Column field="mon" title="Mon" />
              <Column field="tue" title="Tue" />
              <Column field="wed" title="Wed" />
              <Column field="thu" title="Thu" />
              <Column field="fri" title="Fri" />
              <Column field="sat" title="Sat" />
              <Column field="sun" title="Sun" />
            </Grid>

            {(timesheetData[0]?.approval === 'PENDING') && (
                    <div className='mt-3'>
                      <div className='mb-3'>
                      <Form onSubmit={handleRejectSubmit} render={formRenderProps =>
                        <FormElement>
                          <fieldset className={'k-form-fieldset'}>
                            <label>Description</label>
                            <Field
                              id={'feedback'}
                              name={'feedback'}
                              label={'Feedback *'}
                              component={TextArea}
                              validator={requiredValidator}
                            />
                            <div className="d-flex justify-content-between align-items-center mt-3">
                              <Button
                                themeColor={"error"}
                                type={"submit"}
                                disabled={!formRenderProps.allowSubmit}
                              >
                                Reject
                              </Button>
                              <Button
                                themeColor={"success"}
                                onClick={handleApproveTimesheet}
                              >
                                Approve
                              </Button>
                            </div>
                          </fieldset>
                        </FormElement>} />
                    </div>
                    </div>
                  )}
            <style>
                {`.k-animation-container {
                    z-index: 10003;
                }`}
            </style>
      </HeaderLayout>
    </div>
  );
};

export default ApprovalTimesheet;

import * as React from "react";
import { Dialog } from "@progress/kendo-react-dialogs";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { Input } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { GetRequestHelper } from "../helper/GetRequestHelper";
import { RadioGroup } from "@progress/kendo-react-inputs";
import { Checkbox } from "@progress/kendo-react-inputs"


const EditForm = (props) => {
  const [approverData, setApproverData] = React.useState([]);
  const [supervisorData, setSupervisorData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const genderData = [
    { label: 'Female', value: 'female' },
    { label: 'Male', value: 'male' },
    { label: 'Other', value: 'other' }
  ];

  const requiredValidator = (value) =>
    value ? "" : "Error: This field is required.";

  const getMetaData = async () => {
    try {
      const response = await GetRequestHelper("userlist");
      if (response.status === 404) {
        setApproverData([])
        setSupervisorData([])
      } else {
        const updatedDataApprover = response.users.map(user => {
          return {
            approver_id: user.id,
            approver_name: user.name,
          };
        });
        const updatedDataSupervisor = response.users.map(user => {
          return {
            supervisor_id: user.id,
            supervisor_name: user.name,
          };
        });
        setApproverData(updatedDataApprover)
        setSupervisorData(updatedDataSupervisor)
      }
    } catch (err) {
      console.error("Error fetching metadata:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getMetaData();
  }, []);

  // Custom rendering function for the DatePicker component
  

  const emailRegex = new RegExp(/\S+@\S+\.\S+/);
  const emailValidator = (value) =>
    emailRegex.test(value) ? "" : "Please enter a valid email.";
  const EmailInput = (props) => {
    const { validationMessage, visited, ...rest } = props;
    
    return (
      <div>
        <Input {...rest} />
        {visited && validationMessage && <div className="k-form-error">{validationMessage}</div>}
      </div>
    );
  };

  const ApproverDropDown = (fieldRenderProps) => {
    // Find the initial project based on the project_id in initialValues
    const selectedApprover = approverData.find(
      (user) => user.approver_id === fieldRenderProps.value
    );
  
    return (
      <div>
        <label className="k-label">{fieldRenderProps.label}</label>
        <DropDownList
          data={fieldRenderProps.data}
          textField="approver_name"
          dataItemKey="approver_id"
          value={selectedApprover || null} // Set the selected value
          onChange={(e) => fieldRenderProps.onChange({ value: e.value.approver_id })}
          name={fieldRenderProps.name}
        />
        {fieldRenderProps.visited && fieldRenderProps.error && (
          <div className="k-required">{fieldRenderProps.error}</div>
        )}
      </div>
    );
  };

  const SupervisorDropDown = (fieldRenderProps) => {
    // Find the initial project based on the project_id in initialValues
    const selectedSupervisor = supervisorData.find(
      (user) => user.supervisor_id === fieldRenderProps.value
    );
  
    return (
      <div>
        <label className="k-label">{fieldRenderProps.label}</label>
        <DropDownList
          data={fieldRenderProps.data}
          textField="supervisor_name"
          dataItemKey="supervisor_id"
          value={selectedSupervisor || null} // Set the selected value
          onChange={(e) => fieldRenderProps.onChange({ value: e.value.supervisor_id })}
          name={fieldRenderProps.name}
        />
        {fieldRenderProps.visited && fieldRenderProps.error && (
          <div className="k-required">{fieldRenderProps.error}</div>
        )}
      </div>
    );
  };

  const CheckBoxField = (fieldRenderProps) => (
    <div>
      <label className="k-label">{fieldRenderProps.label}</label>
      <Checkbox
        checked={fieldRenderProps.value}
        onChange={(e) => fieldRenderProps.onChange({ value: e.target.checked })}
        name={fieldRenderProps.name}
      />
      {fieldRenderProps.visited && fieldRenderProps.error && (
        <div className="k-required">{fieldRenderProps.error}</div>
      )}
    </div>
  );
  

  return (
    <Dialog title={`Edit User`} onClose={props.cancelEdit}>
      <Form
        onSubmit={props.onSubmit}
        initialValues={{ approver_id: props.item.approver_id, supervisor_id: props.item.supervisor_id, ...props.item }}

        render={(formRenderProps) => (
          <FormElement style={{ maxWidth: 650 }}>
            <fieldset className={"k-form-fieldset"}>
            <div className="mb-3">
                <Field
                  name={"firstname"}
                  component={Input}
                  label={"First Name *"}
                  validator={requiredValidator}
                />
              </div>
              <div className="mb-3">
                <Field
                  name={"lastname"}
                  component={Input}
                  label={"Last Name"}
                />
              </div>
              <div className="mb-3">
                <Field
                  name={"email"}
                  type={"email"}
                  component={EmailInput}
                  label={"Email *"}
                  validator={emailValidator}
                />
              </div>
              <div>
                <label>Gender *</label>
                <Field
                  name={"gender"}
                  component={RadioGroup}
                  data={genderData}
                  label="Gender *"
                  layout={"horizontal"}
                  validator={requiredValidator}
                />
              </div>
              <div className="mb-3">
                <Field
                  name={"role"}
                  component={Input}
                  label={"Role *"}
                  validator={requiredValidator}
                />
              </div>
              <div className="mb-3">
                {!loading && (
                  <Field
                    name={"approver_id"} // Change to project_id
                    label={"Approver Name *"}
                    component={ApproverDropDown}
                    data={approverData}
                    validator={requiredValidator}
                  />
                )}
              </div>
              <div className="mb-3">
                {!loading && (
                  <Field
                    name={"supervisor_id"} // Change to project_id
                    label={"Supervisor Name *"}
                    component={SupervisorDropDown}
                    data={supervisorData}
                    validator={requiredValidator}
                  />
                )}
              </div>

             
              <div className="mb-3">
                <Field
                  name={"is_active"}
                  label={"Active"}
                  component={CheckBoxField} // Use custom CheckBoxField renderer
                />
              </div>
            </fieldset>
            <div className="k-form-buttons">
              <Button
                disabled={!formRenderProps.allowSubmit}
                themeColor={"primary"}
              >
                Update
              </Button>
              <Button type={"button"} onClick={props.cancelEdit}>
                Cancel
              </Button>
            </div>
          </FormElement>
        )}
      />
    </Dialog>
  );
};

export default EditForm;

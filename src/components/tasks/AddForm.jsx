import * as React from "react";
import { Dialog } from "@progress/kendo-react-dialogs";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { Input } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { GetRequestHelper } from "../helper/GetRequestHelper";
import { useNavigate } from "react-router-dom";

const EditForm = (props) => {
  const [projectData, setProjectData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate()


  // Validator function to ensure required fields are filled
  const requiredValidator = (value) => (value ? "" : "Error: This field is required.");

  // Fetch client and project metadata
  const getMetaData = async () => {
    try {
      const response = await GetRequestHelper("projectlist", navigate);
      if (response.status === 404) {
        setProjectData([]);
      } else {
        setProjectData(response.projects);
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

  // Custom rendering function for DatePicker component
  const DatePickerField = (fieldRenderProps) => (
    <div>
      <label className="k-label">{fieldRenderProps.label}</label>
      <DatePicker
        value={fieldRenderProps.value}
        onChange={(e) => fieldRenderProps.onChange({ value: e.value })}
        name={fieldRenderProps.name}
        format="dd/MM/yyyy"
      />
      {fieldRenderProps.visited && fieldRenderProps.error && (
        <div className="k-required">{fieldRenderProps.error}</div>
      )}
    </div>
  );

 

  

  return (
    <Dialog title={`Add Task`} onClose={props.cancelEdit}>
      <Form
        onSubmit={props.onSubmit}
        initialValues={{ client_id: null, project_id: null, ...props.item }}
        render={(formRenderProps) => (
          <FormElement style={{ maxWidth: 650 }}>
            <fieldset className={"k-form-fieldset"}>
              <div className="mb-3">
                <Field
                  name={"name"}
                  component={Input}
                  label={"Task Name *"}
                  validator={requiredValidator}
                />
              </div>
              
              <div className="mb-3">
                {!loading && (
                  <Field
                    name={"project_id"}
                    component={DropDownList}
                    data={projectData}
                    textField="name"
                    dataItemKey="project_id"
                    label="Project Name"
                    validator={requiredValidator}
                  />
                )}
              </div>
              <div className="mb-3">
                <Field
                  name={"start_date"}
                  label={"Start Date"}
                  component={DatePickerField}
                />
              </div>
              <div className="mb-3">
                <Field
                  name={"end_date"}
                  label={"End Date"}
                  component={DatePickerField}
                />
              </div>
              
              
            </fieldset>
            <div className="k-form-buttons">
              <Button disabled={!formRenderProps.allowSubmit} themeColor={"primary"}>
                Add
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

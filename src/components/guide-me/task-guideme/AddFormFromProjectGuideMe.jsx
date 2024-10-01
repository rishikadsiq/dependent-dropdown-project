import * as React from "react";
import { Dialog } from "@progress/kendo-react-dialogs";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { Input } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { useNavigate } from "react-router-dom";


const AddFormFromProjectGuideMe = (props) => {
  const [projectData, setProjectData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate()


  const requiredValidator = (value) =>
    value ? "" : "Error: This field is required.";

  const getMetaData = async () => {
    try {
      const localData = JSON.parse(localStorage.getItem('guideMeProjectData'));
      if(localData){
        const updatedData = localData.map(project => {
          return {
            project_id: project.id,
            project_name: project.name, // Change this line
          };
        });
        setProjectData(updatedData);
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
  const DatePickerField = (fieldRenderProps) => (
    <div>
      <label className="k-label">{fieldRenderProps.label}</label>
      <DatePicker
        value={fieldRenderProps.value}
        onChange={(e) => fieldRenderProps.onChange({ value: e.value })}
        name={fieldRenderProps.name}
        format="dd/MM/yyyy" // Set format for date display
      />
      {fieldRenderProps.visited && fieldRenderProps.error && (
        <div className="k-required">{fieldRenderProps.error}</div>
      )}
    </div>
  );

  
  const ProjectDropDown = (fieldRenderProps) => {
    // Find the initial project based on the project_id in initialValues
    const selectedProject = projectData.find(
      (project) => project.project_id === fieldRenderProps.value
    );
  
    return (
      <div>
        <label className="k-label">{fieldRenderProps.label}</label>
        <DropDownList
          data={fieldRenderProps.data}
          textField="project_name"
          dataItemKey="project_id"
          value={selectedProject || null} // Set the selected value
          onChange={(e) => fieldRenderProps.onChange({ value: e.value.project_id })}
          name={fieldRenderProps.name}
        />
        {fieldRenderProps.visited && fieldRenderProps.error && (
          <div className="k-required">{fieldRenderProps.error}</div>
        )}
      </div>
    );
  };
  

  return (
    <Dialog title={`Add Task`} onClose={props.cancelEdit}>
      <Form
        onSubmit={props.onSubmit}
        initialValues={{ project_id: props.item.project_id, ...props.item }}

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
                    name={"project_id"} // Change to project_id
                    label={"Project Name *"}
                    component={ProjectDropDown}
                    data={projectData}
                    validator={requiredValidator}
                  />
                )}
              </div>

              <div className="mb-3">
                <Field
                  name={"start_date"}
                  label={"Start Date"}
                  component={DatePickerField} // Use custom DatePickerField renderer
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
              <Button
                disabled={!formRenderProps.allowSubmit}
                themeColor={"primary"}
              >
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

export default AddFormFromProjectGuideMe;

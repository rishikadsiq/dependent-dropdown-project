import * as React from "react";
import { Dialog } from "@progress/kendo-react-dialogs";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { Input } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { useNavigate } from "react-router-dom";


const AddFormFromClientGuideMe = (props) => {
  const [clientData, setClientData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate()

  const requiredValidator = (value) =>
    value ? "" : "Error: This field is required.";

  const getMetaData = () => {
    try {
      const localData = JSON.parse(localStorage.getItem('guideMeClientData'));
      console.log(localData)
      if(localData){
        console.log(localData)
        const updatedData = localData.map(client => {
          return {
            client_id: client.id,
            client_name: client.name,
          };
        });
        console.log(updatedData)
        setClientData(updatedData);
        
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

  
  const ClientDropDown = (fieldRenderProps) => {
    // Find the initial client based on the client_id in initialValues
    const selectedClient = clientData.find(
      (client) => client.client_id === fieldRenderProps.value
    );
  
    return (
      <div>
        <label className="k-label">{fieldRenderProps.label}</label>
        <DropDownList
          data={fieldRenderProps.data}
          textField="client_name"
          dataItemKey="client_id"
          value={selectedClient || null} // Set the selected value
          onChange={(e) => fieldRenderProps.onChange({ value: e.value.client_id })}
          name={fieldRenderProps.name}
        />
        {fieldRenderProps.visited && fieldRenderProps.error && (
          <div className="k-required">{fieldRenderProps.error}</div>
        )}
      </div>
    );
  };
  

  return (
    <Dialog title={`Add Project`} onClose={props.cancelEdit}>
      <Form
        onSubmit={props.onSubmit}
        initialValues={{ client_id: props.item.client_id, ...props.item }}

        render={(formRenderProps) => (
          <FormElement style={{ maxWidth: 650 }}>
            <fieldset className={"k-form-fieldset"}>
              <div className="mb-3">
                <Field
                  name={"name"}
                  component={Input}
                  label={"Project Name *"}
                  validator={requiredValidator}
                />
              </div>
              <div className="mb-3">
                {!loading && (
                  <Field
                    name={"client_id"} // Change to client_id
                    label={"Client Name *"}
                    component={ClientDropDown}
                    data={clientData}
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

export default AddFormFromClientGuideMe;
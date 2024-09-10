import * as React from "react";
import { Dialog } from "@progress/kendo-react-dialogs";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { Input } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { GetRequestHelper } from "../helper/GetRequestHelper";
import { DatePicker } from "@progress/kendo-react-dateinputs";

const AddForm = (props) => {
  const [clientData, setClientData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const requiredValidator = (value) =>
    value ? "" : "Error: This field is required.";

  const getMetaData = async () => {
    try {
      const response = await GetRequestHelper("clientlist");
      if (response.status === 404) {
        setClientData([]);
      } else {
        setClientData(response.clients);
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

  return (
    <Dialog title={`Add Project`} onClose={props.cancelEdit}>
      <Form
        onSubmit={props.onSubmit}
        initialValues={props.item}
        render={(formRenderProps) => (
          <FormElement style={{ maxWidth: 650 }}>
            <fieldset className={"k-form-fieldset"}>
              <div className="mb-3">
                <Field
                  name={"name"}
                  component={Input}
                  label={"Project Name"}
                  validator={requiredValidator}
                />
              </div>
              <div className="mb-3">
                {!loading && (
                  <Field
                    name={"client_id"}
                    component={DropDownList}
                    data={clientData}
                    textField="name"
                    dataItemKey="client_id"
                    label="Client Name"
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

export default AddForm;

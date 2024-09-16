import * as React from "react";
import { Dialog } from "@progress/kendo-react-dialogs";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { Button } from "@progress/kendo-react-buttons";
import { DatePicker } from "@progress/kendo-react-dateinputs";

const EditForm = (props) => {

  // Validator function to ensure required fields are filled
  const requiredValidator = (value) => (value ? "" : "Error: This field is required.");

  

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
    <Dialog title={`Add Timesheet`} onClose={props.cancelEdit}>
      <Form
        onSubmit={props.onSubmit}
        initialValues={{ ...props.item }}
        render={(formRenderProps) => (
          <FormElement style={{ maxWidth: 650 }}>
            <fieldset className={"k-form-fieldset"}>
             
              <div className="mb-3">
                <Field
                  name={"date"}
                  label={"Date *"}
                  component={DatePickerField}
                  validator={requiredValidator}
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

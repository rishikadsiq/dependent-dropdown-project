import * as React from "react";
import { Dialog } from "@progress/kendo-react-dialogs";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { Input, NumericTextBox } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import { Error } from "@progress/kendo-react-labels";

const AddClientGuideMe = props => {

  const emailRegex = new RegExp(/\S+@\S+\.\S+/);
  const emailValidator = (value) =>
    emailRegex.test(value) ? "" : "Please enter a valid email.";
  const EmailInput = (fieldRenderProps) => {
    const { validationMessage, visited, ...others } = fieldRenderProps;
    return (
      <div>
        <Input {...others} />
        {visited && validationMessage && <Error>{validationMessage}</Error>}
      </div>
    );
  };
  
  const requiredValidator = (value) =>
    value ? "" : "Error: This field is required.";

  return <Dialog title={`Add Client`} onClose={props.cancelEdit}>
        <Form onSubmit={props.onSubmit} initialValues={props.item} render={formRenderProps => <FormElement style={{
      maxWidth: 650
    }}>
              <fieldset className={"k-form-fieldset"}>
                <div className="mb-3">
                  <Field name={"name"} component={Input} label={"Client Name *"} validator={requiredValidator}/>
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
                <div className="mb-3">
                  <Field name={"phone"} component={Input} label={"Phone"}/>
                </div>
              </fieldset>
              <div className="k-form-buttons">
                <Button disabled={!formRenderProps.allowSubmit} themeColor={'primary'}>
                  Add
                </Button>
                <Button type={"submit"} onClick={props.cancelEdit}>
                  Cancel
                </Button>
              </div>
            </FormElement>} />
      </Dialog>;
};
export default AddClientGuideMe;
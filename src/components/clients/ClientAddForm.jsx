import * as React from "react";
import { Dialog } from "@progress/kendo-react-dialogs";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { Input, NumericTextBox } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
const ClientAddForm = props => {
  return <Dialog title={`Add Client`} onClose={props.cancelEdit}>
        <Form onSubmit={props.onSubmit} initialValues={props.item} render={formRenderProps => <FormElement style={{
      maxWidth: 650
    }}>
              <fieldset className={"k-form-fieldset"}>
                <div className="mb-3">
                  <Field name={"firstname"} component={Input} label={"First Name"} />
                </div>
                <div className="mb-3">
                  <Field name={"lastname"} component={Input} label={"Last Name"} />
                </div>
                <div className="mb-3">
                  <Field name={"email"} component={Input} label={"Email"} />
                </div>
                <div className="mb-3">
                  <Field name={"phone"} component={Input} label={"Contact"} />
                </div>
              </fieldset>
              <div className="k-form-buttons">
                <Button disabled={!formRenderProps.allowSubmit} themeColor={'primary'}>
                  Update
                </Button>
                <Button type={"submit"} onClick={props.cancelEdit}>
                  Cancel
                </Button>
              </div>
            </FormElement>} />
      </Dialog>;
};
export default ClientAddForm;
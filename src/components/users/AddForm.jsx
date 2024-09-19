import * as React from "react";
import { Dialog } from "@progress/kendo-react-dialogs";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { Input } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { GetRequestHelper } from "../helper/GetRequestHelper";
import { RadioGroup } from "@progress/kendo-react-inputs";
import { useNavigate } from "react-router-dom";

const genderData = [
  { label: 'Female', value: 'female' },
  { label: 'Male', value: 'male' },
  { label: 'Other', value: 'other' }
];

const EditForm = (props) => {
  const [userData, setUserData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate()


  // Validator function to ensure required fields are filled
  const requiredValidator = (value) => (value ? "" : "Error: This field is required.");

  // Fetch client and user metadata
  const getMetaData = async () => {
    try {
      const response = await GetRequestHelper("userlist", navigate);
      if (response.status === 404) {
        setUserData([]);
      } else {
        setUserData(response.users);
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

  // Custom rendering function for EmailInput component
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
  
  return (
    <Dialog title={`Add Task`} onClose={props.cancelEdit}>
      <Form
        onSubmit={props.onSubmit}
        initialValues={{ ...props.item }}
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
                    name={"approver_id"}
                    component={DropDownList}
                    data={userData}
                    textField="name"
                    dataItemKey="approver_id"
                    label="Approver Name *"
                    validator={requiredValidator}
                  />
                )}
              </div>
              <div className="mb-3">
                {!loading && (
                  <Field
                    name={"supervisor_id"}
                    component={DropDownList}
                    data={userData}
                    textField="name"
                    dataItemKey="supervisor_id"
                    label="Supervisor Name *"
                    validator={requiredValidator}
                  />
                )}
              </div>
              <div className="mb-3">
                <Field
                  name={"password"}
                  component={Input}
                  label={"Password *"}
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

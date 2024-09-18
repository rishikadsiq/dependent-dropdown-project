import React from 'react';
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { Button } from "@progress/kendo-react-buttons";
import { Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { RadioGroup } from "@progress/kendo-react-inputs";
import Alerts from '../alerts/Alerts';

import {
  FormInput,
  FormMaskedTextBox,
} from './form-components'

import {
  requiredValidator,
  emailValidator,
  passwordValidator,
  phoneValidator,
  confirmPasswordValidator,

} from './validators'

const Signup = () => {
  const navigate = useNavigate()
  const [showAlert, setShowAlert] = React.useState(false)
  const [message, setMessage] = React.useState("")
  const [variant, setVariant] = React.useState(null)
  const genderData = [
    { label: 'Female', value: 'female' },
    { label: 'Male', value: 'male' },
    { label: 'Other', value: 'other' }
  ];

  const handleSubmit = async (formData) => {
    console.log("Sign Up form submitted", formData)
    const response = await fetch("http://127.0.0.1:5000/register", {
      method: 'POST',
      body: JSON.stringify({
        company_name: formData.company_name,
        email: formData.email,
        firstname: formData.first_name,
        lastname: formData.last_name,
        gender: formData.gender,
        phone: formData.phone,
        password: formData.password
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response1 = await response.json()
    console.log(response1)
    if (response1.status===201) {
      console.log("Form data submitted successfully!");
      setMessage(response1.message)
      setShowAlert(true)
      setVariant("success")
      navigate('/login');
    } else if(response1.status === 409){
      console.log(response1.message)
      setMessage(response1.message)
      setShowAlert(true)
      setVariant("danger")
    }else {
      console.error("Failed to submit form data:", response.message);
    }
  }

  return (
    <Container className='vh-100 mt-3 mb-5'>
      {showAlert && (
                <div>
                <Alerts showAlert={showAlert} setShowAlert={setShowAlert} message={message} variant={variant} />
                </div>
            )}
      <div className="d-flex align-items-center justify-content-center vh-100 h4 flex-column">
        <h1>Get started with TimeChronos</h1>
        <p>Create a free account to start tracking time and superchange</p>
        <h3>Sign Up</h3>
        <Card className="border shadow-sm mt-3" style={{ width: '30%' }}>
          <div className='p-4'>
            <Form onSubmit={handleSubmit} render={formRenderProps =>
              <FormElement>
                <fieldset className={'k-form-fieldset'}>

                  <Field
                    id={'company_name'}
                    name={'company_name'}
                    label={'Company Name *'}
                    component={FormInput}
                    validator={requiredValidator}
                  />
                  <Field
                    id={'email'}
                    name={'email'}
                    label={'Email *'}
                    component={FormInput}
                    validator={emailValidator}
                  />

                  <Field
                    id={'first_name'}
                    name={'first_name'}
                    label={'First Name *'}
                    component={FormInput}
                    validator={requiredValidator}
                  />
                  <Field
                    id={'last_name'}
                    name={'last_name'}
                    label={'Last Name'}
                    component={FormInput}
                    validator={requiredValidator}
                  />

                <label className='mt-3'>Gender *</label>
                <Field
                  name={"gender"}
                  component={RadioGroup}
                  data={genderData}
                  label="Gender *"
                  layout={"horizontal"}
                  validator={requiredValidator}
                />
                  <Field
                    id={'phone'}
                    name={'phone'}
                    label={'Phone Number *'}
                    component={FormMaskedTextBox}
                    validator={phoneValidator}
                  />
                  <Field
                    id={'password'}
                    name={'password'}
                    label={'Password *'}
                    type={'password'}
                    component={FormInput}
                    validator={passwordValidator}
                  />
                  <Field
                    id={'retype_password'}
                    name={'retype_password'}
                    label={'Re-type Password *'}
                    type={'password'}
                    component={FormInput}
                    validator={confirmPasswordValidator}
                  />

                  <div className="k-form-buttons">
                    <Button
                      themeColor={"primary"}
                      type={"submit"}
                      disabled={!formRenderProps.allowSubmit}
                    >
                      Sign Up
                    </Button>
                    <Button onClick={formRenderProps.onFormReset}>Cancel</Button>
                  </div>
                  <Card.Text className="mt-3" style={{ fontWeight: 'normal' }}>
                    Already have an account? <span className="text-decoration-underline text-info" onClick={() => navigate('/login')} style={{ cursor: "pointer" }}>Login</span>
                  </Card.Text>
                </fieldset>
              </FormElement>} />
          </div>
        </Card>
      </div>
    </Container>
  );
};

export default Signup;
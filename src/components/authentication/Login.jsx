import React from 'react';
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { Button } from "@progress/kendo-react-buttons";
import { Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
  FormInput,
} from './form-components'

import {
  requiredValidator,
  emailValidator,
} from './validators'
import Alerts from '../alerts/Alerts';

const Login = () => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = React.useState(false)
  const [message, setMessage] = React.useState("")
  const [variant, setVariant] = React.useState(null)

  const handleSubmit = async (formData) => {
    console.log("Login form submitted", formData);
    try{
      const fetchData = await fetch("http://127.0.0.1:5000/login", {
        method: 'POST',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await fetchData.json();
      if (response.status == 200) {
        setMessage(response.message)
        setShowAlert(true)
        setVariant("success")
        console.log("Login successfully");
        const { access_token, refresh_token } = response;
        const decoded = jwtDecode(access_token);
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('userData', JSON.stringify(decoded));
        console.log("Navigating to home page...");
        navigate('/');
        } else if(response.status === 401){
          setShowAlert(true)
          setVariant('danger')
          setMessage(response.message)
        }
    } catch(error){
      console.error('Error logging in:', error);
    }
    
  };

  return (
    <Container>
      {showAlert && (
                <div>
                <Alerts showAlert={showAlert} setShowAlert={setShowAlert} message={message} variant={variant} />
                </div>
            )}
      <div className="d-flex align-items-center justify-content-center vh-100 h4 flex-column">
        <h1>Get started with TimeChronos</h1>
        <h3>Login</h3>
        <Card className="border shadow-sm mt-3" style={{ width: '30%' }}>
          <div className='p-4'>
            <Form onSubmit={handleSubmit} render={formRenderProps =>
              <FormElement>
                <fieldset className={'k-form-fieldset'}>
                  <Field
                    id={'email'}
                    name={'email'}
                    label={'Email *'}
                    component={FormInput}
                    validator={emailValidator}
                  />
                  <Field
                    id={'password'}
                    name={'password'}
                    label={'Password *'}
                    component={FormInput}
                    validator={requiredValidator}
                  />
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <Button
                      themeColor={"primary"}
                      type={"submit"}
                      disabled={!formRenderProps.allowSubmit}
                    >
                      Login
                    </Button>
                    <span
                      className="text-decoration-underline text-info"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate('/forgotpassword')}
                    >
                      Forgot Password
                    </span>
                  </div>
                  <Card.Text className="mt-3" style={{ fontWeight: 'normal' }}>
                    Don&apos;t have an account? <span className="text-decoration-underline text-info" onClick={() => navigate('/register')} style={{ cursor: "pointer" }}>Signup</span>
                  </Card.Text>
                </fieldset>
              </FormElement>} />
          </div>
        </Card>
      </div>
    </Container>
  );
};

export default Login;

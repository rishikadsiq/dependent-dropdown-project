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

const Login = () => {
  const navigate = useNavigate()

  const handleSubmit = async (formData) => {
    console.log("Login form submitted", formData)
    const response = await fetch("http://127.0.0.1:5000/login", {
      method: 'POST',
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status == 200) {
      console.log("Login successfully");
      try {
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        };

        requestOptions.body = JSON.stringify(formData);

        const response = await fetch("http://127.0.0.1:5000/login", requestOptions);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const response_data = await response.json()
        console.log(response_data)
        const { access_token, refresh_token } = response_data;
        const decoded = jwtDecode(access_token)
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('userData', JSON.stringify(decoded));
        console.log("Navigating to home page...");
        navigate('/')


      } catch (error) {
        console.error('Error:', error);
        throw error;

      }
    } else {
      console.error("Failed to submit form data:", response.message);
    }
  }

  return (
    <Container>
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

                  <div className="k-form-buttons">
                    <Button
                      themeColor={"primary"}
                      type={"submit"}
                      disabled={!formRenderProps.allowSubmit}
                    >
                      Login
                    </Button>
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
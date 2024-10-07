import React from 'react';
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { Button } from "@progress/kendo-react-buttons";
import { Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  FormInput,
} from './form-components'
import { domain } from '../../config';

import {
  emailValidator,
} from './validators'
import Alerts from '../dynamic-compoenents/Alerts';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = React.useState(false)
  const [message, setMessage] = React.useState("")
  const [variant, setVariant] = React.useState(null)
  console.log(domain)

  const handleSubmit = async (formData) => {
    const response = await fetch(`${domain}/forgotpassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: formData.email }) // Send email in request body
    });

    if (response.status === 200) {
      setMessage('Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.');
      setShowAlert(true);
      setVariant("success");
    }
  };

  return (
    <Container>
      <div className="d-flex align-items-center justify-content-center vh-100 h4 flex-column">
        <h1>Get started with TimeChronos</h1>
        <h3>Forgot Password</h3>

        {/* Show the alert if the email is sent successfully */}

        {/* Conditionally render the card if the alert is not shown */}
        
          <Card className="border shadow-sm mt-3" style={{ width: '30%' }}>
            <div className='p-4'>
              {!showAlert && (
                <>
                <Card.Text className="mt-3" style={{ fontWeight: 'normal' }}>
                Enter your email and we'll send you a link to get back into your account.
              </Card.Text>
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

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <Button
                        themeColor={"primary"}
                        type={"submit"}
                        disabled={!formRenderProps.allowSubmit}
                      >
                        Send Email
                      </Button>
                    </div>
                  </fieldset>
                </FormElement>} />
                </>
                )}
                {showAlert && (
                  <Card.Text className="mt-3">
                    {message}
                  </Card.Text>

                )}
            </div>
          </Card>

      </div>
    </Container>
  );
};

export default ForgotPassword;

import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { Button } from "@progress/kendo-react-buttons";
import { Container, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { FormInput } from './form-components';
import { passwordValidator } from './validators';

const ResetPassword = () => {
    const navigate = useNavigate();
    const { code } = useParams();

    const handleSubmit = async (formData) => {
        console.log("Reset Password form submitted", formData);

        const response = await fetch(`http://127.0.0.1:5000/resetpassword?token=${code}`, {
            method: 'POST',
            body: JSON.stringify({ password: formData.password }),
            headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
            console.log("Form data submitted successfully!");
            navigate('/login');
        } else {
            console.error("Failed to submit form data:", response.statusText);
        }
    };

    return (
        <Container className='vh-100 mt-3 mb-5'>
            <div className="d-flex align-items-center justify-content-center vh-100 h4 flex-column">
                <h1>Get started with TimeChronos</h1>
                <p>Create a free account to start tracking time and superchange</p>
                <h3>Reset Password</h3>
                <Card className="border shadow-sm mt-3" style={{ width: '30%' }}>
                    <div className='p-4'>
                        <Form onSubmit={handleSubmit} render={formRenderProps =>
                            <FormElement>
                                <fieldset className={'k-form-fieldset'}>
                                    <Field
                                        id={'password'}
                                        name={'password'}
                                        label={'Password *'}
                                        component={FormInput}
                                        validator={passwordValidator}
                                    />
                                    <Field
                                        id={'retype_password'}
                                        name={'retype_password'}
                                        label={'Re-type Password *'}
                                        component={FormInput}
                                        validator={passwordValidator}
                                    />
                                    <div className="k-form-buttons">
                                        <Button
                                            themeColor={"primary"}
                                            type={"submit"}
                                            disabled={!formRenderProps.allowSubmit}
                                        >
                                            Reset Password
                                        </Button>
                                        <Button onClick={formRenderProps.onFormReset}>Cancel</Button>
                                    </div>
                                </fieldset>
                            </FormElement>}
                        />
                    </div>
                </Card>
            </div>
        </Container>
    );
};

export default ResetPassword;

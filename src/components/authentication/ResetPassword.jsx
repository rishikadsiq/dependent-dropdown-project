import React from 'react';
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { Button } from "@progress/kendo-react-buttons";
import { Container, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { FormInput } from './form-components';
import { passwordValidator } from './validators';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // 

const ResetPassword = () => {
    const navigate = useNavigate();
    const { code } = useParams();
    const [showPassword, setShowPassword] = React.useState(false);  
    const [showRetypePassword, setShowRetypePassword] = React.useState(false);  
    const confirmPasswordValidator = (retypePassword, password) => {
        if (retypePassword !== password) {
            return "Passwords do not match.";
        }
        return "";
    };
    const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    };

    const toggleRetypePasswordVisibility = () => {
    setShowRetypePassword(!showRetypePassword);
    };

    const handleSubmit = async (formData) => {

        const response = await fetch(`http://127.0.0.1:5000/resetpassword?token=${code}`, {
            method: 'POST',
            body: JSON.stringify({ password: formData.password }),
            headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
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
                                    {/* Password Field */}
                                    <div className="position-relative">
                                        <Field
                                        id={'password'}
                                        name={'password'}
                                        label={'Password *'}
                                        type={showPassword ? 'text' : 'password'}
                                        component={FormInput}
                                        validator={passwordValidator}
                                        />
                                        <button
                                        type="button"
                                        className="btn btn-link position-absolute"
                                        onClick={togglePasswordVisibility}
                                        style={{
                                            top: '50%',
                                            right: '5px',  // Adjusted for better right alignment
                                            transform: 'translateY(-20%)',
                                            padding: 0,
                                        }}
                                        >
                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                        </button>
                                    </div>

                                    {/* Re-type Password Field */}
                                    <div className="position-relative">
                                        <Field
                                        id={'retype_password'}
                                        name={'retype_password'}
                                        label={'Re-type Password *'}
                                        type={showRetypePassword ? 'text' : 'password'}
                                        component={FormInput}
                                        validator={(value) => confirmPasswordValidator(value, formRenderProps.valueGetter('password'))}
                                        />
                                        <button
                                        type="button"
                                        className="btn btn-link position-absolute"
                                        onClick={toggleRetypePasswordVisibility}
                                        style={{
                                            top: '50%',
                                            right: '5px',  // Adjusted for better right alignment
                                            transform: 'translateY(-20%)',
                                            padding: 0,
                                        }}
                                        >
                                        <FontAwesomeIcon icon={showRetypePassword ? faEyeSlash : faEye} />
                                        </button>
                                    </div>
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

import React from 'react';
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { Button } from "@progress/kendo-react-buttons";
import { Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FormInput } from '../authentication/form-components';
import { passwordValidator } from '../authentication/validators';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // 
import { PostRequestHelper } from '../helper/PostRequestHelper';

const ChangePassword = ({setShowButton, setMessage, setVariant, setShowAlert }) => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = React.useState(false);  
    const [showPreviousPassword, setPreviousPassword] = React.useState(false);
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
    const togglePreviousPasswordVisibility = () => {
    setPreviousPassword(!showPreviousPassword);
    };

    const toggleRetypePasswordVisibility = () => {
    setShowRetypePassword(!showRetypePassword);
    };

    const handleSubmit = async (formData) => {

       try{
        const response = await PostRequestHelper('/changepassword', { new_password: formData.password, current_password: formData.current_password }, navigate)
        if(response.status===200){
            setMessage(response.message)
            setShowAlert(true)
            setVariant("success")
        }else if(response.status===401){
            setMessage(response.message)
            setShowAlert(true)
            setVariant("danger")
        }
       }catch(err){
        console.error("Error while updating password: " + err)
       }
        


        setShowButton(false)
    };

    return (
        <Container>
            <div style={{width: '600px'}}>
                <h6>Change Password</h6>
                    <div>
                        <Form onSubmit={handleSubmit} render={formRenderProps =>
                            <FormElement>
                                <fieldset className={'k-form-fieldset'}>
                                    
                                    {/* Password Field */}
                                    <div className="position-relative">
                                        <Field
                                        id={'current_password'}
                                        name={'current_password'}
                                        label={'Current Password *'}
                                        type={showPreviousPassword ? 'text' : 'password'}
                                        component={FormInput}
                                        validator={passwordValidator}
                                        />
                                        <button
                                        type="button"
                                        className="btn btn-link position-absolute"
                                        onClick={togglePreviousPasswordVisibility}
                                        style={{
                                            top: '50%',
                                            right: '5px',  // Adjusted for better right alignment
                                            transform: 'translateY(-20%)',
                                            padding: 0,
                                        }}
                                        >
                                        <FontAwesomeIcon icon={showPreviousPassword ? faEyeSlash : faEye} />
                                        </button>
                                    </div>
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
                                                Save Password
                                            </Button>
                                            <Button onClick={() => {
                                                formRenderProps.onFormReset()
                                                setShowButton(false)
                                            }}>Cancel</Button>
                                        </div>
                                </fieldset>
                            </FormElement>}
                        />
                    </div>
            </div>
        </Container>
    );
};

export default ChangePassword;

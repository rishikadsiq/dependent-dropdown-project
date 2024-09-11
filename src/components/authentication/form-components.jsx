import * as React from 'react';
import { FieldWrapper } from '@progress/kendo-react-form';
import { Input, MaskedTextBox, Checkbox, TextArea } from '@progress/kendo-react-inputs';
import { Label, Error, Hint } from '@progress/kendo-react-labels';
export const FormInput = fieldRenderProps => {
  const {
    validationMessage,
    touched,
    label,
    id,
    valid,
    disabled,
    hint,
    type,
    optional,
    ...others
  } = fieldRenderProps;
  const showValidationMessage = touched && validationMessage;
  const showHint = !showValidationMessage && hint;
  const hintId = showHint ? `${id}_hint` : '';
  const errorId = showValidationMessage ? `${id}_error` : '';
  return <FieldWrapper>
    <Label editorId={id} editorValid={valid} editorDisabled={disabled} optional={optional} className='k-form-label'>{label}</Label>
    <div className={'k-form-field-wrap'}>
      <Input valid={valid} type={type} id={id} disabled={disabled} ariaDescribedBy={`${hintId} ${errorId}`} {...others} />
      {showHint && <Hint id={hintId}>{hint}</Hint>}
      {showValidationMessage && <Error id={errorId}>{validationMessage}</Error>}
    </div>
  </FieldWrapper>;
};


export const FormCheckbox = fieldRenderProps => {
  const {
    validationMessage,
    touched,
    id,
    valid,
    disabled,
    hint,
    optional,
    label,
    ...others
  } = fieldRenderProps;
  const showValidationMessage = touched && validationMessage;
  const showHint = !showValidationMessage && hint;
  const hintId = showHint ? `${id}_hint` : '';
  const errorId = showValidationMessage ? `${id}_error` : '';
  return <FieldWrapper>
    <div className={'k-form-field-wrap'}>
      <Checkbox ariaDescribedBy={`${hintId} ${errorId}`} label={label} labelOptional={optional} valid={valid} id={id} disabled={disabled} labelClassName='k-form-label' {...others} />
      {showHint && <Hint id={hintId}>{hint}</Hint>}
      {showValidationMessage && <Error id={errorId}>{validationMessage}</Error>}
    </div>
  </FieldWrapper>;
};
export const FormMaskedTextBox = fieldRenderProps => {
  const {
    validationMessage,
    touched,
    label,
    id,
    valid,
    hint,
    optional,
    ...others
  } = fieldRenderProps;
  const showValidationMessage = touched && validationMessage;
  const showHint = !showValidationMessage && hint;
  const hintId = showHint ? `${id}_hint` : '';
  const errorId = showValidationMessage ? `${id}_error` : '';
  return <FieldWrapper>
    <Label editorId={id} editorValid={valid} optional={optional} className='k-form-label'>{label}</Label>
    <div className={'k-form-field-wrap'}>
      <MaskedTextBox ariaDescribedBy={`${hintId} ${errorId}`} valid={valid} id={id} {...others} />
      {showHint && <Hint id={hintId}>{hint}</Hint>}
      {showValidationMessage && <Error id={errorId}>{validationMessage}</Error>}
    </div>
  </FieldWrapper>;
};
export const FormTextArea = fieldRenderProps => {
  const {
    validationMessage,
    touched,
    label,
    id,
    valid,
    hint,
    disabled,
    optional,
    ...others
  } = fieldRenderProps;
  const showValidationMessage = touched && validationMessage;
  const showHint = !showValidationMessage && hint;
  const hintId = showHint ? `${id}_hint` : '';
  const errorId = showValidationMessage ? `${id}_error` : '';
  return <FieldWrapper>
    <Label editorId={id} editorValid={valid} optional={optional} className='k-form-label'>{label}</Label>
    <div className={'k-form-field-wrap'}>
      <TextArea valid={valid} id={id} disabled={disabled} ariaDescribedBy={`${hintId} ${errorId}`} {...others} />
      {showHint && <Hint id={hintId}>{hint}</Hint>}
      {showValidationMessage && <Error id={errorId}>{validationMessage}</Error>}
    </div>
  </FieldWrapper>;
};













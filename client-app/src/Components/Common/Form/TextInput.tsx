import React from 'react'
import { FieldRenderProps } from 'react-final-form'
import { FormFieldProps, Form, Label } from 'semantic-ui-react'



interface IProps extends FieldRenderProps<string, HTMLElement>, FormFieldProps {
 inputRef?: React.Ref<HTMLInputElement>
}

const TextInput: React.FC<IProps> = ({ placeholder, type, icon, input, meta: {touched, error}, IconLabel, onChange, handleTogglePicker, inputRef, emojiPicker}) => {
  return (
    <Form.Input fluid iconPosition='left' type={type} placeholder={placeholder} style={{ marginBottom: '0.7em', fontFamily: `'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif` }}>
      {IconLabel && (
        <button type="button" className='ui icon button label button__icon' onClick={handleTogglePicker}>
          <i aria-hidden="true" className={emojiPicker ? 'close icon' : 'add icon'}></i>
        </button>
      )}
      <i aria-hidden="true" className={icon}></i>
      <input {...input} value={input.value || ''} className={IconLabel ? 'input__icon':''} ref={inputRef} onChange={(e) => {input.onChange(e)
        if (onChange) onChange(e)
      }}/>
      {touched && error && (
        <Label basic color='red'>
          {error}
        </Label>
      )}
    </Form.Input>
  )
}

export default TextInput

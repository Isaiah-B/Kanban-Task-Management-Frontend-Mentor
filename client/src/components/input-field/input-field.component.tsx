import { InputBox, InputFieldContainer, InputInvalidError } from './input-field.styles';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isRequired?: boolean,
}

function InputField({ isRequired = false, ...props }: InputFieldProps) {
  return (
    <InputFieldContainer>
      <InputBox
        required={isRequired}
        {...props}
      />
      {
        isRequired
        && <InputInvalidError>Can&apos;t be empty</InputInvalidError>
      }
    </InputFieldContainer>
  );
}

export default InputField;

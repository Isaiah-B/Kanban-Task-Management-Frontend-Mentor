import { ReactComponent as CrossIcon } from '../../assets/icon-cross.svg';

import InputField from '../input-field/input-field.component';

import {
  InputListItemContainer,
  RemoveSubtaskButton,
} from './input-list-item.styles';

interface InputListItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholderText?: string,
  index: number,
  handleOnChange: (text: string, index: number) => void,
  handleRemoveItem: (index: number) => void,
}

function InputListItem({
  index,
  handleOnChange,
  handleRemoveItem,
  placeholderText = '',
  ...props
}: InputListItemProps) {
  return (
    <InputListItemContainer>
      <InputField
        type="text"
        placeholder={placeholderText}
        onChange={({ target }) => handleOnChange(target.value, index)}
        isRequired
        {...props}
      />
      <RemoveSubtaskButton
        type="button"
        onClick={() => handleRemoveItem(index)}
      >
        <CrossIcon />
      </RemoveSubtaskButton>
    </InputListItemContainer>
  );
}

export default InputListItem;

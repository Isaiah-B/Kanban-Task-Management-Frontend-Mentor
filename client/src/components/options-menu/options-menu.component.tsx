import { OptionMenuButton, OptionsMenuContainer } from './options-menu.styles';

interface OptionsMenuProps {
  editText: string,
  deleteText: string,
  handleEdit: () => void,
  handleDelete: () => void,
}

function OptionsMenu({
  editText,
  deleteText,
  handleEdit,
  handleDelete,
}: OptionsMenuProps) {
  return (
    <OptionsMenuContainer>
      <OptionMenuButton
        onClick={() => handleEdit()}
      >
        {editText}
      </OptionMenuButton>

      <OptionMenuButton
        className="text-red"
        onClick={() => handleDelete()}
      >
        {deleteText}
      </OptionMenuButton>
    </OptionsMenuContainer>
  );
}

export default OptionsMenu;

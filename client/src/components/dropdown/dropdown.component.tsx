import { useState } from 'react';
import { useRecoilValue } from 'recoil';

import { ReactComponent as ChevronDownIcon } from '../../assets/icon-chevron-down.svg';
import { CurrentBoardState } from '../../recoilStore';

import {
  DropdownContainer,
  DropdownBox,
  DropDownMenu,
  DropdownItem,
} from './dropdown.styles';

interface DropdownProps {
  selectedStatus: string,
  handleSelectStatus: (statusId: string) => void
}

function Dropdown({ selectedStatus, handleSelectStatus }: DropdownProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const currentBoard = useRecoilValue(CurrentBoardState);

  const onClickDropdownItem = (statusId: string) => {
    setDropdownOpen(false);
    handleSelectStatus(statusId);
  };

  return (
    <DropdownContainer>
      <DropdownBox
        className={dropdownOpen ? 'open' : ''}
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        {
          currentBoard.columns.find((col) => col.id === selectedStatus)?.name
        }
        <ChevronDownIcon />
      </DropdownBox>
      <DropDownMenu>
        {
          currentBoard.columns.map((column) => (
            <DropdownItem
              key={column.id}
              id={column.id}
              onClick={() => onClickDropdownItem(column.id)}
            >
              {column.name}
            </DropdownItem>
          ))
        }
      </DropDownMenu>
    </DropdownContainer>
  );
}

export default Dropdown;

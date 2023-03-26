import styled from 'styled-components';
import { BodyL } from '../../index.styles';
import { ModalBoxBase } from '../modals/modals.styles';

export const DropdownContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

export const DropdownBox = styled.div`
  ${ModalBoxBase};
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;

  &:hover,
  &.open {
    border: 1px solid hsl(242, 48%, 58%);
  }
`;

export const DropDownMenu = styled.div`
  position: absolute;
  top: 4.8rem;
  visibility: hidden;
  opacity: 0;
  
  height: 0px;
  width: 100%;
  max-height: 12rem;
  overflow-y: auto;
  transition: all 0.4s;
  
  border-radius: 8px;
  background-color: ${({ theme }) => theme.dropdownMenuBackground};
  box-shadow: ${({ theme }) => theme.shadow};

  .open ~ & {
    opacity: 1;
    visibility: visible;

    height: 12rem;
    padding: 1.2rem 0;
  }
`;

export const DropdownItem = styled.div`
  ${BodyL};
  color: hsl(216, 15%, 57%);
  padding: 0.4rem 1.6rem;
  cursor: pointer;

  &:hover {
    background-color: hsla(242, 48%, 58%, 0.25);
  }
`;

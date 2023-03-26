import styled from 'styled-components';
import { BodyM } from '../../../index.styles';
import { ModalContainerBase } from '../modals.styles';

export const TaskDetailsContainer = styled.div`
  ${ModalContainerBase};
`;

export const TaskDetailsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 2.4rem;
`;

export const TaskOptionsContainer = styled.div`
  position: relative;
`;

export const TaskDetailsOptionsButton = styled.button`
  width: 2rem;
  border: none;
  background: none;
  cursor: pointer;
`;

export const OptionsMenuWrapper = styled.div`
  display: none;
  position: absolute;
  top: 3.4rem;
  transform: translateX(-50%);
  z-index: 100;

  &.open {
    display: block;
  }
`;

export const SubtasksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

export const SubtaskItem = styled.label`
  display: flex;
  align-items: center;

  position: relative;
  padding: 1.2rem;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.checkboxBackground};
  cursor: pointer;

  &:hover {
    background-color: hsla(242, 48%, 58%, 0.25);
  }

  input[type=checkbox] {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
  }
`;

export const SubtaskCheckbox = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  
  position: absolute;

  width: 1.6rem;
  height: 1.6rem;
  border: 1px solid hsla(216, 15%, 57%, 0.25);
  border-radius: 2px;
  background-color: ${({ theme }) => theme.checkbox};

  &::after {
    content: url(./assets/icon-check.svg);
    display: none;
    position: absolute;
    top: 3px;
  }
  
  input[type=checkbox]:checked ~ & {
    border-color: hsl(242, 48%, 58%);
    background-color: hsl(242, 48%, 58%);

    &::after {
      display: block;
    }
  }

`;

export const SubtaskTitle = styled.span`
  ${BodyM};
  color: ${({ theme }) => theme.textMain};
  margin-left: 3.4rem;

  input[type=checkbox]:checked ~ & {
    text-decoration: line-through;
    color: ${({ theme }) => theme.textLight};
  }
`;

export const StatusSection = styled.div`
  h5 {
    margin-bottom: 0.8rem;
  }
`;

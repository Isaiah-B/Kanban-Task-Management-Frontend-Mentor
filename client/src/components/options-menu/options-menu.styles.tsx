import styled from 'styled-components';
import { BodyL } from '../../index.styles';

export const OptionsMenuContainer = styled.div`
  display: flex;
  flex-direction: column;

  border-radius: 8px;
  padding: 0.8rem 0;
  overflow: hidden;
  width: 19.2rem;
  background-color: ${({ theme }) => theme.optionsMenuBackground};
  box-shadow: ${({ theme }) => theme.shadow};

  & button:first-child {
    padding: 0.8rem 1.6rem 0.8rem
  }

  & button:last-child {
    padding: 0.8rem 1.6rem 0.8rem;
  }
`;

export const OptionMenuButton = styled.button`
  ${BodyL};
  font-family: inherit;
  text-align: left;
  color: hsl(216, 15%, 57%);
  
  cursor: pointer;
  border: none;
  width: 100%;
  background-color: ${({ theme }) => theme.optionsMenuBackground};
  
  
  &.text-red {
    color: hsl(0, 78%, 63%);
  }

  &:hover {
    background-color: hsla(242, 48%, 58%, 0.25);
  }
`;

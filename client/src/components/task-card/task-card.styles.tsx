import styled from 'styled-components';
import { BodyM } from '../../index.styles';

export const TaskCardContainer = styled.div`
  word-wrap: anywhere;
  margin-bottom: 2rem;
  padding: 2.3rem 1.6rem;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  box-shadow: 0 4px 6px hsla(220, 40%, 35%, 0.1);
  
  h3 {
    margin-bottom: 0.8rem;
  }

  span {
    ${BodyM};
    color: ${({ theme }) => theme.textLight};
  }

  &[data-rbd-drag-handle-context-id="0"] {
    cursor: pointer;
  }

  &:hover {
    transform: scale(1.03);
    h3 {
      color: hsl(242, 48%, 58%);
    }
  }
`;

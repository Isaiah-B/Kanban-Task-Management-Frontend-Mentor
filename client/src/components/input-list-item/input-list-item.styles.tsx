import styled from 'styled-components';

export const InputListItemContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
  width: 100%;
`;

export const RemoveSubtaskButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  
  svg {
    fill: hsl(216, 15%, 57%);
  }
  
  &:hover svg {
    fill: hsl(216, 15%, 72%);
  }

  .submitted div:has(input[type="text"]:invalid) ~ & {
    svg {
      fill: hsl(0, 78%, 63%);
    }
  }
`;

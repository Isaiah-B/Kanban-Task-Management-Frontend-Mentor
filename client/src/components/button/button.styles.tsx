import styled, { css } from 'styled-components';

const ButtonBase = css`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  border: none;
  border-radius: 24px;
  padding: 1.2rem 1.8rem;
  cursor: pointer;

  font-family: inherit;
  font-weight: 700;
  color: hsl(0, 0%, 100%);

  &:disabled {
    opacity: 0.25;
    cursor: default;
  }
`;

export const ButtonPrimaryL = styled.button`
  ${ButtonBase}
  font-size: 1.5rem;
  padding: 1.4rem 2.4rem;
  background-color: hsl(242, 48%, 58%);

  &:hover {
    background-color: hsl(242, 100%, 82%);

    &:disabled {
      background-color: hsl(242, 48%, 58%);
    }
  }
`;

export const ButtonPrimaryS = styled.button`
  ${ButtonBase}
  font-size: 1.3rem;
  background-color: hsl(242, 48%, 58%);

  &:hover {
    background-color: hsl(242, 100%, 82%);
  }
`;

export const ButtonSecondary = styled.button`
  ${ButtonBase}
  font-size: 1.3rem;
  background-color: ${({ theme }) => theme.buttonSecondary};
  color: hsl(242, 48%, 58%);

  &:hover {
    background-color: ${({ theme }) => theme.buttonSecondaryHover};
  }
`;

export const ButtonDestructive = styled.button`
  ${ButtonBase}
  background-color:hsl(0, 78%, 63%);

  &:hover {
    background-color: hsl(0, 100%, 80%);
  }
`;

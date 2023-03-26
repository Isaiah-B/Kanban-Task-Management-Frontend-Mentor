import styled from 'styled-components';

import { BodyL } from '../../../index.styles';
import { ModalContainer } from '../modals.styles';

export const AuthFormContainer = styled(ModalContainer)`
  display: flex;
  flex-direction: column;

  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  width: 50rem;
  padding: 2.4rem;
  background-color: ${({ theme }) => theme.backgroundSecondary};
`;

export const FormNavText = styled.span`
  ${BodyL};
  color: ${({ theme }) => theme.textMain};
  text-align: center;
  margin-top: 2rem;
`;

export const FormNavButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;

  font-family: inherit;
  text-decoration: underline;
  color: inherit;
`;

export const AuthErrorText = styled.span`
  ${BodyL};
  color: hsl(0, 78%, 63%);
  margin-top: 2rem;
`;

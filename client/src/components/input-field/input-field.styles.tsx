import styled from 'styled-components';
import { BodyL } from '../../index.styles';
import { ModalBoxBase } from '../modals/modals.styles';

export const InputFieldContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const InputBox = styled.input`
  ${ModalBoxBase};

  :not(.submitted) &:invalid {
    border-color: initial;
  }
  
  .submitted &:invalid {
    border-color: hsl(0, 78%, 63%);
  }
`;

export const InputInvalidError = styled.div`
  display: none;
  position: absolute;
  right: 1.6rem;
  top: 50%;
  transform: translateY(-50%);

  ${BodyL};
  color: hsl(0, 78%, 63%);

  .submitted :invalid ~ & {
    display: block;
  }
`;

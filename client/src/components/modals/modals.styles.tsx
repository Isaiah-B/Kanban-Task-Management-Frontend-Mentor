import styled, { css } from 'styled-components';

import { BodyL, BodyM, MEDIA_SIZES } from '../../index.styles';

export const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 500;

  height: 100%;
  width: 100%;
  overflow-y: auto;
  background: hsla(0, 0%, 0%, 0.5);
`;

export const ModalContainerBase = css`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;

  width: 48rem;
  padding: 3.2rem;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.backgroundSecondary};

  p {
    ${BodyL};
    color: ${({ theme }) => theme.textLight};
    margin-bottom: 2.4rem;
  }

  @media ${MEDIA_SIZES.mobileL} {
    width: 92%;
    padding: 2.4rem;
  }
`;

export const ModalContainer = styled.form`
  ${ModalContainerBase};
`;

export const ModalTitle = styled.h2`
  margin-bottom: 2.4rem;

  &.text-red {
    color: hsl(0, 78%, 63%);
  }
`;

export const ModalSection = styled.div`
  margin-bottom: 2.4rem;
`;

export const ModalSectionTitle = styled.h5`
  ${BodyM};
  color: ${({ theme }) => theme.modalSubheading};
  margin-bottom: 0.8rem;
`;

export const ModalBoxBase = css`
  width: 100%;
  outline: none;
  padding: 0.8rem 1.6rem;
  border: 1px solid hsla(216, 15%, 57%, 0.25);
  border-radius: 4px;
  background-color: ${({ theme }) => theme.textFieldBackground};
  cursor: pointer;

  ${BodyL};
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: ${({ theme }) => theme.textMain};

  &::placeholder {
    ${BodyL};
    font-family: inherit;
    font-weight: 700;
    color: ${({ theme }) => theme.inputPlaceholder};
  }

  &:focus,
  &:active {
    border-color: hsl(242, 48%, 58%);
    cursor: text;
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 1.6rem;
  width: 100%;
  padding-bottom: 0.8rem;

  @media ${MEDIA_SIZES.mobileL} {
    flex-direction: column;
  }
`;

// ---------------INPUTS--------------- //
export const TextArea = styled.textarea`
  ${ModalBoxBase};
  resize: none;
`;

export const InputListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  overflow-y: auto;
  margin-bottom: 1.2rem;
  max-height: 14.7rem;
`;

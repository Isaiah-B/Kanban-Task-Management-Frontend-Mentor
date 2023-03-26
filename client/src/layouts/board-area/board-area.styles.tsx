import styled from 'styled-components';
import { MEDIA_SIZES } from '../../index.styles';

export const BoardAreaContainer = styled.div`
  position: relative;
  overflow-y: clip;
  overflow-x: auto;
  
  display: flex;
  align-items: center;

  margin: 0 0 0 30rem;
  padding: 0rem 2.4rem 5rem;
  height: 100%;
  width: 100%;
  transition: margin 0.3s;

  &.sidebar-closed {
    margin-left: 0;
  }

  @media ${MEDIA_SIZES.tablet} {
    margin: 0 0 0 26rem;
  }

  @media ${MEDIA_SIZES.tabletS} {
    margin: 0;
  }
`;

export const ColumnsContainer = styled.div`
  display: flex;
  gap: 2.4rem;

  height: 100%;
`;

export const NewColumnBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 28rem;
  height: 100%;
  border-radius: 6px;
  margin-top: 3.9rem;
  background: ${({ theme }) => theme.newColumnBackground};
  cursor: pointer;

  h1 {
    color: ${({ theme }) => theme.textLight}
  }

  &:hover h1{
    color: hsl(242, 48%, 58%);
  }
`;

export const NewColModal = styled.form`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  
  width: 20rem;
  height: 10rem;
  background-color: hsl(235, 12%, 19%);
`;

export const EmptyNotif = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3.2rem;

  text-align: center;
  width: 100%;
  padding: 0 2.4rem;

  h2 {
    color: hsl(216, 15%, 57%);
  }
`;

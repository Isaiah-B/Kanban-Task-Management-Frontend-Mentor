import styled from 'styled-components';
import { MEDIA_SIZES } from '../../index.styles';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  
  height: inherit;
`;

export const BoardMain = styled.main`
  position: relative;
  display: flex;
  height: 100%;
  width: 100%;
  min-height: 0;
`;

export const ShowSidebarButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  
  position: absolute;
  left: 0;
  bottom: 3.2rem;

  width: 5.6rem;
  height: 4.8rem;
  border: none;
  border-radius: 0 100px 100px 0;
  background-color: hsl(242, 48%, 58%);
  cursor: pointer;
  
  transition: transform 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  transition-delay: 0.5s;

  &:hover {
    background-color: hsl(242, 100%, 82%);
  }

  &.sidebar-open {
    transform: translateX(-100%);
    transition: all 0s;
  }

  @media ${MEDIA_SIZES.tabletS} {
    display: none;
    opacity: 0;
  }
`;

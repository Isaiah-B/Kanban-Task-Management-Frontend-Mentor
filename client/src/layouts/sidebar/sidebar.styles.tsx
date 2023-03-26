import styled from 'styled-components';
import { MEDIA_SIZES } from '../../index.styles';

export const SidebarContainer = styled.div`
  position: absolute;
  z-index: 100;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  height: calc(100% + 2.5rem);
  width: 30rem;
  margin-top: -2.5rem;
  padding: 1.5rem 0 3.2rem;
  border-right: 1px solid ${({ theme }) => theme.lines};
  background-color: ${({ theme }) => theme.backgroundSecondary};

  transition: transform 0.3s ease-out;

  &.hidden {
    transform: translateX(-100%);
    pointer-events: none;

    @media ${MEDIA_SIZES.tabletS} {
      transform: translate(-50%, -100%);
      opacity: 0;
      transition: all 0.6s;
    }
  }

  @media ${MEDIA_SIZES.tablet} {
    width: 26rem;
  }

  @media ${MEDIA_SIZES.tabletS} {
    left: 50%;
    top: 10%;
    transform: translateX(-50%);

    height: 60%;
    border-right: none;
    border-radius: 8px;
    padding: 1.6rem 0;
    box-shadow: ${({ theme }) => theme.shadow};
  }
`;

export const BoardsListWrapper = styled.div`
  h4 {
    text-transform: uppercase;
    margin-bottom: 2rem;
    padding-left: 2.4rem;
  }
`;

export const BoardsList = styled.ul`
  display: flex;
  flex-direction: column;

  list-style: none;
`;

const BoardListItemBase = styled.button`
  position: relative;
  z-index: 100;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  padding: 1.4rem 0 1.4rem 3.2rem;
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;

  font-family: inherit;
  
  @media ${MEDIA_SIZES.tablet} {
    gap: 1.2rem;
    padding: 1.4rem 0 1.4rem 2.4rem;
  }
`;

export const BoardListItem = styled(BoardListItemBase)`
  h3 {
    color: hsl(216, 15%, 57%);
    max-width: 70%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  path {
    fill: hsl(216, 15%, 57%);
  }
  
  &::before {
    content: '';
    display: none;
    position: absolute;
    left: 0;
    z-index: -1;
    
    height: 100%;
    width: 90%;
    border-radius: 0 100px 100px 0;
  }

  &.selected {
    h3 {
      color: hsl(0, 0%, 100%);
    }

    path {
      fill: hsl(0, 0%, 100%);
    }
    
    &::before {
      display: block;
      background-color: hsl(242, 48%, 58%);
    }
  }

  &:not(.selected)&:hover {
    h3 {
      color: hsl(242, 48%, 58%);
    }

    path {
      fill: hsl(242, 48%, 58%);
    }

    &::before {
      display: block;
      background-color: ${({ theme }) => theme.menuHover};
    }
  }
`;

export const AddBoardButton = styled(BoardListItemBase)`
  h3 {
    color: hsl(242, 48%, 58%);
  }

  path {
    fill: hsl(242, 48%, 58%);
  }

  &::before {
    content: none;
  }

  &:hover {
    h3 {
      color: hsl(242, 100%, 82%);
    }

    path {
      fill: hsl(242, 100%, 82%);
    }
  }
`;

export const SidebarBottom = styled.div`
`;

export const ThemeSwitchPadding = styled.div`
  padding: 0 2.4rem;
  margin-bottom: 0.8rem;

  @media ${MEDIA_SIZES.tablet} {
    padding: 0 1.2rem;
  }
`;

export const ThemeSwitchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  border-radius: 6px;
  padding: 1.4rem 6.4rem;
  background-color: ${({ theme }) => theme.backgroundMain};

  @media ${MEDIA_SIZES.tablet} {
    padding: 1.4rem 5.6rem;
  }
`;

export const SwitchButton = styled.button`
  position: relative;
  width: 4rem;
  height: 2rem;
  border: none;
  border-radius: 12px;
  background-color: hsl(242, 48%, 58%);
  cursor: pointer;
  transition: opacity 0.3s;

  &::before {
    content: '';
    position: absolute;
    left: 0.3rem;
    top: 50%;
    transform: translateY(-50%);
    
    width: 1.4rem;
    height: 1.4rem;
    border-radius: 50%;
    background-color: hsl(0, 0%, 100%);
    transition: all 0.3s ease-out;
  }

  .dark &::before {
    transform: translate(2rem, -50%);
  }

  &:hover {
    opacity: 0.5; 
  }
`;

export const HideSidebarButton = styled(BoardListItem)`
  @media ${MEDIA_SIZES.tabletS} {
    display: none;
  }
`;

export const SidebarMobileWrapper = styled.div`
  &::before {
    content: '';
    display: none;

    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;

    height: 100%;
    width: 100%;
    overflow-y: auto;
    background: hsla(0, 0%, 0%, 0.5);
  }

  @media ${MEDIA_SIZES.tabletS} {
    &.mobile-open::before {
      display: block;
    }
  }
`;

import styled from 'styled-components';

import Button from '../../components/button/button.component';
import { ReactComponent as ChevronDownSVG } from '../../assets/icon-chevron-down.svg';

import { MEDIA_SIZES } from '../../index.styles';

export const BoardHeaderContainer = styled.header`
  display: flex;
  align-items: center;

  height: 9.7rem;
  border-bottom: 1px solid ${({ theme }) => theme.lines};
  background-color: ${({ theme }) => theme.backgroundSecondary};

  @media ${MEDIA_SIZES.mobileL} {
    height: 6.4rem;
    border: none;
  }
`;

export const BoardHeaderLogoBox = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  
  height: 100%;
  width: 20.8rem;
  padding-left: 2.4rem;
  transition: all 0.15s ease-out;
  
  @media ${MEDIA_SIZES.tablet} {
    width: 20.1rem;
  }
  
  @media ${MEDIA_SIZES.mobileL} {
    width: 5rem;
  }
  
  &.sidebar-open {
    width: 29.9rem;
    transition-delay: 0.15s;

    @media ${MEDIA_SIZES.tablet} {
      width: 25.9rem;
    }

    @media ${MEDIA_SIZES.tabletS} {
      width: 20.1rem;
    }

    @media ${MEDIA_SIZES.mobileL} {
      width: 5rem;
    }
  }
`;

export const BoardHeaderMain = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  height: 100%;
  width: 89%;
  min-width: 0;
  padding: 3.2rem 3.2rem 3.2rem 2.4rem;
  border-left: 1px solid ${({ theme }) => theme.lines};

  @media ${MEDIA_SIZES.tablet} {
    padding: 3.2rem 2.4rem 3.2rem 2.4rem;
  }

  @media ${MEDIA_SIZES.tabletS} {
    gap: 1.2rem;
  }

  @media ${MEDIA_SIZES.mobileL} {
    border: none;
  }
`;

export const BoardTitleButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;

  min-width: 0;
  text-align: left;
  border: none;
  background: none;

  h1 {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const ChevronDown = styled(ChevronDownSVG)`
  display: none;
  flex-shrink: 0;
  transition: all 0.3s;
  
  @media ${MEDIA_SIZES.tabletS} {
    display: block;
    
    .sidebar-open ~ div & {
      transform: rotate(180deg);
    }
  }
`;

export const BoardHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 2.4rem;

  flex-shrink: 0;
`;

export const AddTaskButton = styled(Button)`
  @media ${MEDIA_SIZES.mobileL} {
    height: 3.2rem;
    width: 4.8rem;
    padding: 0;
  }
`;

export const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  
  width: 2rem;
  border: none;
  background: none;
  padding: 0 0.4rem;
  cursor: pointer;
`;

export const OptionsMenuWrapper = styled.div`
  display: none;
  position: absolute;
  top: 9rem;
  transform: translateX(1rem);
  z-index: 100;

  &.open {
    display: block;
  }

  @media ${MEDIA_SIZES.tablet} {
    transform: none;
    right: 2rem;
  }
`;

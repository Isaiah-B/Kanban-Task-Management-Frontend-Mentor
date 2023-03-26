import { useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import OptionsMenu from '../../components/options-menu/options-menu.component';
import { BUTTON_TYPES } from '../../components/button/button.component';
import useScreenWidth from '../../hooks/useScreenWidth';

import { ReactComponent as LogoLight } from '../../assets/logo-light.svg';
import { ReactComponent as LogoDark } from '../../assets/logo-dark.svg';
import { ReactComponent as LogoMobile } from '../../assets/logo-mobile.svg';
import { ReactComponent as AddTaskMobileIcon } from '../../assets/icon-add-task-mobile.svg';
import { ReactComponent as VerticalEllipsis } from '../../assets/icon-vertical-ellipsis.svg';

import { MODAL_TYPES } from '../../types';

import {
  CurrentBoardState,
  ModalState,
  SideBarState,
  ThemeState,
  UserState,
} from '../../recoilStore';

import {
  AddTaskButton,
  BoardHeaderActions,
  BoardHeaderContainer,
  BoardHeaderLogoBox,
  BoardHeaderMain,
  BoardTitleButton,
  ChevronDown,
  MenuButton,
  OptionsMenuWrapper,
} from './board-header.styles';

function DesktopLogo() {
  const theme = useRecoilValue(ThemeState);

  return (
    theme === 'light'
      ? <LogoLight />
      : <LogoDark />
  );
}

function BoardHeader() {
  const currentUser = useRecoilValue(UserState);
  const currentBoard = useRecoilValue(CurrentBoardState);
  const [sidebarOpen, setSidebarOpen] = useRecoilState(SideBarState);
  const setModalState = useSetRecoilState(ModalState);

  const [optionsOpen, setOptionsOpen] = useState(false);
  const screenWidth = useScreenWidth();

  let boardEmpty = true;

  if (currentBoard && currentBoard.id) {
    boardEmpty = currentBoard.columns.length < 1;
  }

  const onClickEditBoard = () => {
    setOptionsOpen(false);

    if (!currentBoard) return;

    setModalState({
      isOpen: true,
      currentItem: currentBoard,
      modalType: MODAL_TYPES.editBoard,
    });
  };

  const onClickDeleteBoard = () => {
    setOptionsOpen(false);

    if (!currentBoard) return;

    setModalState({
      isOpen: true,
      currentItem: currentBoard,
      modalType: MODAL_TYPES.deleteConfirm,
    });
  };

  return (
    <BoardHeaderContainer>
      <BoardHeaderLogoBox className={sidebarOpen ? 'sidebar-open' : ''}>
        {
          screenWidth > 544
            ? <DesktopLogo />
            : <LogoMobile />
        }
      </BoardHeaderLogoBox>
      <BoardHeaderMain>
        <BoardTitleButton
          onClick={() => setSidebarOpen(!sidebarOpen)}
          disabled={screenWidth > 608}
        >
          <h1>{currentBoard ? currentBoard.name : ''}</h1>
          <ChevronDown />
        </BoardTitleButton>

        <BoardHeaderActions>
          <AddTaskButton
            disabled={boardEmpty}
            buttonStyle={BUTTON_TYPES.primaryL}
            onClick={() => setModalState((state) => ({
              ...state, modalType: MODAL_TYPES.addTask, isOpen: true,
            }))}
          >
            {
              screenWidth > 700
                ? '+ Add New Task'
                : <AddTaskMobileIcon />
            }
          </AddTaskButton>

          <MenuButton
            onClick={() => setOptionsOpen(!optionsOpen)}
            disabled={!currentUser.id}
          >
            <VerticalEllipsis />
          </MenuButton>

          <OptionsMenuWrapper className={optionsOpen ? 'open' : ''}>
            <OptionsMenu
              editText="Edit Board"
              deleteText="Delete Board"
              handleEdit={onClickEditBoard}
              handleDelete={onClickDeleteBoard}
            />
          </OptionsMenuWrapper>
        </BoardHeaderActions>
      </BoardHeaderMain>
    </BoardHeaderContainer>
  );
}

export default BoardHeader;

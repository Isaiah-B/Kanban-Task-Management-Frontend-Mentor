import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { ReactComponent as BoardIcon } from '../../assets/icon-board.svg';
import { ReactComponent as HideSidebarIcon } from '../../assets/icon-hide-sidebar.svg';
import { ReactComponent as SunIcon } from '../../assets/icon-light-theme.svg';
import { ReactComponent as MoonIcon } from '../../assets/icon-dark-theme.svg';

import {
  BoardsState,
  CurrentBoardState,
  ModalState,
  SideBarState,
  ThemeState,
} from '../../recoilStore';

import { MODAL_TYPES } from '../../types';
import useClickOutside from '../../hooks/useClickOutside';

import {
  AddBoardButton,
  BoardListItem,
  SidebarBottom,
  SidebarContainer,
  SidebarMobileWrapper,
  BoardsList,
  BoardsListWrapper,
  HideSidebarButton,
  SwitchButton,
  ThemeSwitchContainer,
  ThemeSwitchPadding,
} from './sidebar.styles';

function Sidebar() {
  const boards = useRecoilValue(BoardsState);
  const setModalState = useSetRecoilState(ModalState);

  const [theme, setTheme] = useRecoilState(ThemeState);
  const [currentBoard, setCurrentBoard] = useRecoilState(CurrentBoardState);
  const [sidebarVisible, setSidebarVisible] = useRecoilState(SideBarState);

  const changeBoard = (boardId: string) => {
    const newBoard = boards.find((board) => board.id === boardId);
    if (newBoard) setCurrentBoard(newBoard);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const onClickAddBoard = () => {
    setModalState((state) => ({
      ...state,
      modalType: MODAL_TYPES.addBoard,
      isOpen: true,
    }));
  };

  const closeMobileSidebar = () => {
    setSidebarVisible(false);
  };

  const mobileWrapperRef = useClickOutside(closeMobileSidebar) as React.RefObject<HTMLDivElement>;

  return (
    <SidebarMobileWrapper className={sidebarVisible ? 'mobile-open' : ''} ref={mobileWrapperRef}>
      <SidebarContainer className={sidebarVisible ? '' : 'hidden'}>
        <BoardsListWrapper>
          <h4>{`All Boards (${boards.length})`}</h4>
          <BoardsList>
            {
              boards.map((board) => (
                <li key={board.id}>
                  <BoardListItem
                    className={board.id === currentBoard.id ? 'selected' : ''}
                    onClick={() => changeBoard(board.id)}
                  >
                    <BoardIcon />
                    <h3 title={board.name}>
                      {board.name}
                    </h3>
                  </BoardListItem>
                </li>
              ))
            }
            <li>
              <AddBoardButton onClick={onClickAddBoard}>
                <BoardIcon />
                <h3>+ Create New Board</h3>
              </AddBoardButton>
            </li>
          </BoardsList>
        </BoardsListWrapper>

        <SidebarBottom>
          <ThemeSwitchPadding>
            <ThemeSwitchContainer
              className={theme}
              onClick={toggleTheme}
            >
              <SunIcon />
              <SwitchButton aria-label="Switch theme" />
              <MoonIcon />
            </ThemeSwitchContainer>
          </ThemeSwitchPadding>

          <HideSidebarButton onClick={() => setSidebarVisible(false)}>
            <HideSidebarIcon />
            <h3>Hide Sidebar</h3>
          </HideSidebarButton>
        </SidebarBottom>
      </SidebarContainer>
    </SidebarMobileWrapper>
  );
}

export default Sidebar;

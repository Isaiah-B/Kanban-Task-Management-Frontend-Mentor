import { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import {
  BoardsState,
  CurrentBoardState,
  SideBarState,
  UserState,
} from '../../recoilStore';

import { GET_USER_BOARDS } from '../../queries';
import { IBoard } from '../../types';

import BoardArea from '../board-area/board-area.layout';
import BoardHeader from '../board-header/board-header.component';
import Sidebar from '../sidebar/sidebar.component';
import ModalRenderer from '../../components/modals/modal-renderer.component';
import { ReactComponent as ShowSidebarIcon } from '../../assets/icon-show-sidebar.svg';

import { Container, BoardMain, ShowSidebarButton } from './board-container.styles';
import Loader from '../../components/loader/loader.component';

function BoardContainer() {
  const currentUser = useRecoilValue(UserState);

  const [currentBoard, setCurrentBoard] = useRecoilState(CurrentBoardState);
  const [sidebarOpen, setSidebarOpen] = useRecoilState(SideBarState);

  const setBoardsState = useSetRecoilState(BoardsState);

  // Get user's boards.
  // If there is already a current board in state, set it as the displayed board
  // Else, set the first board as the displayed board.
  const [getBoards, { loading, error, data }] = useLazyQuery(GET_USER_BOARDS, {
    onCompleted: (res) => {
      if (!currentBoard.id) {
        setCurrentBoard(res.getUserBoards.boards[0]);
      } else {
        setCurrentBoard(res.getUserBoards.boards.find(
          (board: IBoard) => board.id === currentBoard.id,
        ));
      }
    },
  });

  // Lazy load boards if user is logged in
  useEffect(() => {
    if (currentUser.id) {
      getBoards();

      if (data) {
        const { boards } = data.getUserBoards;
        setBoardsState(boards);
      }
    }
  }, [currentUser, data]);

  if (loading) return <Loader />;
  if (error) return <p>Error {error.message}</p>;

  return (
    <Container>
      <BoardHeader />
      <BoardMain>
        <Sidebar />
        <BoardArea />
      </BoardMain>
      <ShowSidebarButton
        className={sidebarOpen ? 'sidebar-open' : ''}
        onClick={() => setSidebarOpen(true)}
        disabled={!currentUser.id}
      >
        <ShowSidebarIcon />
      </ShowSidebarButton>
      <ModalRenderer />
    </Container>
  );
}

export default BoardContainer;

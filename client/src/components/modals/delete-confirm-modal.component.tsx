import { FormEvent } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useMutation, Reference } from '@apollo/client';

import Button, { BUTTON_TYPES } from '../button/button.component';

import { IBoard } from '../../types';
import { DELETE_BOARD, DELETE_TASK } from '../../queries';
import {
  BoardsState,
  CurrentBoardState,
  ModalState,
  UserState,
} from '../../recoilStore';

import {
  ButtonRow,
  ModalContainer,
  ModalSection,
  ModalTitle,
} from './modals.styles';

function DeleteConfirmModal() {
  const [modalState, setModalState] = useRecoilState(ModalState);
  const setCurrentBoard = useSetRecoilState(CurrentBoardState);
  const currentUser = useRecoilValue(UserState);
  const [boards, setBoards] = useRecoilState(BoardsState);

  // Convert ITask | IBoard to object to access their fields
  const item = Object(modalState.currentItem);
  const itemType: string = item.__typename.toLowerCase();

  // Boards have a 'name' field; Tasks have a 'title' field
  let itemTitle: string = '';
  if (item.name) itemTitle = item.name;
  else if (item.title) itemTitle = item.title;

  let confirmText: string;
  if (itemType === 'board') {
    confirmText = `Are you sure you want to delete the '${itemTitle}' board? This action will remove all columns and tasks and cannot be reveresed.`;
  } else {
    confirmText = `Are you sure you want to delete the '${itemTitle}' task and its subtasks? this action cannot be reversed.`;
  }

  const [deleteTask] = useMutation(DELETE_TASK, {
    update(cache) {
      cache.modify({
        id: `Column:${item.status}`,
        fields: {
          tasks(existingTaskRefs, { readField }) {
            return existingTaskRefs.filter(
              (taskRef: Reference) => item.id !== readField('id', taskRef),
            );
          },
        },
      });
    },
  });

  const [deleteBoard] = useMutation(DELETE_BOARD, {
    update(cache) {
      cache.modify({
        id: `User:${currentUser.id}`,
        fields: {
          boards(exisitingBoardRefs, { readField }) {
            return exisitingBoardRefs.filter(
              (boardRef: Reference) => item.id !== readField('id', boardRef),
            );
          },
        },
      });
    },
  });

  const deleteItem = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (itemType === 'task') {
      deleteTask({
        variables: { taskId: item.id },
      });
    } else if (itemType === 'board') {
      deleteBoard({
        variables: { boardId: item.id },
      });

      const updatedBoards = boards.filter((board) => board.id !== item.id);
      setBoards(updatedBoards);

      if (updatedBoards.length) {
        setCurrentBoard(updatedBoards[0]);
      } else {
        setCurrentBoard({} as IBoard);
      }
    }

    setModalState({
      ...modalState,
      currentItem: {},
      isOpen: false,
    });
  };

  const cancelModal = () => {
    setModalState({ ...modalState, isOpen: false });
  };

  return (
    <ModalContainer onSubmit={(e) => deleteItem(e)}>
      <ModalTitle className="text-red">{`Delete this ${itemType}?`}</ModalTitle>

      <ModalSection>
        <p>{confirmText}</p>
      </ModalSection>

      <ButtonRow>
        <Button
          type="submit"
          buttonStyle={BUTTON_TYPES.destructive}
        >
          Delete
        </Button>

        <Button
          type="button"
          buttonStyle={BUTTON_TYPES.secondary}
          onClick={cancelModal}
        >
          Cancel
        </Button>
      </ButtonRow>
    </ModalContainer>
  );
}

export default DeleteConfirmModal;

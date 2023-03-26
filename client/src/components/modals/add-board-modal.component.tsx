import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import InputListItem from '../input-list-item/input-list-item.component';
import InputField from '../input-field/input-field.component';
import Button, { BUTTON_TYPES } from '../button/button.component';

import { ADD_BOARD } from '../../queries';
import useValidateForm from '../../hooks/useValidateForm';

import {
  BoardsState,
  CurrentBoardState,
  ModalState,
  UserState,
} from '../../recoilStore';

import {
  InputListContainer,
  ModalContainer,
  ModalSection,
  ModalSectionTitle,
  ModalTitle,
} from './modals.styles';

function AddBoardModal() {
  const setBoards = useSetRecoilState(BoardsState);
  const setCurrentBoard = useSetRecoilState(CurrentBoardState);
  const setModalState = useSetRecoilState(ModalState);
  const currentUser = useRecoilValue(UserState);

  const [boardName, setBoardName] = useState('');
  const [columns, setColumns] = useState(['Todo', 'Doing']);

  const [createBoard] = useMutation(ADD_BOARD);

  const formRef = useValidateForm();

  const submitCreateBoard = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Add new board to cache to allow columns/tasks to be added without refreshing
    const fetchedNewBoardData = await createBoard({
      variables: {
        name: boardName,
        columns,
      },
      update(cache, { data }) {
        cache.modify({
          id: `User:${currentUser.id}`,
          fields: {
            boards(exisitingBoardRefs) {
              const newBoardRef = cache.writeFragment({
                data: data.addBoard,
                fragment: gql`
                  fragment AddBoard on Board {
                    id
                  }
                `,
              });

              return [...exisitingBoardRefs, newBoardRef];
            },
          },
        });
      },
    });

    const newBoard = fetchedNewBoardData.data.addBoard;

    // Add new board to recoil state to update sidebar ui
    setBoards((state) => state.concat(newBoard));
    setCurrentBoard(newBoard);
    setModalState((state) => ({ ...state, isOpen: false }));
  };

  const addColumn = () => {
    setColumns(columns.concat(''));
  };

  const removeColumn = (index: number) => {
    setColumns((list) => {
      const listCopy = [...list];
      listCopy.splice(index, 1);
      return listCopy;
    });
  };

  // Store subask inputs in state on change
  const columnNameOnChange = (text: string, columnIndex: number) => {
    setColumns(columns.map(
      (column, index) => (index === columnIndex ? text : column),
    ));
  };

  return (
    <ModalContainer ref={formRef} onSubmit={(e) => submitCreateBoard(e)}>
      <ModalTitle>Add New Board</ModalTitle>

      <ModalSection>
        <ModalSectionTitle>Board Name</ModalSectionTitle>
        <InputField
          value={boardName}
          placeholder="e.g. Web Design"
          onChange={({ target }) => setBoardName(target.value)}
          isRequired
        />
      </ModalSection>

      <ModalSection>
        <ModalSectionTitle>Board Columns</ModalSectionTitle>
        <InputListContainer>
          {
            columns.map((columnName, index) => (
              <InputListItem
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                value={columnName}
                index={index}
                handleOnChange={columnNameOnChange}
                handleRemoveItem={removeColumn}
              />
            ))
          }
        </InputListContainer>
        <Button
          buttonStyle={BUTTON_TYPES.secondary}
          type="button"
          onClick={addColumn}
        >
          + Add New Column
        </Button>
      </ModalSection>

      <Button
        type="submit"
        buttonStyle={BUTTON_TYPES.primaryS}
      >
        Create New Board
      </Button>
    </ModalContainer>
  );
}

export default AddBoardModal;

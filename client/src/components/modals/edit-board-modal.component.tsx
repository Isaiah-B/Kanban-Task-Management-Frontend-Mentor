import { useState } from 'react';
import { useMutation, gql, Reference } from '@apollo/client';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import InputListItem from '../input-list-item/input-list-item.component';
import InputField from '../input-field/input-field.component';
import Button, { BUTTON_TYPES } from '../button/button.component';

import { EDIT_BOARD } from '../../queries';
import { CurrentBoardState, ModalState, UserState } from '../../recoilStore';
import useValidateForm from '../../hooks/useValidateForm';

import {
  ModalContainer,
  ModalSection,
  InputListContainer,
  ModalTitle,
  ModalSectionTitle,
} from './modals.styles';

function EditBoardModal() {
  const currentUser = useRecoilValue(UserState);
  const currentBoard = useRecoilValue(CurrentBoardState);
  const setModalState = useSetRecoilState(ModalState);

  const [name, setName] = useState(currentBoard.name);
  const [columns, setColumns] = useState(currentBoard.columns.map(
    (column) => column.name,
  ));

  const [editBoard] = useMutation(EDIT_BOARD);

  const formRef = useValidateForm();

  const columnNameOnChange = (text: string, columnIndex: number) => {
    setColumns(columns.map((columnName, index) => (
      index === columnIndex ? text : columnName
    )));
  };

  const removeColumn = (columnIndex: number) => {
    setColumns(columns.filter((column, index) => (
      index !== columnIndex
    )));
  };

  const addColumn = () => {
    setColumns(columns.concat(''));
  };

  const submitEditBoard = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    editBoard({
      variables: {
        boardId: currentBoard.id,
        boardName: name,
        columnNames: columns,
      },
      update(cache, { data }) {
        cache.modify({
          id: `User:${currentUser.id}`,
          fields: {
            Boards(existingBoardRefs, { readField }) {
              const editedBoardRef = cache.writeFragment({
                id: `Board:${currentBoard.id}`,
                fragment: gql`
                  fragment EditBoard on Board {
                    name
                    columns
                  }
                `,
                data: {
                  name: data.editBoard.name,
                  columns: data.editBoard.columns,
                },
              });

              return existingBoardRefs.map(
                (ref: Reference) => (editedBoardRef === readField('id', ref) ? editedBoardRef : ref),
              );
            },
          },
        });
      },
    });

    setModalState((state) => ({
      ...state,
      isOpen: false,
      currentItem: {},
    }));
  };

  return (
    <ModalContainer ref={formRef} onSubmit={(e) => submitEditBoard(e)}>
      <ModalTitle>Edit Board</ModalTitle>

      <ModalSection>
        <ModalSectionTitle>Board Name</ModalSectionTitle>
        <InputField
          type="text"
          value={name}
          onChange={({ target }) => setName(target.value)}
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
        buttonStyle={BUTTON_TYPES.primaryS}
        type="submit"
      >
        Save Changes
      </Button>
    </ModalContainer>
  );
}

export default EditBoardModal;

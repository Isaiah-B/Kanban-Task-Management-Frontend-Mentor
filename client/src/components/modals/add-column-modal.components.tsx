import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useSetRecoilState, useRecoilValue } from 'recoil';

import Button, { BUTTON_TYPES } from '../button/button.component';
import InputField from '../input-field/input-field.component';

import { ADD_COLUMNS } from '../../queries';
import { CurrentBoardState, ModalState } from '../../recoilStore';
import useValidateForm from '../../hooks/useValidateForm';

import {
  ModalContainer,
  ModalSection,
  ModalSectionTitle,
  ModalTitle,
} from './modals.styles';

function AddColumnModal() {
  const currentBoard = useRecoilValue(CurrentBoardState);
  const setModalState = useSetRecoilState(ModalState);
  const [columnName, setColumnName] = useState('');

  const [addColumns] = useMutation(ADD_COLUMNS);

  const formRef = useValidateForm();

  const createColumn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (currentBoard) {
      addColumns({
        variables: {
          boardId: currentBoard.id,
          columnNames: [columnName],
        },
        update(cache, { data }) {
          cache.modify({
            id: `Board:${currentBoard.id}`,
            fields: {
              columns(existingColRefs) {
                const newColRef = cache.writeFragment({
                  data: data.addColumns,
                  fragment: gql`
                    fragment addCol on Column {
                      id
                    }
                  `,
                });

                return [...existingColRefs, newColRef];
              },
            },
          });
        },
      });
    }

    setModalState((state) => ({ ...state, isOpen: false }));
    setColumnName('');
  };

  return (
    <ModalContainer ref={formRef} onSubmit={(e) => createColumn(e)}>
      <ModalTitle>Add New Column</ModalTitle>

      <ModalSection>
        <ModalSectionTitle>Column Name</ModalSectionTitle>
        <InputField
          value={columnName}
          onChange={({ target }) => setColumnName(target.value)}
          isRequired
        />
      </ModalSection>
      <Button
        type="submit"
        buttonStyle={BUTTON_TYPES.primaryS}
      >
        Create Column
      </Button>
    </ModalContainer>
  );
}

export default AddColumnModal;

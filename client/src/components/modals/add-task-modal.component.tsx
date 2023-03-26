import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import Dropdown from '../dropdown/dropdown.component';
import InputField from '../input-field/input-field.component';
import InputListItem from '../input-list-item/input-list-item.component';
import Button, { BUTTON_TYPES } from '../button/button.component';

import { CurrentBoardState, ModalState } from '../../recoilStore';
import { ADD_TASK } from '../../queries';
import useValidateForm from '../../hooks/useValidateForm';

import {
  InputListContainer,
  ModalContainer,
  ModalSection,
  ModalSectionTitle,
  ModalTitle,
  TextArea,
} from './modals.styles';

function AddTaskModal() {
  const currentBoard = useRecoilValue(CurrentBoardState);
  const setModalState = useSetRecoilState(ModalState);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [selectedStatus, setSelectedStatus] = useState(currentBoard?.columns[0].id);
  const [subtaskList, setSubtaskList] = useState(['', '']);
  const subtaskPlaceholders = ['e.g. Make coffee', 'e.g. Drink coffee & smile'];

  const [addTask] = useMutation(ADD_TASK);

  const formRef = useValidateForm();

  const removeSubtask = (index: number) => {
    setSubtaskList((list) => {
      const listCopy = [...list];
      listCopy.splice(index, 1);
      return listCopy;
    });
  };

  const addSubtask = () => {
    setSubtaskList(subtaskList.concat(''));
  };

  // Store subask inputs in state on change
  const subtaskOnChange = (text: string, subtaskIndex: number) => {
    setSubtaskList(subtaskList.map(
      (subtask, index) => (index === subtaskIndex ? text : subtask),
    ));
  };

  const selectStatus = (statusId: string) => {
    setSelectedStatus(statusId);
  };

  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setModalState((state) => ({ ...state, isOpen: false }));

    await addTask({
      variables: {
        title,
        description,
        columnId: selectedStatus,
        subtasks: subtaskList,
      },

      update: (cache, { data }) => {
        cache.modify({
          id: `Column:${selectedStatus}`,
          fields: {
            tasks(existingTaskRefs) {
              const newTaskRef = cache.writeFragment({
                data: data.addTask,
                fragment: gql`
                  fragment NewTask on Task {
                    id
                  }
                `,
              });

              if (!existingTaskRefs.includes(newTaskRef)) {
                return [...existingTaskRefs, newTaskRef];
              }
              return existingTaskRefs;
            },
          },
        });
      },
    });
  };

  return (
    <ModalContainer ref={formRef} onSubmit={(e) => handleAddTask(e)}>
      <ModalTitle>Add New Task</ModalTitle>

      <ModalSection>
        <ModalSectionTitle>Title</ModalSectionTitle>
        <InputField
          value={title}
          placeholder="e.g. Take coffee break"
          onChange={({ target }) => setTitle(target.value)}
          isRequired
        />
      </ModalSection>

      <ModalSection>
        <ModalSectionTitle>Description</ModalSectionTitle>
        <TextArea
          rows={4}
          placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
          onChange={({ target }) => setDescription(target.value)}
        />
      </ModalSection>

      <ModalSection>
        <ModalSectionTitle>Subtasks</ModalSectionTitle>
        <InputListContainer>
          {
            subtaskList.map((subtaskText, index) => (
              <InputListItem
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                value={subtaskText}
                placeholderText={subtaskPlaceholders[index] || ''}
                index={index}
                handleOnChange={subtaskOnChange}
                handleRemoveItem={removeSubtask}
              />
            ))
          }
        </InputListContainer>

        <Button
          buttonStyle={BUTTON_TYPES.secondary}
          type="button"
          onClick={addSubtask}
        >
          + Add New Subtask
        </Button>
      </ModalSection>

      <ModalSection>
        <ModalSectionTitle>Status</ModalSectionTitle>
        <Dropdown
          selectedStatus={selectedStatus}
          handleSelectStatus={selectStatus}
        />
      </ModalSection>

      <Button
        type="submit"
        buttonStyle={BUTTON_TYPES.primaryS}
      >
        Create Task
      </Button>
    </ModalContainer>
  );
}

export default AddTaskModal;

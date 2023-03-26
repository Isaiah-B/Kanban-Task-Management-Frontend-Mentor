/* eslint-disable no-param-reassign */
import { useMutation, gql } from '@apollo/client';
import { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import Button, { BUTTON_TYPES } from '../button/button.component';
import InputField from '../input-field/input-field.component';
import Dropdown from '../dropdown/dropdown.component';
import InputListItem from '../input-list-item/input-list-item.component';

import { EDIT_TASK } from '../../queries';
import { ITask } from '../../types';
import { CurrentBoardState, ModalState } from '../../recoilStore';
import useValidateForm from '../../hooks/useValidateForm';

import {
  InputListContainer,
  ModalContainer,
  ModalSection,
  ModalSectionTitle,
  ModalTitle,
  TextArea,
} from './modals.styles';

function EditTaskModal() {
  const currentBoard = useRecoilValue(CurrentBoardState);
  const [modalState, setModalState] = useRecoilState(ModalState);
  const currentTask = modalState.currentItem as ITask;

  const originalStatus = currentTask.status;
  const [title, setTitle] = useState(currentTask.title);
  const [description, setDescription] = useState(currentTask.description);
  const [selectedStatus, setSelectedStatus] = useState(currentTask.status);
  const [subtaskList, setSubtaskList] = useState(
    currentTask.subtasks.map((subtask) => (
      { title: subtask.title, isCompleted: subtask.isCompleted }
    )) || [],
  );

  const [editTask] = useMutation(EDIT_TASK);

  const formRef = useValidateForm();

  const subtaskOnChange = (text: string, subtaskIndex: number) => {
    setSubtaskList(subtaskList.map(
      (subtask, index) => {
        if (index === subtaskIndex) {
          subtask.title = text;
        }
        return subtask;
      },
    ));
  };

  const removeSubtask = (index: number) => {
    setSubtaskList((list) => {
      const listCopy = [...list];
      listCopy.splice(index, 1);
      return listCopy;
    });
  };

  const onEditTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    editTask({
      variables: {
        taskId: currentTask.id,
        title,
        description,
        subtasks: subtaskList,
        originalStatus,
        status: selectedStatus,
      },
      update(cache, { data }) {
        cache.writeFragment({
          id: `Task:${currentTask.id}`,
          fragment: gql`
            fragment EditTask on Task {
              title,
              description,
              subtasks,
              status
            }
          `,
          data: {
            title,
            description,
            subtasks: data.editTask.subtasks,
            status: selectedStatus,
          },
        });

        if (originalStatus !== selectedStatus) {
          const originalCol = currentBoard.columns.find((col) => col.id === originalStatus);
          const newCol = currentBoard.columns.find((col) => col.id === selectedStatus);

          cache.writeFragment({
            id: `Column:${originalStatus}`,
            fragment: gql`
              fragment RemoveTask on Column {
                tasks {
                  id
                }
              }
            `,
            data: {
              tasks: originalCol?.tasks.filter(
                (task) => task.id !== currentTask.id,
              ),
            },
          });

          cache.writeFragment({
            id: `Column:${selectedStatus}`,
            fragment: gql`
              fragment AppendTask on Column {
                tasks {
                  id
                }
              }
            `,
            data: {
              tasks: newCol?.tasks.concat(data.editTask),
            },
          });
        }
      },
    });

    setModalState({ ...modalState, currentItem: {}, isOpen: false });
  };

  return (
    <ModalContainer ref={formRef} onSubmit={(e) => onEditTask(e)}>
      <ModalSection>
        <ModalTitle>Edit Task</ModalTitle>
        <InputField
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          isRequired
        />
      </ModalSection>

      <ModalSection>
        <ModalSectionTitle>Description</ModalSectionTitle>
        <TextArea
          rows={4}
          placeholder="e.g. It&apos;s always good to take a break. This 15 minute break will recharge the batteries a little."
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
      </ModalSection>

      <ModalSection>
        <InputListContainer>
          {
            subtaskList.map((subtask, index) => (
              <InputListItem
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                value={subtask.title}
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
          onClick={() => setSubtaskList(subtaskList.concat({ title: '', isCompleted: false }))}
        >
          + Add New Subtask
        </Button>
      </ModalSection>

      <ModalSection>
        <Dropdown
          selectedStatus={selectedStatus}
          handleSelectStatus={(statusId: string) => setSelectedStatus(statusId)}
        />
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

export default EditTaskModal;

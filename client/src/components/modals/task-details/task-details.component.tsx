import { useState, useRef } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useRecoilState, useRecoilValue } from 'recoil';

import Dropdown from '../../dropdown/dropdown.component';
import OptionsMenu from '../../options-menu/options-menu.component';
import { ReactComponent as VerticalEllipsisIcon } from '../../../assets/icon-vertical-ellipsis.svg';

import { CurrentBoardState, ModalState } from '../../../recoilStore';
import { EDIT_TASK } from '../../../queries';
import { ITask, MODAL_TYPES } from '../../../types';
import useClickOutside from '../../../hooks/useClickOutside';

import {
  OptionsMenuWrapper,
  StatusSection,
  SubtaskCheckbox,
  SubtaskItem,
  SubtasksList,
  SubtaskTitle,
  TaskDetailsContainer,
  TaskDetailsHeader,
  TaskDetailsOptionsButton,
  TaskOptionsContainer,
} from './task-details.styles';

import {
  ModalSection,
  ModalSectionTitle,
  ModalWrapper,
} from '../modals.styles';

function TaskDetails() {
  const currentBoard = useRecoilValue(CurrentBoardState);
  const [modalState, setModalState] = useRecoilState(ModalState);

  const currentTask = modalState.currentItem as ITask;

  const [subtaskList, setSubtaskList] = useState(currentTask.subtasks.map((subtask) => (
    { title: subtask.title, isCompleted: subtask.isCompleted }
  )));
  const subtaskListRef = useRef<{ title: string, isCompleted: boolean }[]>();
  subtaskListRef.current = subtaskList;

  const [optionsOpen, setOptionsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(currentTask.status);
  const originalStatus = currentTask.status;

  const statusRef = useRef<string>();
  statusRef.current = selectedStatus;

  const [editTask] = useMutation(EDIT_TASK, {
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
          title: currentTask.title,
          description: currentTask.description,
          subtasks: data.editTask.subtasks,
          status: statusRef.current,
        },
      });

      // Move task ref to new column if the status was changed
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
          id: `Column:${statusRef.current}`,
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

  const numOfCompletedSubtasks = currentTask.subtasks.reduce((acc, curr) => (
    curr.isCompleted ? acc + 1 : acc
  ), 0);

  const changeStatus = (statusId: string) => {
    setSelectedStatus(statusId);
  };

  function checkSubtasksChanged() {
    if (subtaskListRef.current) {
      const originalSubtasks = subtaskListRef.current.map((subtask) => (
        subtask.isCompleted
      ));

      const currentSubtasks = subtaskList.map((subtask) => (
        subtask.isCompleted
      ));

      return JSON.stringify(originalSubtasks) !== JSON.stringify(currentSubtasks);
    }

    return false;
  }

  // Close the modal and edit the task
  const closeModal = async () => {
    const statusIsChanged = statusRef.current !== originalStatus;
    const subtasksChanged = checkSubtasksChanged();

    if (statusIsChanged || subtasksChanged) {
      editTask({
        variables: {
          taskId: currentTask.id,
          title: currentTask.title,
          description: currentTask.description,
          subtasks: subtaskListRef.current,
          originalStatus,
          status: statusRef.current,
        },
      });
    }

    setModalState({ ...modalState, isOpen: false });
  };

  const onDeleteTask = async () => {
    setModalState({ ...modalState, modalType: MODAL_TYPES.deleteConfirm });
  };

  const openEditTaskModal = () => {
    setModalState({ ...modalState, modalType: MODAL_TYPES.editTask, isOpen: true });
  };

  const onClickCheckbox = (checkedIndex: number) => {
    setSubtaskList(subtaskList.map(
      (subtask, index) => {
        if (index === checkedIndex) {
          return { ...subtask, isCompleted: !subtask.isCompleted };
        }
        return subtask;
      },
    ));
  };

  const ref = useClickOutside(closeModal) as React.RefObject<HTMLDivElement>;

  return (
    <ModalWrapper ref={ref}>
      <TaskDetailsContainer>
        <TaskDetailsHeader>
          <h2>{currentTask.title}</h2>

          <TaskOptionsContainer>
            <TaskDetailsOptionsButton
              onClick={() => setOptionsOpen(!optionsOpen)}
              aria-label="Task options"
            >
              <VerticalEllipsisIcon />
            </TaskDetailsOptionsButton>

            <OptionsMenuWrapper className={optionsOpen ? 'open' : ''}>
              <OptionsMenu
                editText="Edit Task"
                deleteText="Delete Task"
                handleEdit={openEditTaskModal}
                handleDelete={onDeleteTask}
              />
            </OptionsMenuWrapper>
          </TaskOptionsContainer>
        </TaskDetailsHeader>

        <p>{currentTask.description}</p>

        {
          currentTask.subtasks.length > 0
          && (
            <ModalSection>
              <ModalSectionTitle>
                {`Subtasks (${numOfCompletedSubtasks} of ${currentTask.subtasks.length})`}
              </ModalSectionTitle>
              <SubtasksList>
                {
                  subtaskList.map((subtask, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <SubtaskItem key={index}>
                      <input
                        type="checkbox"
                        checked={subtask.isCompleted}
                        onChange={() => onClickCheckbox(index)}
                      />
                      <SubtaskCheckbox />
                      <SubtaskTitle>{subtask.title}</SubtaskTitle>
                    </SubtaskItem>
                  ))
                }
              </SubtasksList>
            </ModalSection>
          )
        }

        <StatusSection>
          <ModalSectionTitle>Current Status</ModalSectionTitle>
          <Dropdown
            selectedStatus={selectedStatus}
            handleSelectStatus={changeStatus}
          />
        </StatusSection>
      </TaskDetailsContainer>
    </ModalWrapper>
  );
}

export default TaskDetails;

import { useSetRecoilState } from 'recoil';
import { Draggable } from 'react-beautiful-dnd';

import { ModalState } from '../../recoilStore';
import { ITask, MODAL_TYPES } from '../../types';

import { TaskCardContainer } from './task-card.styles';

function TaskCard({ index, task }: { index: number, task: ITask }) {
  const { title, subtasks } = task;
  const setModalState = useSetRecoilState(ModalState);

  const handleOpenTaskDetails = () => {
    setModalState({
      isOpen: true,
      currentItem: task,
      modalType: MODAL_TYPES.taskDetails,
    });
  };

  const numOfCompletedSubtasks = task.subtasks.reduce((acc, curr) => (
    curr.isCompleted ? acc + 1 : acc
  ), 0);

  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {
        (provided) => (
          <TaskCardContainer
            onClick={handleOpenTaskDetails}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <h3>{title}</h3>
            <span>{`${numOfCompletedSubtasks} of ${subtasks.length} subtasks`}</span>
          </TaskCardContainer>
        )
      }
    </Draggable>
  );
}

export default TaskCard;

import { Droppable } from 'react-beautiful-dnd';

import TaskCard from '../task-card/task-card.component';

import { IColumn } from '../../types';

import {
  ColumnTaskList,
  BoardColumnCircle,
  BoardColumnContainer,
  BoardColumnHeader,
  BoardColumnName,
} from './board-column.styles';

function BoardColumn({ column, colIndex }: { column: IColumn, colIndex: number }) {
  return (
    <BoardColumnContainer key={column.id}>
      <BoardColumnHeader>
        <BoardColumnCircle colorIndex={colIndex} />
        <BoardColumnName>{`${column.name} (${column.tasks.length})`}</BoardColumnName>
      </BoardColumnHeader>

      <Droppable droppableId={column.id}>
        {
          (provided) => (

            <ColumnTaskList ref={provided.innerRef} {...provided.droppableProps}>
              <div className="list-wrap">
                {
                  column.tasks.map((task, index) => (
                    <TaskCard key={task.id} index={index} task={task} />
                  ))
                }
                {provided.placeholder}

              </div>
            </ColumnTaskList>
          )
       }
      </Droppable>
    </BoardColumnContainer>
  );
}

export default BoardColumn;

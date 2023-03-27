import { useMutation, gql } from '@apollo/client';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import Button, { BUTTON_TYPES } from '../../components/button/button.component';
import BoardColumn from '../../components/board-column/board-column.component';

import {
  BoardsState,
  CurrentBoardState,
  ModalState,
  SideBarState,
  UserState,
} from '../../recoilStore';

import { MOVE_TASK } from '../../queries';
import { IColumn, MODAL_TYPES } from '../../types';

import {
  BoardAreaContainer,
  ColumnsContainer,
  NewColumnBox,
  EmptyNotif,
} from './board-area.styles';

function BoardArea() {
  const currentUser = useRecoilValue(UserState);
  const sidebarOpen = useRecoilValue(SideBarState);
  const boards = useRecoilValue(BoardsState);
  const setModalState = useSetRecoilState(ModalState);
  const [currentBoard, setCurrentBoard] = useRecoilState(CurrentBoardState);

  const [moveTask] = useMutation(MOVE_TASK);

  const handleOnDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    // To prevent mutating the state, the entire state is rebuilt
    // by copying it and replacing the columns altered by the
    // drag and drop operation

    // Copy first level of the column array (id, name)
    const cols = [...currentBoard.columns];

    if (!destination) return;
    if (destination.droppableId === source.droppableId
        && destination.index === source.index) return;

    const sourceCol = cols.find((col) => col.id === source.droppableId);
    const destinationCol = cols.find((col) => col.id === destination.droppableId);

    if (sourceCol && destinationCol) {
      const selectedTask = sourceCol.tasks[source.index];

      // Copy the tasks array as only the first level of each column has been copied

      // Remove task from the source column and add it to the destination column
      const sourceTasks = [...sourceCol.tasks];
      sourceTasks.splice(source.index, 1);
      const updatedSource: IColumn = { ...sourceCol, tasks: sourceTasks };

      // If the source and destination columns are the same, the destination task list
      // should be the same as the source's. Otherwise, copy the tasks from the
      // seperate destination column in to destinationTasks
      const destinationTasks = sourceCol === destinationCol
        ? sourceTasks
        : [...destinationCol.tasks];

      destinationTasks.splice(destination.index, 0, selectedTask);
      const updatedDestination: IColumn = { ...destinationCol, tasks: destinationTasks };
      // Replace the original source and destination columns with the
      // updated ones
      const updatedCols = cols.map((col) => {
        if (col.id === sourceCol.id) {
          return updatedSource;
        }
        if (col.id === destinationCol.id) {
          return updatedDestination;
        }
        return col;
      });

      setCurrentBoard({ ...currentBoard, columns: updatedCols });

      const moveTaskFragment = gql`
      fragment RemoveTask on Column {
        tasks {
          id
        }
      }
    `;

      // Move the task across the columns in the server
      moveTask({
        variables: {
          taskId: selectedTask.id,
          sourceColumnId: sourceCol.id,
          destinationColumnId: destinationCol.id,
          destinationColumnIndex: destination.index,
        },
        // Replace 'tasks' field in the source & destination columns in cache with
        // the updated source/destination task lists for smooth UI change
        update(cache) {
          cache.writeFragment({
            id: `Task:${selectedTask.id}`,
            fragment: gql`
              fragment SetStatus on Task {
                status
              }
            `,
            data: {
              status: destinationCol.id,
            },
          });

          cache.writeFragment({
            id: `Column:${sourceCol.id}`,
            fragment: moveTaskFragment,
            data: {
              tasks: updatedSource,
            },
            broadcast: false,
          });

          cache.writeFragment({
            id: `Column:${destinationCol.id}`,
            fragment: moveTaskFragment,
            data: {
              tasks: updatedDestination,
            },
            broadcast: false,
          });
        },
      });
    }
  };

  const openModal = (modalType: string, isOpen: boolean) => {
    setModalState((state) => ({ ...state, modalType, isOpen }));
  };

  if (!boards.length) {
    return (
      <BoardAreaContainer className={sidebarOpen ? '' : 'sidebar-closed'}>
        <EmptyNotif>
          <h2>You don&apos;t have any boards!</h2>

          <Button
            width="fit-content"
            buttonStyle={BUTTON_TYPES.primaryL}
            onClick={() => openModal(MODAL_TYPES.addBoard, true)}
            disabled={!currentUser.id}
          >
            + Create New Board
          </Button>

        </EmptyNotif>
      </BoardAreaContainer>
    );
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <BoardAreaContainer className={sidebarOpen ? '' : 'sidebar-closed'}>
        {
          currentBoard.columns.length
            ? (
              <ColumnsContainer>
                {
                  currentBoard.columns.map((column, index) => (
                    <BoardColumn key={column.id} column={column} colIndex={index} />
                  ))
                }
                <NewColumnBox onClick={() => openModal(MODAL_TYPES.addColumn, true)}>
                  <h1>+ New Column</h1>
                </NewColumnBox>
              </ColumnsContainer>
            )
            : (
              <EmptyNotif>
                <h2>This board is empty. Create a new column to get started.</h2>
                <Button
                  width="fit-content"
                  buttonStyle={BUTTON_TYPES.primaryL}
                  onClick={() => openModal(MODAL_TYPES.addColumn, true)}
                  aria-label="Show Sidebar"
                >
                  + Add New Column
                </Button>
              </EmptyNotif>
            )
        }
      </BoardAreaContainer>
    </DragDropContext>
  );
}

export default BoardArea;

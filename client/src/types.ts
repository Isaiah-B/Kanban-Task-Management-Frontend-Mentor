export interface IUser {
  id: string,
  username: string,
  boards: IBoard[]
}

export interface IBoard {
  id: string,
  name: string,
  columns: IColumn[]
  __typename?: string,
}

export interface IColumn {
  id: string,
  name: string,
  tasks: ITask[],
}

export interface ITask {
  id: string,
  title: string,
  description: string,
  status: string,
  subtasks: ISubtask[]
  __typename?: string,
}

export interface ISubtask {
  id: string,
  title: string,
  isCompleted: boolean
}

export const MODAL_TYPES = {
  taskDetails: 'taskDetails',
  addTask: 'addTask',
  editTask: 'editTask',
  addBoard: 'addBoard',
  editBoard: 'editBoard',
  deleteConfirm: 'deleteConfirm',
  addColumn: 'addColumn',
  login: 'login',
  signup: 'signup',
};

import { atom } from 'recoil';
import { IBoard, ITask } from './types';

export const ThemeState = atom({
  key: 'Theme',
  default: '',
  effects_UNSTABLE: [
    ({ setSelf }) => {
      const storedTheme = localStorage.getItem('kanban-theme');
      if (storedTheme) setSelf(storedTheme);
      else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        localStorage.setItem('kanban-theme', 'dark');
        setSelf('dark');
      } else {
        localStorage.setItem('kanban-theme', 'light');
        setSelf('light');
      }
    },
  ],
});

export const UserState = atom({
  key: 'User',
  default: {
    id: null,
    token: null,
  },
});

export const BoardsState = atom({
  key: 'Boards',
  default: [] as IBoard[],
});

export const CurrentBoardState = atom({
  key: 'CurrentBoard',
  default: {} as IBoard,
});

export const SideBarState = atom({
  key: 'SidebarOpen',
  default: true,
});

export const TaskDetailsModalState = atom({
  key: 'TaskView',
  default: {
    isOpen: false,
    currentTask: {} as ITask,
  },
});

export const ModalState = atom({
  key: 'SelectedModal',
  default: {
    isOpen: false,
    modalType: '',
    currentItem: {} as ITask | IBoard | {},
  },
});

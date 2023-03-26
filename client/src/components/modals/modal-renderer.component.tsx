import ReactDOM from 'react-dom';
import { useRecoilValue } from 'recoil';

import { ModalState } from '../../recoilStore';

import TaskDetails from './task-details/task-details.component';
import AddTaskModal from './add-task-modal.component';
import AddBoardModal from './add-board-modal.component';
import EditTaskModal from './edit-task-modal.component';
import EditBoardModal from './edit-board-modal.component';
import DeleteConfirmModal from './delete-confirm-modal.component';
import withModalWrapper from './modal-wrapper.component';
import AddColumnModal from './add-column-modal.components';
import Login from './auth/login.component';
import Signup from './auth/signup.component';

function ModalRenderer() {
  const modalState = useRecoilValue(ModalState);

  let SelectedModal = withModalWrapper(AddTaskModal);

  interface StringIndex {
    [index: string] : any,
  }

  const MODAL_SELECTION: StringIndex = {
    taskDetails: TaskDetails,
    addTask: withModalWrapper(AddTaskModal),
    editTask: withModalWrapper(EditTaskModal),
    addBoard: withModalWrapper(AddBoardModal),
    editBoard: withModalWrapper(EditBoardModal),
    deleteConfirm: withModalWrapper(DeleteConfirmModal),
    addColumn: withModalWrapper(AddColumnModal),
    login: withModalWrapper(Login, true),
    signup: withModalWrapper(Signup, true),
  };

  if (modalState.modalType.length) {
    SelectedModal = MODAL_SELECTION[modalState.modalType];
  }
  if (!modalState.isOpen) return null;

  return ReactDOM.createPortal(
    <SelectedModal />,
    document.getElementById('modal-root') as Element,
  );
}

export default ModalRenderer;

import React, { RefObject } from 'react';
import { useRecoilState } from 'recoil';

import { ModalState } from '../../recoilStore';
import useClickOutside from '../../hooks/useClickOutside';

import { ModalWrapper } from './modals.styles';

// Allow string indexing of props
interface ComponentProps {
  [x: string]: any,
}

function withModalWrapper<P extends ComponentProps>(
  Component: React.ComponentType<P>,
  nullRef: boolean = false,
) {
  return function Wrapper({ ...props }) {
    const [modalState, setModalState] = useRecoilState(ModalState);

    const closeModal = () => {
      setModalState({ ...modalState, isOpen: false });
    };

    let modalRef;

    // nullRef prevents use of useClickoutside
    if (nullRef) modalRef = null;
    else modalRef = useClickOutside(closeModal) as RefObject<HTMLDivElement>;

    return (
      <ModalWrapper id="modal-wrap" ref={modalRef}>
        <Component {...(props as P)} />
      </ModalWrapper>
    );
  };
}

export default withModalWrapper;

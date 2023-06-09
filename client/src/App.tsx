import { useQuery } from '@apollo/client';
import { ThemeProvider } from 'styled-components';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import BoardContainer from './layouts/board-container/board-container.component';
import Loader from './components/loader/loader.component';

import { ME } from './queries';
import { dark, light } from './themes';
import { MODAL_TYPES } from './types';
import { ModalState, ThemeState, UserState } from './recoilStore';

import { GlobalStyles } from './index.styles';

function App() {
  const [currentUser, setCurrentUser] = useRecoilState(UserState);
  const setModalState = useSetRecoilState(ModalState);
  const theme = useRecoilValue(ThemeState) === 'light' ? light : dark;

  const { loading } = useQuery(ME, {
    onCompleted: ((data) => setCurrentUser({ ...currentUser, id: data.me._id })),
    onError: (() => {
      setModalState((state) => ({ ...state, isOpen: true, modalType: MODAL_TYPES.login }));
    }),
  });

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {
        loading
          ? <Loader />
          : <BoardContainer />
      }
    </ThemeProvider>
  );
}

export default App;

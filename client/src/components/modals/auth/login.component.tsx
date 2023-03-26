import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useRecoilState, useSetRecoilState } from 'recoil';

import InputField from '../../input-field/input-field.component';
import Button, { BUTTON_TYPES } from '../../button/button.component';

import { LOGIN } from '../../../queries';
import { MODAL_TYPES } from '../../../types';
import { ModalState, UserState } from '../../../recoilStore';
import useValidateForm from '../../../hooks/useValidateForm';

import {
  AuthFormContainer,
  AuthErrorText,
  FormNavButton,
  FormNavText,
} from './auth-modal.styles';

import {
  ModalSection,
  ModalSectionTitle,
  ModalTitle,
} from '../modals.styles';

function Login() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [currentUser, setCurrentUser] = useRecoilState(UserState);
  const setModalState = useSetRecoilState(ModalState);

  const [login] = useMutation(LOGIN);

  const openSignup = () => {
    setModalState((state) => ({ ...state, modalType: MODAL_TYPES.signup }));
  };

  const submitLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    login({
      variables: { username, password },
      onCompleted(data) {
        const { id, token } = data.login;
        localStorage.setItem('kanban-token', token);
        setCurrentUser({ id, token });

        setUsername('');
        setPassword('');
        setModalState((state) => ({ ...state, isOpen: false, modalType: '' }));
      },
      onError(err) {
        setErrorMessage(err.message);
      },
    });
  };

  const formRef = useValidateForm();

  if (currentUser.id) {
    setModalState((state) => ({ ...state, isOpen: false, modalType: '' }));
  }

  return (
    <AuthFormContainer ref={formRef} onSubmit={(e) => submitLogin(e)}>
      <ModalTitle>Login</ModalTitle>

      <ModalSection>
        <ModalSectionTitle>Username</ModalSectionTitle>
        <InputField
          type="text"
          placeholder="Username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          isRequired
        />
      </ModalSection>

      <ModalSection>
        <ModalSectionTitle>Password</ModalSectionTitle>
        <InputField
          type="password"
          placeholder="Password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          isRequired
        />
      </ModalSection>

      <Button
        buttonStyle={BUTTON_TYPES.primaryL}
        type="submit"
      >
        Login
      </Button>

      {
        errorMessage.length
          ? <AuthErrorText>{errorMessage}</AuthErrorText>
          : null
      }

      <FormNavText>
        Don&apos;t have an account?&nbsp;
        <FormNavButton
          type="button"
          onClick={() => openSignup()}
        >
          Sign up
        </FormNavButton>
      </FormNavText>
    </AuthFormContainer>
  );
}

export default Login;

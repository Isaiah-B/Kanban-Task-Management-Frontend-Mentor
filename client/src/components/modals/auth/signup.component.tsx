import { useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useMutation } from '@apollo/client';

import InputField from '../../input-field/input-field.component';
import Button, { BUTTON_TYPES } from '../../button/button.component';

import { MODAL_TYPES } from '../../../types';
import { ModalState, UserState } from '../../../recoilStore';
import useValidateForm from '../../../hooks/useValidateForm';

import { SIGNUP } from '../../../queries';

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

function Signup() {
  const setModalState = useSetRecoilState(ModalState);
  const [currentUser, setCurrentUser] = useRecoilState(UserState);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const formRef = useValidateForm();

  const [signup] = useMutation(SIGNUP);

  const openLogin = () => {
    setModalState((state) => ({ ...state, modalType: MODAL_TYPES.login }));
  };

  const submitSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    signup({
      variables: {
        username,
        password,
        passwordConfirm,
      },
      onCompleted: ((data) => {
        const { id, token } = data.signup;

        localStorage.setItem('kanban-token', token);
        setCurrentUser({ id, token });

        setUsername('');
        setPassword('');
        setPasswordConfirm('');

        setModalState((state) => ({ ...state, isOpen: false, modalType: '' }));
      }),
      onError: ((error) => {
        setErrorMessage(error.message);
      }),
    });
  };

  if (currentUser.id) {
    setModalState((state) => ({ ...state, isOpen: false, modalType: '' }));
  }

  return (
    <AuthFormContainer ref={formRef} onSubmit={(e) => submitSignup(e)}>
      <ModalTitle>Sign Up</ModalTitle>

      <ModalSection>
        <ModalSectionTitle>Username</ModalSectionTitle>
        <InputField
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          isRequired
        />
      </ModalSection>

      <ModalSection>
        <ModalSectionTitle>Password</ModalSectionTitle>
        <InputField
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          isRequired
        />
      </ModalSection>

      <ModalSection>
        <ModalSectionTitle>Confirm Password</ModalSectionTitle>
        <InputField
          type="password"
          value={passwordConfirm}
          onChange={({ target }) => setPasswordConfirm(target.value)}
          isRequired
        />
      </ModalSection>

      <Button
        type="submit"
        buttonStyle={BUTTON_TYPES.primaryL}
      >
        Sign Up
      </Button>

      {
        errorMessage.length
          ? <AuthErrorText>{errorMessage}</AuthErrorText>
          : null
      }

      <FormNavText>
        Already have an account?&nbsp;
        <FormNavButton
          type="button"
          onClick={() => openLogin()}
        >
          Log in
        </FormNavButton>
      </FormNavText>
    </AuthFormContainer>
  );
}

export default Signup;

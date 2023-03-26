import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { RecoilRoot } from 'recoil';

import App from './App';

import createApolloClient from './apolloClient';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

const client = createApolloClient();

root.render(
  <RecoilRoot>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </RecoilRoot>,
);

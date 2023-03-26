import { setContext } from '@apollo/client/link/context';

import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client';

const createApolloClient = () => {
  const httpLink = createHttpLink({
    uri: 'http://localhost:8000/graphql',
  });

  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('kanban-token');
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  const cache = new InMemoryCache({
    typePolicies: {
      Column: {
        fields: {
          tasks: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache,
  });

  return client;
};

export default createApolloClient;

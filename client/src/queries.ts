import { gql } from '@apollo/client';

export const ME = gql`
  query Me {
    me {
      _id
    }
  }
`;

const TASK_FIELDS = gql`
  fragment TaskFields on Task {
    id
    title
    description
    subtasks {
      id
      title
      isCompleted
    }
    status
  }
`;

const BOARD_FIELDS = gql`
  fragment BoardFields on Board {
    id
    name
    columns {
      id
      name
      tasks {
        id
        title
        description
        subtasks {
          id
          title
          isCompleted
        }
        status
      }
    }
  }
`;

export const GET_USER_BOARDS = gql`
  query GetUserBoards {
    getUserBoards {
      _id
      username
      boards {
        id
        name
        columns {
          id
          name
          tasks {
            id
            title
            description
            subtasks {
              id
              title
              isCompleted
            }
            status
          }
        }
      }
    }
  }
`;

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      token
    }
  }
`;

export const SIGNUP = gql`
  mutation Signup($username: String!, $password: String!, $passwordConfirm: String!){
    signup(username: $username, password: $password, passwordConfirm: $passwordConfirm) {
      id
      token
    }
  }
`;
export const MOVE_TASK = gql`
  ${TASK_FIELDS}
  mutation MoveTask($taskId: ID!, $sourceColumnId: ID!, $destinationColumnId: ID!, $destinationColumnIndex: Int!) {
    moveTask(taskId: $taskId, sourceColumnId: $sourceColumnId, destinationColumnId: $destinationColumnId, destinationColumnIndex: $destinationColumnIndex) {
      ...TaskFields
    }
  }
`;

export const ADD_TASK = gql`
  ${TASK_FIELDS}
  mutation AddTask($columnId: ID!, $title: String!, $description: String!, $subtasks: [String]!) {
    addTask(columnId: $columnId, title: $title, description: $description, subtasks: $subtasks) {
      ...TaskFields
    }
  }
`;

export const ADD_BOARD = gql`
  ${BOARD_FIELDS}
  mutation AddBoard($name: String!, $columns: [String!]!) {
    addBoard(name: $name, columns: $columns) {
      ...BoardFields
    }
  }
`;

export const DELETE_TASK = gql`
  ${TASK_FIELDS}
  mutation DeleteTask($taskId: ID!) {
    deleteTask(taskId: $taskId) {
      ...TaskFields
    }
  }
`;

export const EDIT_TASK = gql`
  ${TASK_FIELDS}
  mutation EditTask($taskId: ID!, $title: String!, $description: String!, $subtasks: [SubtaskInput]!, $originalStatus: ID!, $status: ID!) {
    editTask(taskId: $taskId, title: $title, description: $description, subtasks: $subtasks, originalStatus: $originalStatus, status: $status) {
      ...TaskFields
    }
  }
`;

export const EDIT_BOARD = gql`
  ${BOARD_FIELDS}
  mutation EditBoard($boardId: ID!, $boardName: String!, $columnNames: [String]!) {
    editBoard(boardId: $boardId, boardName: $boardName, columnNames: $columnNames) {
      ...BoardFields
    }
  }
`;

export const DELETE_BOARD = gql`
  ${BOARD_FIELDS}
  mutation DeleteBoard($boardId: ID!) {
    deleteBoard(boardId: $boardId) {
      ...BoardFields
    }
  }
`;

export const ADD_COLUMNS = gql`
  mutation AddColumns($boardId: ID!, $columnNames: [String!]!) {
    addColumns(boardId: $boardId, columnNames: $columnNames) {
      id
      name
      tasks {
        id
        title
        description
        subtasks {
          id
          title
          isCompleted
        }
        status
      }
    }
  }
`;

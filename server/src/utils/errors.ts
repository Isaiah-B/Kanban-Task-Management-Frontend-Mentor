import { GraphQLError } from 'graphql';

function sendErrorDev(error: any) {
  if (!(error instanceof GraphQLError)) {
    switch (error.constructor.name) {
      case 'MongoServerError':
        if (error.code === 11000) {
          return new GraphQLError('A user with this name already exists', {
            extensions: { code: 'BAD_USER_INPUT' }
          });
        }
        break;
      case 'ValidationError':
        if (error.errors) {
          const message = error.errors[Object.keys(error.errors)[0]].message;
          return new GraphQLError(message, {
            extensions: { code: 'VALIDATION_ERROR' }
          });
        }
        break;
      default:
        console.log(`UNHANDLED_ERROR: ${error.constructor.name}`);
        return error;
    }
  }

  return error;
}

// Normalize all errors types to GraphQLError
export function handleErrors(error: unknown) {
  if (process.env.NODE_ENV === 'development') {
    return sendErrorDev(error);
  }
}
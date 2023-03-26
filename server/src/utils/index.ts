import { GraphQLError } from 'graphql';
import mongoose from 'mongoose';
import User from '../models/user-model';

export async function checkUserExists(userId: string) {
  try {
    const user = await User.findById(userId);
  
    if (!user) throw new GraphQLError('User not found', {
      extensions: { code: 'USER_NOT_FOUND' },
    });
  } catch (err) {
    return err;
  }
}

export function checkUserHasBoard(userBoards, boardId: mongoose.Types.ObjectId) {
  if (!userBoards.includes(boardId)) {
    throw new GraphQLError('User does not own this board', {
      extensions: { code: 'FORBIDDEN' },
    });
  }

  return;
}

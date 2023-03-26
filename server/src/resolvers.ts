import { Document, } from 'mongoose';
import { GraphQLError } from 'graphql';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import Board from './models/board-model.js';
import Column from './models/column-model.js';
import Task, { ISubtask } from './models/task-model.js';
import User from './models/user-model.js';

import { checkUserExists, checkUserHasBoard } from './utils/index.js';
import { handleErrors } from './utils/errors.js';

const resolvers = {
  Query: {
    me: (parent: undefined, args: Record<string, any>, { currentUser }) => {
      return currentUser;
    },
    allBoards: async () => {
      return Board.find({});
    },
    getBoard: async (_: any, args: any, { currentUser }) => {
      try {
        checkUserHasBoard(currentUser._id, args.id);
        return Board.findOne({ _id: args.id });
      } catch (err) {
        return handleErrors(err);
      }
    },
    getUserBoards: async (_: any, __: any, { currentUser }) => {
      try {
        checkUserExists(currentUser._id);
        return User.findById(currentUser._id);
      } catch (err) {
        return handleErrors(err);
      }
    }
  },

  User: {
    boards: async (parent: any) => {
      const userBoards = await parent.populate('boards');
      return userBoards.boards;
    }
  },
  Board: {
    columns: async (parent: any) => {
      const boardCols = await parent.populate('columns');
      return boardCols.columns;
    }
  },
  Column: {
    tasks: async (parent: any) => {
      const columnTasks = await parent.populate('tasks');
      return columnTasks.tasks;
    }
  },

  Mutation: {
    addBoard: async (_: any, args: any, { currentUser }) => {
      try {
        const newBoard = new Board({ name: args.name });

        // Create empty columns for each column name provided
        // and add them to the board's 'columns' array 
        if (args.columns) {
          for (let i=0; i < args.columns.length; i++) {
            const newColumn = await Column.create({
              name: args.columns[i],
              board: newBoard._id,
            });
            newBoard.columns.push(newColumn._id);
          }
        }

        await newBoard.save();

        if (currentUser.username !== 'guest') {
          currentUser.boards.push(newBoard._id);
          await currentUser.save();
        }

        return newBoard;
      } catch (err) {
        return handleErrors(err);
      }
    },

    editBoard: async (_: any, args: any, { currentUser }) => {
      const { boardId, boardName, columnNames } = args;

      try {
        checkUserExists(currentUser._id);
        checkUserHasBoard(currentUser.boards, boardId);

        const board = await Board.findByIdAndUpdate(boardId, 
          { name: boardName },
          { new: true }
        );
        
        
        if (columnNames.length) {
          // Set length of board's column list to that of the columnNames list if
          // columns were deleted
          if (columnNames.length < board.columns.length) {
            const columnsToDelete = board.columns.splice(columnNames.length);
            columnsToDelete.forEach(async (columnId) => await Column.deleteOne({ _id: columnId }));
          }

          for (let i = 0; i < columnNames.length; i++) {

            // If a column exists at i, rename it; otherwise create a new column
            if (board.columns[i]) {
              await Column.findByIdAndUpdate(board.columns[i],
                { name: columnNames[i] }  
              );
            } else {
              const newColumn = await Column.create({ name: columnNames[i] });
              board.columns.push(newColumn._id);
            }
          }
        } else {
          board.columns = [];
        }

        await board.save();
        return board;

      } catch (err) {
        return handleErrors(err);
      }
    },

    deleteBoard: async (_: any, args: any, { currentUser }) => {
      try {
        checkUserExists(currentUser._id);
        checkUserHasBoard(currentUser.boards, args.boardId);
  
        const deletedBoard = await Board.findOneAndRemove({ _id: args.boardId });

        // Delete boardId from user's board array
        await User.findByIdAndUpdate({ _id: currentUser._id },
          { boards: currentUser.boards.filter((id) => id.toString() !== args.boardId.toString()) }
        );

        return deletedBoard;
      } catch (err) {
        return err;
      }
    },

    addColumns: async (_: any, args: any) => {
      const board = await Board.findById(args.boardId);
      let newColumn: Document;

      for (let i=0; i < args.columnNames.length; i++) {
        newColumn = await Column.create({
          name: args.columnNames[i],
          board: board._id,
        });
        board.columns.push(newColumn._id);
      }

      board.save();
      return newColumn;
    },

    removeColumns: async (_: any, args: any) => {
      const board = await Board.findById(args.boardId);

      board.columns = board.columns.filter((id) => !args.columnIds.includes(id.toString()));

      await Column.deleteMany({
        _id: {
          $in: args.columnIds
        }
      });
            
      board.save();
      return board;
    },

    addTask: async (_: any, args: any) => {
      const { title, description, subtasks } = args;

      const column = await Column.findById(args.columnId).populate('tasks');

      const newTask = await Task.create({
        title,
        description,
        status: column.id
      });

      if (subtasks.length) {
        for (let i=0; i < subtasks.length; i++) {
          const newSubtask = { title: subtasks[i], isCompleted: false };
          newTask.subtasks.push(newSubtask);
        }
        await newTask.save();
      }

      column.tasks.push(newTask._id);
      column.save();

      return newTask;
    },
    
    deleteTask: async (_: any, args: any) => {
      const deletedTask = await Task.findByIdAndRemove(args.taskId);
      
      const column = await Column.findById(deletedTask.status);
      column.tasks = column.tasks.filter((id) => id.toString() !== args.taskId);
      column.save();

      return deletedTask;
    },

    moveTask: async (_: any, args: any) => {
      const { sourceColumnId, destinationColumnId, destinationColumnIndex, taskId } = args;
      
      const task = await Task.findById(taskId);
      
      // Remove task from the source column
      await Column.findOneAndUpdate(
        { _id: sourceColumnId },
        { $pull: { tasks: taskId } }
      );

      // Add task to the destination column
      const destintationColumn = await Column.findOneAndUpdate(
        { _id: destinationColumnId },
        { 
          $push: {
            tasks: {
              $each: [task],
              $position: destinationColumnIndex
            } 
          } 
        }
      );

      task.status = destintationColumn.id;

      await task.save();
      return task;
    },

    editTask: async (_: any, args: any) => {
      try {
        const {
          taskId,
          title,
          description,
          subtasks,
          originalStatus,
          status,
        } = args;
  
        const updatedTask = await Task.findByIdAndUpdate(taskId, {
          title,
          description,
          status,
        });
        
        if (subtasks.length) {
          // If the original subtask list has more items than the updated list,
          // remove any extra items from the original
          if (updatedTask.subtasks.length > subtasks.length) {
            updatedTask.subtasks.splice(subtasks.length - updatedTask.subtasks.length);
          }
  
          for (let i = 0; i < subtasks.length; i++) {
            // If a subtask exists in the original list at i, change its title, otherwise create
            // a new subtask
            if (updatedTask.subtasks[i]) {
              updatedTask.subtasks[i].title = subtasks[i].title;
              updatedTask.subtasks[i].isCompleted = subtasks[i].isCompleted;
            } else {
              const newSubtask: ISubtask = { title: subtasks[i].title, isCompleted: false };
              updatedTask.subtasks.push(newSubtask);
            }
          }
        } else {
          updatedTask.subtasks = [];
        }
        
        // If the task's status was changed, remove it from the
        // original column and append it to the new column
        if (originalStatus !== status) {
          await Column.findOneAndUpdate(
            { _id: originalStatus },
            { $pull: { tasks: taskId } },
          );
          
          await Column.findOneAndUpdate(
            { _id: status },
            { $push: { tasks: taskId } }
          );
        }

        await updatedTask.save();
        return updatedTask;

      } catch (err) {
        console.log(err);
      }
    },

    signup: async (_: any, args: any, { currentUser }) => {
      if (!currentUser.role && currentUser.role !== 'guest') return;

      try {
        const { username, password, passwordConfirm } = args;
        const newUser = await User.create({ username, password, passwordConfirm });
        
        const userForToken = {
          username,
          id: newUser._id
        };

        const token = jwt.sign(userForToken, process.env.JWT_SECRET);
      
        return {
          id: newUser._id,
          token,
        };

      } catch (err) {
        return handleErrors(err);
      }
    },

    login: async (_: any, args: any, { currentUser }) => {
      if (!currentUser.role && currentUser.role !== 'guest') return;

      try {
        const { username, password } = args;

        if (!username || !password) {
          throw new GraphQLError('Username or password not provided', {
            extensions: { code: 'BAD_USER_INPUT' }
          });
        }
        
        const user = await User.findOne({ username }).select('+password');
        const passwordMatch = user && await bcrypt.compare(password, user.password);

        if (!user || !passwordMatch) {
          throw new GraphQLError('Username and password do not match', {
            extensions: { code: 'BAD_USER_INPUT' }
          });
        }

        const userForToken = {
          username,
          id: user._id
        };

        return {
          id: user._id,
          token: jwt.sign(userForToken, process.env.JWT_SECRET)
        };

      } catch (err) {
        return handleErrors(err);
      }
    }
  }
};

export default resolvers;

import mongoose from 'mongoose';

export interface ISubtask {
  title: string,
  isCompleted: boolean,
}

export interface ITask {
  title: string,
  description?: string,
  status?: string,
  subtasks: [ISubtask?],
}

const taskSchema = new mongoose.Schema<ITask>({
  title: {
    type: String,
    required: [true, 'Task must have a title'],
  },
  description: {
    type: String,
  },
  status: {
    type: String,
  },
  subtasks: [
    {
      title: {
        type: String,
        required: [true, 'Subtask must have a title'],
      },
      isCompleted: {
        type: Boolean,
      }
    }
  ]
});

export default mongoose.model('Task', taskSchema);

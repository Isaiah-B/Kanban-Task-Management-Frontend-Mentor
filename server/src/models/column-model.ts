import mongoose from 'mongoose';
import Task from './task-model.js';

export interface IColumn {
  name: string,
  tasks: mongoose.Types.ObjectId[],
  board: mongoose.Schema.Types.ObjectId,
}

const columnSchema = new mongoose.Schema<IColumn>({
  name: {
    type: String,
    required: [true, 'Column must have a name'],
  },
  tasks: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Task',
    }
  ],
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board'
  }
});

// Cascade delete tasks
columnSchema.pre('deleteOne', async function() {
  await Task.deleteMany({ status: this.getQuery()._id });
});

export default mongoose.model('Column', columnSchema);
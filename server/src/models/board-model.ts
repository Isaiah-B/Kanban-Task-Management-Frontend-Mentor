import mongoose from 'mongoose';
import Column from './column-model';

interface IBoard {
  name: string,
  columns: mongoose.Types.ObjectId[],
}

const boardSchema = new mongoose.Schema<IBoard>({
  name: {
    type: String,
    required: [true, 'Board must have a name'],
  },
  columns: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Column',
    }
  ],
});

boardSchema.pre('findOneAndRemove', async function() {
  const columnsToDelete = await Column.find({ board: this.getQuery()._id });
  const columnIds = columnsToDelete.map((column) => column._id);
  columnIds.forEach(async (id) => (
    await Column.deleteOne({ _id: id })
  ));
});

export default mongoose.model('Board', boardSchema);
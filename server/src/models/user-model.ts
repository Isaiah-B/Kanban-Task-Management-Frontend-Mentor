import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

interface IUser {
  username: string,
  password: string,
  passwordConfirm: string | undefined,
  boards: mongoose.Types.ObjectId[],
}

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    select: false,
  },
  passwordConfirm: {
    type: String,
    validate: {
      validator(this: IUser, value: string) {
        return value === this.password;
      },
      message: 'Passwords do not match'
    }
  },
  boards: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Board'
    }
  ]
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  return next();
});

export default mongoose.model('User', userSchema);

import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import { User } from '../user/model';
import { Freet } from '../freet/model';


export type Bookmark = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freetId: Freet;
  userId: User;
  publicFreet: Boolean;
};

const BookmarkSchema = new Schema({
    freetId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  publicFreet: {
    type: Boolean,
    required: true
  }
});

const BookmarkModel = model<Bookmark>('Bookmark', BookmarkSchema);
export default BookmarkModel;

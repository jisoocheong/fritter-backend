import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Bookmark} from '../bookmark/model';
import { Freet } from 'freet/model';

// Update this if you add a property to the Bookmark type!
type BookmarkResponse = {
  _id: string;
  user: string;
  freet: Freet;
  content: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Bookmark object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Bookmark>} bookmark - A bookmark
 * @returns {BookmarkResponse} - The bookmark object formatted for the frontend
 */
const constructBookmarkResponse = (bookmark: HydratedDocument<Bookmark>): BookmarkResponse => {
  const bookmarkCopy: Bookmark = {
    ...bookmark.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  // const userCopy: User = {
  //   ...user.toObject({
  //     versionKey: false // Cosmetics; prevents returning of __v property
  //   })
  // };
  // delete userCopy.password;
  // return {
  //   ...userCopy,
  //   _id: userCopy._id.toString(),
  //   dateJoined: formatDate(user.dateJoined)
  // };
  const {username} = bookmarkCopy.userId;
  delete bookmarkCopy.userId;
  return {
    ...bookmarkCopy,
    _id: bookmarkCopy._id.toString(),
    user: username,
    freet: bookmarkCopy.freetId,
    content: bookmarkCopy.freetId.content
  };
};

export {
  constructBookmarkResponse
};

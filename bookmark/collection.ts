import type {HydratedDocument, Types} from 'mongoose';
import { User } from 'user/model';
import type {Bookmark} from './model';
import BookmarkModel from './model';
import { Freet } from '../freet/model';
import UserCollection from '../user/collection';



class BookmarkCollection {
  /**
   * Add a new bookmark
   *
   * @param {Freet} freetId - The freet that is bookmarked
   * @param {User} userId - The userId of user that is bookmarking
   * @param {Boolean} publicFreet - The public or private status of the bookmark
   * @return {Promise<HydratedDocument<Bookmark>>} - The newly created bookmark
   */
  static async addOne(freetId: Freet, userId: User, publicFreet: boolean): Promise<HydratedDocument<Bookmark>> {
    const bookmark = new BookmarkModel({freetId, userId, publicFreet});
    await bookmark.save(); // Saves bookmark to MongoDB
    return bookmark;
  }

    /**
   * Remove a bookmark from the collection.
   *
   * @param {Freet} freetId - The freetId of the freet to remove from bookmarks
   * @param {User} userId - The userId of user that is removing the bookmark
   * @return {Promise<Boolean>} - true if the bookmark has been removed, false otherwise
   */
     static async removeOne(freetId: Freet, userId: User): Promise<boolean> {
        const bookmark = await BookmarkModel.deleteOne({freetId: freetId, userId: userId});
        return bookmark !== null;
      }


    /**
   * Retrieves all of the bookmarks of a user.
   *
   * @param {string} userId - The userId of user that we are getting bookmarks from
   * @return {Promise<HydratedDocument<Bookmark>[]>} - An array of all of the Bookmark
   */
     static async findAllByUser(userId: string): Promise<Array<HydratedDocument<Bookmark>>> {
        const author = await UserCollection.findOneByUsername(userId);
        return BookmarkModel.find({authorId: author._id}).populate('authorId');

      }

    /**
   * Retrieves a bookmark by its id.
   *
   * @param {string} bookmarkId - The userId of user that we are getting bookmarks from
   * @return Bookmark bookmark - An array of all of the Bookmark
   */
     static async findOne(bookmarkId: string): Promise<Bookmark> {
      // const author = await UserCollection.findOneByUsername(userId);
      return BookmarkModel.findById(bookmarkId);

    }
    
}

export default BookmarkCollection;

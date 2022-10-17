import type {HydratedDocument, Types} from 'mongoose';
import type {Bookmark} from './model';
import BookmarkModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore bookmarks
 * stored in MongoDB, including adding, finding, updating, and deleting bookmarks.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Bookmark> is the output of the BookmarkModel() constructor,
 * and contains all the information in Bookmark. https://mongoosejs.com/docs/typescript.html
 */
class BookmarkCollection {
  /**
   * Add a bookmark to the collection
   *
   * @param {string} authorId - The id of the author of the bookmark
   * @param {string} content - The id of the content of the bookmark
   * @return {Promise<HydratedDocument<Bookmark>>} - The newly created bookmark
   */
  static async addOne(authorId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Bookmark>> {
    const date = new Date();
    const bookmark = new BookmarkModel({
      authorId,
      dateCreated: date,
      content,
      dateModified: date
    });
    await bookmark.save(); // Saves bookmark to MongoDB
    return bookmark.populate('authorId');
  }

  /**
   * Find a bookmark by bookmarkId
   *
   * @param {string} bookmarkId - The id of the bookmark to find
   * @return {Promise<HydratedDocument<Bookmark>> | Promise<null> } - The bookmark with the given bookmarkId, if any
   */
  static async findOne(bookmarkId: Types.ObjectId | string): Promise<HydratedDocument<Bookmark>> {
    return BookmarkModel.findOne({_id: bookmarkId}).populate('authorId');
  }

  /**
   * Get all the bookmarks in the database
   *
   * @return {Promise<HydratedDocument<Bookmark>[]>} - An array of all of the bookmarks
   */
  static async findAll(): Promise<Array<HydratedDocument<Bookmark>>> {
    // Retrieves bookmarks and sorts them from most to least recent
    return BookmarkModel.find({}).sort({dateModified: -1}).populate('authorId');
  }

  /**
   * Get all the bookmarks in by given author
   *
   * @param {string} username - The username of author of the bookmarks
   * @return {Promise<HydratedDocument<Bookmark>[]>} - An array of all of the bookmarks
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Bookmark>>> {
    const author = await UserCollection.findOneByUsername(username);
    return BookmarkModel.find({authorId: author._id}).populate('authorId');
  }

  /**
   * Update a bookmark with the new content
   *
   * @param {string} bookmarkId - The id of the bookmark to be updated
   * @param {string} content - The new content of the bookmark
   * @return {Promise<HydratedDocument<Bookmark>>} - The newly updated bookmark
   */
  static async updateOne(bookmarkId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Bookmark>> {
    const bookmark = await BookmarkModel.findOne({_id: bookmarkId});
    bookmark.content = content;
    bookmark.dateModified = new Date();
    await bookmark.save();
    return bookmark.populate('authorId');
  }

  /**
   * Delete a bookmark with given bookmarkId.
   *
   * @param {string} bookmarkId - The bookmarkId of bookmark to delete
   * @return {Promise<Boolean>} - true if the bookmark has been deleted, false otherwise
   */
  static async deleteOne(bookmarkId: Types.ObjectId | string): Promise<boolean> {
    const bookmark = await BookmarkModel.deleteOne({_id: bookmarkId});
    return bookmark !== null;
  }

  /**
   * Delete all the bookmarks by the given author
   *
   * @param {string} authorId - The id of author of bookmarks
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await BookmarkModel.deleteMany({authorId});
  }
}

export default BookmarkCollection;

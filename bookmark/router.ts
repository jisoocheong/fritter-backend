import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import BookmarkCollection from './collection';
import * as userValidator from '../user/middleware';
import * as bookmarkValidator from '../bookmark/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the bookmarks
 *
 * @name GET /api/bookmarks
 *
 * @return {BookmarkResponse[]} - A list of all the bookmarks sorted in descending
 *                      order by date modified
 */
/**
 * Get bookmarks by author.
 *
 * @name GET /api/bookmarks?authorId=id
 *
 * @return {BookmarkResponse[]} - An array of bookmarks created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.author !== undefined) {
      next();
      return;
    }

    const allBookmarks = await BookmarkCollection.findAll();
    const response = allBookmarks.map(util.constructBookmarkResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const authorBookmarks = await BookmarkCollection.findAllByUsername(req.query.author as string);
    const response = authorBookmarks.map(util.constructBookmarkResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new bookmark.
 *
 * @name POST /api/bookmarks
 *
 * @param {string} content - The content of the bookmark
 * @return {BookmarkResponse} - The created bookmark
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the bookmark content is empty or a stream of empty spaces
 * @throws {413} - If the bookmark content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    bookmarkValidator.isValidBookmarkContent
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const bookmark = await BookmarkCollection.addOne(userId, req.body.content);

    res.status(201).json({
      message: 'Your bookmark was created successfully.',
      bookmark: util.constructBookmarkResponse(bookmark)
    });
  }
);

/**
 * Delete a bookmark
 *
 * @name DELETE /api/bookmarks/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the bookmark
 * @throws {404} - If the bookmarkId is not valid
 */
router.delete(
  '/:bookmarkId?',
  [
    userValidator.isUserLoggedIn,
    bookmarkValidator.isBookmarkExists,
    bookmarkValidator.isValidBookmarkModifier
  ],
  async (req: Request, res: Response) => {
    await BookmarkCollection.deleteOne(req.params.bookmarkId);
    res.status(200).json({
      message: 'Your bookmark was deleted successfully.'
    });
  }
);

/**
 * Modify a bookmark
 *
 * @name PUT /api/bookmarks/:id
 *
 * @param {string} content - the new content for the bookmark
 * @return {BookmarkResponse} - the updated bookmark
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the bookmark
 * @throws {404} - If the bookmarkId is not valid
 * @throws {400} - If the bookmark content is empty or a stream of empty spaces
 * @throws {413} - If the bookmark content is more than 140 characters long
 */
router.put(
  '/:bookmarkId?',
  [
    userValidator.isUserLoggedIn,
    bookmarkValidator.isBookmarkExists,
    bookmarkValidator.isValidBookmarkModifier,
    bookmarkValidator.isValidBookmarkContent
  ],
  async (req: Request, res: Response) => {
    const bookmark = await BookmarkCollection.updateOne(req.params.bookmarkId, req.body.content);
    res.status(200).json({
      message: 'Your bookmark was updated successfully.',
      bookmark: util.constructBookmarkResponse(bookmark)
    });
  }
);

export {router as bookmarkRouter};

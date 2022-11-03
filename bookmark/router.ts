import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import BookmarkCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';
import { User } from 'user/model';


const router = express.Router();


/**
 * Get all bookmarks of a user.
 *
 * @name GET /api/bookmarks?userId=id
 *
 * @return {BookmarkResponse[]} - An array of bookmarks created of the user with id, authorId
 * @throws {400} - If userId is not given
 * @throws {404} - If no user has given userId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if userId query parameter was supplied
    if (req.query.userId !== undefined) {
      next();
      return;
    }

    res.status(400).json({error: "No user was given"});
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const userFreets = await BookmarkCollection.findAllByUser(req.query.userId as string);
    // const response = userFreets.map(util.constructFreetResponse);
    res.status(200).json(userFreets); 
  }
);

/**
 * Create a new bookmark.
 *
 * @name POST /api/bookmarks/
 *
 * @param {string} content - The content of the freet
 * @return {FreetResponse} - The bookmark freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
 router.post(
    '/',
    [
      userValidator.isUserLoggedIn,
      freetValidator.isValidFreetContent
    ],
    async (req: Request, res: Response) => {
      // const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
      const freet = await BookmarkCollection.addOne(req.session.userId, req.body.content, true);
  
      res.status(201).json({
        message: 'Your bookmark was created successfully.',
        freet: util.constructBookmarkResponse(freet)
      });
    }
  );


export {router as freetRouter};

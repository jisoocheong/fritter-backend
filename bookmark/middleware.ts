import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import BookmarkCollection from '../bookmark/collection';

/**
 * Checks if a bookmark with bookmarkId is req.params exists
 */
const isBookmarkExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.bookmarkId);
  const bookmark = validFormat ? await BookmarkCollection.findOne(req.params.bookmarkId) : '';
  if (!bookmark) {
    res.status(404).json({
      error: {
        bookmarkNotFound: `Bookmark with bookmark ID ${req.params.bookmarkId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the bookmark in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidBookmarkContent = (req: Request, res: Response, next: NextFunction) => {
  const {content} = req.body as {content: string};
  if (!content.trim()) {
    res.status(400).json({
      error: 'Bookmark content must be at least one character long.'
    });
    return;
  }

  if (content.length > 140) {
    res.status(413).json({
      error: 'Bookmark content must be no more than 140 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the bookmark whose bookmarkId is in req.params
 */
const isValidBookmarkModifier = async (req: Request, res: Response, next: NextFunction) => {
  const bookmark = await BookmarkCollection.findOne(req.params.bookmarkId);
  const userId = bookmark.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' bookmarks.'
    });
    return;
  }

  next();
};

export {
  isValidBookmarkContent,
  isBookmarkExists,
  isValidBookmarkModifier
};

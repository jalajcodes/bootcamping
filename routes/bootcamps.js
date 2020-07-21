import express from 'express';
import { asyncHandler } from '../middlewares/async.js';

import {
	getBootcamps,
	getBootcamp,
	createBootcamp,
	deleteBootcamp,
	updateBootcamp,
} from '../controllers/bootcampsController.js';

const router = express.Router();

router.route('/').get(asyncHandler(getBootcamps)).post(asyncHandler(createBootcamp));

router
	.route('/:id')
	.get(asyncHandler(getBootcamp))
	.put(asyncHandler(updateBootcamp))
	.delete(asyncHandler(deleteBootcamp));

export default router;

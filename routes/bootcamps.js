import express from 'express';
import { asyncHandler } from '../middlewares/async.js';

import {
	getBootcamps,
	getBootcamp,
	createBootcamp,
	deleteBootcamp,
	updateBootcamp,
	getBootcampsInRadius,
	uploadPhoto,
} from '../controllers/bootcampsController.js';

import Bootcamp from '../models/Bootcamp.js';
import advancedResults from '../middlewares/advancedResults.js';

// Include other resource router
import courseRouter from './courses.js';

const router = express.Router();

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router
	.route('/')
	.get(asyncHandler(advancedResults(Bootcamp, 'courses')), asyncHandler(getBootcamps))
	.post(asyncHandler(createBootcamp));

router
	.route('/:id')
	.get(asyncHandler(getBootcamp))
	.put(asyncHandler(updateBootcamp))
	.delete(asyncHandler(deleteBootcamp));

router.route('/radius/:zipcode/:distance').get(asyncHandler(getBootcampsInRadius));
router.route('/:id/photo').put(asyncHandler(uploadPhoto));
export default router;

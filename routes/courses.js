import express from 'express';
import { asyncHandler } from '../middlewares/async.js';

import { getCourses, getCourse, addCourse, updateCourse, deleteCourse } from '../controllers/coursesController.js';

import Course from '../models/Course.js';
import advancedResults from '../middlewares/advancedResults.js';

const router = express.Router({ mergeParams: true });

router
	.route('/')
	.get(
		asyncHandler(
			advancedResults(Course, {
				path: 'bootcamp',
				select: 'name description',
			})
		),
		asyncHandler(getCourses)
	)
	.post(asyncHandler(addCourse));
router.route('/:id').get(asyncHandler(getCourse)).put(asyncHandler(updateCourse)).delete(asyncHandler(deleteCourse));

export default router;

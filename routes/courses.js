import express from 'express';
import { asyncHandler } from '../middlewares/async.js';

import { getCourses, getCourse, addCourse, updateCourse, deleteCourse } from '../controllers/coursesController.js';

const router = express.Router({ mergeParams: true });

router.route('/').get(asyncHandler(getCourses)).post(asyncHandler(addCourse));
router.route('/:id').get(asyncHandler(getCourse)).put(asyncHandler(updateCourse)).delete(asyncHandler(deleteCourse));

export default router;

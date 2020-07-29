import Course from '../models/Course.js';
import { ErrorResponse } from '../utils/errorResponse.js';
import Bootcamp from '../models/Bootcamp.js';

// @desc      Get all courses || Get all courses for a bootcamp.
// @route     GET /api/v1/courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public
export const getCourses = async (req, res, next) => {
	let query;

	if (req.params.bootcampId) {
		query = Course.find({ bootcamp: req.params.bootcampId });
	} else {
		query = Course.find().populate({
			path: 'bootcamp',
			select: 'name description',
		});
	}

	const courses = await query;

	res.status(200).json({
		success: true,
		count: courses.length,
		data: courses,
	});
};

// @desc      Get single course
// @route     GET /api/v1/courses/:id
// @access    Public
export const getCourse = async (req, res, next) => {
	const course = await Course.findById(req.params.id).populate({
		path: 'bootcamp',
		select: 'name description',
	});

	if (!course) {
		return next(new ErrorResponse(`No course with the id of ${req.params.id} was found.`, 404));
	}

	res.status(200).json({
		success: true,
		data: course,
	});
};

// @desc      Add a course
// @route     POST /api/v1/bootcamps/:bootcampId/courses
// @access    Private
export const addCourse = async (req, res, next) => {
	req.body.bootcamp = req.params.bootcampId;

	const bootcamp = await Bootcamp.findById(req.params.bootcampId);

	if (!bootcamp) {
		return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId} was found.`, 404));
	}

	const course = await Course.create(req.body);

	res.status(200).json({
		success: true,
		data: course,
	});
};

// @desc      Update a course
// @route     PUT /api/v1/courses/:id
// @access    Private
export const updateCourse = async (req, res, next) => {
	let course = await Course.findById(req.params.id);

	if (!course) {
		return next(new ErrorResponse(`No course with the id of ${req.params.id} was found.`, 404));
	}

	course = await Course.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(201).json({
		success: true,
		data: course,
	});
};

// @desc      Delete a course
// @route     DELETE /api/v1/courses/:id
// @access    Private
export const deleteCourse = async (req, res, next) => {
	const course = await Course.findById(req.params.id);

	if (!course) {
		return next(new ErrorResponse(`No course with the id of ${req.params.id} was found.`, 404));
	}

	await course.remove();

	res.status(200).json({
		success: true,
		data: {},
	});
};

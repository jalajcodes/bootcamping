import Bootcamp from '../models/Bootcamp.js';
import { ErrorResponse } from '../utils/errorResponse.js';
import { geocoder } from '../utils/geocoder.js';

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
export const getBootcamps = async (req, res, next) => {
	let query;
	// Copy req.query
	let reqQuery = { ...req.query };
	// Fields to exclude
	const removeFields = ['select', 'sort', 'page', 'limit'];
	// Loop over removeFields and delete them from reqQuery
	removeFields.forEach((param) => delete reqQuery[param]);
	// Create query string
	let queryStr = JSON.stringify(reqQuery);
	// Create operators ($gt, %lte etc...)
	queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);
	// creating query for getting data from database
	query = Bootcamp.find(JSON.parse(queryStr));
	// Select Fields
	if (req.query.select) {
		const fields = req.query.select.split(',').join(' ');
		query = query.select(fields);
	}
	// Sort
	if (req.query.sort) {
		const sortBy = req.query.sort.split(',').join(' ');
		query = query.sort(sortBy);
	} else {
		query = query.sort('-createdAt');
	}

	// pagination
	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 25;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const total = await Bootcamp.countDocuments();
	query = query.skip(startIndex).limit(limit);

	const bootcamps = await query;

	// Pagination result
	let pagination = {};

	if (startIndex > 0) {
		pagination.prev = {
			page: page - 1,
			limit,
		};
	}
	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit,
		};
	}

	// Sending Response
	res.status(200).json({ success: true, count: bootcamps.length, pagination, data: bootcamps });
};

// @desc      Get single bootcamps
// @route     GET /api/v1/bootcamp/:id
// @access    Public
export const getBootcamp = async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);

	if (!bootcamp) {
		return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
	}

	res.status(200).json({ success: true, data: bootcamp });
};

// @desc      Create new bootcamp
// @route     POST /api/v1/bootcamps
// @access    Private
export const createBootcamp = async (req, res, next) => {
	const response = await Bootcamp.create(req.body);
	res.status(201).json({ success: true, data: response });
};

// @desc      Update Bootcamp
// @route     PUT /api/v1/bootcamp/:id
// @access    Private
export const updateBootcamp = async (req, res, next) => {
	const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});
	if (!bootcamp) {
		return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
	}
	res.status(200).json({ success: true, data: bootcamp });
};

// @desc      Get all bootcamps
// @route     DELETE /api/v1/bootcamp/:id
// @access    Private
export const deleteBootcamp = async (req, res, next) => {
	const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
	if (!bootcamp) {
		return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
	}
	res.status(200).json({ success: true, data: {} });
};

// @desc      Get bootcamps within radius
// @route     DELETE /api/v1/bootcamp/radius/:zipcode/:distance
// @access    Private
export const getBootcampsInRadius = async (req, res, next) => {
	const { zipcode, distance } = req.params;
	// Get lat/lng from geocoder
	const loc = await geocoder.geocode(zipcode);
	const lat = loc[0].latitude;
	const lng = loc[0].longitude;

	// Calc radius using radians
	// Divide dis by radius of earth
	// Earth Radius = 6,378 km
	const radius = distance / 6378;

	// this will search for bootcamps available withinh radius
	const bootcamps = await Bootcamp.find({
		location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
	});

	res.status(200).json({
		success: true,
		count: bootcamps.length,
		data: bootcamps,
	});
};

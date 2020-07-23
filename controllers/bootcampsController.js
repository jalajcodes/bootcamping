import Bootcamp from '../models/Bootcamp.js';
import { ErrorResponse } from '../utils/errorResponse.js';
import { geocoder } from '../utils/geocoder.js';

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
export const getBootcamps = async (req, res, next) => {
	const bootcamps = await Bootcamp.find();
	res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
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

	const bootcamps = await Bootcamp.find({
		location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
	});

	res.status(200).json({
		success: true,
		count: bootcamps.length,
		data: bootcamps,
	});
};

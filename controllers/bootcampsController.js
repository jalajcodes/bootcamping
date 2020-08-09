import Bootcamp from '../models/Bootcamp.js';
import { ErrorResponse } from '../utils/errorResponse.js';
import { geocoder } from '../utils/geocoder.js';

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
export const getBootcamps = async (req, res, next) => {
	return res.status(200).json(res.advancedResults);
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

// @desc      Delete a bootcamp
// @route     DELETE /api/v1/bootcamp/:id
// @access    Private
export const deleteBootcamp = async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);
	if (!bootcamp) {
		return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
	}
	bootcamp.remove();

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
	// Divide dist. by radius of earth
	// Earth Radius = 6,378 km
	const radius = distance / 6378;

	// this will search for bootcamps available within radius
	const bootcamps = await Bootcamp.find({
		location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
	});

	res.status(200).json({
		success: true,
		count: bootcamps.length,
		data: bootcamps,
	});
};

// @desc      Upload photo for bootcamp
// @route     /api/v1/bootcamp/:id/photo
// @access    Private
export const uploadPhoto = async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);

	if (!bootcamp) {
		return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
	}

	if (!req.files) {
		return next(new ErrorResponse(`Please upload a photo`, 400));
	}

	let file = req.files.file;

	if (!file.mimetype.startsWith('image/')) {
		return next(new ErrorResponse(`Please upload a image file`, 400));
	}
	if (file.size > process.env.MAX_FILE_SIZE) {
		return next(new ErrorResponse(`Max size limit is ${process.env.MAX_FILE_SIZE} Bytes`, 400));
	}
	const extension = file.mimetype.split('/')[1];
	file.name = `photo_${Date.now()}_${bootcamp._id}.${extension}`;

	// save file to filesystem
	file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
		if (err) {
			console.log(err);
			return next(new ErrorResponse(`Problem with file upload`, 500));
		}

		await Bootcamp.findByIdAndUpdate(req.params.id, {
			photo: file.name,
		});

		res.status(200).json({
			success: true,
			data: file.name,
		});
	});
};

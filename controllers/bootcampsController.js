import Bootcamp from '../models/Bootcamp.js';

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
const getBootcamps = async (req, res, next) => {
	try {
		const bootcamps = await Bootcamp.find();
		res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
	} catch (err) {
		res.status(400).json({ success: true, data: null });
	}
};

// @desc      Get single bootcamps
// @route     GET /api/v1/bootcamp/:id
// @access    Public
const getBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.findById(req.params.id);
		if (!bootcamp) {
			res.status(400).json({ success: false, data: null });
			return;
		}

		res.status(200).json({ success: true, data: bootcamp });
	} catch (err) {
		next(err);
	}
};

// @desc      Create new bootcamp
// @route     POST /api/v1/bootcamps
// @access    Private
const createBootcamp = async (req, res, next) => {
	try {
		const response = await Bootcamp.create(req.body);
		res.status(201).json({ success: true, data: response });
	} catch (err) {
		console.log(`Error: ${err.message}`);
		res.status(400).json({ success: false, data: null });
	}
};

// @desc      Update Bootcamp
// @route     PUT /api/v1/bootcamp/:id
// @access    Private
const updateBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!bootcamp) {
			return res.status(400).json({ success: false, data: null });
		}
		res.status(200).json({ success: true, data: bootcamp });
	} catch (err) {
		res.status(400).json({ success: false, data: null });
	}
};

// @desc      Get all bootcamps
// @route     DELETE /api/v1/bootcamp/:id
// @access    Private
const deleteBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
		if (!bootcamp) {
			return res.status(400).json({ success: false, data: null });
		}
		res.status(200).json({ success: true, data: {} });
	} catch (err) {
		res.status(400).json({ success: false, data: null });
	}
};

export { getBootcamp, getBootcamps, createBootcamp, deleteBootcamp, updateBootcamp };

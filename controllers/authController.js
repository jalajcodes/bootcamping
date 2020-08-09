import { ErrorResponse } from '../utils/errorResponse.js';
import User from '../models/User.js';

// @desc        Register User
// @route       POST /api/v1/auth/register
// access       Public
export const register = async (req, res, next) => {
	const { name, email, password, role } = req.body;

	const user = await User.create({
		name,
		email,
		password,
		role,
	});

	const token = await user.getSignedJwtToken();
	res.status(200).json({
		success: true,
		token,
	});
};

// @desc        Login User
// @route       POST /api/v1/auth/login
// access       Public
export const login = async (req, res, next) => {
	const { email, password } = req.body;

	// Validate if an email or password is sent
	if (!email || !password) {
		return next(new ErrorResponse('Please enter an email and password.', 400));
	}

	// Get the user
	const user = await User.findOne({ email }).select('+password');

	// Check if user exists in db
	if (!user) {
		return next(new ErrorResponse('Invalid Credentials.', 401));
	}

	const isMatched = await user.matchPassword(password);

	if (!isMatched) {
		return next(new ErrorResponse('Invalid Credentials.', 401));
	}

	const token = await user.getSignedJwtToken();
	res.status(200).json({
		success: true,
		token,
	});
};

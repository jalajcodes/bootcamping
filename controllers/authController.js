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

	sendTokenResponse(user, res, 200);
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

	sendTokenResponse(user, res, 200);
};
// get token from model method , set cookie and send response
const sendTokenResponse = async (res, user, statusCode) => {
	const token = await user.getSignedJwtToken();

	const cookieOptions = {
		httpOnly: true,
		expires: new Date() + process.env.COOKIE_EXPIRY * 24 * 60 * 60 * 1000,
	};

	res.cookie('token', token, cookieOptions).status(statusCode).json({
		success: true,
		token,
	});
};

const advancedResults = (model, populate) => async (req, res, next) => {
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
	query = model.find(JSON.parse(queryStr));
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
	const startIndex = (page - 1) * limit; // if page = 1 & limit = 10 then startIndex = 0 and if p=2, l=10 then si=20 and so on and so forth...
	const endIndex = page * limit; // ofcourse
	const total = await model.countDocuments();
	query = query.skip(startIndex).limit(limit);

	// Populate
	if (populate) {
		query = query.populate(populate);
	}

	const results = await query;

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

	res.advancedResults = {
		success: true,
		count: results.length,
		pagination,
		data: results,
	};

	next();
};

export default advancedResults;

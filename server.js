import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import colors from 'colors';
import { errorHandler } from './middlewares/error.js';
import { connectDB } from './config/db.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load config.env
dotenv.config({ path: __dirname + '\\.env' });

// Route files
import bootcamps from './routes/bootcamps.js';

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// Mount Routers
app.use('/api/v1/bootcamps', bootcamps);

// Error Hanlder
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
	PORT,
	console.log(`Server running in ${process.env.NODE_ENV} on port ${process.env.PORT}`.yellow.bold)
);

// Handle unhandled promise rejections

process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`.red);
	// Close server and exit process
	server.close(() => process.exit(1));
});

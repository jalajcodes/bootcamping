import fs from 'fs';
import mongoose from 'mongoose';
import colors from 'colors';
import dotenv from 'dotenv';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vard
dotenv.config();

// Load models
import Bootcamp from './models/Bootcamp.js';

// Connect to DB
mongoose.connect(process.env.ATLAS_URI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true,
});

// Read JSON files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));

// Import into DB
const importData = async () => {
	try {
		await Bootcamp.create(bootcamps);
		console.log('Data Imported...'.green.inverse);
		process.exit();
	} catch (err) {
		console.log(err);
	}
};
// Delete Data
const deleteData = async () => {
	try {
		await Bootcamp.deleteMany();
		console.log('Data Destroyed...'.red.inverse);
		process.exit();
	} catch (err) {
		console.log(err);
	}
};

if (process.argv[2] === '-i') {
	importData();
} else if (process.argv[2] === '-d') {
	deleteData();
}

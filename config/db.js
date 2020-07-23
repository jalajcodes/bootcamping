// ATLAS_URI = mongodb + srv://jalajIsTheAdmin:AYYj8BOHVY92gMok@cluster0-vxvp0.mongodb.net/BootCamping?retryWrites=true&w=majority

import mongoose from 'mongoose';

const connectDB = async () => {
	const conn = await mongoose.connect(process.env.ATLAS_URI, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	});

	console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
};

export { connectDB };

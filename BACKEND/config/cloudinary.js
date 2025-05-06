import { v2 as cloudinary } from 'cloudinary';

const connectCloudinary = async () => {
    try {
        // Log the environment variables (without the secret key for security)
        console.log('Cloudinary Config:', {
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            has_secret: !!process.env.CLOUDINARY_SECRET_KEY
        });

        if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_SECRET_KEY) {
            throw new Error('Missing Cloudinary environment variables');
        }

        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_SECRET_KEY
        });

        console.log('Cloudinary configured successfully');
    } catch (error) {
        console.error('Error configuring Cloudinary:', error.message);
        throw error;
    }
};

export default connectCloudinary;
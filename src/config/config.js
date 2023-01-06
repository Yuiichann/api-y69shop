require('dotenv').config();

const PORT = process.env.PORT || 5000;

const NODE_ENV = process.env.NODE_ENV;

const MONGO_DB_URL = process.env.MONGO_DB_URL;

const cloudinary_name = process.env.CLOUDINARY_NAME;
const cloudinary_api_key = process.env.CLOUDINARY_API_KEY;
const cloudinary_api_secret = process.env.CLOUDINARY_API_SECRET;

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

module.exports = {
  server: {
    PORT,
    NODE_ENV,
  },
  db: {
    MONGO_DB_URL,
  },
  cloudinary: {
    NAME: cloudinary_name,
    API_KEY: cloudinary_api_key,
    API_SECRET: cloudinary_api_secret,
  },
  jwt: {
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
  },
};

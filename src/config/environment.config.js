import dotenv from "dotenv";

dotenv.config();

export default {
    PORT: process.env.PORT,
    DB_LINK: process.env.DB_LINK,
    SECRET_KEY: process.env.SECRET_KEY,
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    KEY: process.env.KEY,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
};
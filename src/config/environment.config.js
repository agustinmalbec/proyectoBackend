import { Command } from 'commander';
import dotenv from 'dotenv';

const program = new Command();

program
    .option('-d', 'Variable para debug', false)
    .option('--mode <mode>', 'Modo de trabajo', 'dev')
program.parse();

console.log("Mode Option: ", program.opts().mode);

const environment = program.opts().mode;

dotenv.config({
    path: environment === "prod" ? ".env.production" : ".env.development"
});

export default {
    PORT: process.env.PORT,
    DB_LINK: process.env.DB_LINK,
    DB_TEST_LINK: process.env.DB_TEST_LINK,
    SECRET_KEY: process.env.SECRET_KEY,
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    KEY: process.env.KEY,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GMAIL_ACCOUNT: process.env.GMAIL_ACCOUNT,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
    environment: environment
};
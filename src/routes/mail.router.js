import { Router } from "express";
import { sendEmail, sendEmailWithAttachments } from '../controllers/email.controller.js';

const emailsRouter = Router();

emailsRouter.get("/", sendEmail);

emailsRouter.get("/attachments", sendEmailWithAttachments);

export default emailsRouter;
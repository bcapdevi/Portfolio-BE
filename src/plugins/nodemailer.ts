import fp from "fastify-plugin";
import nodemailer from "nodemailer";
import { FastifyInstance } from "fastify";
import { google } from "googleapis";
import { createLogger } from "../utils/logger";

const logger = createLogger("nodemailer");

declare module "fastify" {
  interface FastifyInstance {
    mailer: nodemailer.Transporter;
  }
}

export default fp(
  async (fastify: FastifyInstance) => {
    try {
      // Initialize OAuth2 client
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        "http://localhost:3000/oauth2callback"
      );

      // Set refresh token
      oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      });

      // Get new access token
      const { token: accessToken } = await oauth2Client.getAccessToken();

      if (!accessToken) {
        throw new Error("Failed to get access token");
      }

      // Create transporter with OAuth2
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          type: "OAuth2",
          user: process.env.GMAIL_ADDRESS,
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
          accessToken: accessToken,
        },
      });

      // Verify connection
      await transporter.verify();
      logger.info("Email service initialized successfully");

      // Add to fastify instance
      fastify.decorate("mailer", transporter);

      // Cleanup
      fastify.addHook("onClose", async (instance) => {
        await instance.mailer.close();
        logger.info("Email service closed");
      });
    } catch (error) {
      logger.error("Failed to initialize email service:", error);
      throw error;
    }
  },
  {
    name: "nodemailer",
  }
);
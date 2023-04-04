import jwt from "jsonwebtoken";
import { MongoClient } from "mongodb";
import { customAlphabet } from "nanoid";
import path from "path";
import sgMail from "@sendgrid/mail";
import { readFileSync } from "fs";
import Handlebars from "handlebars";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isEmail from "validator/es/lib/isEmail";
import sanitize from "mongo-sanitize";

//  extend dayjs with utc plugin
dayjs.extend(utc);

//  extend dayjs with timezone plugin
dayjs.extend(timezone);

const runtimeConfig = useRuntimeConfig();

const JWT_SECRET = runtimeConfig.JWT_SECRET;
const MONGODB_URI = runtimeConfig.MONGODB_URI;
const MONGODB_DBNAME = runtimeConfig.MONGODB_DBNAME;
const SENDGRID_API_KEY = runtimeConfig.SENDGRID_API_KEY;

const BASE_URL = runtimeConfig.public.BASE_URL;

sgMail.setApiKey(SENDGRID_API_KEY);

const emailsDir = path.resolve(process.cwd(), "assets", "emails");

export default eventHandler(async (event) => {
  const client = new MongoClient(MONGODB_URI);

  const response: ResponseType = {};

  const body = await readBody(event);

  // Check if the body is present
  if (!body) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message: "Missing required fields",
    });

    return response;
  }

  // Check if the email address is present
  if (!body.emailAddress) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message: "Email address is required",
    });

    return response;
  }

  // Sanitize the email address
  const emailAddress = sanitize(body.emailAddress);

  // Check if the email address is valid
  if (!isEmail(emailAddress)) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message: "Invalid email address",
    });

    return response;
  }

  // Check if the user exists in the database
  try {
    const database = client.db(MONGODB_DBNAME);

    const alphabet = "0123456789";
    const nanoidMagicCode = customAlphabet(alphabet, 5);

    const magicCode = nanoidMagicCode();

    const authObject = {
      emailAddress,
      magicCode,
      createdAt: dayjs().utc().unix(),
    };

    // Insert the new user into the auth database and wait for email verification
    const authCollection = database.collection("auth");

    // await authCollection.insertOne(authObject);

    // Send the login code to the user
    const emailFile = readFileSync(path.join(emailsDir, "confirm-email.html"), {
      encoding: "utf8",
    });

    const emailTemplate = Handlebars.compile(emailFile);

    const combinedCode = `${emailAddress}:${magicCode}`;

    const authUrl = `${BASE_URL}/login/auth?code=${encodeURIComponent(
      combinedCode
    )}`;

    const msg = {
      to: "test@sjy.so",
      // to: emailAddress,
      from: {
        email: "no-reply@sjy.so",
        name: "Kato Authentication Service",
      },
      subject: "🌞 Your sign-in details for Kato",
      html: emailTemplate({
        auth_code: magicCode,
        base_url: BASE_URL,
        signin_url: authUrl,
        email: emailAddress,
      }),
    };

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Auth code sent",
      }),
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");

        response.statusCode = 200;
        response.body = JSON.stringify({
          message: "Auth code sent",
        });
      })
      .catch((error) => {
        console.error(error);

        response.statusCode = 500;
        response.body = JSON.stringify({
          message: "Error sending email",
        });
      });
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();

    return response;
  }
});

interface ResponseType {
  statusCode?: number;
  body?: string;
}

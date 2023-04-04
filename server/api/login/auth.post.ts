import jwt from "jsonwebtoken";
import { MongoClient } from "mongodb";
import { nanoid, customAlphabet } from "nanoid";
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

const client = new MongoClient(MONGODB_URI);

const emailsDir = path.resolve(process.cwd(), "assets", "emails");

export default eventHandler(async (event) => {
  const body = await readBody(event);

  console.log(body);

  // Check if the email address is present
  if (!body.emailAddress) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Email address is required",
      }),
    };
  }

  // Sanitize the email address
  const emailAddress = sanitize(body.emailAddress);

  // Check if the email address is valid
  if (!isEmail(emailAddress)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Invalid email address",
      }),
    };
  }

  // Check if the user exists in the database
  try {
    const database = client.db(MONGODB_DBNAME);
    const usersCollection = database.collection("users");

    const query = { emailAddress: body.emailAddress };

    const user = await usersCollection.findOne(query);

    if (!user) {
      // User does not exist

      // Create a new user
      const id = nanoid();

      // Insert the new user into the database and wait for login code
      const authCollection = database.collection("auth");

      const alphabet = "0123456789";
      const nanoidMagicCode = customAlphabet(alphabet, 5);

      const magicCode = nanoidMagicCode();

      const auth = {
        id,
        emailAddress,
        magicCode,
        createdAt: dayjs().utc().unix(),
      };

      // await authCollection.insertOne(auth);

      // Send the login code to the user

      const emailFile = readFileSync(
        path.join(emailsDir, "confirm-email.html"),
        {
          encoding: "utf8",
        }
      );

      const emailTemplate = Handlebars.compile(emailFile);

      const authUrl = `${BASE_URL}/auth?email=${encodeURIComponent(
        emailAddress
      )}&code=${magicCode}`;

      const msg = {
        to: "test@sjy.so",
        from: "no-reply@sjy.so",
        subject: "🌞 Your sign-in link for Kato",
        html: emailTemplate({
          base_url: BASE_URL,
          signin_url: authUrl,
          email: emailAddress,
        }),
      };

      return {
        statusCode: 200,
      };

      sgMail
        .send(msg)
        .then(() => {
          console.log("Email sent");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
    return {
      statusCode: 200,
    };
  }
});

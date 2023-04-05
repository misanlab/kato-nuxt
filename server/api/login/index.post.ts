/* eslint-disable import/no-named-as-default-member */

import { readFileSync } from "fs";
import path from "path";
import sgMail from "@sendgrid/mail";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Handlebars from "handlebars";
import sanitize from "mongo-sanitize";
import { MongoClient } from "mongodb";

import isEmail from "validator/es/lib/isEmail";

//  extend dayjs with utc plugin
dayjs.extend(utc);

//  extend dayjs with timezone plugin
dayjs.extend(timezone);

const runtimeConfig = useRuntimeConfig();

const MONGODB_URI = runtimeConfig.MONGODB_URI;
const MONGODB_DBNAME = runtimeConfig.MONGODB_DBNAME;
const SENDGRID_API_KEY = runtimeConfig.SENDGRID_API_KEY;

const BASE_URL = runtimeConfig.public.BASE_URL;

sgMail.setApiKey(SENDGRID_API_KEY);

const emailsDir = path.resolve(process.cwd(), "assets", "emails");

export default eventHandler(async (event) => {
  const client = new MongoClient(MONGODB_URI);

  const body = await readBody(event);

  // Check if the body is present
  if (!body) {
    throw createError({
      message: "Missing required fields",
      statusCode: 400,
    });
  }

  // Check if the email address is present
  if (!body.emailAddress) {
    throw createError({
      message: "Email address is required",
      statusCode: 400,
    });
  }

  // Sanitize the email address
  const emailAddress = sanitize(body.emailAddress);

  // Check if the email address is valid
  if (!isEmail(emailAddress)) {
    throw createError({
      message: "Invalid email address",
      statusCode: 400,
    });
  }

  // Check if the user exists in the database
  try {
    const database = client.db(MONGODB_DBNAME);

    const magicCode = Math.floor(10000 + Math.random() * 90000);

    // Insert the new user into the auth database and wait for email verification
    const authCollection = database.collection("auth");

    // Check if the user already exists
    const query = { emailAddress };

    const user = await authCollection.findOne(query);

    if (user) {
      // Update the user with the new magic code
      const update = {
        $set: {
          createdAt: dayjs().utc().unix(),
          magicCode,
        },
      };

      await authCollection.updateOne(query, update);
    } else {
      const authObject = {
        createdAt: dayjs().utc().unix(),
        emailAddress,
        magicCode,
      };

      await authCollection.insertOne(authObject);
    }

    // Send the login code to the user
    const emailFile = readFileSync(path.join(emailsDir, "confirm-email.html"), {
      encoding: "utf8",
    });

    const emailTemplate = Handlebars.compile(emailFile);

    const combinedCode = `${emailAddress}:${magicCode}`;

    const authUrl = `${BASE_URL}/auth?code=${encodeURIComponent(combinedCode)}`;

    const msg = {
      from: {
        name: "Kato Authentication Service",
        email: "no-reply@sjy.so",
      },
      html: emailTemplate({
        auth_code: magicCode,
        base_url: BASE_URL,
        email: emailAddress,
        signin_url: authUrl,
      }),
      subject: "🌞 Your sign-in details for Kato",
      to: emailAddress,
    };

    console.log(magicCode, ":", emailAddress);
    console.log(authUrl);

    const statusCode = await sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");

        return 200;
      })
      .catch((error) => {
        console.error(error);

        return 500;
      });

    if (statusCode === 200) {
      return {
        message: "Auth code sent",
        statusCode: 200,
      };
    } else {
      throw createError({
        message: "Error sending email",
        statusCode: 500,
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }
});

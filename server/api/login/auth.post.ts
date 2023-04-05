/* eslint-disable import/default */
/* eslint-disable import/no-named-as-default-member */

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import sanitize from "mongo-sanitize";
import { MongoClient } from "mongodb";
import isEmail from "validator/es/lib/isEmail";
import jwt from "jsonwebtoken";

//  extend dayjs with utc plugin
dayjs.extend(utc);

//  extend dayjs with timezone plugin
dayjs.extend(timezone);

const runtimeConfig = useRuntimeConfig();

const ACCESS_TOKEN_SECRET = runtimeConfig.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = runtimeConfig.REFRESH_TOKEN_SECRET;
const MONGODB_URI = runtimeConfig.MONGODB_URI;
const MONGODB_DBNAME = runtimeConfig.MONGODB_DBNAME;

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

  // check is auth code is present
  if (!body.authCode) {
    throw createError({
      message: "Auth code is required",
      statusCode: 400,
    });
  }

  // Sanitize the email address
  const emailAddress = sanitize(body.emailAddress);
  const authCode = sanitize(body.authCode);

  // Check if the email address is valid
  if (!isEmail(emailAddress)) {
    throw createError({
      message: "Invalid email address",
      statusCode: 400,
    });
  }

  // Check if the auth code is valid
  if (authCode.length !== 5) {
    throw createError({
      message: "Invalid auth code",
      statusCode: 401,
    });
  }

  // Check if the user exists in the database
  try {
    const database = client.db(MONGODB_DBNAME);

    // Insert the new user into the auth database and wait for email verification
    const authCollection = database.collection("auth");

    // Check if the user already exists
    const query = { emailAddress, magicCode: authCode };

    const userInstance = await authCollection.findOne(query);

    if (userInstance) {
      // Check if the code has expired
      const createdAt = dayjs.unix(userInstance.createdAt).utc();

      const now = dayjs().utc();

      const diff = now.diff(createdAt, "minute");

      if (diff > 5) {
        throw createError({
          message: "Auth code has expired",
          statusCode: 401,
        });
      }

      // remove user instance
      await authCollection.deleteOne(query);

      const userCollection = database.collection("users");

      // Check if the user already exists
      const userQuery = { emailAddress };

      const user = await userCollection.findOne(userQuery);

      if (!user) {
        // Create a new user

        const timestamp = dayjs().utc().unix();

        const newUser = {
          accessedAt: timestamp,
          createdAt: timestamp,
          emailAddress,
          updatedAt: timestamp,
        };

        await userCollection.insertOne(newUser);
      }

      // generate access token with 1 week expiry
      const ACCESS_TOKEN = jwt.sign({ emailAddress }, ACCESS_TOKEN_SECRET, {
        expiresIn: "7d",
      });

      // generate refresh token with 1 month expiry
      const REFRESH_TOKEN = jwt.sign({ emailAddress }, REFRESH_TOKEN_SECRET, {
        expiresIn: "30d",
      });

      return {
        body: JSON.stringify({
          accessToken: ACCESS_TOKEN,
          emailAddress,
          refreshToken: REFRESH_TOKEN,
        }),
        statusCode: 200,
      };
    } else {
      throw createError({
        message: "Invalid auth code",
        statusCode: 401,
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }
});

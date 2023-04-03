import jwt from "jsonwebtoken";
import { MongoClient } from "mongodb";
import { nanoid } from "nanoid";

const runtimeConfig = useRuntimeConfig();

const JWT_SECRET = runtimeConfig.JWT_SECRET;
const MONGODB_URI = runtimeConfig.MONGODB_URI;
const MONGODB_DBNAME = runtimeConfig.MONGODB_DBNAME;

const client = new MongoClient(MONGODB_URI);

export default eventHandler(async (event) => {
  const body = await readBody(event);
  console.log(body.emailAddress);

  // Check if the user exists in the database
  try {
    const database = client.db(MONGODB_DBNAME);
    const usersCollection = database.collection("users");

    const query = { emailAddress: body.emailAddress };

    const user = await usersCollection.findOne(query);

    if (!user) {
      // User does not exist

      const id = nanoid();
      const emailAddress = body.emailAddress;

      // create a new user
      const newUser = {
        id,
        emailAddress,
      };

      // insert the new user into the database
      const result = await usersCollection.insertOne(newUser);

      // create a token
      const token = jwt.sign({ id, emailAddress }, JWT_SECRET, {
        expiresIn: "5m",
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }

  return;
});

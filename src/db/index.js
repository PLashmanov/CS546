import { ObjectId } from 'mongodb';
import { users, fraudsters } from "../config/mongoCollections.js";

async function fetchUsersFromEmails(emails) {
    try {
      const usersCollection = await users(); 
      // Ensure 'email' is indexed
      // await usersCollection.createIndex({ email: 1 });
      const usersToEmail = await usersCollection.find({ email: { $in: emails } }).toArray();
      return usersToEmail;
    } catch (err) {
      console.error(err);
      throw err;

  }
}

async function fetchFraudsterByID(fraudsterID) {
  try {
      const fraudsterCollection = await fraudsters();
      const fraudster = await fraudsterCollection.findOne({ _id: ObjectId(fraudsterID) });
      return fraudster;
  } catch (err) {
      console.error(err);
      throw err;
  }
}

  export { fetchUsersFromEmails ,fetchFraudsterByID };

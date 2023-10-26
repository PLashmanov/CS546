import { ObjectId } from 'mongodb';
import { usersCollection, fraudstersCollection } from "../config/mongoCollections.js";
import {getMongoID, isArray} from '../validations/Validations.js'


async function fetchUsersFromEmails(emails) {
    try {
      if(!isArray(emails)){
        throw new Error("emails need to be of type array")
      }
      const userCollection = await usersCollection(); 
      const usersToEmail = await userCollection.find({ email: { $in: emails } }).toArray();
      return usersToEmail;
    } catch (err) {
      console.error(err);
      throw err;

  }
}

async function fetchFraudsterByID(fraudsterID) {
  try {
      const mongoID = getMongoID(fraudsterID)
      const fraudCollection = await fraudstersCollection();
      const fraudster = await fraudCollection.findOne({ _id: mongoID});
      return fraudster;
  } catch (err) {
      console.error(err);
      throw err;
  }
}

export { fetchUsersFromEmails ,fetchFraudsterByID };


import { users, fraudsters } from "../config/mongoCollections.js";
import {getMongoID, isArray} from '../validations/Validations.js'


async function fetchUsersFromIds(userIds) {
  try {
    if(!isArray(userIds)){
      throw new Error("list of ids need to be of type array")
    } 
    const userCollection = await users(); 
    const objectIds = userIds.map(id => getMongoID(id));
    const usersToEmail = await userCollection.find({ _id: { $in: objectIds } }).toArray();
    return usersToEmail;
  } catch (err) {
    console.error(err);
    throw err;

  }
} 


async function fetchFraudsterByID(fraudsterID) {
  try {
      const mongoID = getMongoID(fraudsterID)
      const fraudCollection = await fraudsters();
      const fraudster = await fraudCollection.findOne({ _id: mongoID});
      return fraudster;
  } catch (err) {
      console.error(err);
      throw err;
  }
}

export { fetchFraudsterByID, fetchUsersFromIds };

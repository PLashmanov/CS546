import { ObjectId } from 'mongodb';
import { validateId } from '../validations/Validations.js';
import { detections } from '../config/mongoCollections.js';
import * as validations from '../validations/Validations.js';
import { ValidationError } from '../error/customErrors.js';


export async function createDetectionRecord(isFraud, fraudScore, potentialFraudDetails) {
  // todo validations
  let updateDate = new Date();

  const newDetectionRecord = {
    isFraud: isFraud,
    fraudScore: fraudScore,
    potentialFraudDetails: potentialFraudDetails,
    createDate: updateDate
  }
  const detectionsCollection = await detections();
  let detection = await detectionsCollection.insertOne(newDetectionRecord);
  if (!detection.acknowledged || !detection.insertedId) throw `error: could not add new detection`;
  const detectionId = detection.insertedId.toString();
  const detectionInserted = await detectionsCollection.findOne({ _id: new ObjectId(detectionId) });
  return detectionInserted;
}


export async function getNumOfDetections() {
  const detectionsCollection = await detections();
  const count = await detectionsCollection.countDocuments();
  if (count === undefined) throw new Error(`could not get the count of detections`);
  return count;
}

export async function getNumOfFraudDetections() {
  const detectionsCollection = await detections();
  const count = await detectionsCollection.countDocuments({ isFraud: true });
  if (count === undefined) throw new Error(`could not get the count of detections`);
  return count;
}
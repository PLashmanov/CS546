import { ObjectId } from 'mongodb';
import { validateId } from '../validations/Validations.js';
import { fraudsters } from '../config/mongoCollections.js';
import { reports } from '../config/mongoCollections.js';
import { users } from '../config/mongoCollections.js';
import * as validations from '../validations/Validations.js';
import * as reportsData from './reportsData.js';
import { AlertService } from '../services/AlertService.js';
import { BusinessError, ValidationError } from '../error/customErrors.js';

export const getFraudsterById = async (fraudsterId) => {
  fraudsterId = validations.validateId(fraudsterId);
  const fraudsterCollection = await fraudsters();
  const fraudster = await fraudsterCollection.findOne({ _id: new ObjectId(fraudsterId) });
  if (!fraudster) throw new Error(`fraudster not found`);
  let updatedFraudster;
  if (fraudster) {
    let lastReport = formatDate(fraudster.updateDate);
    updatedFraudster = await fraudsterCollection.findOneAndUpdate({ _id: new ObjectId(fraudsterId) }
      , { $set: { lastTimeReported: lastReport } }, { returnDocument: 'after' });
  }

  if (await isFraudsterTrending(fraudsterId)) {
    updatedFraudster = await fraudsterCollection.findOneAndUpdate({ _id: new ObjectId(fraudsterId) }
      , { $set: { trending: true } }, { returnDocument: 'after' });
  }

  await fraudsterCollection.updateOne({ _id: new ObjectId(fraudsterId) },
    { $unset: { lastTimeReported: "" } });

  await fraudsterCollection.updateOne({ _id: new ObjectId(fraudsterId) },
    { $unset: { lastTimeReported: "" } });
  return updatedFraudster;
}

export async function fraudsterExists(ein, itin, ssn, email, phone) {
  ein = validations.validateEIN(ein);
  itin = validations.validateITIN(itin);
  ssn = validations.validateSSN(ssn);
  email = validations.validateEmailFr(email);
  phone = validations.validatePhoneNumberFr(phone);

  let fraudstersCollection = await fraudsters();
  let fraudsterIds = new Set();
  if (ein !== 'N/A') {
    const fraudsters = await fraudstersCollection.find({ eins: ein }).toArray();
    fraudsters.forEach(fraudster => fraudsterIds.add(fraudster._id.toString()));
  }

  if (itin !== 'N/A') {
    const fraudsters = await fraudstersCollection.find({ itins: itin }).toArray();
    fraudsters.forEach(fraudster => fraudsterIds.add(fraudster._id.toString()));
  }
  if (ssn !== 'N/A') {
    const fraudsters = await fraudstersCollection.find({ ssns: ssn }).toArray();
    fraudsters.forEach(fraudster => fraudsterIds.add(fraudster._id.toString()));
  }

  if (email !== 'N/A') {
    const fraudsters = await fraudstersCollection.find({ emails: email }).toArray();
    fraudsters.forEach(fraudster => fraudsterIds.add(fraudster._id.toString()));
  }

  if (phone !== 'N/A') {
    const fraudsters = await fraudstersCollection.find({ phones: phone }).toArray();
    fraudsters.forEach(fraudster => fraudsterIds.add(fraudster._id.toString()));
  }
  if (fraudsterIds.size === 1) {
    return Array.from(fraudsterIds)[0];
  } else if (fraudsterIds.size > 1) {
    let frId = await joinFraudstersToOne(Array.from(fraudsterIds));
    return frId;
  }
  else return false;
}

export async function createFraudster() {

  let eins = [];
  let itins = [];
  let ssns = [];
  let emails = [];
  let phones = [];
  let names = [];
  let users = [];
  let reports = [];
  let numReports = 0;
  let updateDate = new Date();
  let trending = false;

  const newFraudster = {
    eins: eins,
    itins: itins,
    ssns: ssns,
    emails: emails,
    phones: phones,
    names: names,
    users: users,
    reports: reports,
    numReports: numReports,
    updateDate: updateDate,
    trending: trending
  }

  const fraudstersCollection = await fraudsters();
  let fraudster = await fraudstersCollection.insertOne(newFraudster);
  if (!fraudster.acknowledged || !fraudster.insertedId) throw `error: could not add fraudster`;
  const fraudsterId = fraudster.insertedId.toString();
  const fraudsterInserted = await fraudstersCollection.findOne({ _id: new ObjectId(fraudsterId) });
  return fraudsterInserted;
}

export async function updateFraudsterAfterCreateReport(fraudsterId, ein, itin, ssn, email, phone, nameFraudster, userId, reportId, type) {
  fraudsterId = validateId(fraudsterId);
  ein = validations.validateEIN(ein);
  itin = validations.validateITIN(itin);
  ssn = validations.validateSSN(ssn);
  email = validations.validateEmailFr(email);
  phone = validations.validatePhoneNumberFr(phone);
  nameFraudster = validations.validateNameFr(nameFraudster);
  userId = validations.validateId(userId);
  reportId = validations.validateId(reportId);
  let todaysDate = new Date();
  let report = {
    reportId: reportId,
    date: todaysDate
  };

  const fraudstersCollection = await fraudsters();

  let updatedFraudster = await fraudstersCollection.findOneAndUpdate(
    { _id: new ObjectId(fraudsterId) },
    {
      $addToSet: {
        eins: ein,
        itins: itin,
        ssns: ssn,
        emails: email,
        phones: phone,
        names: nameFraudster,
        users: userId,
        reports: report,
      },
      $set: {
        updateDate: todaysDate
      },
      $inc: { numReports: 1 }
    },
    { returnDocument: 'after' }
  );
  if (await isFraudsterTrending(fraudsterId)) {
    updatedFraudster = await fraudstersCollection.findOneAndUpdate({ _id: new ObjectId(fraudsterId) }
      , { $set: { trending: true } }, { returnDocument: 'after' });
  }
  if (!updatedFraudster || !updatedFraudster._id) {
    throw new Error('Fraudster not found or couldnt be updated');
  }
  try {
    await AlertService.getInstance().alertUsers(updatedFraudster._id.toString());
  }
  catch (ex) {
    console.error("error occured during email service: ", ex)
  }
  return updatedFraudster;
}

export async function isFraudsterTrending(fraudsterId) {
  fraudsterId = validations.validateId(fraudsterId);
  const fraudstersCollection = await fraudsters();
  let oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const fraudster = await fraudstersCollection.findOne({ _id: new ObjectId(fraudsterId) });

  if (!fraudster) {
    throw new Error(`fraudster not found`);
    return;
  }

  const recentReports = fraudster.reports.filter(report => report.date >= oneWeekAgo);
  const count = recentReports.length;
  if (count < 3) return false;

  return true;
}

export function formatDate(date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();

  const monthPad = String(month).padStart(2, '0');
  const dayPad = String(day).padStart(2, '0');

  return `${monthPad}/${dayPad}/${year}`;
}

export async function findFraudsterByKeyAttributes(ein, itin, ssn, email, phone) {
  ein = validations.validateEIN(ein);
  itin = validations.validateITIN(itin);
  ssn = validations.validateSSN(ssn);
  email = validations.validateEmailFr(email);
  phone = validations.validatePhoneNumberFr(phone);

  let fraudsterId = await fraudsterExists(ein, itin, ssn, email, phone);
  const fraudstersCollection = await fraudsters();

  if (fraudsterId) {
    const fraudster = await fraudstersCollection.findOne({ _id: new ObjectId(fraudsterId) });
    if (!fraudster) throw new Error('fraudster was not found');

    const lastReported = formatDate(fraudster.updateDate);
    let trending = await isFraudsterTrending(fraudsterId);

    const fraudsterAttributesToReturn = {
      id: fraudster._id.toString(),
      eins: fraudster.eins,
      itins: fraudster.itins,
      ssns: fraudster.ssns,
      emails: fraudster.emails,
      phones: fraudster.phones,
      names: fraudster.names,
      numReports: fraudster.numReports,
      lastTimeReported: lastReported,
      trending: trending
    }
    return fraudsterAttributesToReturn;
  }
  else {
    return 'No matches found';
  }
}

export async function getFraudsterTrendingCount() {
  const fraudstersCollection = await fraudsters();
  const fraudsterTrending = await fraudstersCollection
    .find({ trending: true })
    .toArray();

  return fraudsterTrending.length;
}



export async function getNumOfFraudsters() {
  const fraudstersCollection = await fraudsters();
  const count = await fraudstersCollection.countDocuments();
  if (count === undefined) throw new Error('Fraudster not found based on provided attributes.');
  return count;
}

export async function findFraudstersByName(name) {

  if (name.trim().length < 2 || name.trim().length > 20) throw new ValidationError("name length must be between 2 and 30");
  const lim = 20;

  const fraudsterCollection = await fraudsters();
  const fraudstersExactName = await fraudsterCollection.find({ names: { $regex: new RegExp(`^${name}$`, 'i') } })
    .sort({ updateDate: -1 })
    .limit(lim).toArray();
  const difference = lim - fraudstersExactName.length;

  let numToFind;
  let fraudsters2;
  let fraudstersSomeMatch = [];

  if (difference > 0) {
    let someMatch = {
      "names":
      {
        $elemMatch: { $regex: new RegExp(name, 'i') },
        $not: {
          $regex: new RegExp(`^${name}$`, 'i')
        }
      }
    };
    fraudstersSomeMatch = await fraudsterCollection.find(someMatch)
      .sort({ updateDate: -1 })
      .limit(difference)
      .toArray();
  }

  const combinedFraudsters = [...fraudstersExactName, ...fraudstersSomeMatch];
  let fraudstersResult = [];

  for (let i = 0; i < combinedFraudsters.length; i++) {
    let trending = await isFraudsterTrending(combinedFraudsters[i]._id.toString());

    let toReturn = {
      id: combinedFraudsters[i]._id.toString(),
      eins: combinedFraudsters[i].eins,
      itins: combinedFraudsters[i].itins,
      ssns: combinedFraudsters[i].ssns,
      emails: combinedFraudsters[i].emails,
      phones: combinedFraudsters[i].phones,
      names: combinedFraudsters[i].names,
      numReports: combinedFraudsters[i].numReports,
      lastTimeReported: formatDate(combinedFraudsters[i].updateDate),
      trending: trending
    }
    fraudstersResult.push(toReturn);
  }
  return fraudstersResult;
}

async function joinTwoFraudsters(frId1, frId2) {
  frId1 = validations.validateId(frId1);
  frId1 = validations.validateId(frId1);

  const fraudsterCollection = await fraudsters();
  const fraudster2 = await getFraudsterById(frId2);
  let updateData = {
    $addToSet: {
      eins: { $each: fraudster2.eins },
      itins: { $each: fraudster2.itins },
      ssns: { $each: fraudster2.ssns },
      emails: { $each: fraudster2.emails },
      phones: { $each: fraudster2.phones },
      names: { $each: fraudster2.names },
      users: { $each: fraudster2.users },
      reports: { $each: fraudster2.reports }
    },
    $inc: { numReports: fraudster2.numReports }
  }

  let fraudster1Updated = await fraudsterCollection.findOneAndUpdate(
    { _id: new ObjectId(frId1) },
    updateData,
    { returnDocument: 'after' });

  await fraudsterCollection.deleteOne({ _id: new ObjectId(frId2) });

  return fraudster1Updated;
}

async function joinFraudstersToOne(frIds) {
  frIds = validations.validateFrIds(frIds);
  if (frIds.length < 2) {
    throw new BusinessError('At least two fraudsters are required for merging');
  }

  const primaryFraudsterId = frIds[0];

  for (let i = 1; i < frIds.length; i++) {
    await joinTwoFraudsters(primaryFraudsterId, frIds[i]);
  }
  const fraudsterCollection = await fraudsters();
  const updatedPrimaryFraudster = await fraudsterCollection.findOne({ _id: new ObjectId(primaryFraudsterId) });
  return updatedPrimaryFraudster._id.toString();
}
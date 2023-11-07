import { ObjectId } from 'mongodb';
import { validateId } from '../validations/Validations.js';
import { fraudsters } from '../config/mongoCollections.js';
import { reports } from '../config/mongoCollections.js';
import { users } from '../config/mongoCollections.js';
import * as validations from '../validations/Validations.js';
import * as reportsData from './reportsData.js';
import { AlertService } from '../services/AlertService.js'

export const getFraudsterById = async (fraudsterId) => {
  fraudsterId = validations.validateId(fraudsterId);
  const fraudsterCollection = await fraudsters();
  const fraudster = await fraudsterCollection.findOne({ _id: new ObjectId(fraudsterId) });
  if (!fraudster) throw new Error(`fraudster not found`);

  if (await isFraudsterTrending(fraudsterId)) {
    updatedFraudster = await fraudsterCollection.findOneAndUpdate({ _id: new ObjectId(fraudsterId) }
      , { $set: { trending: true } }, { returnDocument: 'after' });
  }
  return fraudster;
}

// checks if fraudster exists in collection and returns their id, false otherwise
export async function fraudsterExists(ein, itin, ssn, email, phone) {
  ein = validations.validateEIN(ein);
  itin = validations.validateITIN(itin);
  ssn = validations.validateSSN(ssn);
  email = validations.validateEmailFr(email);
  phone = validations.validatePhoneNumberFr(phone);

  let fraudstersCollection = await fraudsters();
  let fraudster;
  if (ein !== 'N/A') {
    if (fraudster = await fraudstersCollection.findOne({ eins: ein })) {
      return fraudster._id.toString();
    }

  } else if (itin !== 'N/A') {
    if (fraudster = await fraudstersCollection.findOne({ itins: itin })) {
      return fraudster._id.toString();
    }

  } else if (ssn !== 'N/A') {
    if (fraudster = await fraudstersCollection.findOne({ ssns: ssn })) {
      return fraudster._id.toString();
    }

  } else if (email !== 'N/A') {
    if (fraudster = await fraudstersCollection.findOne({ emails: email })) {
      return fraudster._id.toString();
    }

  } else if (phone !== 'N/A') {
    if (fraudster = await fraudstersCollection.findOne({ phones: phone })) {
      return fraudster._id.toString();
    }
  }
  return false;
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
  type = validations.validateType(type); // FIXME create in Validations

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
        updateDates: todaysDate
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
  await new AlertService().alertUsers(updatedFraudster._id.toString());
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

    const fraudsterAttributesToReturn = {
      eins: fraudster.eins,
      itins: fraudster.itins,
      ssns: fraudster.ssns,
      emails: fraudster.emails,
      phones: fraudster.phones,
      names: fraudster.names,
      numReports: fraudster.numReports,
      lastTimeReported: lastReported,
      trending: fraudster.trending
    }
    return fraudsterAttributesToReturn;
  }
  else {
    return 'No matches found';
  }
}

export async function getNumOfFraudsters() {
  const fraudstersCollection = await fraudsters();
  const count = await fraudstersCollection.countDocuments();
  if (count === undefined) throw new Error('Fraudster not found based on provided attributes.');
  return count;
}
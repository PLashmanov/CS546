import {ObjectId} from 'mongodb';
import {validateId} from '../validations/Validations.js';
import{fraudsters} from '../config/mongoCollections.js';
import{reports} from '../config/mongoCollections.js';
import{users} from '../config/mongoCollections.js';
import * as validations from '../validations/Validations.js';
import * as reportsData from './reportsData.js';

export const getFraudsterById = async (fraudsterId) => {
    fraudsterId = validations.validateId(fraudsterId);
    const fraudsterCollection = await fraudsters();
    const fraudster = await fraudsterCollection.findOne({_id: newObject(fraudsterId)});
    if(!fraudster) throw new Error (`fraudster not found`);
    return fraudster;
}

// checks if fraudster exists in collection and returns their id, false otherwise
export async function fraudsterExists(ein, itin, ssn, email, phone) {
    ein = validations.validateEIN(ein);
    itin = validations.validateITIN(itin);
    ssn = validations.validateSSN(ssn);
    email = validations.validateEmailFr(email); 
    phone = validations.validatePhoneNumberFr(phone); // FIXME: check the input 

   let fraudstersCollection = await fraudsters();
    let fraudster;
    if (fraudster = await fraudstersCollection.findOne({eins: ein})) {
      return fraudster._id.toString();
    } else if (fraudster = await fraudstersCollection.findOne({itins: itin})) {
      return fraudster._id.toString();
    } else if (fraudster = await fraudstersCollection.findOne({ssns: ssn})) {
      return fraudster._id.toString();
    } else if (fraudster = await fraudstersCollection.findOne({emails: email})) {
      return fraudster._id.toString();
    } else if (fraudster = await fraudstersCollection.findOne({phones: phone})) {
      return fraudster._id.toString();
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
if(!fraudster.acknowledged || !fraudster.insertedId) throw `error: could not add fraudster`;
const fraudsterId = fraudster.insertedId.toString();
const fraudsterInserted = await fraudstersCollection.findOne({_id: new ObjectId(fraudsterId)});
return fraudsterInserted;
}

 //FIXME: checks mandatory fields, also updates trending status // usage: reports.txt -> createReport()
 export async function updateFraudsterAfterCreateReport(fraudsterId, ein, itin, ssn, email, phone, nameFraudster, userId, reportId, type) {
  fraudsterId = validateId(fraudsterId);
  ein = validations.validateEIN(ein);
  itin = validations.validateITIN(itin);
  ssn = validations.validateSSN(ssn);
  email = validations.validateEmailFr(email);
  phone = validations.validatePhoneNumberFr(phone);
  nameFraudster = validations.validateNameFr(nameFraudster);
  userId =  validations.validateId(userId);
  reportId = validations.validateId(reportId);
  let todaysDate = new Date();
  let report = {
    reportId: reportId,
    date: todaysDate
  };
  type = validations.validateType(type); // FIXME create in Validations

  const fraudstersCollection = await fraudsters();

  let fraudsterToUpdate = await fraudstersCollection.findOneAndUpdate(
    {_id: new ObjectId(fraudsterId)},
    {$addToSet:
      {eins: ein,
      itins: itin,
      ssns: ssn,
      emails: email,
      phones: phone,
      names: nameFraudster,
      users: userId,
      reports: report,
      updateDates: todaysDate},
      $inc: {numReports: 1},
    }
  );
  let insert;
  if (await isFraudsterTrending(fraudsterId)) {
    insert = await fraudstersCollection.findOneAndUpdate({_id: new ObjectId(fraudsterId)},{$set: {trending: true}});
  }

  const updatedFraudster = await fraudstersCollection.findOne({_id: new ObjectId(fraudsterId)});
  return updatedFraudster;
 }

export async function isFraudsterTrending(fraudsterId) {
  fraudsterId = validations.validateId(fraudsterId);
  const fraudstersCollection = await fraudsters();
  let oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const fraudster = await fraudstersCollection.findOne({_id: new ObjectId(fraudsterId)});
  
  if (!fraudster) {
    throw new Error (`fraudster not found`);
    return;
  }

  const recentReports = fraudster.reports.filter(report => report.date >= oneWeekAgo);
  const count = recentReports.length;
  if (count < 3) return false;

return true;
}

//FIXME finisih updating fraudster: updateDate, trending
export async function updateFraudsterAfterRemoveReport(reportId) {
  reportId = validations.validateId(reportId);
  const fraudsterCollection = await fraudsters();
  const fraudsterWithReport = await fraudsterCollection.findOne({reports: new ObjectId(reportId)});
  if(!fraudsterWithReport) return;
  
  const reportsCollection = await reports();
  const report = await reportsCollection.findOne({_id: new ObjectId(reportId)});

  let ein = report.ein;
  let itin = report.itin;
  let ssn = report.ssn;
  let email = report.email;
  let phone = report.phone;
  let nameFr = report.nameFr;
  let userId = report.userId;
  
  let updatedFraudster = await fraudsterCollection.findOneAndUpdate(
    {reports: new ObjectId(reportId)},
    {$pull: {
      eins: ein,
      itins: itin,
      ssns: ssn,
      emails: email,
      phones: phone,
      names: nameFr,
      reports: reportId,
      users: userId
    },
    $inc: {numReports: -1}
  })
}
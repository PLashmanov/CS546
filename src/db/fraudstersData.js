import {ObjectId} from 'mongodb';
import {validateId} from '../validations/Validations.js';
import{fraudsters} from '../config/mongoCollections.js';
import {validateEIN, validateITIN, validateSSN, validateEmailFr, validatePhoneNumberFr, validateAddressFr} from '../validations/Validations.js';

export const getFraudsterById = async (fraudsterId) => {
    fraudsterId = validateId(fraudsterId);
    const fraudsterCollection = await fraudsters();
    const fraudster = await fraudsterCollection.findOne({_id: newObject(fraudsterId)});
    if(!fraudster) throw `error: fraudster not found`;
    return fraudster;
}

// checks if fraudster exists in collection and returns their id, false otherwise
export async function fraudsterExists(ein, itin, ssn, email, phone, address) {
    ein = validateEIN(ein);
    itin = validateITIN(itin);
    ssn = validateSSN(ssn);
    email = validateEmailFr(email); 
    phone = validatePhoneNumberFr(phone); // FIXME: check the input 

   let fraudstersCollection = await fraudsters();
    let fraudster;
    if (fraudster = await fraudstersCollection.findOne({einArr: ein})) {
      return fraudster._id.toString();
    } else if (fraudster = await fraudstersCollection.findOne({itinArr: itin})) {
      return fraudster._id.toString();
    } else if (fraudster = await fraudstersCollection.findOne({ssnArr: ssn})) {
      return fraudster._id.toString();
    } else if (fraudster = await fraudstersCollection.findOne({emailArr: email})) {
      return fraudster._id.toString();
      //FIXME: check if we are still using phone
    } else if (fraudster = await fraudstersCollection.findOne({phoneArr: phone})) {
      return fraudster._id.toString();
    }
    return false;
}

//FIXME: this is hard-coded for the db proposal

export async function createFraudster() {

const newFraudster = {
  eins: [],
  itins: [], 
  ssns: [],
  emails: [],
  phones: [],
  names: [],
  users: [],
  numReports: 0,
  trending: false
}
const fraudstersCollection = await fraudsters();
let fraudster = await fraudstersCollection.insertOne(newFraudster);
if(!fraudster.acknowledged || !fraudster.insertedId) throw `error: could not add fraudster`;
const fraudsterId = fraudster.insertedId.toString();
const fraudsterInserted = await fraudstersCollection.findOne({_id: new ObjectId(fraudsterId)});

return fraudsterInserted;
}

 //FIXME: checks mandatory fields, also updates trending status // usage: reports.txt -> createReport()
 export const updateFraudsterAfterReport = async (ein, itin, ssn, email, phone, address, nameFraudster, userId, reportId) => {
    reportId = validateId(reportId);
    userId = validateId(userId);
}
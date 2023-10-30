import * as validations from '../validations/Validations.js';
import {reports} from '../config/mongoCollections.js';
import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import {fraudsterExists, createFraudster} from './fraudstersData.js';
import {updateUserAfterReport} from './usersData.js';
import {updateFraudsterAfterReport} from './fraudstersData.js';

export const createReport = async (
    userId,
    ein = null,
    itin = null,
    ssn = null,
    email = null,
    phone = null,
    nameFraudster = null,
    type = null   //FIXME: create validation for type
    ) => {

    userId = validations.validateId(userId);
    const userCollection = await users();
    let user = await userCollection.findOne({_id: new ObjectId(userId)});
    if (!user) throw `error: user ${userId} does not exist`;

    ein = validations.validateEIN(ein);
    itin = validations.validateITIN(itin);
    ssn = validations.validateSSN(ssn);
    email = validations.validateEmailFr(email); 
    phone = validations.validatePhoneNumberFr(phone); // FIXME: check the input 

    if (ein === "N/A" && itin === "N/A" && ssn === "N/A"
    && email === "N/A" && phone === 'N/A') throw `error: one of the following must be provided: ein, itin, ssn, email, phone or address`;

    nameFraudster = validations.validateNameFr(nameFraudster);
    type = validations.validateType(type); //FIXME: create validateType
    
    const reportCollection = await reports();
    if (await reportCollection.findOne({ein: ein})) ;
    
    let fraudsterId;
    //check if fraudster exists
    let fraudsterExistsId = fraudsterExists(ein, itin, ssn, email, phone);
    if (fraudsterExistsId) {
        fraudsterId = fraudsterExistsId;
    } else {
        const newFraudster = createFraudster(ein, itin, ssn, email, phone, nameFraudster, userId);
        fraudsterId = newFraudster._id.toString();
    }
    let newReport = {
        userId: userId,
        ein: ein,
        itin: itin,
        ssn: ssn,
        email: email,
        phone: phone,
        nameFraudster: nameFraudster, 
        fraudsterId: fraudsterId,
        type: type
    }
    const insertReport = await reportCollection.insertOne(newReport);
    if(!insertReport.acknowledged || !insertReport.insertedId) throw `error: could not add report`;
    const newReportId = insertReport.insertedId.toString();
    const report = await getReportById(newReportId);

    const updatedUsers = updateUserAfterReport(userId, newReportId);

     //FIXME: add reprtId to fraudsters once fraudsters implemented
     //const updatedFraudsters = updateFraudsterAfterReport();

    return report;
};

export const getReportById = async (id) => {
    id = validations.validateId(id);
    const reportCollection = await reports();
    const report = await reportCollection.findOne({_id: new ObjectId(id)});
    if(!report) throw `Error: report not found`;
    return report;
};

export async function getNumOfReports() {
    const reportsCollection = await reports();
    const count = await reportsCollection.countDocuments();
    if(count === undefined) throw `error: could not get the count of reports`;
    return count;
}

export const removeReport = async(reportId) => {
    reportId = validations.validateId(reportId);

    const reportsColleciton = await reports();
    const removed = await reportsColleciton.findOneAndDelete({_id: new ObjectId(reportId)});

    if(!removed) throw `error: report ${reportId} cound not be deleted`;

    updateUserAfterRemoveReport(reportId);
    return "Report ${id} deleted";
};


async function updateUserAfterRemoveReport(reportId) {
    id = validations.validateId(id);
    const userCollection = await users();
    const userWithReport = await userCollection.findOne({reportIds: id});
    if (!userWithReport) return;

    const updatedUser = await userCollection.findOneAndUpdate(
        {reportIds: id},
        {$pull: {reportIds: id}, $inc: {numOfReports: -1}},
        {returnOriginal: false});

    if (!updatedUser || !updatedUser.value) throw `error: failed to remove reportId from reportIds array in users`;

    return `Report ${reportId} was deleted from user collection`;
}


//FIXME finisih updating fraudster: users, reports and numReports
export async function updateFraudsterAfterRemoveReport(reportId) {
    const fraudsterCollection = await fraudsterExists();
    const fraudsterWithReport = await fraudsterCollection.findOne({reportIds: id});
    if(!fraudsterWithReport) return;

    const updatedFrUsers = await fraudsterCollection.findOneAndUpdate(
        {reportIds: id},
        {$pull: {users: }}
    )
}









//FIXME: we can delete if this is too much
// export const getAllReports = async () => {
//     const reportCollection = await reports();
//     let reports = await reportCollection.find({}).toArray();
//     if(!reports) throw `Could not get all reports`;
//     reports = reports.map((x) => {
//         x._id = x._id.toString();
//         return x;
//     });
// };

//FIXME:
export const getAllReportsOfUser = async(userId) => {

}

//FIXME:
export const getAllReportsForFraudster = async(fraudsterId) => {

}


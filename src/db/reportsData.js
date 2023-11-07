import * as validations from '../validations/Validations.js';
import { reports } from '../config/mongoCollections.js';
import { fraudsters } from '../config/mongoCollections.js';
import { users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import { fraudsterExists, createFraudster } from './fraudstersData.js';
import * as usersData from './usersData.js';
import * as fraudstersData from './fraudstersData.js';

export const createReport = async (
    userId,
    ein = null,
    itin = null,
    ssn = null,
    email = null,
    phone = null,
    nameFraudster = null,
    type = null
) => {

    userId = validations.validateId(userId);
    const userCollection = await users();
    let user = await userCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) throw new Error(`user ${userId} does not exist`);

    ein = validations.validateEIN(ein);
    itin = validations.validateITIN(itin);
    ssn = validations.validateSSN(ssn);
    email = validations.validateEmailFr(email);
    phone = validations.validatePhoneNumberFr(phone);

    if (ein === "N/A" && itin === "N/A" && ssn === "N/A"
        && email === "N/A" && phone === 'N/A') throw new Error(`one of the following must be provided: ein, itin, ssn, email, phone or address`);

    nameFraudster = validations.validateNameFr(nameFraudster);
    type = validations.validateType(type); //FIXME: create validateType

    let date = new Date();

    let fraudsterId;
    let fraudsterExistsId = await fraudsterExists(ein, itin, ssn, email, phone);
    if (fraudsterExistsId) {
        fraudsterId = fraudsterExistsId;
    } else {
        const newFraudster = await createFraudster();
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
        type: type,
        createDate: date
    }

    const reportCollection = await reports();
    const insertReport = await reportCollection.insertOne(newReport);
    if (!insertReport.acknowledged || !insertReport.insertedId) throw new Error(`could not add report`);
    const newReportId = insertReport.insertedId.toString();
    const report = await getReportById(newReportId);

    const updatedUsers = await usersData.updateUserAfterCreateReport(userId, newReportId);
    let updatedFraudsters = await fraudstersData.updateFraudsterAfterCreateReport(fraudsterId, ein, itin, ssn, email, phone, nameFraudster, userId, newReportId, type);

    return report;
};

export const getReportById = async (id) => {
    id = validations.validateId(id);
    const reportCollection = await reports();
    const report = await reportCollection.findOne({ _id: new ObjectId(id) });
    if (!report) throw new Error(`report not found`);
    return report;
};

export async function getNumOfReports() {
    const reportsCollection = await reports();
    const count = await reportsCollection.countDocuments();
    if (count === undefined) throw new Error(`could not get the count of reports`);
    return count;
}

export const getAllReportsOfUser = async (userId) => {
    userId = validations.validateId(userId);
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) throw new Error(`User ${userId} not found`);
    return user.reportIds;
}

export const getAllReportsForFraudster = async (fraudsterId) => {
    fraudsterId = validations.validateId(fraudsterId);
    const fraudsterCollection = await fraudsters();
    const fraudster = await fraudsterCollection.findOne({ _id: new ObjectId(fraudsterId) });
    if (!fraudster) throw new Error('fraudster ${fraudsterId} not found');
    const fraudsterReports = fraudster.reports.map(report => report.reportId);
    return fraudsterReports;
}
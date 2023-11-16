import * as validations from '../validations/Validations.js';
import { reports } from '../config/mongoCollections.js';
import { fraudsters } from '../config/mongoCollections.js';
import { users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import { BusinessError } from '../error/customErrors.js';
import * as reportsData from './reportsData.js';


export const createUser = async (
    email,
    firstName,
    lastName,
    companyName,
    phoneNumber,
    password,
    notifications
) => {

    if (email === undefined || email === null ||
        firstName === undefined || firstName === null ||
        lastName === undefined || lastName === null ||
        companyName === undefined ||
        phoneNumber === undefined ||
        password === undefined || password === null ||
        notifications === undefined || notifications === null) {
        throw new Error('one or more arguments are missing in createUser');
    }
    email = validations.validateEmail(email);
    const userCollection = await users();
    const existingUser = await userCollection.findOne({ email: email });
    if (existingUser) throw new Error(new BusinessError(`user with email ${email} already exists`));

    firstName = validations.validateName(firstName, "firstName");
    lastName = validations.validateName(lastName, "lastName");
    companyName = validations.validateCompanyName(companyName);
    phoneNumber = validations.validatePhoneNumber(phoneNumber);
    password = validations.validatePassword(password);
    let hashedPassword = await hashPassword(password);
    notifications = validations.validateNotifications(notifications);
    let reportIds = [];
    let numOfReports = 0;
    let badge = false;

    let newUser = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        companyName: companyName,
        phoneNumber: phoneNumber,
        hashedPassword: hashedPassword,
        reportIds: reportIds,
        numOfReports: numOfReports,
        badge: badge,
        notifications: notifications
    }
    const insertedUser = await userCollection.insertOne(newUser);
    if (!insertedUser.acknowledged || !insertedUser.insertedId) throw new Error(`error: could not add user`);
    const newId = insertedUser.insertedId.toString();
    const user = await getUserById(newId);
    return user;
};

export const getUserById = async (id) => {
    id = validations.validateId(id);
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    if (!user) throw new Error(`Error: user ${id} not found`);
    return user;
};

// remove function affects fraudsters and reports collections:
//fraudsters collection (array: users), reports collection(userId)
export const removeUser = async (userId) => {
    userId = validations.validateId(userId);

    let usersCollection = await users();
    if (! await usersCollection.findOne(new ObjectId(userId))) throw new Error(`user ${userId} not found`);
    let idToChangeTo = await updateReportsAfterRemoveUser(userId);
    await updateFraudstersAfterRemoveUser(userId, idToChangeTo);

    const removed = await usersCollection.findOneAndDelete({ _id: new ObjectId(userId) });
    if (!removed) throw new Error(`User ${userId} could not be deleted`);

    return `User ${userId} deleted`;
};

export const updateUserAfterCreateReport = async (userId, reportId) => {

    try {
        userId = validations.validateId(userId);
        reportId = validations.validateId(reportId);

        const userCollection = await users();

        let user = await userCollection.findOne({ _id: new ObjectId(userId) });

        let badge = false;
        if (user.numOfReports >= 9) badge = true;

        const updatedUser = await userCollection.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            {
                $push: { reportIds: reportId },
                $inc: { numOfReports: 1 },
                $set: { badge: badge }
            },
            { returnOriginal: false }
        );
    } catch (error) {
        console.error('Error updating user after creating report:', error);
    }
}

async function hashPassword(password) {
    try {
        const salt = await bcrypt.genSalt(5);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.error("Error hashing password:", error);
        throw error;
    }
}

export async function getUserByReportId(reportId) {
    let report = await reportsData.getReportById(reportId);
    let userWithReportId = report.userId.toString();
    let userWithReport = await getUserById(userWithReportId);
    return userWithReport;
}

export async function fetchUsersFromIds(userIds) {
    try {
        if (!validations.isArray(userIds)) {
            throw new Error("list of ids need to be of type array")
        }
        const userCollection = await users();
        const mongoIds = userIds.map(id => validations.getMongoID(id));
        const usersToEmail = await userCollection.find({ _id: { $in: mongoIds } }).toArray();
        return usersToEmail;
    } catch (ex) {
        console.error("error while fetching user ids ", ex);
        throw ex;
    }
}

export async function updateReportsAfterRemoveUser(userId) {
    userId = validations.validateId(userId);
    //make changes in reports collection:
    //update userId in reports colelction to the id of the master. Save as string
    let usersCollection = await users();
    let master = await usersCollection.findOne({ firstName: "MASTER" });
    if (!master) throw new BusinessError(`error: users collection must have a Master`);
    let idToChangeTo = master._id.toString();
    if (idToChangeTo === userId) throw new Error(`error: Master cannot be deleted`);

    let reportCollection = await reports();
    reportCollection.updateMany(
        { userId: userId },
        { $set: { userId: idToChangeTo } }
    );
    return idToChangeTo;
}

export async function updateFraudstersAfterRemoveUser(userId, idToChangeTo) {
    userId = validations.validateId(userId);
    let fraudstersCollection = await fraudsters();
    await fraudstersCollection.updateMany({ users: userId }, { $addToSet: { users: idToChangeTo } });
    await fraudstersCollection.updateMany({ users: userId }, { $pull: { users: userId } });
}
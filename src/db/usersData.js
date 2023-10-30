import * as validations from '../validations/Validations.js';
import {reports} from '../config/mongoCollections.js';
import {fraudsters} from '../config/mongoCollections.js';
import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';

export const createUser = async (
    email,
    firstName,
    lastName,
    companyName,
    phoneNumber,
    password,
    notifications
) => {

    email = validations.validateEmail(email);
    const userCollection = await users();
    const existingUser = await userCollection.findOne({email: email});
    if (existingUser) throw `error: user with email ${email} already exists`;

    firstName = validations.validateName(firstName);
    lastName= validations.validateName(lastName);
    companyName = validations.validateCompanyName(companyName);
    email = validations.validateEmail(email);
    phoneNumber = validations.validatePhoneNumber(phoneNumber); // FIXME: check the input // get rid of it?
    let hashedPassword = validations.validatePassword(password);    // FIXME: implementation needed in validations.js Proffessor will talk about it
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
    if(!insertedUser.acknowledged || !insertedUser.insertedId) throw `error: could not add user`;
    const newId = insertedUser.insertedId.toString();
    const user = await getUserById(newId);
    return user;
};

export const getUserById = async (id) => {
    id = validations.validateId(id);
    const userCollection = await users();
    const user = await userCollection.findOne({_id: new ObjectId(id)});
    if(!user) throw `Error: user ${id} not found`;
    return user;
};

// remove function affects fraudsters and reports collections:
//fraudsters collection (array: users), reports collection(userId)
export const removeUser = async(id) => {
    id = validations.validateId(id);

    let existingObjId = new ObjectId(id);

    //make changes in reports collection:
    //update userId in reports colelction to the id of the master. Save as string
    let usersCollection = await users();
    let master = await usersCollection.findOne({firstName: "MASTER"});
    if(!master) throw `error: users collection must have Master`;
    let idToChangeTo = master._id.toString();
    if (idToChangeTo === id) throw `error: master cannot be deleted`;

    let reportCollection = await reports();
    let changedUserId = reportCollection.updateMany(
        {userId: existingObjId},
        {$set: {userId: idToChangeTo}}
    );
    //make changes in fraudsters collection, users array
    let fraudstersCollection = await fraudsters();
    let updatedUserIds = await fraudstersCollection.updateMany({users: existingObjId},{$addToSet: {users: idToChangeTo}});
    let deleteOldOne = await fraudstersCollection.updateMany({users: existingObjId}, {$pull: {users: id}});

    //remove user
    const removed = await usersCollection.findOneAndDelete({_id: existingObjId}); 
    if (!removed) throw `User could not be deleted`;

    return `User ${id} deleted`;
};

//FIXME: update with patch // usage: reports ->to add reportId to user, incr num reports and check badge
export const updateUserAfterReport = async (userId, reportId) => {
    reportId = validations.validateId(reportId);

    const userCollection = await users();
    const updatedUser = await userCollection.findOneAndUpdate(
        {_id: new ObjectId(userId)},
        {$push: {reportIds: reportId}, $inc: {numOfReports: 1}});
    let updatedUserBadge = await userCollection.find({_id: new ObjectId(userId)});
    if (updatedUserBadge.numOfReports < 10) {
        updatedUserBadge = false;
    } else {
        updatedUserBadge = true;
    }
}

//FIXME: update with put? ASK PAVEL
export const updateUserPut = async () => {
}
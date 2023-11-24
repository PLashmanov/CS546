import {seed_config,generateUsers,generateRamdomUsers,generateRamdomFraudsters,generateFraudsters} from "./seed_util.js";
import { faker } from '@faker-js/faker';
import { createUser } from '../db/usersData.js'

import {dbConnection, closeConnection} from '../config/mongoConnection.js';
//stash

//const db = await dbConnection();
//await db.dropDatabase();

console.log("Creating default & simulating users\n")
// default users
//generateUsers.forEach((user) => {console.log(user)});
// random users
generateRamdomUsers.forEach((user) => {createUser(user.email[0],user.firstName,user.lastName,user.companyName,user.phoneNumber,user.hashedPassword, user.notifications)});
/* 
email,
    firstName,
    lastName,
    companyName,
    phoneNumber,
    password,
    notifications
 */
// random fraudsters
//generateRamdomFraudsters.forEach((fraudster) => {console.log(fraudster)});

//generateFraudsters.forEach((fraudster) => {console.log(fraudster)});z

//await closeConnection();

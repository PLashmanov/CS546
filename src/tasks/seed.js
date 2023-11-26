
import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import {seed_config,generateUsers,generateRamdomUsers,generateRamdomFraudsters,generateFraudsters} from "./seed_util.js";
import { faker } from '@faker-js/faker';
import { createUser, insertMany} from '../db/usersData.js'

//stash

//const db = await dbConnection();
//await db.dropDatabase();

const db = await dbConnection();
await db.dropDatabase();

console.log("Creating default & simulating users\n")
// default users
//generateUsers.forEach((user) => {console.log(user)});

const users = async () => {

    generateUsers.forEach( async (user) => { 
        let userTmp = await createUser(user.email,user.firstName,user.lastName,user.companyName,user.phoneNumber,user.hashedPassword, user.notifications)
    });
}

// random users
const randomUsers = async () => {
    await insertMany(generateRamdomUsers);
   /*  generateRamdomUsers.forEach( async (user) => { 
        let userTmp = await createUser(user.email[0],user.firstName,user.lastName,user.companyName,user.phoneNumber,user.hashedPassword, user.notifications)
    }); */
}

await randomUsers();
//await users();
//await createUser ("foo@gmail.com","john","bonx","Bonx IC","+14018478981","!pF7yfWN30",true)
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

await closeConnection();

import {seed_config,generateUsers,generateRamdomUsers,generateRamdomFraudsters,generateFraudsters} from "./seed_util.js";
import { faker } from '@faker-js/faker';
import {createUser} from '../db/usersData.js'
import {closeConnection} from '../config/mongoConnection.js'

const randomUsers= async () => {
    generateRamdomUsers.map( (user) => createUser(user.email,user.firstName,user.lastName,user.companyName,user.phoneNumber,user.hashedPassword,user.notifications))
}

console.log("Creating default & simulating users\n")
// default users
let defaultUsers = generateUsers
//defaultUsers.forEach((user) => {console.log(user)});
//defaultUsers.map( (user) => createUser(user.email,user.firstName,user.lastName,user.companyName,"+12128550474",user.hashedPassword,user.notifications))


// random users
await randomUsers()
//generateRamdomUsers.map( (user) => createUser(user.email,user.firstName,user.lastName,user.companyName,user.phoneNumber,user.hashedPassword,user.notifications))

// random fraudsters
//generateRamdomFraudsters.forEach((fraudster) => {console.log(fraudster)});

//generateFraudsters.forEach((fraudster) => {console.log(fraudster)});z

//await closeConnection();



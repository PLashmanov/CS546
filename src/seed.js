import {dbConnection, closeConnection} from './config/mongoConnection.js';
import * as users from './db/users.js';
import * as reports from './db/reports.js';
import * as fraudsters from './db/fraudsters.js';

const db = await dbConnection();
//await db.dropDatabase();

// try {
//     let vaiva = await users.createUser(vaiva@vitten.com',  'Vaiva', 'Vitten', '', '+18312556644', '$2a$10$N5NH4Xt9uj18GCd7W9Rl2eHrw8k6lhGpds5w389ux.bwZFMK5WSiq', true);
//     console.log(vaiva);
// } catch (e) {
//     console.log(e);
// }

// try {
//     let vaiva = await users.getUserById('653c512cd60772d9108c8c7d');
//     console.log(vaiva);
// } catch (e) {
//     console.log(e);
// }

// try {
//     let vaiva = await fraudsters.createFraudster();
//     console.log(vaiva);
// } catch (e) {
//     console.log(e);
// }

// try {
//     let vaiva = await users.removeUser('653bf9b5a61dac49aa219d61');
//     console.log(vaiva);
// } catch (e) {
//     console.log(e);
// }

// try {
//     let vaiva = await reports.getNumOfReports();
//     console.log(vaiva);
// } catch (e) {
//     console.log(e);
// }


// try {
//     let vaiva = await reports.removeReport('653c9d7451f411eca19f5a44');
//     console.log(vaiva);
// } catch (e) {
//     console.log(e);
// }

// try {
//     let vaiva = await reports.createReport('653c512cd60772d9108c8c7d', '', '', '254-22-8468', 'inventing@anna.com', '+18322456812', 'Anna Delvi', 'insurance_fraud');
//     console.log(vaiva);
// } catch (e) {
//     console.log(e);
// }

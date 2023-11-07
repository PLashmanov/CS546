import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import * as users from './usersData.js';
import * as reports from './reportsData.js';
import * as fraudsters from './fraudstersData.js';

const db = await dbConnection();
//await db.dropDatabase();

// try {
//     let vaiva = await users.createUser('v.vitten@gmail.com', 'Vaiva', 'Vitten', '', ' + 18312556644', 'tralala12!', true);
//     console.log(vaiva);
// } catch (e) {
//     console.log(e);
// }

// try {
//     let vaiva = await users.createUser('m.vitten@vitten.com', 'Matthias', 'Vitten', '', ' + 18312556644', 'tralala12!', true);
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
//     let vaiva = await users.removeUser('654948718f0188921d467409');
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
//     let vaiva = await reports.createReport('6549682087a8f667ca76cc4a', '', '', '254-22-8468', 'inventing@anna.com', '+18322456812', 'Anna Delvi', 'insurance_fraud');
//     console.log(vaiva);
// } catch (e) {
//     console.log(e);
// }

try {
    let matthias = await reports.createReport('6549759f4de215a1bc71a757', '', '', '', '', '+18322456812', 'Anna Delvi', '');
    console.log(matthias);
} catch (e) {
    console.log(e);
}
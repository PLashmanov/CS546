import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import { createUser, createMaster, getNumOfUsers } from '../db/usersData.js'
import { createReport, getNumOfReports } from '../db/reportsData.js';
import { createFeedback, getNumOfFeedback } from '../db/feedbackData.js';
import { createReview, getNumOfReviews } from '../db/reviewsData.js';
import { createDetectionRecord, getNumOfDetections } from '../db/detectionsData.js';
import { getNumOfFraudsters } from '../db/fraudstersData.js'


const db = await dbConnection();
await db.dropDatabase();

// ************** users  *********************
console.log(" *********************** 1) creating users ***********************\n")

createMaster();

let user1 = await createUser("g@gmail.com", "Phill", "Hawes", "ABC", "+12128478981", "foobar123!", false)
let user2 = await createUser("h@gmail.com", "Jack", "Hawes", "123 Holdings", "+16178478981", "foobar123!", false)
let user3 = await createUser("b@gmail.com", "George", "Johns", "89 Holdings", "+12018478981", "foobar123!", false)
let user4 = await createUser("a@gmail.com", "Janice", "Unice", "89 Holdings", "+12038478982", "foobar123!", false)
let user5 = await createUser("b@msft.com", "Wendy", "Johns", "Holdings Inc", "+14148478981", "foobar123!", false)

let userCnt = await getNumOfUsers();
console.log('--> created ' + userCnt + ' users\n\n')

// ************** fraud reports  *********************
console.log(" *********************** 2) creating reports ***********************\n")

console.log("ignore below harmless errors with 'No valid email addresses retrieved for fraudsterID: $frauderID'. Its because no users have enabled email notifications\n")

let fraud1 = await createReport(user1._id.toString(), '12-3456789', null, null, 'badperson@gmail.com', '+12123453456', "Bad Johnny", 'wire_fraud')
let fraud2 = await createReport(user1._id.toString(), '34-3456789', null, null, 'b123n@gmail.com', '+12123453456', "Bad Sam", 'money_laundering')
let fraud3 = await createReport(user1._id.toString(), '56-3456789', null, null, 'bad@gmail.com', '+12123453456', "Bad Hank", 'creditcard_fraud')
let fraud4 = await createReport(user1._id.toString(), null, null, '035-54-9898', 'person1@gmail.com', '+12123453456', "Bad Johnny", 'wire_fraud')
let fraud5 = await createReport(user1._id.toString(), '12-3456789', null, '035-54-9898', 'badperson@gmail.com', '+12123453456', "Bad Johnny", 'wire_fraud')
let fraud6 = await createReport(user1._id.toString(), '12-3456789', null, null, 'person2@gmail.com', '+12123453456', "Bad Johnny", 'wire_fraud')
let fraud7 = await createReport(user1._id.toString(), '12-3456789', null, null, 'badperson@gmail.com', '+12123453456', "Bad Johnny", 'money_laundering')
let fraud8 = await createReport(user1._id.toString(), '12-3456789', null, null, 'badperson@gmail.com', '+12123453456', "Bad Johnny", 'wire_fraud')
let fraud9 = await createReport(user1._id.toString(), '12-3456789', null, null, 'badperson@gmail.com', '+12123453456', "Bad Johnny", 'insurance_fraud')
let fraud10 = await createReport(user1._id.toString(), '12-3456789', null, null, 'badperson@gmail.com', '+12123453456', "Bad Johnny", 'embezzlement')
let fraud11 = await createReport(user2._id.toString(), '12-3456789', null, null, 'badperson@gmail.com', '+12123453456', "Bad Johnny", 'wire_fraud')
let fraud12 = await createReport(user3._id.toString(), '12-3456789', null, null, 'badperson@gmail.com', '+12123453456', "Tim Johnny", 'wire_fraud')
let fraud13 = await createReport(user4._id.toString(), '12-3456789', null, null, 'badperson@gmail.com', '+12123453456', "Nan Navi", 'wire_fraud')
let fraud14 = await createReport(user5._id.toString(), '11-3456789', null, null, 'badman@gmail.com', '+12123453457', "", 'mortgage_fraud')
let fraud15 = await createReport(user5._id.toString(), '10-3456789', null, null, 'badwoman@gmail.com', '+12123453458', "Bad", 'mortgage_fraud')
let fraud16 = await createReport(user5._id.toString(), '19-3456789', null, null, 'badkid@gmail.com', '+12123453459', "Jim", 'mortgage_fraud')
let fraud17 = await createReport(user5._id.toString(), '13-3456789', null, null, 'badstudent@gmail.com', '+12123453460', "Anna", 'mortgage_fraud')
let fraud18 = await createReport(user5._id.toString(), '14-3456789', null, null, 'manbad@gmail.com', '+12123453461', "Ann", 'mortgage_fraud')
let fraud19 = await createReport(user5._id.toString(), '15-3456789', null, null, 'fraud@gmail.com', '+12123453462', "Sue", 'mortgage_fraud')
let fraud20 = await createReport(user5._id.toString(), '16-3456789', null, null, 'cheat@gmail.com', '+12123453463', "Knot Good", 'mortgage_fraud')
let fraud21 = await createReport(user5._id.toString(), '17-3456789', null, null, 'robber@gmail.com', '+12123453464', "Nat", 'mortgage_fraud')
let fraud22 = await createReport(user5._id.toString(), '17-3456789', null, null, 'thiswillhurt@gmail.com', '+12123453465', "Lucky Bob", 'mortgage_fraud')
let fraud23 = await createReport(user5._id.toString(), null, null, '035-57-9978', 'badmatt@gmail.com', '+12123453758', "Bad Matt", 'insurance_fraud')
let fraud24 = await createReport(user5._id.toString(), null, '955-78-1234', '519-11-1385', 'badmatt3@gmail.com', '+12123453459', "Jim", 'mortgage_fraud')
let fraud25 = await createReport(user5._id.toString(), null, null, '185-37-7785', 'badstudent1@gmail.com', '+12123453460', "Annabell", 'identify_theft')
let fraud26 = await createReport(user5._id.toString(), null, null, '785-12-4489', 'badann@gmail.com', '+12123473461', "Ann", 'identify_theft')
let fraud27 = await createReport(user5._id.toString(), null, '955-78-1235', '115-88-1336', 'fraud12@gmail.com', '+12123453762', "Sue", 'identify_theft')
let fraud28 = await createReport(user5._id.toString(), null, null, '896-78-1385', 'cheat55@gmail.com', '+12128453463', "Knot Good", 'identify_theft')
let fraud29 = await createReport(user5._id.toString(), null, null, '225-98-8823', 'robber404@gmail.com', '+12129853464', "Nat", 'identify_theft')
let fraud30 = await createReport(user5._id.toString(), null, null, '123-77-4468', 'thiswillhurt22@gmail.com', '+19173453465', "Lucky Bob", 'identify_theft')
let fraud31 = await createReport(user5._id.toString(), '17-3456789', null, null, 'thiswillhurt5@gmail.com', '+12013453465', "Lucky Bob", 'mortgage_fraud')
let fraud32 = await createReport(user5._id.toString(), null, '935-57-7970', null, 'badmatthew@gmail.com', '+12123466758', "Bad Matt", 'insurance_fraud')
let fraud33 = await createReport(user5._id.toString(), null, '950-57-7174', null, 'badmatt388@gmail.com', '+12123452459', "Jim", 'mortgage_fraud')
let fraud34 = await createReport(user5._id.toString(), null, '901-33-6942', '123-45-6789', 'badstudent10@gmail.com', '+12126553460', "Annabell", 'money_laundering')
let fraud35 = await createReport(user5._id.toString(), null, '933-45-7782', null, 'badannie@gmail.com', '+12123473981', "Ann", 'utility_scam')
let fraud36 = await createReport(user5._id.toString(), null, '922-78-9877', null, 'frauder@gmail.com', '+12123983762', "Sue", 'money_laundering')
let fraud37 = await createReport(user5._id.toString(), null, '954-44-7764', '789-45-6123', 'cheating@gmail.com', '+12125553463', "Knot Good", 'utility_scam')
let fraud38 = await createReport(user5._id.toString(), null, '903-38-6689', null, 'robbers@gmail.com', '+12129873464', "Nat", 'phishing')
let fraud39 = await createReport(user5._id.toString(), null, '904-98-1315', null, 'thiswillhurttomorrow@gmail.com', '+12126653465', "Lucky Bob", 'phishing')


console.log('\n')
let fraud_cnt = await getNumOfReports();
console.log('-->  created ' + fraud_cnt + ' reports\n')
let fraudsters_cnt = await getNumOfFraudsters();
console.log('-->  created ' + fraudsters_cnt + ' fraudsters\n\n')

// ************** feedback  *********************
console.log(" *********************** 3) creating feedback ***********************\n")


let feedback1 = await createFeedback(user1._id.toString(), 'Phil', 'jim@gmail.com', 'This site rocks!')
let feedback2 = await createFeedback(user2._id.toString(), 'JAck', 'jack@gmail.com', 'This site saved my family from financial ruin')
let feedback3 = await createFeedback(user3._id.toString(), 'George', 'georg@gmail.com', 'Love it. Thank you Frap!')
let feedback4 = await createFeedback(user1._id.toString(), 'Phil', 'jim2@gmail.com', 'Phil again! I earned a badge! Thanks')
let feedback5 = await createFeedback(user3._id.toString(), 'George', 'jim@gmail.com', 'George here.. am going to earn a badge one of these days!')
let feedback6 = await createFeedback(user3._id.toString(), 'George', 'jim@gmail.com', 'George here again!!. very close to my first badge now!')

let feedback_cnt = await getNumOfFeedback();
console.log('-->  created ' + feedback_cnt + ' feedback\n')

// ************** reviews  *********************
console.log(" *********************** 4) creating reviews ***********************\n")

let review1 = await createReview(user5._id.toString(), 'wends', "A+ love it so much")
let review2 = await createReview(user4._id.toString(), 'JANICE', '9 out of 10 from JANICE! Continue the good work!')
let review3 = await createReview(user3._id.toString(), 'George', 'Frap rocking it')
let review4 = await createReview(user2._id.toString(), 'JJ', 'How do I turn on email notifications?')
let review5 = await createReview(user1._id.toString(), 'PH', 'man this site is good')

let reviews_cnt = await getNumOfReviews();
console.log('-->  created ' + reviews_cnt + ' reviews\n')

// ************** detections  *********************
console.log(" *********************** 5) creating detections ***********************\n")


let detect1 = await createDetectionRecord(true, 75, "Fraud detected")
let detect2 = await createDetectionRecord(false, 5, "No Fraud detected")
let detect3 = await createDetectionRecord(true, 99, "Massive Fraud detected")
let detect4 = await createDetectionRecord(false, 1, "No Fraud detected")
let detect5 = await createDetectionRecord(true, 71, "Minimal Fraud detected")
let detect6 = await createDetectionRecord(false, 11, "Passing score")
let detect7 = await createDetectionRecord(true, 80, "Some Fraud detected")

let dections_cnt = await getNumOfDetections();
console.log('-->  created ' + dections_cnt + ' detections\n')

console.log(" *********************** finished. exiting ***********************\n")


await closeConnection();
process.exit()

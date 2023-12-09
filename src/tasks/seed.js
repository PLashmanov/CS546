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

let review1 = await createReview(user5._id.toString(), 'wends', "A+ love it")
let review2 = await createReview(user4._id.toString(), 'JANICE', '9 out of 10 from JANICE!')
let review3 = await createReview(user3._id.toString(), 'George V', 'Frap rocking it')
let review4 = await createReview(user3._id.toString(), 'JJ', 'How do I turn on email notifications?')
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

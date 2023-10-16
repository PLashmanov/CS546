import { MailSender } from "../util/MailSender.js";
import { fetchUsersFromEmails, fetchFraudsterByID } from "../db/index.js";
import { ObjectId } from 'mongodb';
import {isValidEmailAddress} from "../validations/Validations.js"
/**
 * Alert Users About Fraudster Activity
  caller needs to catch all exceptions thrown and log only
       - should not throw user out for alert errors

 * @todo 
 * - Replace `#v1fetchEmailsWithAlertEnabled` with `#fetchEmailsWithAlertEnabled` when db is created
   @example
    dotenv.config();
    const alertUsers = new AlertService();
    let fraudsterID = "507f1f77bcf86cd799439011";
    try{
      await alertUsers.alertUsers(fraudsterID);
    }
    catch(e){
      console.error("error sending email for modification of fraduster: " , fraudsterID , "with error " , e)
    }
*/

class AlertService {
  constructor() {
    this.mailSender = new MailSender();
  }
   /* dummy function until db created - include emails here to test */
  #v1fetchEmailsWithAlertEnabled(fraudsterID) {
    return [ 'stephendmiller14@gmail.com'];
  }

  /** 
    @param {string} fraudsterID - The unique identifier of the fraudster. Needs to be a valid mongo ID
  **/
  async alertUsers(fraudsterID) {
    if (!ObjectId.isValid(fraudsterID)) {
      throw new Error('Invalid ObjectId passed to alert service:', fraudsterID);
    }
    /* USE WHEN DB CREATED */
    //const emailAddresses = #fetchEmailsWithAlertEnabled(fraudsterID) 
    const emailAddresses = this.#v1fetchEmailsWithAlertEnabled(fraudsterID);
    if (!Array.isArray(emailAddresses) || emailAddresses.length === 0) {
      console.error('No valid email addresses retrieved for fraudsterID:', fraudsterID);
      throw new Error('No valid email addresses retrieved for fraudsterID:', fraudsterID);
    }
    for (let userEmail of emailAddresses) {  
      if (await isValidEmailAddress(userEmail)) {
         await this.#sendAlertEmail(userEmail, fraudsterID);
      }
      else{
        console.error("invalid email format:  " ,  userEmail)
      }
    }
  }
  
  async #fetchEmailsWithAlertEnabled(fraudsterID) {
      let emails = await fetchFraudsterByID(fraudsterID); 
      let users = await fetchUsersFromEmails(emails);
      return users.filter(user => user.notificationsEnabled).map(user => user.email);
  }

  async #sendAlertEmail(userEmail , fraudsterID) { 
      const info = await this.mailSender.sendMail({
        from: process.env.FRAP_EMAIL,
        to: userEmail,
        subject: 'Alert from FRAP',
        body: `A fraudster you reported has been modified. Fraudster ID: ${fraudsterID}`,});
      console.log('Email sent:', info.accepted);
  }
}
 
export { AlertService };

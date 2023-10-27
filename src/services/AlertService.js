import { MailSender } from "../util/MailSender.js";
import { fetchUsersFromEmails, fetchFraudsterByID } from "../db/index.js";
import { ObjectId } from 'mongodb';
import {isValidEmailAddress, isArray} from "../validations/Validations.js"
/**
 * Alert Users About Fraudster Activity
   @example
    dotenv.config();
    const alertService = new AlertService();
    let fraudsterID = "507f1f77bcf86cd799439011";
    try{
        await alertService.alertUsers(fraudsterID);
    }
    catch(e){
        console.error("error sending email for modification of fraduster: " , fraudsterID , "with error " , e)
    }
*/

class AlertService {
  constructor() {
    this.mailSender = new MailSender();
  }
  /** 
    @param {string} fraudsterID - The unique identifier of the fraudster. Needs to be a valid mongo ID
  **/
  async alertUsers(fraudsterID) {
    if (!ObjectId.isValid(fraudsterID)) {
      throw new Error('Invalid ObjectId passed to alert service:', fraudsterID);
    }
    const emailAddresses = await this.#fetchEmailsWithAlertEnabled(fraudsterID) 
    if (!isArray(emailAddresses) || emailAddresses.length === 0) {
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
      const fraduster = await fetchFraudsterByID(fraudsterID); 
      const users = await fetchUsersFromEmails(fraduster.email);
      return users.filter(user => user.notifications).map(user => user.email);
  }

  async #sendAlertEmail(userEmail , fraudsterID) { 
      const status = await this.mailSender.sendMail({
        from: process.env.FRAP_EMAIL,
        to: userEmail,
        subject: 'Alert from FRAP',
        body: `A fraudster you reported has been modified. Fraudster ID: ${fraudsterID}`,});
      console.log(`Email sent: ${status.response}, Accepted: ${status.accepted}`);
  }
}
 
export { AlertService };

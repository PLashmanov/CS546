import { MailSender } from "../util/MailSender.js";
import { fetchUsersFromIds } from "../db/usersData.js";
import { ObjectId } from 'mongodb';
import { isValidEmailAddress, isArray } from "../validations/Validations.js";
import { getFraudsterById } from "../db/fraudstersData.js";

export class AlertService {
  static instance = null;
  constructor() {
    this.mailSender = new MailSender();
    this.emailQueue = [];
    this.isProcessing = false;
    this.#initializeEmailWorker();
  }
  static getInstance() {
    if (!AlertService.instance) {
        AlertService.instance = new AlertService();
    }
    return AlertService.instance;
  }
  async alertUsers(fraudsterID) {
    if (!ObjectId.isValid(fraudsterID)) {
      throw new Error('Invalid ObjectId passed to alert service:', fraudsterID);
    }
    const emailAddresses = await this.#fetchEmailsWithAlertEnabled(fraudsterID);
    if (!isArray(emailAddresses) || emailAddresses.length === 0) {
      console.error('No valid email addresses retrieved for fraudsterID:', fraudsterID);
      return;
    }
    for (let userEmail of emailAddresses) {
      if (await isValidEmailAddress(userEmail)) {
        this.emailQueue.push({ userEmail, fraudsterID });
      } else {
        console.error("Invalid email format:", userEmail);
      }
    }
  }

  #initializeEmailWorker() {
    setInterval(async () => {
      if (!this.isProcessing && this.emailQueue.length > 0) {
        this.isProcessing = true;
        try {
          while (this.emailQueue.length > 0) {
            const user = this.emailQueue.shift();
            await this.#sendEmail(user);
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        } catch (ex) {
            console.error('error sending email ', ex);
        } finally {
            this.isProcessing = false;
        }
      }
    }, 3000); 
  }

  async #sendEmail(user) {
    const {userEmail, fraudsterID } = user;
    const status = await this.mailSender.sendMail({
      from: process.env.FRAP_EMAIL,
      to: userEmail,
      subject: 'Alert from FRAP',
      body: `A fraudster you reported has been modified. Fraudster ID: ${fraudsterID}`,
    });
    console.log(`Email sent: ${status.response}, Accepted: ${status.accepted}`);
  }

  async #fetchEmailsWithAlertEnabled(fraudsterID) {
    const fraudster = await getFraudsterById(fraudsterID);
    if (!fraudster || !fraudster.users) {
      throw new Error('Fraudster not found or userIds missing in fraudster collection');
    }
    const users = await fetchUsersFromIds(fraudster.users);
    return users.filter(user => user.notifications).map(user => user.email);
  }
}


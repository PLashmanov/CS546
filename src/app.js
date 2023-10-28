import { AlertService  } from "./services/AlertService.js";
import dotenv from 'dotenv';

async function main() {   

    dotenv.config();
    const alertUsers = new AlertService();
    let fraudsterID = "507f1f77bcf86cd799439011";
    /* alert users based on fraudstreID */
    /*
    try{
        await alertUsers.alertUsers(fraudsterID);
    }
    catch(e){
        console.error("error sending email for modification of fraduster: " , fraudsterID , "with error " , e)
    }
    */
    
}
main();

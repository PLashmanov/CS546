import { usersCollection , sessionsCollection } from "../config/mongoCollections.js";
import  bcrypt from 'bcrypt'; 


/** 
@example
const user = await LoginService.authenticate(email}, pass);
To logout -> await LoginService.destroyAllUserSessions({email});
*/

class LoginService {
    
    static async authenticate(reqEmail, reqPassword) {
        const user = await this.#getUser(reqEmail)
        const isPasswordValid = await this.#verifyPassword(reqPassword, user.password); 
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }
        delete user.password;
        return user;
    }

    static createSession(req, user) {
        req.session.userEmail = user.email;
    }

    static async destroyAllUserSessions(reqEmail) {
        const user = await this.#getUser(reqEmail)
        try{
            const sessionCollection = await sessionsCollection();
            let deleteResult =  await sessionCollection.deleteMany({ "session": { $regex: `"userEmail":"${String(reqEmail)}"` } });
            if(deleteResult.deletedCount !== 0){
                console.log("previous sessions were deleted " , deleteResult.deletedCount  )
            }
        }
        catch(err){
            throw new Error("error deleting sessions " , err)
        } 
    }
   static async #verifyPassword(reqPassword, storedPass){
        return await bcrypt.compare(reqPassword, storedPass);
    }
    static async #getUser(reqEmail){
        const userCollection = await usersCollection();
        const user = await userCollection.findOne({ email: reqEmail });

        if (!user) {
            throw new Error('User not found');
        }
        return user; 
    }

}

export default LoginService;

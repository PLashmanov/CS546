import { usersCollection  } from "../config/mongoCollections.js";
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

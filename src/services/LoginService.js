import { users  } from "../config/mongoCollections.js";
import  bcrypt from 'bcrypt'; 
import { BusinessError } from '../error/customErrors.js';
/** 
@example
const user = await LoginService.authenticate(email}, pass);
To logout -> await LoginService.destroyAllUserSessions({email});
*/

class LoginService {
    
    static async authenticate(reqEmail, reqPassword) {
        const user = await this.#getUser(reqEmail)
        const isPasswordValid = await this.#verifyPassword(reqPassword, user.hashedPassword); 
        if (!isPasswordValid) {
            throw new BusinessError('Either Password or Login is invalid');
        }
        const userDetails = {
            firstName: user.firstName,
            email: user.email
        };
        return userDetails;
    }
    static async createSession(req, user) {
        const userInfo = await this.#getUser(user.email);
        req.session.user = {
            email: userInfo.email,
            firstName: userInfo.firstName,
            id : userInfo._id.toString()
        };

    }
   static async #verifyPassword(reqPassword, storedPass){
        return await bcrypt.compare(reqPassword, storedPass);
    }
    static async #getUser(reqEmail){
        const userCollection = await users();
        const user = await userCollection.findOne({ email: reqEmail });
        if (!user) {
            throw new Error('Either Password or Login is invalid');
        }
        return user; 
    }
}

export default LoginService;

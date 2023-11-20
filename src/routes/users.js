import {Router} from 'express';
import  {createUser} from '../db/usersData.js';
import { ValidationError, BusinessError} from '../error/customErrors.js';
import  LoginService from '../services/LoginService.js';
import {validatePasswordConfirmation} from '../validations/Validations.js'
const router = Router();

router
    .post('/register', async (req, res) => {
        try {
            const { email, firstName, lastName, companyName, 
                  phoneNumber, password, confirmPassword, notifications } = req.body;
            
            if (!email || !firstName || !lastName || !companyName || !phoneNumber || !password || !confirmPassword) {
            throw new ValidationError("required field is missing ");
            }
            validatePasswordConfirmation(password,confirmPassword)
           const user  = await createUser(
                email,
                firstName,
                lastName,
                companyName,
                phoneNumber,
                password,
                notifications 
            )
            if(user){
                LoginService.createSession(req, user);
                req.session.isLoggedIn = true;
                req.session.user = {
                    email: user.email
                };
            }
            return res.status(200).json({ message: user});
        } catch (ex) {
            if (ex instanceof ValidationError) {
              return res.status(400).json({ error: ex.message });
            }
            else if (ex instanceof BusinessError) {
              return res.status(409).json({ error: ex.message });
            }
            return res.status(500).json({ error: ex.message });
        }
    });

export default router;
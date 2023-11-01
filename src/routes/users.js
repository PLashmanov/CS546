import {Router} from 'express';
import  {createUser} from '../db/usersData.js';
import { ValidationError, BusinessError} from '../error/customErrors.js';


const router = Router();

router
    .post('/register', async (req, res) => {
        try {
            const email =  req.body.email;
            const firstName =  req.body.firstName;
            const lastName =  req.body.lastName;
            const  companyName =  req.body.companyName;
            const phoneNumber =  req.body.phoneNumber;
            const password =  req.body.password;
            const notifications =  req.body.notifications;
           const user  = await createUser(
                email,
                firstName,
                lastName,
                companyName,
                phoneNumber,
                password,
                notifications 
            )
            return res.status(200).json({ message: user.email});
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
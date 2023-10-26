import {Router} from 'express';
import  LoginService from '../services/LoginService.js';
//import { ValidationError, BusinessError } from '../error/customErrors.js';
const router = Router();

router
  .post('/login', async (req, res) => {
    try {
        const user = await LoginService.authenticate(req.body.email, req.body.password);
        LoginService.createSession(req, user);
        return res.status(200).json({ message: 'User authenticated successfully ' , user});
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

router
  .post('/logout', async (req, res) => {
    try {
        const userEmail = req.body.email;
        req.session.destroy(async (err) => {
            if (err) {
                return res.status(500).json({ error:'Could not log out: ' + err.message});
            }
            try{
                await LoginService.destroyAllUserSessions(userEmail);
            }
            catch(err){
               return res.status(500).json({ error:'Could not log out: ' + err.message});
            }
            return res.status(200).json({ message: 'Logged out'});
        });
    } catch (err) {
        return res.status(500).json( { error:'Could not log out: ' + err.message});
    }
});


export default router;
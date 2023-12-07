import {Router} from 'express';
import  LoginService from '../services/LoginService.js';
import { BusinessError } from '../error/customErrors.js';
import xss from 'xss';
const router = Router();

router
    .post('/login', async (req, res) => {
        try {
            const sanitizedEmail = xss(req.body.email);
            const user = await LoginService.authenticate(sanitizedEmail, req.body.password);
            await LoginService.createSession(req, user);
            req.session.isLoggedIn = true;
            
            return res.status(200).json({ message: user});
        } catch (ex) {
            if (ex instanceof BusinessError) {
              return res.status(409).json({ error: ex.message });
            }
            return res.status(500).json({ error: ex.message });
        }
    });
    

router
    .post('/logout', (req, res) => {
        if (req.session) {
            req.session.destroy(ex => {
            if (ex) {
                return res.status(500).json( { error:'Could not log out user: ' + ex.message});
            } else {
                res.clearCookie('FrapSess');
                return res.status(200).json({ message: 'Logged out'});
            }
            });
    }
});

export default router;
import {Router} from 'express';
import  LoginService from '../services/LoginService.js';
const router = Router();

router
    .post('/login', async (req, res) => {
        try {
            const user = await LoginService.authenticate(req.body.email, req.body.password);
            LoginService.createSession(req, user);
            req.session.isLoggedIn = true;
            req.session.user = {
                email: user.email
            };
            return res.status(200).json({ message: user});
        } catch (ex) {
            return res.status(400).json({ error: ex.message });
        }
    });

router
    .post('/logout', (req, res) => {
        req.session.destroy(ex => {
        if (ex) {
            return res.status(500).json( { error:'Could not log out user: ' + ex.message});
        } else {
            return res.status(200).json({ message: 'Logged out'});
        }
        });
});

export default router;
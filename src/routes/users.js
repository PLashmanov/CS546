import {Router} from 'express';
import  {createUser, removeUser , getUserById , updateUser} from '../db/usersData.js';
import { ValidationError, BusinessError} from '../error/customErrors.js';
import  LoginService from '../services/LoginService.js';
import {validatePasswordConfirmation} from '../validations/Validations.js'
const router = Router();

router.post('/register', async (req, res) => {
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
                await LoginService.createSession(req, user);
                req.session.isLoggedIn = true;
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
router.delete('/delete', async (req, res) => {
    try{
        if (req.session && req.session.user) {
            const resp = await removeUser(req.session.user.id)
            req.session.destroy(ex => {
            if (ex) {
                console.error("could not delete session")
                return res.status(200).json({ message: resp});
            } else {
                res.clearCookie('FrapSess');
                return res.status(200).json({ message: resp});
            }
            });
        } else {
            return res.status(409).json({ message: "user not logged in"});
        }
    }
    catch (ex) {
        if (ex instanceof ValidationError) {
            return res.status(400).json({ error: ex.message });
        }
        else if (ex instanceof BusinessError) {
            return res.status(409).json({ error: ex.message });
        }
        return res.status(500).json({ error: ex.message });
    }
});
router.get('/profile', async (req, res) => {
    try{
        if (req.session.isLoggedIn && req.session.user) {
            const userInfo = await getUserById(req.session.user.id)
            res.render('profile', { 
                title: 'Profile',
                user: userInfo
            });
        }
        else{
            res.status(400).render('error', { message: "user not logged in" });
        }
    }
    catch (ex) {
        if (ex instanceof ValidationError) {
            res.status(400).render('error', { message: ex.message });
        }
        else if (ex instanceof BusinessError) {
            res.status(409).render('error', { message: ex.message });
        }
        res.status(400).render('error', { message: ex.message });
    }
    
});
router.put('/update', async (req, res) => {
    try{
        if (req.session.isLoggedIn && req.session.user) {
        const { email, companyName, phoneNumber, notifications } = req.body;
        
        if (!email || !companyName || !phoneNumber) {
        throw new ValidationError("attribute is missing ");
        }
       const user  = await updateUser(
            req.session.user.id,
            email,
            companyName,
            phoneNumber,
            notifications 
        )
        return res.status(200).json({ message: user});
    }
        else{
            res.status(400).render('error', { message: "user not logged in" });
        }
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
router.get('/getuserinfo', (req, res) => {
    if (req.session.isLoggedIn && req.session.user) {
        return res.status(200).json({ user: req.session.user });
    } else {
        res.status(400).json({ error: 'User not logged in' });
    }
});


export default router;
import {Router} from 'express';
import  {createUser, removeUser , getUserById , updateUser} from '../db/usersData.js';
import { ValidationError, BusinessError} from '../error/customErrors.js';
import  LoginService from '../services/LoginService.js';
import { MetricService } from '../services/MetricService.js';
import {validatePasswordConfirmation} from '../validations/Validations.js'
import xss from 'xss';
const router = Router();

router.post('/register', async (req, res) => {
    try {
        let { email, firstName, lastName, companyName, phoneNumber, password, confirmPassword, notifications } = req.body;
        
      
        email = xss(email);
        firstName = xss(firstName);
        lastName = xss(lastName);
        companyName = xss(companyName);
        phoneNumber = xss(phoneNumber);
            
            if (!email || !firstName || !lastName || !phoneNumber || !password || !confirmPassword) {
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
router.get('/report', async (req, res) => {
    try{
        if (req.session.isLoggedIn && req.session.user) {
            const userInfo = await getUserById(req.session.user.id)
            res.render('report', { 
                title: 'Report',
                user: userInfo,
                userLoggedIn:true,
            });
        }
        else{
            res.status(400).render('error', {title: "error", message: "User Not Logged In!" });
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
router.get('/dashboard', async (req, res) => {
    try{
        if (req.session.isLoggedIn && req.session.user) {
            const userInfo = await getUserById(req.session.user.id)
            let metrics =  await MetricService.getInstance().getMetrics();
            res.render('dashboard', { 
                title: 'Dashboard',
                user: userInfo,
                userLoggedIn:true,
                metrics: metrics,
            });
        }
        else{
            res.status(400).render('error', {title: "error", message: "User Not Logged In!" });
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
router.get('/lookup', async (req, res) => {
    try{
        if (req.session.isLoggedIn && req.session.user) {
            const userInfo = await getUserById(req.session.user.id)
            res.render('lookup', { 
                title: 'Search for Fraudster',
                user: userInfo,
                userLoggedIn:true,
            });
        }
        else{
            res.status(400).render('error', {title: "error", message: "User Not Logged In!" });
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
/*router.get('/feedback', async (req, res) => {
    try {
        res.render('feedback', {title: "Feedback or Questions",userLoggedIn: req.session && req.session.isLoggedIn});
    } catch (e) {
        console.error(e);
        res.status(500).send("Error Rendering Page");
    }
});*/
router.get('/index', async (req, res) => {
    try {
        res.render('index', {title: "Home",userLoggedIn: req.session && req.session.isLoggedIn});
    } catch (e) {
        console.error(e);
        res.status(500).send("Error Rendering Page");
    }
});
router.get('/login', async (req, res) => {
    try {
        res.render('login', {title: "Login",userLoggedIn: req.session && req.session.isLoggedIn});
    } catch (e) {
        console.error(e);
        res.status(500).send("Error Rendering Page");
    }
});

router.get('/register', async (req, res) => {
    try {
        res.render('register', {title: "Register",userLoggedIn: req.session && req.session.isLoggedIn});
    } catch (e) {
        console.error(e);
        res.status(500).send("Error Rendering Page");
    }
});

router.get('/about', async (req, res) => {
    try {
        res.render('about', {title: "About FRAP",userLoggedIn: req.session && req.session.isLoggedIn});
    } catch (e) {
        res.status(500).send("Error Rendering Page");
    }
});
router.get('/contact', async (req, res) => {
    try {
        res.render('contact', {title: "Contact",userLoggedIn: req.session && req.session.isLoggedIn});
    } catch (e) {
        res.status(500).send("Error Rendering Page");
    }
});

router.get('/profile', async (req, res) => {
    try{
        if (req.session.isLoggedIn && req.session.user) {
            const userInfo = await getUserById(req.session.user.id)
            res.render('profile', { 
                title: 'Profile',
                user: userInfo,
                userLoggedIn:true,
            });
        }
        else{
            res.status(400).render('error', {title: "error", message: "User Not Logged In!" });
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
    try {
        if (req.session.isLoggedIn && req.session.user) {
            let { email, companyName, phoneNumber, notifications } = req.body;
            email = xss(email);
            companyName = xss(companyName);
            phoneNumber = xss(phoneNumber);
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
            res.status(400).render('error', {title: "error", message: "user not logged in" });
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
import {Router} from 'express';
const router = Router();

router.get('/', (req, res, next) => {
    next();
}, isLoggedIn);

router.get('/user/index', (req, res, next) => {
    next();
}, isLoggedIn);

function isLoggedIn(req, res, next) {
    if (req.session.isLoggedIn) {
        next();  
    } else {
        res.redirect('/user/login');  
    }
}

export default router;
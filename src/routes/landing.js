import { MetricService } from '../services/MetricService.js';
import {Router} from 'express';
const router = Router();

router.get('/', async (req, res) => {
    try {
        res.render('index', {title: "Home",userLoggedIn: req.session && req.session.isLoggedIn});
    } catch (e) {
        console.error(e);
        res.status(500).send("Error Rendering Page");
    }
});

router.get('/metrics', async (req, res) => {
    try {
        let metrics =  await MetricService.getInstance().getMetrics();
        return res.json(metrics);
    } catch (e) {
        console.error(e);
        res.status(500).send("Error Getting Metrics");
    }
});
/*
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
*/

export default router;
import { Router } from 'express';
import { FraudDectionService } from '../services/FraudDetectionService.js';
import multer from 'multer';
import xss from 'xss';

const upload = multer({ dest: './public/upload/' })

const router = Router();

router.get('/', async (req, res) => {
    try {
        res.render('detect', {title: "Detect Fraud",userLoggedIn: req.session && req.session.isLoggedIn});
    } catch (error) {
        res.status(500).send("Error with getting detect route");
    }
});

router.get('/submit-detect', async (req, res) => {
    if (req.session && req.session.isLoggedIn) {
        res.render('detect', {
            title: "Submit File for Fraud Detection",
            userLoggedIn: req.session && req.session.isLoggedIn
        })
    } else {
        res.redirect('/user/login');
    }
});

router.post('/submit-detect', upload.single('uploaded_file'), async (req, res) => {

    if (!req.session || !req.session.isLoggedIn) {
        return res.redirect('/user/login');
    }

    const uploadedFile = req.file;
    try {
        let detectionResult =  await FraudDectionService.getInstance().detectFraud(uploadedFile.path);
        //detectionResult = xss(detectionResult);maybe needed, not sure....
        res.render('detectResults', {fraudResult: detectionResult,
                    userLoggedIn: req.session && req.session.isLoggedIn});
    } catch (error) {
        //res.status(500).send("Error with getting detect route");
        res.render('detect', {title: "Detect Fraud",error: error, userLoggedIn: req.session && req.session.isLoggedIn});
    }
 });
export default router;
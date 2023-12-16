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

    try {
        const uploadedFile = req.file;
        if (uploadedFile.mimetype != 'application/pdf'){
            throw new Error ('Unsupported file type! Please upload a pdf file!')
        }
        let detectionResult =  await FraudDectionService.getInstance().detectFraud(uploadedFile.path);
        res.render('detectResults', {fraudResult: detectionResult,title: 'Detection Results',
                    userLoggedIn: req.session && req.session.isLoggedIn});
    } catch (error) {
        res.render('detect', {title: "Detect Fraud",error: error, userLoggedIn: req.session && req.session.isLoggedIn});
    }
 });
export default router;
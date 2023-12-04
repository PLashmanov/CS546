import { Router } from 'express';
import { FraudDectionService } from '../services/FraudDetectionService.js';
import multer from 'multer';

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
            userLoggedIn: true
        })
    } else {
        res.redirect('/user/login');
    }
});

router.post('/submit-detect', upload.single('uploaded_file'), async (req, res) => {

    const uploadedFile = req.file;
    try {
        let detectionResult =  await FraudDectionService.getInstance().detectFraud(uploadedFile.path);
        res.render('detectResults', {frauldResult: detectionResult});
    } catch (error) {
        res.status(500).send("Error with getting detect route");
    }
 });
export default router;
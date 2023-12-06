import { Router } from 'express';
import { createFeedback } from '../db/feedbackData.js'; 
import { validateName, validateEmail, validateFeedbackText } from '../validations/Validations.js';
import xss from 'xss';

const router = Router();

router.get('/', async (req, res) => {
    try {
        res.render('feedback', {
            title: "Feedback",
            userLoggedIn: req.session && req.session.isLoggedIn
        })
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).send("Error fetching reviews");
    }
});

router.get('/feedback', (req, res) => {
   
    const success = req.query.status === 'success';
    res.render('feedback', {
        title: "Feedback or Question",
        userLoggedIn: req.session && req.session.isLoggedIn,
        successMessage: success ? "Feedback submitted successfully!" : null
    });
});


router.post('/submit-feedback', async (req, res) => {
    
    if (!req.session || !req.session.isLoggedIn) {
        return res.redirect('/user/login');
    }
    try {
        const sanitizedReq = {
            name: xss(req.body.name),
            email: xss(req.body.email),
            feedback: xss(req.body.feedback)
        };
        const userId = req.session.user.id;
        let { name, email, feedback } = sanitizedReq;
        name = validateName(name);
        email = validateEmail(email);
        validateFeedbackText(feedback); 
        let feedbackRes = await createFeedback(userId, name, email, feedback); 
        return res.status(200).json({ message: feedbackRes});
    } catch (ex) {
        console.error("Error submitting feedback: ", ex);
        return res.status(500).json({ error: ex.message });
    }
});



export default router;
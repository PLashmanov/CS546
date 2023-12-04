import { Router } from 'express';
import { createFeedback } from '../db/feedbackData.js'; 
import { validateName, validateEmail, validateFeedbackText } from '../validations/Validations.js';


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
    console.log(req.body);
    if (!req.session || !req.session.isLoggedIn) {
        return res.redirect('/user/login');
    }

    const userId = req.session.user.id;
    let { name, email, feedback } = req.body;

    try {
        name = validateName(name);
        email = validateEmail(email);
        validateFeedbackText(feedback); 

        await createFeedback(userId, name, email, feedback); 
        res.redirect('/user/index');
    } catch (error) {
        console.error("Error submitting feedback: ", error);
        res.redirect('/feedback');
    }
});



export default router;
import { Router } from 'express';
import { getAllReviews, createReview } from '../db/reviewsData.js';
import { ValidationError, BusinessError } from '../error/customErrors.js';
import { validateNickname, validateBody } from '../validations/Validations.js';
import xss from 'xss';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const allReviews = await getAllReviews();
        res.render('reviews', {
            title: "Reviews",
            reviews: allReviews,
            userLoggedIn: req.session && req.session.isLoggedIn
        })
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).send("Error fetching reviews");
    }
});

router.get('/submit-review', (req, res) => {
    if (req.session && req.session.isLoggedIn) {
        res.render('submitReview', {
            title: "Submit Review",
            userLoggedIn: true
        })
    } else {
        res.redirect('/user/login');
    }
});

router.post('/submit-review', async (req, res) => {
    try {
        if (!req.session || !req.session.isLoggedIn) {
            throw new Error("Must log in to submit a review");
        }
        let userId = req.session.user.id;

        let errorMessages = [];
        let nickName = xss(req.body.nickName);
        let body = xss(req.body.body)

        try {
            if (!nickName) errorMessages.push("Please enter a nickname");
            if (!body) errorMessages.push("Please enter your review");

            nickName = validateNickname(nickName);
            body = validateBody(body);

        } catch (validationError) {
            errorMessages.push(validationError.message);
        }

        if (errorMessages.length > 0) {
            return res.status(400).render('submitReview', {
                title: "submit-review",
                errorMessage: errorMessages[0],
                nickNameInput: nickName,
                bodyInput: body
            })
        }
        let result;
        try {
            result = await createReview(userId, nickName, body);
        } catch (serverError) {
            return res.status(500).render('submitReview', {
                title: "Submit Review",
                errorMessage: serverError.message,
                nickNameInput: nickName,
                bodyInput: body
            })
        }
        if (result.insertedReview) {
            res.redirect('/reviews');
        } else {
            return res.status(500).render('error', {
                message: "Status 500: internal server error"
            })
        }

    } catch (error) {
        console.error("Error submitting review: ", error);
        res.status(500).render('error', { title: 'error', message: "error submitting review" });
    }
});
export default router;
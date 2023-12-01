import { Router } from 'express';
import { getAllReviews, createReview } from '../db/reviewsData.js';
import { ValidationError, BusinessError } from '../error/customErrors.js';

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
            title: "SubmitReview",
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
        const userId = req.session.user.id;
        const { nickName, body } = req.body;
        await createReview(userId, nickName, body);
        res.redirect('/reviews');
    } catch (error) {
        console.error("Error submitting review: ", error);
        res.status(500).render('error', { title: 'error', message: "error submitting review" });
    }
});
export default router;
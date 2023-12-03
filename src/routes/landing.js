
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



export default router;
import dotenv from 'dotenv';
import configRoutesFunction from './routes/index.js';
import express from 'express';
import session from "express-session";
import MongoStore from 'connect-mongo';
import exphbs from 'express-handlebars';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
async function main() {

    dotenv.config();
    const app = express();
    app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
    app.set('view engine', 'handlebars');
    app.use(express.urlencoded({ extended: true }));

    app.use(session({
        name: 'FrapSess',
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_SESSION_URL
        }),
        cookie: {
            maxAge: 3600000,
            secure: false
        }
    }));
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const staticDir = express.static(__dirname + '/public');
    app.use('/public', staticDir);
    app.use(express.static('public'));
    app.use(express.json());
    configRoutesFunction(app);
    app.listen(3000, () => {
        console.log('app running on http://localhost:3000');
    });
}
main();


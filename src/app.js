import dotenv from 'dotenv';
import configRoutesFunction from './routes/index.js';
import express from 'express';
import session  from "express-session";
import MongoStore from 'connect-mongo';

async function main() {  

    dotenv.config();
    const app = express();
    app.use(session({
        name: 'FrapSess',
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_SESSION_URL
          }) ,  
        cookie: {
            maxAge: 3600000,
            secure: false
        }
    }));
    app.use(express.json());
    configRoutesFunction(app);
    app.listen(3000, () => {
    console.log('app running on http://localhost:3000');
    });
}
main();


import * as validations from '../validations/Validations.js';
import { feedbacks } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';

export async function createFeedback(userId, name, email, feedbackText) {
    userId = validations.validateId(userId);
    name = validations.validateName(name);
    email = validations.validateEmail(email);
    feedbackText = validations.validateFeedbackText(feedbackText);

    if (!userId || !name || !email || !feedbackText) {
        throw new Error("One or more fields are missing to create feedback");
    }

    const newFeedback = {
        userId,
        name,
        email,
        feedbackText,
        date: new Date()
    };

    const feedbackCollection = await feedbacks();
    const insertedFeedback = await feedbackCollection.insertOne(newFeedback);

    if (!insertedFeedback.acknowledged || !insertedFeedback.insertedId) {
        throw new Error(`Could not add feedback`);
    }

    return insertedFeedback;
}


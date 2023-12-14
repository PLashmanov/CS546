import * as validations from '../validations/Validations.js';
import { reviews } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import { formatDate } from './fraudstersData.js';

export async function createReview(userId, nickName, body) {
    userId = validations.validateId(userId);
    nickName = validations.validateNickname(nickName);
    body = validations.validateReviewBody(body);

    if (userId === null || userId === undefined || nickName === null || nickName === undefined
        || body === null || body === undefined) throw new Error("One ore more fields are missing to create review");

    let date = new Date();

    let newReview = {
        userId: userId,
        nickName: nickName,
        body: body,
        date: date
    }
    const reviewCollection = await reviews();

    if (reviewCollection.findOne({ userId: userId })) {
        throw new Error("Thank you for your interest in leaving a review. We value your feedback. However, please note that each user is limited to one review. It appears that you have already submitted a review. If you have any additional feedback or questions, please feel free to reach out to our support team. We're here to assist you!");
    }

    let insertedReview = await reviewCollection.insertOne(newReview);

    if (!insertedReview.acknowledged || !insertedReview.insertedId) throw new Error(`could not add review`);
    const reviewId = insertedReview.insertedId.toString();
    const reviewToReturn = await findReviewById(reviewId);

    return { insertedReview: true };
}

export async function findReviewById(reviewId) {
    const reviewCollection = await reviews();
    const reviewToReturn = reviewCollection.findOne({ _id: new ObjectId(reviewId) });
    return reviewToReturn;
}

export async function getAllReviews() {
    const reviewsCollection = await reviews();
    const allReviews = await reviewsCollection.find().sort({ date: -1 }).limit(50).toArray();

    allReviews.forEach(review => {
        if (review.date) {
            const dateObj = new Date(review.date);

            review.formattedDate = dateObj.toDateString();
        }
    })
    return allReviews;
}

export async function getNumOfReviews() {

    const reviewsCollection = await reviews();
    const count = await reviewsCollection.countDocuments();
    if (count === undefined) throw new Error('User Reviews count cannot be retrieved.');
    return count;
}
import authRoutes from './auth.js';
import landingRoutes from './landing.js'
import express from 'express';
import userRoutes from './users.js'
import fraudsterRoutes from './fraudsters.js'
import reviewsRoutes from './reviews.js';
import feedbackRoutes from './feedback.js';

const constructorMethod = (app) => {
  app.use('/', landingRoutes); //disable mandatory login
  app.use('/auth', authRoutes);
  app.use('/user', userRoutes);
  app.use('/fraudster', fraudsterRoutes);
  app.use('/reviews', reviewsRoutes);
  app.use('/feedback',feedbackRoutes);
  app.use(express.static('public'));
  app.use('/images', express.static('images'));
  app.use('*', (req, res) => {
    res.status(400).render('error', { title: "error", message: "Page Not Found" });
  });
};

export default constructorMethod;
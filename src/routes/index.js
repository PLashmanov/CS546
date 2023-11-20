import authRoutes from './auth.js';
import landingRoutes from './landing.js'
import express from 'express';
import userRoutes from './users.js'
import fraudsterRoutes from './fraudsters.js'

const constructorMethod = (app) => {
  app.use('/', landingRoutes); //disable mandatory login
  app.use('/auth', authRoutes);
  app.use('/user', userRoutes);
  app.use('/fraudster', fraudsterRoutes);
  app.use(express.static('public'));
  app.use('/images', express.static('images'));
  app.use('*', (req, res) => {
    res.status(404).json({error: 'Not found'});
  });
};

export default constructorMethod;
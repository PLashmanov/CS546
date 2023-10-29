import authRoutes from './auth.js';
import landingRoutes from './landing.js'
import express from 'express';

const constructorMethod = (app) => {
  app.use('/', landingRoutes);
  app.use('/auth', authRoutes);
  app.use(express.static('public'));
  app.use('/images', express.static('images'));
  app.use('*', (req, res) => {
    res.status(404).json({error: 'Not found'});
  });
};

export default constructorMethod;
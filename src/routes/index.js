import authRoutes from './auth.js';


const constructorMethod = (app) => {
  app.use('/auth', authRoutes);
  app.use('*', (req, res) => {
    res.status(404).json({error: 'Not found'});
  });
};

export default constructorMethod;
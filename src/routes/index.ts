
import express from 'express';
import reserveRoutes from './reserve';

const router = express.Router();

router.use('/reserve', reserveRoutes);

export default router;

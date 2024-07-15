
import express from 'express';
import reserveRoutes from './reserve';
import integrationsRoutes from './integrations';

const router = express.Router();

router.use('/reserve', reserveRoutes);
router.use('/integrations', integrationsRoutes);
export default router;

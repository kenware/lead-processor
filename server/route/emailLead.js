import express from 'express';
import Auth from '../middleware/auth';
import EmailLeadController from '../controller/emailLead';
import EmailLeadMiddleware from '../middleware/emailLead';


const router = express.Router();

export default router;

router.get('/lead',
  Auth.Authenticate,
  EmailLeadMiddleware.checkEmailAssignee,
  EmailLeadController.getLead
);

router.get('/leads',
  Auth.Authenticate,
  Auth.IsAdmin,
  EmailLeadMiddleware.validateQueryStatus,
  EmailLeadController.fetchLeads
);

router.post('/leads/status',
  Auth.Authenticate,
  Auth.IsAdmin,
  EmailLeadMiddleware.validateStatus,
  EmailLeadController.decisionOrStatus
);

router.post('/leads/decision',
  Auth.Authenticate,
  EmailLeadMiddleware.validateDecision,
  EmailLeadController.decisionOrStatus
);

import express from 'express';
import { addRule, displayRules, displayRuleById, updateRule, deleteRule } from '../controllers/ruleController.js';

const router = express.Router();

// Add a new rule
router.post('/addrules', addRule);

// Display all rules
router.get('/displayrule', displayRules);

// Display a specific rule by ID
router.get('/displayrule/:id', displayRuleById);

// Update a rule
router.put('/updaterule/:id', updateRule);

// Delete a rule
router.delete('/deleterule/:id', deleteRule);

export default router; 
const express = require('express');
const { body } = require('express-validator');
const {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} = require('../controllers/opportunityController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const opportunityValidation = [
  body('customerName').trim().notEmpty().withMessage('Customer name is required'),
  body('requirement').trim().notEmpty().withMessage('Requirement summary is required'),
  body('estimatedValue')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Estimated value must be a non-negative number'),
  body('stage')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'])
    .withMessage('Invalid stage value'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Invalid priority value'),
  body('contactEmail')
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage('Invalid contact email'),
];

router.use(protect); // All routes require authentication

router.route('/').get(getOpportunities).post(opportunityValidation, createOpportunity);
router.route('/:id').get(getOpportunityById).put(updateOpportunity).delete(deleteOpportunity);

module.exports = router;

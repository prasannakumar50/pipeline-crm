const { validationResult } = require('express-validator');
const Opportunity = require('../models/Opportunity');

// @desc    Get all opportunities
// @route   GET /api/opportunities
// @access  Private
const getOpportunities = async (req, res, next) => {
  try {
    const { stage, priority, search, sortBy, order } = req.query;
    const filter = {};

    if (stage) filter.stage = stage;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { requirement: { $regex: search, $options: 'i' } },
        { contactName: { $regex: search, $options: 'i' } },
      ];
    }

    const sortField = sortBy || 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;

    const opportunities = await Opportunity.find(filter)
      .populate('owner', 'name email')
      .sort({ [sortField]: sortOrder });

    res.status(200).json(opportunities);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single opportunity
// @route   GET /api/opportunities/:id
// @access  Private
const getOpportunityById = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id).populate('owner', 'name email');
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }
    res.status(200).json(opportunity);
  } catch (error) {
    next(error);
  }
};

// @desc    Create an opportunity
// @route   POST /api/opportunities
// @access  Private
const createOpportunity = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const {
      customerName, contactName, contactEmail, contactPhone,
      requirement, estimatedValue, stage, priority, nextFollowUpDate, notes,
    } = req.body;

    // owner is always derived from JWT, never from request body
    const opportunity = await Opportunity.create({
      owner: req.user._id,
      customerName, contactName, contactEmail, contactPhone,
      requirement, estimatedValue, stage, priority, nextFollowUpDate, notes,
    });

    const populated = await opportunity.populate('owner', 'name email');
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an opportunity
// @route   PUT /api/opportunities/:id
// @access  Private (owner only)
const updateOpportunity = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    // Backend ownership check
    if (opportunity.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized. You can only edit your own opportunities.' });
    }

    const allowedFields = [
      'customerName', 'contactName', 'contactEmail', 'contactPhone',
      'requirement', 'estimatedValue', 'stage', 'priority', 'nextFollowUpDate', 'notes',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        opportunity[field] = req.body[field];
      }
    });

    const updated = await opportunity.save();
    await updated.populate('owner', 'name email');
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an opportunity
// @route   DELETE /api/opportunities/:id
// @access  Private (owner only)
const deleteOpportunity = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    // Backend ownership check
    if (opportunity.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized. You can only delete your own opportunities.' });
    }

    await opportunity.deleteOne();
    res.status(200).json({ message: 'Opportunity deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
};

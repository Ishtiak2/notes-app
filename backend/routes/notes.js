const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all notes for the authenticated user
router.get('/', notesController.getNotes);

// Get a specific note
router.get('/:id', notesController.getNote);

// Create a new note
router.post('/', notesController.createNote);

// Update a note
router.put('/:id', notesController.updateNote);

// Delete a note
router.delete('/:id', notesController.deleteNote);

module.exports = router;

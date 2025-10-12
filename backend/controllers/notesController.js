const db = require('../db');

exports.getNotes = async (req, res) => {
    try {
        const { search } = req.query;
        let query = 'SELECT * FROM notes WHERE user_id = ?';
        let params = [req.user.userId];

        // Add search functionality
        if (search) {
            query += ' AND (title LIKE ? OR content LIKE ?)';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm);
        }

        query += ' ORDER BY created_at DESC';

        const [notes] = await db.query(query, params);
        res.json(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ message: 'Error fetching notes' });
    }
};

exports.getNote = async (req, res) => {
    try {
        const [notes] = await db.query(
            'SELECT * FROM notes WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.userId]
        );

        if (notes.length === 0) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.json(notes[0]);
    } catch (error) {
        console.error('Error fetching note:', error);
        res.status(500).json({ message: 'Error fetching note' });
    }
};

exports.createNote = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        const [result] = await db.query(
            'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)',
            [req.user.userId, title, content]
        );

        const [newNote] = await db.query(
            'SELECT * FROM notes WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json(newNote[0]);
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ message: 'Error creating note' });
    }
};

exports.updateNote = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        const [result] = await db.query(
            'UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?',
            [title, content, req.params.id, req.user.userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Note not found' });
        }

        const [updatedNote] = await db.query(
            'SELECT * FROM notes WHERE id = ?',
            [req.params.id]
        );

        res.json(updatedNote[0]);
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ message: 'Error updating note' });
    }
};

exports.deleteNote = async (req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM notes WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ message: 'Error deleting note' });
    }
};

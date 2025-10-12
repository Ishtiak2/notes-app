const bcrypt = require('bcrypt');
const db = require('../db');

exports.getProfile = async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, username, email, created_at FROM users WHERE id = ?',
            [req.user.userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = users[0];

        // Get notes count
        const [notesCount] = await db.query(
            'SELECT COUNT(*) as count FROM notes WHERE user_id = ?',
            [req.user.userId]
        );

        user.notesCount = notesCount[0].count;

        res.json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Error fetching profile' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;

        // Validate input
        if (!username || !email) {
            return res.status(400).json({ message: 'Username and email are required' });
        }

        // Check if username or email already exists (excluding current user)
        const [existingUsers] = await db.query(
            'SELECT * FROM users WHERE (username = ? OR email = ?) AND id != ?',
            [username, email, req.user.userId]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        // Update user profile
        await db.query(
            'UPDATE users SET username = ?, email = ? WHERE id = ?',
            [username, email, req.user.userId]
        );

        // Return updated profile
        const [updatedUser] = await db.query(
            'SELECT id, username, email, created_at FROM users WHERE id = ?',
            [req.user.userId]
        );

        res.json(updatedUser[0]);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile' });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current password and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters long' });
        }

        // Get current user
        const [users] = await db.query(
            'SELECT * FROM users WHERE id = ?',
            [req.user.userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = users[0];

        // Verify current password
        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await db.query(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedNewPassword, req.user.userId]
        );

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Error changing password' });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const { password } = req.body;

        // Validate input
        if (!password) {
            return res.status(400).json({ message: 'Password is required to delete account' });
        }

        // Get current user
        const [users] = await db.query(
            'SELECT * FROM users WHERE id = ?',
            [req.user.userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = users[0];

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Password is incorrect' });
        }

        // Delete user (notes will be deleted automatically due to CASCADE)
        await db.query(
            'DELETE FROM users WHERE id = ?',
            [req.user.userId]
        );

        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ message: 'Error deleting account' });
    }
};
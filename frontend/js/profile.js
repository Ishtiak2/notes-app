// Profile page functionality
class ProfileManager {
    constructor() {
        this.init();
        this.profileData = null;
        this.notesCount = 0;
    }

    init() {
        // Check authentication
        this.checkAuth();
        
        // Load profile data
        this.loadProfileData();
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Initialize tabs
        this.initTabs();
        
        // Initialize password toggles
        this.initPasswordToggles();
    }

    checkAuth() {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }
    }

    async loadProfileData() {
        try {
            const token = localStorage.getItem('token');
            
            // Load profile info
            const profileResponse = await fetch('http://localhost:3000/api/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (profileResponse.ok) {
                this.profileData = await profileResponse.json();
                this.displayProfileInfo();
                this.populateEditForm();
            }

            // Load notes count
            const notesResponse = await fetch('http://localhost:3000/api/notes', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (notesResponse.ok) {
                const notes = await notesResponse.json();
                this.notesCount = notes.length;
                this.updateNotesCount();
            }

        } catch (error) {
            console.error('Error loading profile:', error);
            this.showError('Failed to load profile data');
        }
    }

    displayProfileInfo() {
        if (!this.profileData) return;

        document.getElementById('profileUsername').textContent = this.profileData.username;
        document.getElementById('profileEmail').textContent = this.profileData.email;
        
        // Format member since date
        const createdDate = new Date(this.profileData.created_at);
        const memberSince = createdDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        });
        document.getElementById('memberSince').textContent = `Member since ${memberSince}`;
    }

    populateEditForm() {
        if (!this.profileData) return;

        document.getElementById('editUsername').value = this.profileData.username;
        document.getElementById('editEmail').value = this.profileData.email;
    }

    updateNotesCount() {
        document.getElementById('notesCount').textContent = this.notesCount;
    }

    initEventListeners() {
        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', this.logout.bind(this));

        // Form submissions
        document.getElementById('editProfileForm').addEventListener('submit', this.handleProfileUpdate.bind(this));
        document.getElementById('changePasswordForm').addEventListener('submit', this.handlePasswordChange.bind(this));
        document.getElementById('deleteAccountForm').addEventListener('submit', this.handleAccountDelete.bind(this));
    }

    initTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;

                // Remove active class from all tabs and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                // Add active class to clicked tab and corresponding content
                button.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });
    }

    initPasswordToggles() {
        const toggles = document.querySelectorAll('.password-toggle');
        
        toggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const targetId = toggle.dataset.target;
                const passwordInput = document.getElementById(targetId);
                
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    toggle.classList.remove('fa-eye');
                    toggle.classList.add('fa-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    toggle.classList.remove('fa-eye-slash');
                    toggle.classList.add('fa-eye');
                }
            });
        });
    }

    async handleProfileUpdate(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const profileData = {
            username: formData.get('username'),
            email: formData.get('email')
        };

        // Clear previous errors
        this.clearErrors(['usernameError', 'emailError']);

        // Validate form
        if (!this.validateProfileForm(profileData)) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileData)
            });

            const result = await response.json();

            if (response.ok) {
                this.showSuccess('Profile updated successfully!');
                this.profileData = { ...this.profileData, ...profileData };
                this.displayProfileInfo();
            } else {
                this.showError(result.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            this.showError('Failed to update profile');
        }
    }

    async handlePasswordChange(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const passwordData = {
            currentPassword: formData.get('currentPassword'),
            newPassword: formData.get('newPassword'),
            confirmPassword: formData.get('confirmPassword')
        };

        // Clear previous errors
        this.clearErrors(['currentPasswordError', 'newPasswordError', 'confirmPasswordError']);

        // Validate passwords
        if (!this.validatePasswordForm(passwordData)) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/profile/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            const result = await response.json();

            if (response.ok) {
                this.showSuccess('Password changed successfully!');
                document.getElementById('changePasswordForm').reset();
            } else {
                if (result.message === 'Current password is incorrect') {
                    this.showFieldError('currentPasswordError', 'Current password is incorrect');
                } else {
                    this.showError(result.message || 'Failed to change password');
                }
            }
        } catch (error) {
            console.error('Error changing password:', error);
            this.showError('Failed to change password');
        }
    }

    async handleAccountDelete(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const password = formData.get('password');

        // Clear previous errors
        this.clearErrors(['deletePasswordError']);

        if (!password) {
            this.showFieldError('deletePasswordError', 'Password is required');
            return;
        }

        // Double confirmation
        if (!confirm('Are you absolutely sure you want to delete your account? This action cannot be undone and all your notes will be permanently deleted.')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/profile', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ password })
            });

            const result = await response.json();

            if (response.ok) {
                this.showSuccess('Account deleted successfully. Redirecting...');
                setTimeout(() => {
                    localStorage.removeItem('token');
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                if (result.message === 'Incorrect password') {
                    this.showFieldError('deletePasswordError', 'Incorrect password');
                } else {
                    this.showError(result.message || 'Failed to delete account');
                }
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            this.showError('Failed to delete account');
        }
    }

    validateProfileForm(data) {
        let isValid = true;

        // Username validation
        if (!data.username || data.username.trim().length < 3) {
            this.showFieldError('usernameError', 'Username must be at least 3 characters long');
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            this.showFieldError('emailError', 'Please enter a valid email address');
            isValid = false;
        }

        return isValid;
    }

    validatePasswordForm(data) {
        let isValid = true;

        // Current password validation
        if (!data.currentPassword) {
            this.showFieldError('currentPasswordError', 'Current password is required');
            isValid = false;
        }

        // New password validation
        if (!data.newPassword || data.newPassword.length < 6) {
            this.showFieldError('newPasswordError', 'New password must be at least 6 characters long');
            isValid = false;
        }

        // Confirm password validation
        if (data.newPassword !== data.confirmPassword) {
            this.showFieldError('confirmPasswordError', 'Passwords do not match');
            isValid = false;
        }

        return isValid;
    }

    showSuccess(message) {
        // Remove any existing alerts
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        // Create success alert
        const alert = document.createElement('div');
        alert.className = 'alert alert-success';
        alert.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;

        // Insert at the top of the container
        const container = document.querySelector('.container');
        container.insertBefore(alert, container.firstChild);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 5000);
    }

    showError(message) {
        // Remove any existing alerts
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        // Create error alert
        const alert = document.createElement('div');
        alert.className = 'alert alert-error';
        alert.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;

        // Insert at the top of the container
        const container = document.querySelector('.container');
        container.insertBefore(alert, container.firstChild);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 5000);
    }

    showFieldError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    clearErrors(errorIds) {
        errorIds.forEach(id => {
            const errorElement = document.getElementById(id);
            if (errorElement) {
                errorElement.textContent = '';
            }
        });
    }

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        }
    }
}

// Initialize profile manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProfileManager();
});
// Constants
// Automatically detect API URL based on environment
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000'
    : 'https://notes-app-production-fcf0.up.railway.app';

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const logoutBtn = document.getElementById('logoutBtn');
const addNoteBtn = document.getElementById('addNoteBtn');
const notesList = document.getElementById('notesList');
const newNoteTextarea = document.getElementById('newNote');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearch');
const searchStats = document.getElementById('searchStats');
const searchResults = document.getElementById('searchResults');

// Search variables
let currentSearchTerm = '';
let searchTimeout = null;

// Auth Functions
async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = 'dashboard.html';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login');
    }
}

async function register(username, email, password) {
    try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Registration successful! Please login.');
            window.location.href = 'login.html';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('An error occurred during registration');
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

// Notes Functions
async function fetchNotes(searchTerm = '') {
    try {
        let url = `${API_URL}/api/notes`;
        if (searchTerm) {
            url += `?search=${encodeURIComponent(searchTerm)}`;
        }

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const notes = await response.json();
            displayNotes(notes, searchTerm);
            updateSearchStats(notes.length, searchTerm);
        } else {
            throw new Error('Failed to fetch notes');
        }
    } catch (error) {
        console.error('Error fetching notes:', error);
        alert('Failed to load notes');
    }
}

async function addNote(title, content) {
    try {
        const response = await fetch(`${API_URL}/api/notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ title, content })
        });

        if (response.ok) {
            document.getElementById('noteTitle').value = '';
            newNoteTextarea.value = '';
            fetchNotes(currentSearchTerm); // Maintain search when adding note
        } else {
            throw new Error('Failed to add note');
        }
    } catch (error) {
        console.error('Error adding note:', error);
        alert('Failed to add note');
    }
}

async function deleteNote(noteId) {
    try {
        const response = await fetch(`${API_URL}/api/notes/${noteId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            fetchNotes(currentSearchTerm); // Maintain search when deleting note
        } else {
            throw new Error('Failed to delete note');
        }
    } catch (error) {
        console.error('Error deleting note:', error);
        alert('Failed to delete note');
    }
}

function displayNotes(notes, searchTerm = '') {
    if (!notesList) return;
    
    notesList.innerHTML = '';
    
    if (notes.length === 0) {
        if (searchTerm) {
            // No search results
            notesList.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No notes found</h3>
                    <p>No notes match your search for "<strong>${searchTerm}</strong>"</p>
                    <button class="clear-search-suggestion" onclick="clearSearch()">
                        <i class="fas fa-times"></i> Clear Search
                    </button>
                </div>
            `;
        } else {
            // No notes at all
            notesList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-sticky-note fa-3x"></i>
                    <h3>No notes yet</h3>
                    <p>Create your first note to get started!</p>
                </div>
            `;
        }
        return;
    }
    
    notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note-card';
        
        // Format the dates
        const createdAt = new Date(note.created_at).toLocaleDateString();
        const updatedAt = new Date(note.updated_at).toLocaleDateString();
        
        // Highlight search terms
        let highlightedTitle = note.title;
        let highlightedContent = note.content;
        
        if (searchTerm) {
            const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
            highlightedTitle = note.title.replace(regex, '<span class="search-highlight">$1</span>');
            highlightedContent = note.content.replace(regex, '<span class="search-highlight">$1</span>');
        }
        
        noteElement.innerHTML = `
            <h3><i class="fas fa-file-alt"></i> ${highlightedTitle}</h3>
            <p>${highlightedContent}</p>
            <div class="note-meta">
                <small><i class="fas fa-calendar-plus"></i> Created: ${createdAt}</small>
                <small><i class="fas fa-calendar-edit"></i> Updated: ${updatedAt}</small>
            </div>
            <div class="actions">
                <button onclick="openEditModal(${note.id})" class="btn btn-primary" data-tooltip="Edit Note">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button onclick="deleteNote(${note.id})" class="btn btn-danger" data-tooltip="Delete Note">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        notesList.appendChild(noteElement);
    });
}

// Event Listeners
if (loginForm && !loginForm.hasAttribute('data-enhanced')) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        login(email, password);
    });
}

if (registerForm && !registerForm.hasAttribute('data-enhanced')) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        register(username, email, password);
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}

// Edit Note Functions
let currentEditingNoteId = null;

async function openEditModal(noteId) {
    try {
        const response = await fetch(`${API_URL}/api/notes/${noteId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const note = await response.json();
            document.getElementById('editNoteTitle').value = note.title;
            document.getElementById('editNoteContent').value = note.content;
            currentEditingNoteId = noteId;
            document.getElementById('editNoteModal').style.display = 'block';
        } else {
            throw new Error('Failed to fetch note');
        }
    } catch (error) {
        console.error('Error fetching note:', error);
        alert('Failed to fetch note details');
    }
}

async function updateNote(noteId, title, content) {
    try {
        const response = await fetch(`${API_URL}/api/notes/${noteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ title, content })
        });

        if (response.ok) {
            document.getElementById('editNoteModal').style.display = 'none';
            fetchNotes(currentSearchTerm); // Maintain search when updating note
        } else {
            throw new Error('Failed to update note');
        }
    } catch (error) {
        console.error('Error updating note:', error);
        alert('Failed to update note');
    }
}

// Event Listeners
if (addNoteBtn) {
    addNoteBtn.addEventListener('click', () => {
        const title = document.getElementById('noteTitle').value.trim();
        const content = newNoteTextarea.value.trim();
        if (title && content) {
            addNote(title, content);
        } else {
            alert('Please enter both title and content');
        }
    });
}

// Modal Event Listeners
const closeModalBtn = document.getElementById('closeModalBtn');
const updateNoteBtn = document.getElementById('updateNoteBtn');
const editNoteModal = document.getElementById('editNoteModal');

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        editNoteModal.style.display = 'none';
    });
}

if (updateNoteBtn) {
    updateNoteBtn.addEventListener('click', () => {
        const title = document.getElementById('editNoteTitle').value.trim();
        const content = document.getElementById('editNoteContent').value.trim();
        if (title && content && currentEditingNoteId) {
            updateNote(currentEditingNoteId, title, content);
        } else {
            alert('Please enter both title and content');
        }
    });
}

// Close modal if clicking outside
window.addEventListener('click', (event) => {
    if (event.target === editNoteModal) {
        editNoteModal.style.display = 'none';
    }
});

// Search Functions
function performSearch(searchTerm) {
    currentSearchTerm = searchTerm;
    fetchNotes(searchTerm);
    
    // Show/hide clear button
    if (searchTerm) {
        clearSearchBtn.style.display = 'block';
        searchStats.style.display = 'block';
    } else {
        clearSearchBtn.style.display = 'none';
        searchStats.style.display = 'none';
    }
}

function clearSearch() {
    if (searchInput) {
        searchInput.value = '';
        performSearch('');
    }
}

function updateSearchStats(count, searchTerm) {
    if (!searchResults) return;
    
    if (searchTerm) {
        if (count === 0) {
            searchResults.textContent = `No results found for "${searchTerm}"`;
        } else if (count === 1) {
            searchResults.textContent = `1 note found for "${searchTerm}"`;
        } else {
            searchResults.textContent = `${count} notes found for "${searchTerm}"`;
        }
        searchStats.style.display = 'block';
    } else {
        searchStats.style.display = 'none';
    }
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Search Event Listeners
if (searchInput) {
    // Real-time search with debouncing
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.trim();
        
        // Clear previous timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        // Set new timeout for debounced search
        searchTimeout = setTimeout(() => {
            performSearch(searchTerm);
        }, 300); // 300ms delay
    });

    // Handle Enter key
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
            performSearch(e.target.value.trim());
        }
    });
}

if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', clearSearch);
}

// Initialize dashboard if on dashboard page
if (window.location.pathname.includes('dashboard.html')) {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
    } else {
        fetchNotes();
    }
}
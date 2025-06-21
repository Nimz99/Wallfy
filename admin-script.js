// Admin Panel JavaScript
let wallpapers = [];
let categories = [];

// Check authentication on page load
document.addEventListener('DOMContentLoaded', async function() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('wallfy_admin_logged_in');
    if (isLoggedIn !== 'true') {
        // Not logged in, redirect to login page
        window.location.href = 'login.html';
        return;
    }
    
    // Check session timeout (24 hours)
    const loginTime = localStorage.getItem('wallfy_admin_login_time');
    if (loginTime) {
        const loginDate = new Date(loginTime);
        const now = new Date();
        const hoursDiff = (now - loginDate) / (1000 * 60 * 60);
        
        if (hoursDiff > 24) {
            // Session expired, logout and redirect
            logout();
            return;
        }
    }
    
    // User is authenticated, initialize admin panel
    await loadWallpapers();
    await loadCategories();
    setupEventListeners();
    updateDashboard();
    loadManageTable();
    loadCategoriesTable();
    updateUserInfo();
    setupRealtimeListeners();
});

// Load categories from Firebase
async function loadCategories() {
    try {
        const snapshot = await db.collection('categories').orderBy('displayName').get();
        if (!snapshot.empty) {
            categories = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        } else {
            // Default categories
            const defaultCategories = [
                {
                    name: 'nature',
                    displayName: 'Nature',
                    icon: 'fas fa-mountain',
                    description: 'Breathtaking landscapes and natural beauty'
                },
                {
                    name: 'abstract',
                    displayName: 'Abstract',
                    icon: 'fas fa-palette',
                    description: 'Creative and artistic designs'
                },
                {
                    name: 'minimal',
                    displayName: 'Minimal',
                    icon: 'fas fa-circle',
                    description: 'Clean and simple designs'
                },
                {
                    name: 'space',
                    displayName: 'Space',
                    icon: 'fas fa-rocket',
                    description: 'Cosmic and astronomical themes'
                }
            ];
            // Save default categories to Firebase
            for (let category of defaultCategories) {
                await db.collection('categories').add(category);
            }
        }
    } catch (error) {
        console.error("Error loading categories:", error);
    }
}

// Load wallpapers from Firebase
async function loadWallpapers() {
    try {
        const snapshot = await db.collection('wallpapers').orderBy('title').get();
        if (!snapshot.empty) {
            wallpapers = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        } else {
            // Load sample data if no saved data exists
            const defaultWallpapers = [
                {
                    title: "Mountain Sunset",
                    category: "nature",
                    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
                    imgurLink: "https://imgur.com/sample1",
                    downloadLink: "https://drive.google.com/sample1"
                },
                {
                    title: "Abstract Waves",
                    category: "abstract",
                    image: "https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=300&fit=crop",
                    imgurLink: "https://imgur.com/sample2",
                    downloadLink: "https://drive.google.com/sample2"
                }
            ];
            // Save default data to Firebase
            for (let wallpaper of defaultWallpapers) {
                await db.collection('wallpapers').add(wallpaper);
            }
        }
    } catch (error) {
        console.error("Error loading wallpapers:", error);
    }
}

// Setup real-time listeners for live updates
function setupRealtimeListeners() {
    // Listen for wallpaper changes
    db.collection('wallpapers').onSnapshot((snapshot) => {
        wallpapers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        loadManageTable();
        updateDashboard();
    });

    // Listen for category changes
    db.collection('categories').onSnapshot((snapshot) => {
        categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        loadCategoriesTable();
        updateCategoryDropdowns();
    });
}

// Update user info in sidebar
function updateUserInfo() {
    const username = localStorage.getItem('wallfy_admin_username') || 'Admin';
    const sidebarHeader = document.querySelector('.sidebar-header');
    
    // Add user info to sidebar
    const userInfo = document.createElement('div');
    userInfo.className = 'user-info';
    userInfo.innerHTML = `
        <div class="user-details">
            <i class="fas fa-user-circle"></i>
            <span>Welcome, ${username}</span>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="logout()">
            <i class="fas fa-sign-out-alt"></i>
            Logout
        </button>
    `;
    
    sidebarHeader.appendChild(userInfo);
}

// Logout function
function logout() {
    // Clear authentication data
    localStorage.removeItem('wallfy_admin_logged_in');
    localStorage.removeItem('wallfy_admin_username');
    localStorage.removeItem('wallfy_admin_login_time');
    
    // Redirect to login page
    window.location.href = 'login.html';
}

// Save wallpapers to Firebase
async function saveWallpapers() {
    // This function is now handled by real-time listeners
    // Individual operations are done directly with Firebase
}

// Save categories to Firebase
async function saveCategories() {
    // This function is now handled by real-time listeners
    // Individual operations are done directly with Firebase
}

// Setup event listeners
function setupEventListeners() {
    // Tab navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = item.dataset.tab;
            switchTab(tab);
        });
    });

    // Form submission
    const wallpaperForm = document.getElementById('wallpaperForm');
    wallpaperForm.addEventListener('submit', handleFormSubmit);

    // Category form submission
    const categoryForm = document.getElementById('categoryForm');
    categoryForm.addEventListener('submit', handleCategoryFormSubmit);

    // Search functionality
    const searchInput = document.getElementById('searchWallpapers');
    searchInput.addEventListener('input', handleSearch);

    // Category filter
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.addEventListener('change', handleCategoryFilter);

    // File upload for restore
    const restoreFile = document.getElementById('restoreFile');
    restoreFile.addEventListener('change', handleRestoreFile);
}

// Switch between tabs
function switchTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));

    // Remove active class from all nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Add active class to selected nav item
    const selectedNav = document.querySelector(`[data-tab="${tabName}"]`);
    if (selectedNav) {
        selectedNav.classList.add('active');
    }

    // Update content based on tab
    if (tabName === 'manage') {
        loadManageTable();
    } else if (tabName === 'dashboard') {
        updateDashboard();
    } else if (tabName === 'categories') {
        loadCategoriesTable();
    } else if (tabName === 'upload') {
        updateCategoryDropdowns();
    }
}

// Update category dropdowns in forms
function updateCategoryDropdowns() {
    const wallpaperCategory = document.getElementById('wallpaperCategory');
    const categoryFilter = document.getElementById('categoryFilter');
    const editCategory = document.getElementById('editCategory');
    
    if (wallpaperCategory) {
        wallpaperCategory.innerHTML = '<option value="">Select Category</option>';
        categories.forEach(category => {
            wallpaperCategory.innerHTML += `<option value="${category.name}">${category.displayName}</option>`;
        });
    }
    
    if (categoryFilter) {
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        categories.forEach(category => {
            categoryFilter.innerHTML += `<option value="${category.name}">${category.displayName}</option>`;
        });
    }
    
    if (editCategory) {
        editCategory.innerHTML = '<option value="">Select Category</option>';
        categories.forEach(category => {
            editCategory.innerHTML += `<option value="${category.name}">${category.displayName}</option>`;
        });
    }
}

// Handle category form submission
async function handleCategoryFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const categoryName = formData.get('name').trim().toLowerCase();
    const displayName = formData.get('name').trim();
    const icon = formData.get('icon');
    const description = formData.get('description') || '';
    
    // Validate required fields
    if (!displayName || !icon) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }
    
    // Check if category already exists
    if (categories.find(c => c.name === categoryName)) {
        showMessage('Category already exists', 'error');
        return;
    }
    
    try {
        // Add category to Firebase
        const category = {
            name: categoryName,
            displayName: displayName,
            icon: icon,
            description: description
        };
        
        await db.collection('categories').add(category);
        
        // Reset form
        resetCategoryForm();
        
        // Show success message
        showMessage('Category added successfully!', 'success');
    } catch (error) {
        console.error("Error adding category:", error);
        showMessage('Error adding category', 'error');
    }
}

// Reset category form
function resetCategoryForm() {
    document.getElementById('categoryForm').reset();
}

// Load categories table
function loadCategoriesTable() {
    const tbody = document.getElementById('categoriesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    categories.forEach(category => {
        const wallpaperCount = wallpapers.filter(w => w.category === category.name).length;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="category-icon-cell">
                <i class="${category.icon}"></i>
            </td>
            <td class="category-name-cell">${category.displayName}</td>
            <td class="category-description-cell">${category.description}</td>
            <td class="category-count-cell">${wallpaperCount}</td>
            <td>
                <div class="category-actions">
                    <button class="btn btn-primary btn-sm" onclick="editCategory('${category.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCategory('${category.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Edit category
function editCategory(id) {
    const category = categories.find(c => c.id === id);
    if (!category) return;
    
    // Populate edit form
    document.getElementById('editCategoryId').value = category.id;
    document.getElementById('editCategoryName').value = category.displayName;
    document.getElementById('editCategoryIcon').value = category.icon;
    document.getElementById('editCategoryDescription').value = category.description;
    
    // Show modal
    document.getElementById('editCategoryModal').style.display = 'block';
}

// Save category edit
async function saveCategoryEdit() {
    const id = document.getElementById('editCategoryId').value;
    const category = categories.find(c => c.id === id);
    
    if (!id) {
        showMessage('Cannot update category: No ID found.', 'error');
        return;
    }
    
    // Update category data
    const newDisplayName = document.getElementById('editCategoryName').value.trim();
    const newName = newDisplayName.toLowerCase();
    const newIcon = document.getElementById('editCategoryIcon').value;
    const newDescription = document.getElementById('editCategoryDescription').value;
    
    // Check if name conflicts with other categories
    const nameConflict = categories.find(c => c.id !== id && c.name === newName);
    if (nameConflict) {
        showMessage('Category name already exists', 'error');
        return;
    }
    
    try {
        // Update category in Firebase
        await db.collection('categories').doc(id).update({
            name: newName,
            displayName: newDisplayName,
            icon: newIcon,
            description: newDescription
        });
        
        // Update wallpapers that use this category
        const wallpaperSnapshot = await db.collection('wallpapers').where('category', '==', category.name).get();
        if (!wallpaperSnapshot.empty) {
            const batch = db.batch();
            wallpaperSnapshot.docs.forEach(doc => {
                batch.update(doc.ref, { category: newName });
            });
            await batch.commit();
        }
        
        closeEditCategoryModal();
        showMessage('Category updated successfully!', 'success');
    } catch (error) {
        console.error("Error updating category:", error);
        showMessage('Error updating category', 'error');
    }
}

// Close edit category modal
function closeEditCategoryModal() {
    document.getElementById('editCategoryModal').style.display = 'none';
}

// Delete category
async function deleteCategory(id) {
    const category = categories.find(c => c.id === id);
    if (!category) {
        console.error("Cannot delete category, ID not found:", id);
        return;
    }
    
    try {
        // Check if the category is in use
        const wallpaperCount = wallpapers.filter(w => w.category === category.name).length;
        if (wallpaperCount > 0) {
            if (!confirm(`This category has ${wallpaperCount} wallpaper(s). Deleting it will reassign them to 'Uncategorized'. Continue?`)) {
                return;
            }
            
            // Reassign wallpapers in Firebase
            const wallpaperSnapshot = await db.collection('wallpapers').where('category', '==', category.name).get();
            if (!wallpaperSnapshot.empty) {
                const batch = db.batch();
                wallpaperSnapshot.docs.forEach(doc => {
                    batch.update(doc.ref, { category: 'uncategorized' });
                });
                await batch.commit();
            }

            // Manually update local state for immediate UI feedback
            wallpapers.forEach(w => {
                if (w.category === category.name) w.category = 'uncategorized';
            });
            loadManageTable();
        }
        
        // Delete category from Firebase
        await db.collection('categories').doc(id).delete();
        
        // Manually update local state and UI
        categories = categories.filter(c => c.id !== id);
        loadCategoriesTable();
        updateCategoryDropdowns();
        updateDashboard();
        
        showMessage('Category deleted successfully!', 'success');

    } catch (error) {
        console.error("Error deleting category:", error);
        showMessage('Error deleting category. See console for details.', 'error');
    }
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const wallpaper = {
        title: formData.get('title'),
        category: formData.get('category'),
        image: formData.get('image'),
        imgurLink: formData.get('imgurLink') || '',
        downloadLink: formData.get('downloadLink') || ''
    };

    // Validate required fields
    if (!wallpaper.title || !wallpaper.category || !wallpaper.image) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }

    try {
        // Add wallpaper to Firebase
        await db.collection('wallpapers').add(wallpaper);
        
        // Reset form
        resetForm();

        // Show success message
        showMessage('Wallpaper added successfully!', 'success');
    } catch (error) {
        console.error("Error adding wallpaper:", error);
        showMessage('Error adding wallpaper', 'error');
    }
}

// Reset form
function resetForm() {
    document.getElementById('wallpaperForm').reset();
}

// Update dashboard statistics
function updateDashboard() {
    const total = wallpapers.length;
    
    // Update stats for each category
    categories.forEach(category => {
        const count = wallpapers.filter(w => w.category === category.name).length;
        const statElement = document.getElementById(`${category.name}Count`);
        if (statElement) {
            statElement.textContent = count;
        }
    });
    
    document.getElementById('totalWallpapers').textContent = total;
}

// Load manage table
function loadManageTable() {
    const tbody = document.getElementById('wallpapersTableBody');
    tbody.innerHTML = '';

    wallpapers.forEach(wallpaper => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${wallpaper.image}" alt="${wallpaper.title}" onerror="this.src='https://via.placeholder.com/60x80?text=Error'"></td>
            <td>${wallpaper.title}</td>
            <td><span class="category-badge ${wallpaper.category}">${getCategoryDisplayName(wallpaper.category)}</span></td>
            <td>
                ${wallpaper.imgurLink ? `<a href="${wallpaper.imgurLink}" target="_blank" class="btn btn-secondary btn-sm">View</a>` : ''}
                ${wallpaper.downloadLink ? `<a href="${wallpaper.downloadLink}" target="_blank" class="btn btn-secondary btn-sm">Download</a>` : ''}
            </td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-primary btn-sm" onclick="editWallpaper('${wallpaper.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteWallpaper('${wallpaper.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Handle search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#wallpapersTableBody tr');
    
    rows.forEach(row => {
        const title = row.cells[1].textContent.toLowerCase();
        const category = row.cells[2].textContent.toLowerCase();
        
        if (title.includes(searchTerm) || category.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Handle category filter
function handleCategoryFilter(e) {
    const selectedCategory = e.target.value;
    const rows = document.querySelectorAll('#wallpapersTableBody tr');
    
    rows.forEach(row => {
        const category = row.cells[2].textContent.toLowerCase();
        
        if (selectedCategory === 'all' || category === selectedCategory) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Edit wallpaper
function editWallpaper(id) {
    const wallpaper = wallpapers.find(w => w.id === id);
    if (!wallpaper) return;

    // Populate edit form
    document.getElementById('editId').value = wallpaper.id;
    document.getElementById('editTitle').value = wallpaper.title;
    document.getElementById('editCategory').value = wallpaper.category;
    document.getElementById('editImage').value = wallpaper.image;
    document.getElementById('editImgurLink').value = wallpaper.imgurLink || '';
    document.getElementById('editDownloadLink').value = wallpaper.downloadLink || '';

    // Show modal
    document.getElementById('editModal').style.display = 'block';
}

// Save edit
async function saveEdit() {
    const id = document.getElementById('editId').value;
    
    if (!id) {
        showMessage('Cannot update wallpaper: No ID found.', 'error');
        return;
    }

    try {
        // Update wallpaper in Firebase
        await db.collection('wallpapers').doc(id).update({
            title: document.getElementById('editTitle').value,
            category: document.getElementById('editCategory').value,
            image: document.getElementById('editImage').value,
            imgurLink: document.getElementById('editImgurLink').value,
            downloadLink: document.getElementById('editDownloadLink').value
        });
        
        closeEditModal();
        showMessage('Wallpaper updated successfully!', 'success');
    } catch (error) {
        console.error("Error updating wallpaper:", error);
        showMessage('Error updating wallpaper. See console for details.', 'error');
    }
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Delete wallpaper
async function deleteWallpaper(id) {
    if (!id) {
        console.error("Delete failed: No ID provided.");
        showMessage('Error: Invalid wallpaper ID.', 'error');
        return;
    }

    if (confirm('Are you sure you want to delete this wallpaper?')) {
        try {
            await db.collection('wallpapers').doc(id).delete();
            
            // Manually update local state for immediate UI feedback
            wallpapers = wallpapers.filter(w => w.id !== id);
            loadManageTable();
            updateDashboard();

            showMessage('Wallpaper deleted successfully!', 'success');
        } catch (error) {
            console.error("Error deleting wallpaper:", error);
            showMessage('Error deleting wallpaper. See console for details.', 'error');
        }
    }
}

// Export data
function exportData() {
    const dataToExport = {
        wallpapers: wallpapers.map(({ id, ...rest }) => rest), // Exclude Firebase ID
        categories: categories.map(({ id, ...rest }) => rest), // Exclude Firebase ID
        exportDate: new Date().toISOString(),
        version: '2.0' // New version for compatibility
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wallfy-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showMessage('Data exported successfully!', 'success');
}

// Backup data (same as export)
function backupData() {
    exportData();
}

// Handle restore file
async function handleRestoreFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(event) {
        try {
            const data = JSON.parse(event.target.result);
            
            // Clear existing data first
            await clearAllData(false); // Pass false to avoid confirmation prompt

            const wallpaperPromises = (data.wallpapers || []).map(w => db.collection('wallpapers').add(w));
            const categoryPromises = (data.categories || []).map(c => db.collection('categories').add(c));

            await Promise.all([...wallpaperPromises, ...categoryPromises]);

            showMessage('Data restored successfully!', 'success');
        } catch (error) {
            console.error("Error restoring data:", error);
            showMessage('Error reading backup file. Make sure it is a valid JSON backup.', 'error');
        }
    };
    reader.readAsText(file);
}

// Clear all data
async function clearAllData(confirmFirst = true) {
    const confirmed = confirmFirst 
        ? confirm('Are you sure you want to clear all wallpaper and category data? This action cannot be undone.') 
        : true;

    if (confirmed) {
        try {
            const deleteCollection = async (collectionPath) => {
                const snapshot = await db.collection(collectionPath).get();
                if (snapshot.empty) return;
                const batch = db.batch();
                snapshot.docs.forEach(doc => {
                    batch.delete(doc.ref);
                });
                await batch.commit();
            };

            await Promise.all([
                deleteCollection('wallpapers'),
                deleteCollection('categories')
            ]);
            
            if (confirmFirst) {
                showMessage('All data cleared successfully!', 'success');
            }
        } catch (error) {
            console.error("Error clearing data:", error);
            if (confirmFirst) {
                showMessage('Error clearing data.', 'error');
            }
        }
    }
}

// Show message
function showMessage(text, type = 'info') {
    const container = document.getElementById('messageContainer');
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    
    container.appendChild(message);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        if (message.parentNode) {
            message.parentNode.removeChild(message);
        }
    }, 3000);
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const editModal = document.getElementById('editModal');
    const editCategoryModal = document.getElementById('editCategoryModal');
    
    if (e.target === editModal) {
        closeEditModal();
    }
    if (e.target === editCategoryModal) {
        closeEditCategoryModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeEditModal();
        closeEditCategoryModal();
    }
});

// Add some CSS for category badges and user info
const style = document.createElement('style');
style.textContent = `
    .category-badge {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
        text-transform: capitalize;
    }
    .category-badge.nature {
        background: #d4edda;
        color: #155724;
    }
    .category-badge.abstract {
        background: #d1ecf1;
        color: #0c5460;
    }
    .category-badge.minimal {
        background: #f8d7da;
        color: #721c24;
    }
    .category-badge.space {
        background: #e2e3e5;
        color: #383d41;
    }
    .category-badge.uncategorized, .category-badge.undefined {
        background: #f8f9fa;
        color: #6c757d;
    }
    .btn-sm {
        padding: 4px 8px;
        font-size: 0.9rem;
    }
    .user-info {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    .user-details {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
        opacity: 0.9;
    }
    .user-details i {
        font-size: 1.2rem;
    }
`;
document.head.appendChild(style);

function getCategoryDisplayName(categoryName) {
    const category = categories.find(c => c.name === categoryName);
    return category ? category.displayName : categoryName;
} 
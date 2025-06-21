// Admin Panel JavaScript
let wallpapers = [];
let categories = [];
let nextId = 1;
let nextCategoryId = 1;

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
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
    loadWallpapers();
    loadCategories();
    setupEventListeners();
    updateDashboard();
    loadManageTable();
    loadCategoriesTable();
    updateUserInfo();
});

// Load categories from localStorage
function loadCategories() {
    const saved = localStorage.getItem('wallfy_categories');
    if (saved) {
        categories = JSON.parse(saved);
        if (categories.length > 0) {
            nextCategoryId = Math.max(...categories.map(c => c.id)) + 1;
        }
    } else {
        // Default categories
        categories = [
            {
                id: 1,
                name: 'nature',
                displayName: 'Nature',
                icon: 'fas fa-mountain',
                description: 'Breathtaking landscapes and natural beauty'
            },
            {
                id: 2,
                name: 'abstract',
                displayName: 'Abstract',
                icon: 'fas fa-palette',
                description: 'Creative and artistic designs'
            },
            {
                id: 3,
                name: 'minimal',
                displayName: 'Minimal',
                icon: 'fas fa-circle',
                description: 'Clean and simple designs'
            },
            {
                id: 4,
                name: 'space',
                displayName: 'Space',
                icon: 'fas fa-rocket',
                description: 'Cosmic and astronomical themes'
            }
        ];
        nextCategoryId = 5;
        saveCategories();
    }
}

// Save categories to localStorage
function saveCategories() {
    localStorage.setItem('wallfy_categories', JSON.stringify(categories));
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

// Load wallpapers from localStorage
function loadWallpapers() {
    const saved = localStorage.getItem('wallfy_wallpapers');
    if (saved) {
        wallpapers = JSON.parse(saved);
        // Find the highest ID to set nextId
        if (wallpapers.length > 0) {
            nextId = Math.max(...wallpapers.map(w => w.id)) + 1;
        }
    } else {
        // Load sample data if no saved data exists
        wallpapers = [
            {
                id: 1,
                title: "Mountain Sunset",
                category: "nature",
                image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
                imgurLink: "https://imgur.com/sample1",
                downloadLink: "https://drive.google.com/sample1"
            },
            {
                id: 2,
                title: "Abstract Waves",
                category: "abstract",
                image: "https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=300&fit=crop",
                imgurLink: "https://imgur.com/sample2",
                downloadLink: "https://drive.google.com/sample2"
            }
        ];
        nextId = 3;
        saveWallpapers();
    }
}

// Save wallpapers to localStorage
function saveWallpapers() {
    localStorage.setItem('wallfy_wallpapers', JSON.stringify(wallpapers));
    // Also update the main website's script.js file
    updateMainScript();
}

// Update the main script.js file with current wallpaper data
function updateMainScript() {
    // This would typically be done server-side, but for demo purposes
    // we'll just show a message that the data has been updated
    showMessage('Wallpaper data updated successfully!', 'success');
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
function handleCategoryFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const categoryName = formData.get('name').trim().toLowerCase();
    const displayName = formData.get('name').trim();
    const icon = formData.get('icon');
    const description = formData.get('description') || '';
    
    // Validate required fields
    if (!categoryName || !icon) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }
    
    // Check if category already exists
    if (categories.find(c => c.name === categoryName)) {
        showMessage('Category already exists', 'error');
        return;
    }
    
    // Add category
    const category = {
        id: nextCategoryId++,
        name: categoryName,
        displayName: displayName,
        icon: icon,
        description: description
    };
    
    categories.push(category);
    saveCategories();
    
    // Reset form
    resetCategoryForm();
    
    // Update tables and dropdowns
    loadCategoriesTable();
    updateCategoryDropdowns();
    
    // Show success message
    showMessage('Category added successfully!', 'success');
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
                    <button class="btn btn-primary btn-sm" onclick="editCategory(${category.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCategory(${category.id})">
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
function saveCategoryEdit() {
    const id = parseInt(document.getElementById('editCategoryId').value);
    const category = categories.find(c => c.id === id);
    
    if (!category) return;
    
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
    
    category.name = newName;
    category.displayName = newDisplayName;
    category.icon = newIcon;
    category.description = newDescription;
    
    // Update wallpapers that use this category
    wallpapers.forEach(wallpaper => {
        if (wallpaper.category === category.name) {
            wallpaper.category = newName;
        }
    });
    
    // Save and update
    saveCategories();
    saveWallpapers();
    loadCategoriesTable();
    updateCategoryDropdowns();
    closeEditCategoryModal();
    showMessage('Category updated successfully!', 'success');
}

// Close edit category modal
function closeEditCategoryModal() {
    document.getElementById('editCategoryModal').style.display = 'none';
}

// Delete category
function deleteCategory(id) {
    const category = categories.find(c => c.id === id);
    if (!category) return;
    
    // Check if category has wallpapers
    const wallpaperCount = wallpapers.filter(w => w.category === category.name).length;
    if (wallpaperCount > 0) {
        if (!confirm(`This category has ${wallpaperCount} wallpaper(s). Deleting it will remove the category from all wallpapers. Continue?`)) {
            return;
        }
        
        // Remove category from wallpapers
        wallpapers.forEach(wallpaper => {
            if (wallpaper.category === category.name) {
                wallpaper.category = 'uncategorized';
            }
        });
        saveWallpapers();
    }
    
    // Delete category
    categories = categories.filter(c => c.id !== id);
    saveCategories();
    
    // Update tables and dropdowns
    loadCategoriesTable();
    updateCategoryDropdowns();
    updateDashboard();
    
    showMessage('Category deleted successfully!', 'success');
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const wallpaper = {
        id: nextId++,
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

    // Add wallpaper to array
    wallpapers.push(wallpaper);
    saveWallpapers();

    // Reset form
    resetForm();

    // Show success message
    showMessage('Wallpaper added successfully!', 'success');

    // Update dashboard
    updateDashboard();
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
            <td><span class="category-badge ${wallpaper.category}">${wallpaper.category}</span></td>
            <td>
                ${wallpaper.imgurLink ? `<a href="${wallpaper.imgurLink}" target="_blank" class="btn btn-secondary btn-sm">View</a>` : ''}
                ${wallpaper.downloadLink ? `<a href="${wallpaper.downloadLink}" target="_blank" class="btn btn-secondary btn-sm">Download</a>` : ''}
            </td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-primary btn-sm" onclick="editWallpaper(${wallpaper.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteWallpaper(${wallpaper.id})">
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
function saveEdit() {
    const id = parseInt(document.getElementById('editId').value);
    const wallpaper = wallpapers.find(w => w.id === id);
    
    if (!wallpaper) return;

    // Update wallpaper data
    wallpaper.title = document.getElementById('editTitle').value;
    wallpaper.category = document.getElementById('editCategory').value;
    wallpaper.image = document.getElementById('editImage').value;
    wallpaper.imgurLink = document.getElementById('editImgurLink').value;
    wallpaper.downloadLink = document.getElementById('editDownloadLink').value;

    // Save and update
    saveWallpapers();
    loadManageTable();
    updateDashboard();
    closeEditModal();
    showMessage('Wallpaper updated successfully!', 'success');
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Delete wallpaper
function deleteWallpaper(id) {
    if (confirm('Are you sure you want to delete this wallpaper?')) {
        wallpapers = wallpapers.filter(w => w.id !== id);
        saveWallpapers();
        loadManageTable();
        updateDashboard();
        showMessage('Wallpaper deleted successfully!', 'success');
    }
}

// Export data
function exportData() {
    const data = {
        wallpapers: wallpapers,
        categories: categories,
        exportDate: new Date().toISOString(),
        version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
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
function handleRestoreFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.wallpapers && Array.isArray(data.wallpapers)) {
                wallpapers = data.wallpapers;
                // Update nextId
                if (wallpapers.length > 0) {
                    nextId = Math.max(...wallpapers.map(w => w.id)) + 1;
                }
            }
            
            if (data.categories && Array.isArray(data.categories)) {
                categories = data.categories;
                // Update nextCategoryId
                if (categories.length > 0) {
                    nextCategoryId = Math.max(...categories.map(c => c.id)) + 1;
                }
            }
            
            saveWallpapers();
            saveCategories();
            loadManageTable();
            loadCategoriesTable();
            updateDashboard();
            updateCategoryDropdowns();
            showMessage('Data restored successfully!', 'success');
        } catch (error) {
            showMessage('Error reading backup file', 'error');
        }
    };
    reader.readAsText(file);
}

// Clear all data
function clearAllData() {
    if (confirm('Are you sure you want to clear all wallpaper and category data? This action cannot be undone.')) {
        wallpapers = [];
        categories = [];
        nextId = 1;
        nextCategoryId = 1;
        saveWallpapers();
        saveCategories();
        loadManageTable();
        loadCategoriesTable();
        updateDashboard();
        updateCategoryDropdowns();
        showMessage('All data cleared successfully!', 'success');
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
    .category-badge.uncategorized {
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
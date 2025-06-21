// Wallpaper View Script
let categories = [];

document.addEventListener('DOMContentLoaded', async function() {
    // Load categories first
    await loadCategories();
    
    // Get wallpaper ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const wallpaperId = urlParams.get('id');
    
    if (!wallpaperId) {
        showError('No wallpaper ID provided');
        return;
    }
    
    try {
        // Load wallpaper from Firebase
        const doc = await db.collection('wallpapers').doc(wallpaperId).get();
        
        if (!doc.exists) {
            showError('Wallpaper not found');
            return;
        }
        
        const wallpaper = { id: doc.id, ...doc.data() };
        displayWallpaper(wallpaper);
    } catch (error) {
        console.error("Error loading wallpaper:", error);
        showError('Error loading wallpaper');
    }
});

// Load categories from Firebase
async function loadCategories() {
    try {
        const snapshot = await db.collection('categories').get();
        if (!snapshot.empty) {
            categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
    } catch (error) {
        console.error("Error loading categories:", error);
    }
}

function displayWallpaper(wallpaper) {
    const container = document.getElementById('wallpaperView');
    
    container.innerHTML = `
        <img src="${wallpaper.image}" alt="${wallpaper.title}" class="wallpaper-view-image">
        <h1 class="wallpaper-view-title">${wallpaper.title}</h1>
        <p class="wallpaper-view-category">${getCategoryDisplayName(wallpaper.category)}</p>
        <div class="wallpaper-view-actions">
            ${wallpaper.imgurLink ? `
                <a href="${wallpaper.imgurLink}" target="_blank" class="btn btn-primary">
                    <i class="fas fa-eye"></i> View on Imgur
                </a>
            ` : ''}
            ${wallpaper.downloadLink ? `
                <a href="${wallpaper.downloadLink}" target="_blank" class="btn btn-secondary">
                    <i class="fas fa-download"></i> Download
                </a>
            ` : ''}
        </div>
    `;
    
    // Update page title
    document.title = `${wallpaper.title} - Wallfy`;
}

function getCategoryDisplayName(categoryName) {
    const category = categories.find(c => c.name === categoryName);
    return category ? category.displayName : categoryName;
}

function showError(message) {
    const container = document.getElementById('wallpaperView');
    container.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <h2>Error</h2>
            <p>${message}</p>
            <a href="index.html" class="btn btn-primary">Back to Home</a>
        </div>
    `;
} 
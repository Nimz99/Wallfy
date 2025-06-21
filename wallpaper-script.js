// wallpaper-script.js
function getQueryParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

function loadWallpaper() {
    const id = parseInt(getQueryParam('id'));
    if (!id) {
        document.getElementById('wallpaperView').innerHTML = '<p>Wallpaper not found.</p>';
        return;
    }
    const wallpapers = JSON.parse(localStorage.getItem('wallfy_wallpapers') || '[]');
    const categories = JSON.parse(localStorage.getItem('wallfy_categories') || '[]');
    const wallpaper = wallpapers.find(w => w.id === id);
    if (!wallpaper) {
        document.getElementById('wallpaperView').innerHTML = '<p>Wallpaper not found.</p>';
        return;
    }
    const category = categories.find(c => c.name === wallpaper.category);
    const categoryDisplay = category ? category.displayName : wallpaper.category;
    document.getElementById('wallpaperView').innerHTML = `
        <img src="${wallpaper.image}" alt="${wallpaper.title}" class="wallpaper-view-image">
        <div class="wallpaper-view-title">${wallpaper.title}</div>
        <div class="wallpaper-view-category">${categoryDisplay}</div>
        <div class="wallpaper-view-actions">
            <a href="${wallpaper.downloadLink || wallpaper.image}" target="_blank" class="btn btn-primary">
                <i class="fas fa-download"></i> Download
            </a>
            ${wallpaper.imgurLink ? `<a href="${wallpaper.imgurLink}" target="_blank" class="btn btn-secondary"><i class="fas fa-eye"></i> View on Imgur</a>` : ''}
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', loadWallpaper); 
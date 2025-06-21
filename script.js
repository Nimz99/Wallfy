// Sample wallpaper data - you can replace these with your actual wallpaper data
let wallpapers = [];
let categories = [];

// Load wallpapers from Firebase or use default data
async function loadWallpapers() {
    try {
        const snapshot = await db.collection('wallpapers').orderBy('title').get();
        if (!snapshot.empty) {
            wallpapers = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        } else {
            // Load default sample data if no data exists
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
                },
                {
                    title: "Minimal Geometry",
                    category: "minimal",
                    image: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&h=300&fit=crop",
                    imgurLink: "https://imgur.com/sample3",
                    downloadLink: "https://drive.google.com/sample3"
                },
                {
                    title: "Galaxy Nebula",
                    category: "space",
                    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=300&fit=crop",
                    imgurLink: "https://imgur.com/sample4",
                    downloadLink: "https://drive.google.com/sample4"
                },
                {
                    title: "Forest Path",
                    category: "nature",
                    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
                    imgurLink: "https://imgur.com/sample5",
                    downloadLink: "https://drive.google.com/sample5"
                },
                {
                    title: "Colorful Gradient",
                    category: "abstract",
                    image: "https://images.unsplash.com/photo-1557683311-eac922347aa1?w=400&h=300&fit=crop",
                    imgurLink: "https://imgur.com/sample6",
                    downloadLink: "https://drive.google.com/sample6"
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

// DOM elements
const wallpaperGrid = document.getElementById('wallpaperGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const modal = document.getElementById('wallpaperModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalCategory = document.getElementById('modalCategory');
const viewButton = document.getElementById('viewButton');
const downloadButton = document.getElementById('downloadButton');
const closeModal = document.querySelector('.close');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Current filter
let currentFilter = 'all';

// Initialize the website
document.addEventListener('DOMContentLoaded', async function() {
    await loadWallpapers();
    await loadCategories();
    renderWallpapers();
    renderFilterButtons();
    renderCategoriesSection();
    setupEventListeners();
    setupSmoothScrolling();
    setupRealtimeListeners();
});

// Setup real-time listeners for live updates
function setupRealtimeListeners() {
    // Listen for wallpaper changes
    db.collection('wallpapers').onSnapshot((snapshot) => {
        wallpapers = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        renderWallpapers();
    });

    // Listen for category changes
    db.collection('categories').onSnapshot((snapshot) => {
        categories = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        renderFilterButtons();
        renderCategoriesSection();
    });
}

// Get category display name
function getCategoryDisplayName(categoryName) {
    const category = categories.find(c => c.name === categoryName);
    return category ? category.displayName : categoryName;
}

// Render filter buttons dynamically based on categories
function renderFilterButtons() {
    const filterContainer = document.querySelector('.filter-buttons');
    if (!filterContainer) return;
    
    filterContainer.innerHTML = `
        <button class="filter-btn active" data-filter="all">All</button>
        ${categories.map(category => `
            <button class="filter-btn" data-filter="${category.name}">${category.displayName}</button>
        `).join('')}
    `;
    
    // Re-attach event listeners
    const newFilterButtons = document.querySelectorAll('.filter-btn');
    newFilterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            setActiveFilter(filter);
        });
    });
}

// Render wallpapers
function renderWallpapers() {
    const filteredWallpapers = currentFilter === 'all' 
        ? wallpapers 
        : wallpapers.filter(wallpaper => wallpaper.category === currentFilter);

    wallpaperGrid.innerHTML = filteredWallpapers.map(wallpaper => `
        <div class="wallpaper-card">
            <div class="wallpaper-image">
                <img src="${wallpaper.image}" alt="${wallpaper.title}" loading="lazy">
                <div class="wallpaper-overlay">
                    <a href="wallpaper.html?id=${wallpaper.id}" class="btn btn-primary">
                        <i class="fas fa-eye"></i> View
                    </a>
                </div>
            </div>
            <div class="wallpaper-info">
                <h3>${wallpaper.title}</h3>
                <p>${getCategoryDisplayName(wallpaper.category)}</p>
            </div>
        </div>
    `).join('');
}

// Add event listeners to wallpaper cards
function addWallpaperEventListeners() {
    const wallpaperCards = document.querySelectorAll('.wallpaper-card');

    wallpaperCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Only trigger if not clicking a button or link
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') return;
            const wallpaperId = parseInt(card.dataset.id);
            openModal(wallpaperId, 'view');
        });
    });
}

// Setup all event listeners
function setupEventListeners() {
    // Modal close
    closeModal.addEventListener('click', closeModalFunction);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalFunction();
        }
    });

    // Mobile navigation
    navToggle.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModalFunction();
        }
    });
}

// Set active filter and re-render wallpapers
function setActiveFilter(filter) {
    currentFilter = filter;
    
    // Update active button
    const allFilterButtons = document.querySelectorAll('.filter-btn');
    allFilterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });

    // Re-render wallpapers
    renderWallpapers();
}

// Open modal with wallpaper details
function openModal(wallpaperId, action) {
    const wallpaper = wallpapers.find(w => w.id === wallpaperId);
    if (!wallpaper) return;

    const category = categories.find(c => c.name === wallpaper.category);
    const categoryDisplayName = category ? category.displayName : wallpaper.category;

    modalImage.src = wallpaper.image;
    modalTitle.textContent = wallpaper.title;
    modalCategory.textContent = categoryDisplayName;
    viewButton.href = wallpaper.imgurLink;
    downloadButton.href = wallpaper.downloadLink;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // If action is download, trigger download after a short delay
    if (action === 'download') {
        setTimeout(() => {
            window.open(wallpaper.downloadLink, '_blank');
        }, 500);
    }
}

// Close modal
function closeModalFunction() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Toggle mobile menu
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
}

// Setup smooth scrolling for navigation links
function setupSmoothScrolling() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Update active navigation link based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
});

// Add loading animation for images
function preloadImages() {
    wallpapers.forEach(wallpaper => {
        const img = new Image();
        img.src = wallpaper.image;
    });
}

// Initialize image preloading
preloadImages();

// Add intersection observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe wallpaper cards for animation
function observeWallpaperCards() {
    const cards = document.querySelectorAll('.wallpaper-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Call observe function after rendering wallpapers
const originalRenderWallpapers = renderWallpapers;
renderWallpapers = function() {
    originalRenderWallpapers();
    setTimeout(observeWallpaperCards, 100);
};

// Render categories section dynamically
function renderCategoriesSection() {
    const categoryGrid = document.querySelector('.category-grid');
    if (!categoryGrid) return;
    
    categoryGrid.innerHTML = categories.map(category => `
        <div class="category-card">
            <div class="category-icon">
                <i class="${category.icon}"></i>
            </div>
            <h3>${category.displayName}</h3>
            <p>${category.description}</p>
        </div>
    `).join('');
} 
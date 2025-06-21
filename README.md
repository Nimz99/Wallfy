# Wallfy - Premium Wallpaper Website

A modern, responsive website for viewing and downloading high-quality wallpapers. Built with HTML, CSS, and JavaScript.

## Features

- 🎨 **Modern Design**: Clean, responsive design with smooth animations
- 📱 **Mobile Friendly**: Fully responsive across all devices
- 🔍 **Category Filtering**: Filter wallpapers by categories (Nature, Abstract, Minimal, Space)
- 👁️ **View & Download**: Direct links to Imgur for viewing and Google Drive for downloading
- 🎯 **Interactive Gallery**: Click on wallpaper cards to view details
- ⚡ **Fast Loading**: Optimized images and smooth performance
- 🎭 **Smooth Animations**: Beautiful hover effects and transitions

## File Structure

```
wallfy-website/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Setup Instructions

1. **Download/Clone** the project files to your local machine
2. **Open** `index.html` in your web browser
3. **That's it!** The website is ready to use

## Customization

### Adding Your Own Wallpapers

To add your own wallpapers, edit the `wallpapers` array in `script.js`:

```javascript
const wallpapers = [
    {
        id: 1,
        title: "Your Wallpaper Title",
        category: "nature", // Choose from: nature, abstract, minimal, space
        image: "https://your-image-url.com/image.jpg",
        imgurLink: "https://imgur.com/your-imgur-link",
        downloadLink: "https://drive.google.com/your-google-drive-link"
    },
    // Add more wallpapers...
];
```

### Image Requirements

- **Recommended size**: 400x300 pixels for thumbnails
- **Format**: JPG, PNG, or WebP
- **Hosting**: Use reliable image hosting services like:
  - Unsplash (for sample images)
  - Your own server
  - CDN services

### Link Setup

1. **Imgur Links**: Upload your wallpapers to Imgur and use the direct image links
2. **Google Drive Links**: 
   - Upload wallpapers to Google Drive
   - Right-click → "Get shareable link"
   - Change access to "Anyone with the link can view"
   - Use the sharing link

### Categories

The website supports these categories:
- `nature` - Landscapes, animals, plants
- `abstract` - Artistic designs, patterns
- `minimal` - Simple, clean designs
- `space` - Cosmic, astronomical themes

You can add more categories by:
1. Adding filter buttons in `index.html`
2. Updating the CSS styles
3. Adding category icons in the categories section

## Features Explained

### Navigation
- **Fixed Header**: Stays at the top while scrolling
- **Smooth Scrolling**: Click navigation links for smooth page transitions
- **Mobile Menu**: Hamburger menu for mobile devices

### Gallery
- **Grid Layout**: Responsive grid that adapts to screen size
- **Hover Effects**: Cards lift and images scale on hover
- **Filter System**: Click category buttons to filter wallpapers
- **Modal Preview**: Click any wallpaper to see details

### Modal System
- **Full Preview**: Large image preview with wallpaper details
- **Direct Links**: View button opens Imgur, Download button opens Google Drive
- **Keyboard Support**: Press Escape to close modal
- **Click Outside**: Click outside modal to close

### Responsive Design
- **Desktop**: Full grid layout with hover effects
- **Tablet**: Adjusted grid and navigation
- **Mobile**: Single column layout with mobile menu

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Performance Tips

1. **Optimize Images**: Compress images before uploading
2. **Use CDN**: Host images on a CDN for faster loading
3. **Lazy Loading**: Images load as they come into view
4. **Preloading**: Critical images are preloaded for smooth experience

## Customization Examples

### Changing Colors
Edit the CSS variables in `styles.css`:

```css
/* Primary gradient colors */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Change to your preferred colors */
background: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%);
```

### Adding More Categories
1. Add filter button in HTML:
```html
<button class="filter-btn" data-filter="anime">Anime</button>
```

2. Add category card:
```html
<div class="category-card">
    <div class="category-icon">
        <i class="fas fa-tv"></i>
    </div>
    <h3>Anime</h3>
    <p>Animated artwork and characters</p>
</div>
```

3. Add wallpapers with `category: "anime"` in the JavaScript array.

## Troubleshooting

### Images Not Loading
- Check image URLs are correct and accessible
- Ensure images are publicly accessible
- Try different image hosting services

### Links Not Working
- Verify Imgur and Google Drive links are correct
- Ensure Google Drive files are set to "Anyone can view"
- Test links in a new tab

### Mobile Issues
- Clear browser cache
- Test on different mobile devices
- Check responsive breakpoints in CSS

## License

This project is open source and available under the MIT License.

## Support

For questions or issues:
1. Check the troubleshooting section above
2. Review the code comments for guidance
3. Test with different browsers and devices

---

**Enjoy your new wallpaper website!** 🎨✨ 
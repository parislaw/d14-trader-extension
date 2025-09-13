// Create Canvas-based PNG icons for Chrome Extension
// This script generates actual PNG files using HTML5 Canvas

function createPNGIcon(size, filename) {
    // Create canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = size;
    canvas.height = size;
    
    // Colors matching the dark theme
    const bgColor = '#1a2332';      // Dark blue background
    const accentColor = '#10b981';  // Green accent
    const textColor = '#ffffff';    // White text
    
    // Draw background with rounded corners
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);
    
    // Draw rounded rectangle background
    const radius = size / 8;
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.roundRect(size * 0.1, size * 0.1, size * 0.8, size * 0.8, radius);
    ctx.fill();
    
    // Draw "14" text
    ctx.fillStyle = textColor;
    ctx.font = `bold ${size * 0.4}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('14', size * 0.5, size * 0.5);
    
    // Draw small progress indicator dots
    for (let i = 0; i < 3; i++) {
        ctx.fillStyle = i === 0 ? textColor : 'rgba(255,255,255,0.3)';
        ctx.beginPath();
        ctx.arc(size * 0.25 + i * size * 0.25, size * 0.85, size * 0.03, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Convert canvas to blob and download
    canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log(`Generated: ${filename}`);
    }, 'image/png');
}

// HTML to run this script
function generateIcons() {
    console.log('Generating PNG icons...');
    
    // Generate all required sizes
    createPNGIcon(16, 'icon16.png');
    setTimeout(() => createPNGIcon(32, 'icon32.png'), 100);
    setTimeout(() => createPNGIcon(48, 'icon48.png'), 200);
    setTimeout(() => createPNGIcon(128, 'icon128.png'), 300);
    
    console.log('All icons generated! Check your Downloads folder.');
}

// Auto-run if in browser environment
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', generateIcons);
    } else {
        generateIcons();
    }
}
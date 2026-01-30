# Image Optimization Guide

## Quick Start

### Step 1: Optimize Images

Run the optimization script to create thumbnails and optimized full-size versions:

```bash
./scripts/optimize-images.sh media/drwaings
```

Or use the master script:

```bash
./scripts/optimize-all.sh
```

This will create a `media/drwaings_optimized` directory with:
- `*_thumb.jpg` - Small thumbnails (300px) for grid view
- `*_full.jpg` - Optimized full-size images (1200px) for lightbox

### Step 2: Update Your HTML

Replace placeholders with optimized images using the pattern shown in the HTML Usage section below.

## Image Structure

After optimization, your images will be organized like this:

```
media/drwaings_optimized/
├── finished/
│   ├── 1_thumb.jpg  (for grid - ~50-100KB)
│   ├── 1_full.jpg   (for lightbox - ~200-500KB)
│   └── ...
├── sketches/
│   └── ...
└── ...
```

## HTML Usage Pattern

Use thumbnails in the gallery grid with lazy loading:

```html
<img 
    class="gallery-image" 
    data-src="../media/drwaings_optimized/finished/1_thumb.jpg"
    data-full="../media/drwaings_optimized/finished/1_full.jpg"
    alt="Drawing description"
    loading="lazy"
>
```

**Important**: 
- Use `lightbox-enhanced.js` instead of `lightbox.js` for full-size image support
- Images load lazily when scrolled into view
- Full-size images load only when clicked

## Features

✅ **Lazy Loading**: Images load only when visible in viewport (Intersection Observer)  
✅ **Thumbnails**: Small images (~50-100KB) for fast grid loading  
✅ **Full-size on demand**: Larger images (~200-500KB) load when clicked  
✅ **Automatic optimization**: JPEG compression and resizing  
✅ **Preserves structure**: Maintains original directory structure  
✅ **Progressive enhancement**: Works even if JavaScript fails  

## Performance Benefits

- **Initial page load**: Only loads visible thumbnails (~50KB each)
- **Scroll performance**: Images load as you scroll (lazy loading)
- **Lightbox**: Full-size images load on-demand (not all at once)
- **Bandwidth savings**: ~70-90% reduction in initial load size

## Customization

Edit `scripts/optimize-images.sh` to adjust:

```bash
THUMBNAIL_WIDTH=300      # Thumbnail size (pixels)
FULL_WIDTH=1200         # Full-size max width (pixels)
THUMBNAIL_QUALITY=80    # Thumbnail JPEG quality (0-100)
FULL_QUALITY=85         # Full-size JPEG quality (0-100)
```

## Files Created

- `scripts/optimize-images.sh` - Main optimization script
- `scripts/optimize-all.sh` - Master script for all optimizations
- `scripts/lightbox-enhanced.js` - Enhanced lightbox with lazy loading
- `scripts/README-optimization.md` - This documentation

## Troubleshooting

**Images not loading?**
- Check file paths are correct
- Ensure optimized images exist in `*_optimized` directory
- Check browser console for errors

**Lightbox not working?**
- Make sure you're using `lightbox-enhanced.js`
- Check that `data-full` attribute is set on images
- Verify lightbox HTML element exists: `<div id="lightbox">`

**Optimization script fails?**
- Ensure you're on macOS (uses `sips` command)
- Check that source directory exists
- Verify images are JPEG format

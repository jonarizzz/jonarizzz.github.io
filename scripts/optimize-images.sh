#!/bin/bash

# Comprehensive image optimization script
# Creates thumbnails for grid view and optimized full-size versions
# Usage: ./scripts/optimize-images.sh [source_directory]

SOURCE_DIR="${1:-media/drwaings}"
THUMBNAIL_WIDTH=300
FULL_WIDTH=1200
THUMBNAIL_QUALITY=80
FULL_QUALITY=85

echo "=========================================="
echo "Image Optimization Script"
echo "=========================================="
echo "Source directory: $SOURCE_DIR"
echo "Thumbnail size: ${THUMBNAIL_WIDTH}px (quality: ${THUMBNAIL_QUALITY}%)"
echo "Full size: ${FULL_WIDTH}px (quality: ${FULL_QUALITY}%)"
echo ""

# Create optimized directory structure
OPTIMIZED_DIR="${SOURCE_DIR}_optimized"
mkdir -p "$OPTIMIZED_DIR"

# Counter for statistics
total=0
optimized=0
skipped=0

# Process all images
find "$SOURCE_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.JPG" -o -iname "*.JPEG" \) | while read -r img; do
    total=$((total + 1))
    
    # Get relative path from source directory
    rel_path="${img#$SOURCE_DIR/}"
    dir_path=$(dirname "$rel_path")
    filename=$(basename "$img")
    name_no_ext="${filename%.*}"
    ext="${filename##*.}"
    
    # Create directory structure in optimized folder
    mkdir -p "$OPTIMIZED_DIR/$dir_path"
    
    # Paths for optimized images
    thumb_path="$OPTIMIZED_DIR/$dir_path/${name_no_ext}_thumb.jpg"
    full_path="$OPTIMIZED_DIR/$dir_path/${name_no_ext}_full.jpg"
    
    # Get original dimensions
    width=$(sips -g pixelWidth "$img" 2>/dev/null | tail -1 | awk '{print $2}')
    height=$(sips -g pixelHeight "$img" 2>/dev/null | tail -1 | awk '{print $2}')
    
    if [ -z "$width" ] || [ -z "$height" ]; then
        echo "⚠ Skipping (invalid image): $img"
        skipped=$((skipped + 1))
        continue
    fi
    
    echo "Processing: $rel_path (${width}x${height})"
    
    # Create thumbnail (for grid view)
    if [ "$width" -gt "$THUMBNAIL_WIDTH" ] || [ "$height" -gt "$THUMBNAIL_WIDTH" ]; then
        sips -Z "$THUMBNAIL_WIDTH" "$img" --out "$thumb_path" > /dev/null 2>&1
        sips -s format jpeg -s formatOptions "$THUMBNAIL_QUALITY" "$thumb_path" --out "$thumb_path" > /dev/null 2>&1
    else
        # Copy original if smaller than thumbnail size
        cp "$img" "$thumb_path"
        sips -s format jpeg -s formatOptions "$THUMBNAIL_QUALITY" "$thumb_path" --out "$thumb_path" > /dev/null 2>&1
    fi
    
    # Create optimized full-size version (for lightbox)
    if [ "$width" -gt "$FULL_WIDTH" ]; then
        sips -Z "$FULL_WIDTH" "$img" --out "$full_path" > /dev/null 2>&1
        sips -s format jpeg -s formatOptions "$FULL_QUALITY" "$full_path" --out "$full_path" > /dev/null 2>&1
    else
        # Copy and optimize original if smaller than full width
        cp "$img" "$full_path"
        sips -s format jpeg -s formatOptions "$FULL_QUALITY" "$full_path" --out "$full_path" > /dev/null 2>&1
    fi
    
    # Get file sizes
    orig_size=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img" 2>/dev/null)
    thumb_size=$(stat -f%z "$thumb_path" 2>/dev/null || stat -c%s "$thumb_path" 2>/dev/null)
    full_size=$(stat -f%z "$full_path" 2>/dev/null || stat -c%s "$full_path" 2>/dev/null)
    
    # Calculate savings
    thumb_savings=$((orig_size - thumb_size))
    full_savings=$((orig_size - full_size))
    
    echo "  ✓ Thumbnail: $(numfmt --to=iec-i --suffix=B $thumb_size 2>/dev/null || echo "${thumb_size}B") (saved $(numfmt --to=iec-i --suffix=B $thumb_savings 2>/dev/null || echo "${thumb_savings}B"))"
    echo "  ✓ Full size: $(numfmt --to=iec-i --suffix=B $full_size 2>/dev/null || echo "${full_size}B") (saved $(numfmt --to=iec-i --suffix=B $full_savings 2>/dev/null || echo "${full_savings}B"))"
    
    optimized=$((optimized + 1))
done

echo ""
echo "=========================================="
echo "Optimization complete!"
echo "Optimized images saved to: $OPTIMIZED_DIR"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Review optimized images in: $OPTIMIZED_DIR"
echo "2. Replace original images if satisfied"
echo "3. Update HTML to use _thumb.jpg for grid and _full.jpg for lightbox"

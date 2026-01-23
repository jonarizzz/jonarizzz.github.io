#!/bin/bash

# Image optimization script using macOS sips
# Usage: ./scripts/optimize-images.sh [source_directory] [max_width] [quality]

SOURCE_DIR="${1:-media/drwaings}"
MAX_WIDTH="${2:-1200}"
QUALITY="${3:-85}"

echo "Optimizing images in: $SOURCE_DIR"
echo "Max width: ${MAX_WIDTH}px"
echo "JPEG quality: ${QUALITY}%"
echo ""

# Find all JPEG/JPG images
find "$SOURCE_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.JPG" -o -iname "*.JPEG" \) | while read -r img; do
    # Get image dimensions
    width=$(sips -g pixelWidth "$img" | tail -1 | awk '{print $2}')
    height=$(sips -g pixelHeight "$img" | tail -1 | awk '{print $2}')
    
    # Only resize if larger than max width
    if [ "$width" -gt "$MAX_WIDTH" ]; then
        echo "Resizing: $img (${width}x${height})"
        sips -Z "$MAX_WIDTH" "$img" > /dev/null
    fi
    
    # Optimize JPEG quality
    echo "Optimizing: $img"
    sips -s format jpeg -s formatOptions "$QUALITY" "$img" --out "$img" > /dev/null
    
    # Get new file size
    new_size=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img" 2>/dev/null)
    echo "  ✓ Optimized: $img ($(numfmt --to=iec-i --suffix=B $new_size 2>/dev/null || echo "${new_size} bytes"))"
done

echo ""
echo "Optimization complete!"
